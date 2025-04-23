import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RedirectForm from './RedirectForm';
import Reset from './Reset';

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/tdly-redirect" element={<RedirectForm />} />
        <Route path="/tdly-redirect/reset" element={<Reset />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter; 