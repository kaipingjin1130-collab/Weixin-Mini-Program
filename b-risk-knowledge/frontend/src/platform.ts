/// <reference types="vite/client" />
/** Browser transport for the same-origin A proxy and explicit local demo mode. */
const underPrefix = window.location.pathname.startsWith('/quality/b/');
const embedded = window.location.pathname === '/quality/' && window.location.hash.startsWith('#/b/');
const mode = import.meta.env?.VITE_B_PLATFORM_MODE;
export const inPlatform = embedded || underPrefix && (mode === 'true' || (mode !== 'false' && !import.meta.env?.DEV));

export function currentPath(): string {
  if (!underPrefix && !embedded) return window.location.pathname;
  const hash = embedded ? window.location.hash.slice(3) : window.location.hash.slice(1) || '/knowledge';
  return hash.split('?')[0] === '/knowledge' ? '/knowledge/library' : hash.split('?')[0];
}

export function navigatePath(url: string): void {
  if (embedded) window.history.pushState({}, '', '/quality/#/b' + url);
  else if (underPrefix) window.history.pushState({}, '', '/quality/b/#' + url);
  else window.history.pushState({}, '', url);
  if (embedded) window.dispatchEvent(new Event('platform-route'));
}

export async function apiFetch(input: string, init: RequestInit = {}): Promise<Response> {
  if (!inPlatform) return fetch(input, init);
  if (!input.startsWith('/api/v1/') && !input.startsWith('/integration/v1/')) {
    throw new Error('请求地址不属于平台接口。');
  }
  const headers = new Headers(init.headers);
  headers.delete('Authorization');
  const selected = (window as Window & {QaxcProjectId?: string}).QaxcProjectId;
  if (embedded && selected) headers.set('X-Project-ID', selected);
  const method = (init.method || 'GET').toUpperCase();
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    const response = await fetch('/quality/api/csrf-token', {credentials: 'same-origin', cache: 'no-store'});
    if (response.status === 401) window.dispatchEvent(new Event('b-session-expired'));
    if (!response.ok) throw new Error(response.status === 401 ? '登录已失效，请返回平台重新登录。' : '无法取得安全校验，请稍后重试。');
    const data = await response.json();
    const token = data.csrf_token ?? data.token;
    if (typeof token !== 'string' || !token) throw new Error('安全校验返回格式不正确。');
    headers.set('X-CSRF-Token', token);
  }
  const response = await fetch('/quality/b' + input, {...init, headers, credentials: 'same-origin'});
  if (response.status === 401) window.dispatchEvent(new Event('b-session-expired'));
  return response;
}
