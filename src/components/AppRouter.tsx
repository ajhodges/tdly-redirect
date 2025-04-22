import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import RedirectForm from './RedirectForm';
import Reset from './Reset';

// Component to handle the redirect from 404.html
const RedirectHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a stored redirect path
    const redirect = sessionStorage.redirect;
    if (redirect) {
      // Remove the stored redirect
      delete sessionStorage.redirect;
      // Navigate to the stored path
      navigate(redirect);
    }
  }, [navigate]);

  return null;
};

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter basename="/tdly-redirect">
      <RedirectHandler />
      <Routes>
        <Route path="/" element={<RedirectForm />} />
        <Route path="/reset" element={<Reset />} />
        <Route path="/simulator/new" element={<RedirectForm />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter; 