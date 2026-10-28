<?php
use think\facade\Route;
Route::post('internal/qaxc/:action', \app\admin\controller\QaxcAuthController::class . '@handle')->pattern(['action'=>'login|session|identity']);
