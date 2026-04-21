import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Portfolio from '../pages/Portfolio';
import Login from '../pages/Login';
import AdminProjects from '../pages/AdminProjects';
import PrivateRoute from '../components/PrivateRoute';
import { AuthProvider } from '../context/AuthContext';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin/projetos"
            element={
              <PrivateRoute>
                <AdminProjects />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
