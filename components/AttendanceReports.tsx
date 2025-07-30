
'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function AttendanceReports() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [reportType, setReportType] = useState('daily');

  const attendanceData = [
    {
      id: 1,
      name: 'John Smith',
      employeeId: 'EMP001',
      department: 'Engineering',
      checkIn: '09:15:32',
      checkOut: '18:30:45',
      workHours: '9h 15m',
      status: 'Present',
      date: '2024-01-20',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20male%20employee%20headshot%20photo%20corporate%20business%20portrait%20clean%20background%20formal%20attire%20confident%20smile&width=40&height=40&seq=rep1&orientation=squarish'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      employeeId: 'EMP002',
      department: 'Marketing',
      checkIn: '09:12:18',
      checkOut: '17:45:30',
      workHours: '8h 33m',
      status: 'Present',
      date: '2024-01-20',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20female%20employee%20headshot%20photo%20corporate%20business%20portrait%20clean%20background%20formal%20attire%20confident%20smile&width=40&height=40&seq=rep2&orientation=squarish'
    },
    {
      id: 3,
      name: 'Mike Chen',
      employeeId: 'EMP003',
      department: 'Engineering',
      checkIn: '09:08:45',
      checkOut: '18:15:20',
      workHours: '9h 7m',
      status: 'Present',
      date: '2024-01-20',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20asian%20male%20employee%20headshot%20photo%20corporate%20business%20portrait%20clean%20background%20formal%20attire%20confident%20smile&width=40&height=40&seq=rep3&orientation=squarish'
    },
    {
      id: 4,
      name: 'Emma Davis',
      employeeId: 'EMP004',
      department: 'Sales',
      checkIn: '09:25:10',
      checkOut: '17:30:45',
      workHours: '8h 5m',
      status: 'Late',
      date: '2024-01-20',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20female%20employee%20headshot%20photo%20corporate%20business%20portrait%20clean%20background%20formal%20attire%20confident%20smile%20blonde%20hair&width=40&height=40&seq=rep4&orientation=squarish'
    },
    {
      id: 5,
      name: 'Alex Rodriguez',
      employeeId: 'EMP005',
      department: 'HR',
      checkIn: '-',
      checkOut: '-',
      workHours: '0h 0m',
      status: 'Absent',
      date: '2024-01-20',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20hispanic%20male%20employee%20headshot%20photo%20corporate%20business%20portrait%20clean%20background%20formal%20attire%20confident%20smile&width=40&height=40&seq=rep5&orientation=squarish'
    }
  ];

  const weeklyTrend = [
    { day: 'Mon', present: 48, absent: 2, late: 3 },
    { day: 'Tue', present: 45, absent: 5, late: 3 },
    { day: 'Wed', present: 47, absent: 2, late: 4 },
    { day: 'Thu', present: 46, absent: 3, late: 4 },
    { day: 'Fri', present: 44, absent: 4, late: 5 },
    { day: 'Sat', present: 38, absent: 8, late: 7 },
    { day: 'Sun', present: 35, absent: 10, late: 8 }
  ];

  const departmentStats = [
    { department: 'Engineering', present: 18, total: 20 },
    { department: 'Marketing', present: 12, total: 15 },
    { department: 'Sales', present: 10, total: 12 },
    { department: 'HR', present: 6, total: 8 },
    { department: 'Finance', present: 8, total: 10 }
  ];

  const exportToCSV = () => {
    const headers = ['Name', 'Employee ID', 'Department', 'Check In', 'Check Out', 'Work Hours', 'Status', 'Date'];
    const csvContent = [
      headers.join(','),
      ...attendanceData.map(record => [
        record.name,
        record.employeeId,
        record.department,
        record.checkIn,
        record.checkOut,
        record.workHours,
        record.status,
        record.date
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `attendance-report-${selectedDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    alert('PDF export functionality would be implemented with a library like jsPDF');
  };

  const employees = [
    'All Employees',
    'John Smith',
    'Sarah Johnson', 
    'Mike Chen',
    'Emma Davis',
    'Alex Rodriguez'
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Attendance Reports</h1>
        <p className="text-gray-400">Comprehensive attendance analysis and reporting</p>
      </div>

      <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-800 p-6 mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Report Filters</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-8"
            >
              <option value="daily">Daily Report</option>
              <option value="weekly">Weekly Report</option>
              <option value="monthly">Monthly Report</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Employee</label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-8"
            >
              {employees.map((employee) => (
                <option key={employee} value={employee}>{employee}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Actions</label>
            <div className="flex space-x-2">
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap text-sm"
              >
                <i className="ri-file-excel-line mr-1"></i>
                CSV
              </button>
              <button
                onClick={exportToPDF}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap text-sm"
              >
                <i className="ri-file-pdf-line mr-1"></i>
                PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Today's Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Total Present</span>
              <span className="text-xl font-bold text-green-400">48</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Total Absent</span>
              <span className="text-xl font-bold text-red-400">2</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Late Arrivals</span>
              <span className="text-xl font-bold text-yellow-400">3</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Attendance Rate</span>
              <span className="text-xl font-bold text-indigo-400">96%</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-gray-900 rounded-xl shadow-sm border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Weekly Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="present" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="absent" stroke="#ef4444" strokeWidth={2} />
              <Line type="monotone" dataKey="late" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Department Performance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={departmentStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="department" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }} />
              <Bar dataKey="present" fill="#10b981" />
              <Bar dataKey="total" fill="#374151" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
          <div className="space-y-4">
            {departmentStats.map((dept, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-300">{dept.department}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 h-2 bg-gray-700 rounded-full">
                    <div 
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${(dept.present / dept.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-400">
                    {dept.present}/{dept.total}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Detailed Attendance Records</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-4 font-medium text-white">Employee</th>
                <th className="text-left py-3 px-4 font-medium text-white">Department</th>
                <th className="text-left py-3 px-4 font-medium text-white">Check In</th>
                <th className="text-left py-3 px-4 font-medium text-white">Check Out</th>
                <th className="text-left py-3 px-4 font-medium text-white">Work Hours</th>
                <th className="text-left py-3 px-4 font-medium text-white">Status</th>
                <th className="text-left py-3 px-4 font-medium text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((record) => (
                <tr key={record.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={record.avatar}
                        alt={record.name}
                        className="w-8 h-8 rounded-full object-cover object-top"
                      />
                      <div>
                        <p className="font-medium text-white">{record.name}</p>
                        <p className="text-sm text-gray-400">{record.employeeId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-300">{record.department}</td>
                  <td className="py-3 px-4 text-gray-300">{record.checkIn}</td>
                  <td className="py-3 px-4 text-gray-300">{record.checkOut}</td>
                  <td className="py-3 px-4 text-gray-300">{record.workHours}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      record.status === 'Present' 
                        ? 'bg-green-900/50 text-green-400 border border-green-800'
                        : record.status === 'Late'
                        ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-800'
                        : 'bg-red-900/50 text-red-400 border border-red-800'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-500 hover:text-indigo-400 cursor-pointer">
                        <i className="ri-edit-line text-sm"></i>
                      </button>
                      <button className="p-1 text-gray-500 hover:text-red-400 cursor-pointer">
                        <i className="ri-delete-bin-line text-sm"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
