import React from 'react';
import { useAppSelector } from '../store';
import { Card } from '@online-hiring-system/ui';
import { Role } from '@online-hiring-system/types';

export const DashboardPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  const renderCandidateDashboard = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Candidate Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900">Applications</h3>
          <p className="text-3xl font-bold text-primary-600 mt-2">0</p>
          <p className="text-sm text-gray-500">Total applications</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900">Interviews</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">0</p>
          <p className="text-sm text-gray-500">Scheduled interviews</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900">Offers</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
          <p className="text-sm text-gray-500">Job offers received</p>
        </Card>
      </div>
    </div>
  );

  const renderEmployerDashboard = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Employer Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900">Jobs Posted</h3>
          <p className="text-3xl font-bold text-primary-600 mt-2">0</p>
          <p className="text-sm text-gray-500">Active job postings</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900">Applications</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">0</p>
          <p className="text-sm text-gray-500">Total applications</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900">Interviews</h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">0</p>
          <p className="text-sm text-gray-500">Scheduled interviews</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900">Hires</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
          <p className="text-sm text-gray-500">Successful hires</p>
        </Card>
      </div>
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900">Total Users</h3>
          <p className="text-3xl font-bold text-primary-600 mt-2">0</p>
          <p className="text-sm text-gray-500">Registered users</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900">Employers</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">0</p>
          <p className="text-sm text-gray-500">Active employers</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900">Candidates</h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">0</p>
          <p className="text-sm text-gray-500">Active candidates</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900">Jobs</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
          <p className="text-sm text-gray-500">Total job postings</p>
        </Card>
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  switch (user.role) {
    case Role.CANDIDATE:
      return renderCandidateDashboard();
    case Role.EMPLOYER:
      return renderEmployerDashboard();
    case Role.ADMIN:
      return renderAdminDashboard();
    default:
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">Unknown user role</p>
        </div>
      );
  }
};
