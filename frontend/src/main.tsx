import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import AppRoutes from './routes/AppRoutes';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppRoutes />
    <ToastContainer
      position="top-right"
      theme="dark"
      autoClose={3500}
      toastStyle={{
        background: 'rgba(10, 3, 3, 0.95)',
        border: '1px solid rgba(251, 202, 3, 0.4)',
        color: '#FBCA03',
        fontFamily: 'Rajdhani, sans-serif',
      }}
    />
  </React.StrictMode>,
);
