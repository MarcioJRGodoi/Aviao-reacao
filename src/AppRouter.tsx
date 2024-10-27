// src/AppRouter.tsx
import type React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Menu from './components/Menu';

const AppRouter: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Menu />} />
      </Routes>
  </Router>
);

export default AppRouter;
