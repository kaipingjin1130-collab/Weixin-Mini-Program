<?php
declare(strict_types=1);
namespace app\admin\controller;

use Rain\Auth\Interfaces\AuthInterface;
use Rain\Tools\Utils\Di;
use Rain\Tools\Func;
use Rain\ThinkSystem\Interfaces\LogicInterface;
use Rain\ThinkSystem\Http\Model\AdminUser;
use think\Request;
use think\Response;

/** Private adapter: only existing host accounts; no password/hash export. */
class QaxcAuthController
{
    public function handle(Request $request): Response
    {
        try {
            $config = json_decode(file_get_contents(root_path().'runtime/qaxc-integration.json'), true);
            $key = (string)($config['key'] ?? '');
            if ($key === '' || !hash_equals($key, (string)$request->header('X-Qaxc-Service-Key', ''))) {
                return json(['active'=>false],403);
            }
            $action = basename($request->pathinfo());
            $data = json_decode($request->getContent(),true) ?: [];
            if ($action === 'login') {
                $account = (string)($data['username'] ?? '');
                $password = (string)($data['password'] ?? '');
                if ($account === '' || strlen($account)>200 || $password === '' || strlen($password)>1000) {
                    return json(['active'=>false],401);
                }
                // The host login resolves its logical account to username/mobile.
                // Do not query a physical "account" column: the host schema has none.
                // Match the existing web login's md5(config.key + password).
                // This is a public frontend value, not the server encryption key.
                $frontend = file_get_contents(root_path().'public/static/utils/js/config.js');
                if (!preg_match('/^\s*key:\s*"([^"\r\n]+)"\s*,?\s*$/m', $frontend, $match)
                    || strpos($match[1], chr(92)) !== false) {
                    throw new \RuntimeException('Unsupported host frontend key configuration');
                }
                $webPassword = md5($match[1].$password);
                $user = Func::make(LogicInterface::class)->login($account,$webPassword);
            } elseif ($action === 'session') {
                $auth = Di::make(AuthInterface::class);
                $auth->grade('admin');
                $session = $auth->data();
                if (!$session || ($session['drive'] ?? '')!=='admin' || empty($session['unique'])) {
                    return json(['active'=>false],401);
                }
                $user = $auth->user($session['unique']);
            } elseif ($action === 'identity') {
                $id = (string)($data['id'] ?? '');
                if (!preg_match('/^host:admin:([1-9][0-9]*)$/D',$id,$match)) return json(['active'=>false],401);
                $user = AdminUser::find((int)$match[1]);
            } else return json(['active'=>false],404);
            if (!$user || (int)$user->status!==1) return json(['active'=>false],401);
            $name = (string)$user->username;
            if ((string)$user->mobile !== '') {
                $linked = \app\common\model\admin\Users::where('mobile',$user->mobile)->limit(2)->select();
                if (count($linked)>1) return json(['active'=>false],403);
                if (count($linked)===1) {
                    if ((int)$linked[0]->status!==1) return json(['active'=>false],401);
                    $name = (string)$linked[0]->username;
                }
            }
            $adminIds = array_map('strval', (array)($config['adminIds'] ?? []));
            $adminIds[] = (string)($config['adminId'] ?? '');
            return json(['active'=>true,'aud'=>'qaxc','id'=>'host:admin:'.(string)$user->id,
                'name'=>$name,'isAdmin'=>in_array((string)$user->id, $adminIds, true)]);
        } catch (\Rain\TryResult\Exceptions\BusinessException $e) {
            return json(['active'=>false],401);
        } catch (\Rain\Auth\Exception\AuthException $e) {
            return json(['active'=>false],401);
        } catch (\Throwable $e) {
            return json(['active'=>false,'error'=>'authentication_unavailable'],503);
        }
    }
}
