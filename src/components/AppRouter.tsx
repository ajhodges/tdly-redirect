import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import RedirectForm from './RedirectForm';
import Reset from './Reset';

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter basename="/tdly-redirect">
      <Routes>
        <Route path="/" element={<RedirectForm />} />
        <Route path="/reset" element={<Reset />} />
        <Route path="*" element={<RedirectForm />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter; 