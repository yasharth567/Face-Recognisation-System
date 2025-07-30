
'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import NewEnrollmentsList from './NewEnrollmentsList';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalRegistered: 0,
    todayPresent: 0,
    todayAbsent: 0,
    attendanceRate: 0
  });

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, name: 'John Smith', time: '09:15 AM', status: 'present', avatar: 'https://readdy.ai/api/search-image?query=professional%20male%20employee%20headshot%20photo%20corporate%20business%20portrait%20clean%20background%20formal%20attire%20confident%20smile&width=40&height=40&seq=emp1&orientation=squarish' },
    { id: 2, name: 'Sarah Johnson', time: '09:12 AM', status: 'present', avatar: 'https://readdy.ai/api/search-image?query=professional%20female%20employee%20headshot%20photo%20corporate%20business%20portrait%20clean%20background%20formal%20attire%20confident%20smile&width=40&height=40&seq=emp2&orientation=squarish' },
    { id: 3, name: 'Mike Chen', time: '09:08 AM', status: 'present', avatar: 'https://readdy.ai/api/search-image?query=professional%20asian%20male%20employee%20headshot%20photo%20corporate%20business%20portrait%20clean%20background%20formal%20attire%20confident%20smile&width=40&height=40&seq=emp3&orientation=squarish' },
    { id: 4, name: 'Emma Davis', time: '09:05 AM', status: 'present', avatar: 'https://readdy.ai/api/search-image?query=professional%20female%20employee%20headshot%20photo%20corporate%20business%20portrait%20clean%20background%20formal%20attire%20confident%20smile%20blonde%20hair&width=40&height=40&seq=emp4&orientation=squarish' },
    { id: 5, name: 'Alex Rodriguez', time: '09:02 AM', status: 'present', avatar: 'https://readdy.ai/api/search-image?query=professional%20hispanic%20male%20employee%20headshot%20photo%20corporate%20business%20portrait%20clean%20background%20formal%20attire%20confident%20smile&width=40&height=40&seq=emp5&orientation=squarish' }
  ]);

  const weeklyData = [
    { day: 'Mon', present: 45, absent: 5 },
    { day: 'Tue', present: 48, absent: 2 },
    { day: 'Wed', present: 42, absent: 8 },
    { day: 'Thu', present: 46, absent: 4 },
    { day: 'Fri', present: 44, absent: 6 },
    { day: 'Sat', present: 38, absent: 12 },
    { day: 'Sun', present: 35, absent: 15 }
  ];

  const attendanceTrend = [
    { time: '08:00', count: 5 },
    { time: '08:30', count: 12 },
    { time: '09:00', count: 35 },
    { time: '09:30', count: 48 },
    { time: '10:00', count: 50 },
    { time: '10:30', count: 50 },
    { time: '11:00', count: 48 }
  ];

  const departmentData = [
    { name: 'Engineering', value: 25, color: '#3b82f6' },
    { name: 'Marketing', value: 15, color: '#10b981' },
    { name: 'Sales', value: 12, color: '#f59e0b' },
    { name: 'HR', value: 8, color: '#ef4444' }
  ];

  useEffect(() => {
    setStats({
      totalRegistered: 50,
      todayPresent: 48,
      todayAbsent: 2,
      attendanceRate: 96
    });
  }, []);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">AttendEye Dashboard</h1>
        <p className="text-gray-400">AI-powered attendance system overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <div className="bg-gray-900 rounded-xl shadow-xl border border-gray-800 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total Registered</p>
              <p className="text-xl sm:text-2xl font-bold text-white">{stats.totalRegistered}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <i className="ri-group-line text-blue-400 text-lg sm:text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl shadow-xl border border-gray-800 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Today Present</p>
              <p className="text-xl sm:text-2xl font-bold text-green-400">{stats.todayPresent}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <i className="ri-check-line text-green-400 text-lg sm:text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl shadow-xl border border-gray-800 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Today Absent</p>
              <p className="text-xl sm:text-2xl font-bold text-red-400">{stats.todayAbsent}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
              <i className="ri-close-line text-red-400 text-lg sm:text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl shadow-xl border border-gray-800 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Attendance Rate</p>
              <p className="text-xl sm:text-2xl font-bold text-purple-400">{stats.attendanceRate}%</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <i className="ri-percent-line text-purple-400 text-lg sm:text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <NewEnrollmentsList />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-900 rounded-xl shadow-xl border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Daily Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={attendanceTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#ffffff'
                }} 
              />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-900 rounded-xl shadow-xl border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Weekly Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#ffffff'
                }} 
              />
              <Bar dataKey="present" fill="#10b981" />
              <Bar dataKey="absent" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-900 rounded-xl shadow-xl border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-800 transition-colors">
                <img
                  src={activity.avatar}
                  alt={activity.name}
                  className="w-10 h-10 rounded-full object-cover object-top border border-gray-600"
                />
                <div className="flex-1">
                  <p className="font-medium text-white">{activity.name}</p>
                  <p className="text-sm text-gray-400">Marked attendance at {activity.time}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  activity.status === 'present' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl shadow-xl border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Department Breakdown</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#ffffff'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {departmentData.map((dept, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color }}></div>
                  <span className="text-sm text-gray-300">{dept.name}</span>
                </div>
                <span className="text-sm font-medium text-white">{dept.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
