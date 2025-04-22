import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

describe('App', () => {
  it('renders RedirectForm component on root path', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Redirect Form')).toBeInTheDocument();
  });

  it('renders Reset component on /reset path', () => {
    render(
      <MemoryRouter initialEntries={['/reset']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });
});
