import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import RedirectForm from './components/RedirectForm';
import Reset from './components/Reset';

const TestRouter: React.FC = () => (
  <MemoryRouter initialEntries={['/']}>
    <Routes>
      <Route path="/" element={<RedirectForm />} />
      <Route path="/reset" element={<Reset />} />
    </Routes>
  </MemoryRouter>
);

describe('App', () => {
  it('renders RedirectForm component on root path', () => {
    render(<App RouterComponent={TestRouter} />);
    expect(screen.getByText('Tenderly Redirect')).toBeInTheDocument();
  });

  it('renders Reset component on /reset path', () => {
    render(
      <MemoryRouter initialEntries={['/reset']}>
        <Routes>
          <Route path="/reset" element={<Reset />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Credentials Reset')).toBeInTheDocument();
  });
});
