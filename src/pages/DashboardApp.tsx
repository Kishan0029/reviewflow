import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import DashboardOverview from '@/pages/dashboard/DashboardOverview';
import DashboardFeedback from '@/pages/dashboard/DashboardFeedback';
import DashboardLocations from '@/pages/dashboard/DashboardLocations';
import DashboardSettings from '@/pages/dashboard/DashboardSettings';

export default function DashboardApp() {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<DashboardOverview />} />
        <Route path="feedback" element={<DashboardFeedback />} />
        <Route path="locations" element={<DashboardLocations />} />
        <Route path="settings" element={<DashboardSettings />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  );
}
