import assert from 'node:assert/strict';

const events = [];
const location = {pathname: '/quality/b/', hash: '#/knowledge'};
globalThis.window = {location, history: {pushState(_state, _unused, url) { location.hash = url.slice(url.indexOf('#')); }},
  dispatchEvent(event) { events.push(event.type); }};
const requests = [];
globalThis.fetch = async (url, init = {}) => {
  requests.push({url, init});
  if (url === '/quality/api/csrf-token') return new Response(JSON.stringify({csrf_token: 'test-csrf'}));
  return new Response('{}', {status: 401});
};
const {currentPath, navigatePath, apiFetch} = await import('./platform.ts');
assert.equal(currentPath(), '/knowledge/library');
navigatePath('/retrospectives/test-id');
assert.equal(currentPath(), '/retrospectives/test-id');
await apiFetch('/api/v1/example', {method: 'POST', headers: {Authorization: 'Bearer dev-admin'}});
assert.equal(requests[0].url, '/quality/api/csrf-token');
assert.equal(requests[1].url, '/quality/b/api/v1/example');
assert.equal(requests[1].init.headers.get('Authorization'), null);
assert.equal(requests[1].init.headers.get('X-CSRF-Token'), 'test-csrf');
assert.deepEqual(events, ['b-session-expired']);
await assert.rejects(() => apiFetch('https://outside.example/test'), /请求地址/);
console.log('platform transport and hash routing passed');
