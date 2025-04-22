import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import RedirectForm from './RedirectForm';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Mock window.location
const mockLocation = {
  href: '',
};
Object.defineProperty(window, 'location', { value: mockLocation });

describe('RedirectForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocation.href = '';
  });

  it('should show form when no credentials are stored', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<RedirectForm />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Tenderly Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Project Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Redirect to Tenderly/i)).toBeInTheDocument();
  });

  it('should redirect immediately when credentials are stored', () => {
    mockLocalStorage.getItem
      .mockReturnValueOnce('testuser')
      .mockReturnValueOnce('testproject');

    render(
      <MemoryRouter initialEntries={['/simulator/new?block=123']}>
        <Routes>
          <Route path="*" element={<RedirectForm />} />
        </Routes>
      </MemoryRouter>
    );

    expect(mockLocation.href).toBe(
      'https://dashboard.tenderly.co/testuser/testproject/simulator/new?block=123'
    );
  });

  it('should store credentials and redirect on form submission', async () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    render(
      <MemoryRouter initialEntries={['/simulator/new?block=123']}>
        <Routes>
          <Route path="*" element={<RedirectForm />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Tenderly Username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText(/Project Name/i), {
      target: { value: 'testproject' },
    });
    fireEvent.click(screen.getByText(/Redirect to Tenderly/i));

    await waitFor(() => {
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('tenderlyUsername', 'testuser');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('tenderlyProject', 'testproject');
      expect(mockLocation.href).toBe(
        'https://dashboard.tenderly.co/testuser/testproject/simulator/new?block=123'
      );
    });
  });

  it('should handle empty form submission', () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<RedirectForm />} />
        </Routes>
      </MemoryRouter>
    );

    const submitButton = screen.getByText(/Redirect to Tenderly/i);
    fireEvent.click(submitButton);

    expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
    expect(mockLocation.href).toBe('');
  });
}); 