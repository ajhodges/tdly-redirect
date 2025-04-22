import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Reset from './Reset';

// Mock localStorage
const mockLocalStorage = {
  removeItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Reset', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should clear credentials and redirect to home', async () => {
    render(
      <MemoryRouter initialEntries={['/reset']}>
        <Routes>
          <Route path="/reset" element={<Reset />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Credentials Reset/i)).toBeInTheDocument();
    expect(screen.getByText(/Your Tenderly credentials have been cleared/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('tenderlyUsername');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('tenderlyProject');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    }, { timeout: 3000 });
  });
}); 