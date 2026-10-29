import assert from 'node:assert/strict';

const location = {pathname: '/quality/', hash: '#/b/retrospectives/42'};
globalThis.window = {location, history: {pushState(_state, _unused, url) { location.hash = url.slice(url.indexOf('#')); }}, dispatchEvent() {}};
const calls = [];
globalThis.fetch = async (url, init = {}) => {
  calls.push({url, init});
  return new Response('{}');
};
const {currentPath, navigatePath, apiFetch, inPlatform} = await import('./platform.ts');
assert.equal(inPlatform, true);
assert.equal(currentPath(), '/retrospectives/42');
navigatePath('/knowledge/library');
assert.equal(location.hash, '#/b/knowledge/library');
assert.equal(currentPath(), '/knowledge/library');
window.QaxcProjectId = 'project-selected';
await apiFetch('/api/v1/me', {headers: {Authorization: 'Bearer dev-admin'}});
assert.equal(calls[0].url, '/quality/b/api/v1/me');
assert.equal(calls[0].init.headers.get('Authorization'), null);
assert.equal(calls[0].init.headers.get('X-Project-ID'), 'project-selected');
console.log('embedded platform routing and authenticated transport passed');
