import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/DashboardPage';

import MainLayout from './components/layout/MainLayout';

import FinancePage from './pages/FinancePage';

import AcademicPage from './pages/AcademicPage';
import TasksPage from './pages/TasksPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/finance" element={<FinancePage />} />
            <Route path="/academic" element={<AcademicPage />} />
            <Route path="/tasks" element={<TasksPage />} />
          </Route>
        </Route>
        
        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
