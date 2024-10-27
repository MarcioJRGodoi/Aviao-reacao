// src/components/App.tsx
import type React from 'react';
import AppRouter from '../src/AppRouter';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => (
  <>
    <AppRouter />
    <ToastContainer autoClose={2000} />
  </>
);

export default App;
