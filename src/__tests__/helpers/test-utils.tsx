import { render as rtlRender } from '@testing-library/react';
import { ReactElement } from 'react';

// Custom render function that includes providers if needed
function render(ui: ReactElement, { ...options } = {}) {
  return rtlRender(ui, { ...options });
}

// Re-export everything
export * from '@testing-library/react';
export { render }; 