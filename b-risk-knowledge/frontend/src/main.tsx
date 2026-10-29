import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { inPlatform } from './platform';

if (inPlatform && window.location.pathname.startsWith('/quality/b/')) {
  window.location.replace('/quality/#/b' + (window.location.hash.slice(1) || '/knowledge/library'));
} else {
  createRoot(document.getElementById('root')!).render(<App />);
}
