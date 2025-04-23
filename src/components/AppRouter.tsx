import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RedirectForm from './RedirectForm';

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/tdly-redirect" element={<RedirectForm />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter; 