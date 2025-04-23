import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import RedirectForm from './components/RedirectForm';

const TestRouter: React.FC = () => (
  <MemoryRouter initialEntries={['/']}>
    <Routes>
      <Route path="/" element={<RedirectForm />} />
    </Routes>
  </MemoryRouter>
);

describe('App', () => {
  it('renders RedirectForm component on root path', () => {
    render(<App RouterComponent={TestRouter} />);
    expect(screen.getByText('Tenderly Redirect')).toBeInTheDocument();
  });
});
