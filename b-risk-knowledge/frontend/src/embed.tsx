import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

export function mountKnowledge(element: HTMLElement): () => void {
  const root = createRoot(element);
  root.render(<App embedded />);
  return () => root.unmount();
}
