import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Home</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
