import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RedirectForm from './RedirectForm';

// Mock window.alert
const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('RedirectForm', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  it('renders form elements', () => {
    render(
      <MemoryRouter>
        <RedirectForm />
      </MemoryRouter>
    );

    expect(screen.getByLabelText('Tenderly Username:')).toBeInTheDocument();
    expect(screen.getByLabelText('Project Slug:')).toBeInTheDocument();
    expect(screen.getByText('Save Details')).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    render(
      <MemoryRouter>
        <RedirectForm />
      </MemoryRouter>
    );

    const usernameInput = screen.getByLabelText('Tenderly Username:');
    const projectSlugInput = screen.getByLabelText('Project Slug:');
    const submitButton = screen.getByText('Save Details');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(projectSlugInput, { target: { value: 'testproject' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Values saved successfully! You will be redirected when parameters are provided.');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('tenderlyUsername', 'testuser');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('tenderlyProjectSlug', 'testproject');
    });
  });

  it('validates form fields', async () => {
    render(
      <MemoryRouter>
        <RedirectForm />
      </MemoryRouter>
    );

    const submitButton = screen.getByText('Save Details');
    fireEvent.click(submitButton);

    // The form should prevent submission and not call alert
    await waitFor(() => {
      expect(mockAlert).not.toHaveBeenCalled();
    });
  });
}); 