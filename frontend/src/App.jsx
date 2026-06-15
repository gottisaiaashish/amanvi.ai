import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BrightLayout from './layouts/BrightLayout';
import UnifiedInbox from './pages/UnifiedInbox';
import DailySchedule from './pages/DailySchedule';
import AmanviSecretary from './pages/AmanviSecretary';

// Placeholder for settings
const SettingsView = () => <div className="p-12 text-gray-500">Settings Configuration for n8n Webhooks...</div>;

function App() {
  return (
    <Router>
      <BrightLayout>
        <Routes>
          <Route path="/" element={<UnifiedInbox />} />
          <Route path="/schedule" element={<DailySchedule />} />
          <Route path="/amanvi" element={<AmanviSecretary />} />
          <Route path="/settings" element={<SettingsView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrightLayout>
    </Router>
  );
}

export default App;
