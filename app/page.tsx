
'use client';

import { useState } from 'react';
import Header from '../components/Header';
import Dashboard from '../components/Dashboard';
import FaceEnrollment from '../components/FaceEnrollment';
import AttendanceCapture from '../components/AttendanceCapture';
import AttendanceReports from '../components/AttendanceReports';
import Settings from '../components/Settings';

export default function Home() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'enrollment':
        return <FaceEnrollment />;
      case 'capture':
        return <AttendanceCapture />;
      case 'reports':
        return <AttendanceReports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="pt-16">
        {renderPage()}
      </main>
    </div>
  );
}
