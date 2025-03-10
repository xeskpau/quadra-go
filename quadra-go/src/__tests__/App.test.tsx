import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';
import { AuthProvider } from '../context/AuthContext';

describe('App Component', () => {
  it('renders without crashing', () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    );
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('contains navigation elements', () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
}); 