import { Navigate, Route, Routes } from 'react-router-dom';
import AuthLayout from './pages/auth/AuthLayout';
import LoginPage from './pages/auth/LoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ProtectedRoute from './routes/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/dashboard/DashboardPage';
import UsersPage from './pages/users/UsersPage';
import BranchesPage from './pages/branches/BranchesPage';
import AssetsPage from './pages/assets/AssetsPage';
import CampaignsPage from './pages/campaigns/CampaignsPage';
import GuidelinesPage from './pages/guidelines/GuidelinesPage';
import RequestListPage from './pages/requests/RequestListPage';
import CreateRequestPage from './pages/requests/CreateRequestPage';
import RequestDetailsPage from './pages/requests/RequestDetailsPage';
import NotificationsPage from './pages/notifications/NotificationsPage';
import ReportsPage from './pages/reports/ReportsPage';
import ProfilePage from './pages/profile/ProfilePage';
import BranchUserAssociationPage from './pages/BranchUser/BranchUserAssociationPage';
import BranchActivityMonitoringPage from './pages/BranchActivity/BranchActivityMonitoringPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/branches" element={<BranchesPage />} />
          <Route path="/assets" element={<AssetsPage />} />
          <Route path="/campaigns" element={<CampaignsPage />} />
          <Route path="/guidelines" element={<GuidelinesPage />} />
          <Route path="/requests" element={<RequestListPage />} />
          <Route path="/requests/new" element={<CreateRequestPage />} />
          <Route path="/requests/:id" element={<RequestDetailsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/branch-users" element={<BranchUserAssociationPage />} />
          <Route path="/branch-activities" element={<BranchActivityMonitoringPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
