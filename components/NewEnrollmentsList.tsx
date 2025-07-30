
'use client';

import { useState, useEffect } from 'react';

interface NewEmployee {
  id: number;
  name: string;
  employeeId: string;
  department: string;
  joinDate: string;
  status: 'pending' | 'enrolled' | 'rejected';
  avatar: string;
  phone: string;
  email: string;
}

interface EnrolledUser {
  id: number;
  name: string;
  employeeId: string;
  department: string;
  email: string;
  phone: string;
  enrolledDate: string;
  avatar: string;
  faceData: string[];
}

export default function NewEnrollmentsList() {
  const [newEmployees, setNewEmployees] = useState<NewEmployee[]>([
    {
      id: 1,
      name: 'James Wilson',
      employeeId: 'ATT-004',
      department: 'Engineering',
      joinDate: '2024-01-20',
      status: 'pending',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20young%20male%20employee%20headshot%20photo%20corporate%20business%20portrait%20clean%20background%20formal%20attire%20confident%20smile%20new%20hire&width=50&height=50&seq=new1&orientation=squarish',
      phone: '+1-234-567-8901',
      email: 'james.wilson@company.com'
    },
    {
      id: 2,
      name: 'Maria Garcia',
      employeeId: 'ATT-005',
      department: 'Marketing',
      joinDate: '2024-01-19',
      status: 'pending',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20hispanic%20female%20employee%20headshot%20photo%20corporate%20business%20portrait%20clean%20background%20formal%20attire%20confident%20smile%20new%20hire&width=50&height=50&seq=new2&orientation=squarish',
      phone: '+1-234-567-8902',
      email: 'maria.garcia@company.com'
    },
    {
      id: 3,
      name: 'David Kumar',
      employeeId: 'ATT-006',
      department: 'Sales',
      joinDate: '2024-01-18',
      status: 'pending',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20indian%20male%20employee%20headshot%20photo%20corporate%20business%20portrait%20clean%20background%20formal%20attire%20confident%20smile%20new%20hire&width=50&height=50&seq=new3&orientation=squarish',
      phone: '+1-234-567-8903',
      email: 'david.kumar@company.com'
    },
    {
      id: 4,
      name: 'Emily Johnson',
      employeeId: 'ATT-007',
      department: 'HR',
      joinDate: '2024-01-17',
      status: 'enrolled',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20blonde%20female%20employee%20headshot%20photo%20corporate%20business%20portrait%20clean%20background%20formal%20attire%20confident%20smile%20new%20hire&width=50&height=50&seq=new4&orientation=squarish',
      phone: '+1-234-567-8904',
      email: 'emily.johnson@company.com'
    }
  ]);

  const [selectedEmployee, setSelectedEmployee] = useState<NewEmployee | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [enrolledUsers, setEnrolledUsers] = useState<EnrolledUser[]>([]);

  useEffect(() => {
    const savedUsers = localStorage.getItem('attendeye-enrolled-users');
    if (savedUsers) {
      setEnrolledUsers(JSON.parse(savedUsers));
    }
  }, []);

  const generateEmployeeId = (): string => {
    const prefix = 'ATT';
    const existingIds = [
      ...enrolledUsers.map(user => {
        const idPart = user.employeeId.replace(`${prefix}-`, '');
        return parseInt(idPart) || 0;
      }),
      ...newEmployees.map(emp => {
        const idPart = emp.employeeId.replace(`${prefix}-`, '');
        return parseInt(idPart) || 0;
      })
    ];
    const maxId = Math.max(...existingIds, 0);
    const newId = maxId + 1;
    return `${prefix}-${String(newId).padStart(3, '0')}`;
  };

  const updateEmployeeStatus = (id: number, status: 'enrolled' | 'rejected') => {
    const employee = newEmployees.find(emp => emp.id === id);
    
    if (employee && status === 'enrolled') {
      const newEnrolledUser: EnrolledUser = {
        id: Date.now(),
        name: employee.name,
        employeeId: employee.employeeId,
        department: employee.department,
        email: employee.email,
        phone: employee.phone,
        enrolledDate: new Date().toISOString().split('T')[0],
        avatar: employee.avatar,
        faceData: []
      };

      const updatedEnrolledUsers = [newEnrolledUser, ...enrolledUsers];
      setEnrolledUsers(updatedEnrolledUsers);
      localStorage.setItem('attendeye-enrolled-users', JSON.stringify(updatedEnrolledUsers));
    }
    
    setNewEmployees(prev => 
      prev.map(emp => 
        emp.id === id ? { ...emp, status } : emp
      )
    );
    setShowModal(false);
    setSelectedEmployee(null);

    if (status === 'enrolled') {
      alert(`${employee?.name} has been successfully enrolled! They can now use the attendance system.`);
    }
  };

  const addNewEmployee = () => {
    const newEmployee: NewEmployee = {
      id: Date.now(),
      name: 'New Employee',
      employeeId: generateEmployeeId(),
      department: 'Unassigned',
      joinDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20employee%20headshot%20photo%20corporate%20business%20portrait%20clean%20background%20formal%20attire%20confident%20smile%20new%20hire%20diverse%20person&width=50&height=50&seq=newnew&orientation=squarish',
      phone: '+1-000-000-0000',
      email: 'new.employee@company.com'
    };

    setNewEmployees(prev => [newEmployee, ...prev]);
  };

  const pendingCount = newEmployees.filter(emp => emp.status === 'pending').length;
  const enrolledCount = newEmployees.filter(emp => emp.status === 'enrolled').length;
  const rejectedCount = newEmployees.filter(emp => emp.status === 'rejected').length;

  return (
    <div className="bg-gray-900 rounded-xl shadow-xl border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white mb-1">New Employee Enrollments</h2>
          <p className="text-gray-400 text-sm">Manage face recognition setup for new hires</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-medium">
              {pendingCount} Pending
            </div>
            <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
              {enrolledCount} Enrolled
            </div>
            {rejectedCount > 0 && (
              <div className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-medium">
                {rejectedCount} Rejected
              </div>
            )}
          </div>
          <button
            onClick={addNewEmployee}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap text-sm font-medium"
          >
            <i className="ri-add-line mr-2"></i>
            Add Employee
          </button>
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {newEmployees.map((employee) => (
          <div key={employee.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="flex items-center space-x-4">
              <img
                src={employee.avatar}
                alt={employee.name}
                className="w-12 h-12 rounded-full object-cover object-top border-2 border-gray-600"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-white">{employee.name}</h3>
                <p className="text-gray-400 text-sm">{employee.employeeId} • {employee.department}</p>
                <p className="text-gray-500 text-xs">Joined: {new Date(employee.joinDate).toLocaleDateString()}</p>
                {employee.status === 'enrolled' && (
                  <div className="mt-2">
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                      <i className="ri-shield-check-line mr-1"></i>
                      Can use attendance system
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  employee.status === 'pending' 
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : employee.status === 'enrolled'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                </span>
                <button
                  onClick={() => {
                    setSelectedEmployee(employee);
                    setShowModal(true);
                  }}
                  className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                >
                  <i className="ri-eye-line"></i>
                </button>
              </div>
            </div>
          </div>
        ))}

        {newEmployees.length === 0 && (
          <div className="text-center py-8">
            <i className="ri-user-add-line text-gray-500 text-4xl mb-3"></i>
            <p className="text-gray-400">No new employee enrollments</p>
            <button
              onClick={addNewEmployee}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Add First Employee
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
        <h3 className="text-sm font-medium text-white mb-2">Quick Stats</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-white">{enrolledUsers.length}</p>
            <p className="text-xs text-gray-400">Total Enrolled</p>
          </div>
          <div>
            <p className="text-lg font-bold text-yellow-400">{pendingCount}</p>
            <p className="text-xs text-gray-400">Awaiting Approval</p>
          </div>
          <div>
            <p className="text-lg font-bold text-green-400">{enrolledCount}</p>
            <p className="text-xs text-gray-400">Recently Approved</p>
          </div>
        </div>
      </div>

      {showModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Employee Details</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            
            <div className="text-center mb-6">
              <img
                src={selectedEmployee.avatar}
                alt={selectedEmployee.name}
                className="w-20 h-20 rounded-full object-cover object-top mx-auto mb-3 border-3 border-gray-600"
              />
              <h4 className="text-white font-semibold text-lg">{selectedEmployee.name}</h4>
              <p className="text-gray-400">{selectedEmployee.employeeId}</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-400">Department:</span>
                <span className="text-white">{selectedEmployee.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Join Date:</span>
                <span className="text-white">{new Date(selectedEmployee.joinDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Phone:</span>
                <span className="text-white">{selectedEmployee.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Email:</span>
                <span className="text-white text-sm">{selectedEmployee.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className={`font-medium ${
                  selectedEmployee.status === 'pending' ? 'text-yellow-400' :
                  selectedEmployee.status === 'enrolled' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {selectedEmployee.status.charAt(0).toUpperCase() + selectedEmployee.status.slice(1)}
                </span>
              </div>
            </div>

            {selectedEmployee.status === 'pending' && (
              <div className="flex space-x-3">
                <button
                  onClick={() => updateEmployeeStatus(selectedEmployee.id, 'enrolled')}
                  className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap font-medium"
                >
                  <i className="ri-check-line mr-2"></i>
                  Approve & Enroll
                </button>
                <button
                  onClick={() => updateEmployeeStatus(selectedEmployee.id, 'rejected')}
                  className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap font-medium"
                >
                  <i className="ri-close-line mr-2"></i>
                  Reject
                </button>
              </div>
            )}

            {selectedEmployee.status === 'enrolled' && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <i className="ri-shield-check-line text-green-400"></i>
                  <p className="text-green-400 text-sm font-medium">Employee successfully enrolled</p>
                </div>
                <p className="text-green-300 text-xs mt-1">Can now use attendance system for check-in/out</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
