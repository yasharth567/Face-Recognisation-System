'use client';

import { useState } from 'react';

export default function Settings() {
  const [settings, setSettings] = useState({
    recognitionThreshold: 90,
    autoCapture: true,
    notifications: true,
    emailAlerts: false,
    workingHours: {
      start: '09:00',
      end: '18:00'
    },
    graceTime: 15,
    maxFaceDistance: 0.6,
    cameraResolution: '720p',
    captureInterval: 5,
    dataRetention: 365
  });

  const [activeTab, setActiveTab] = useState('general');

  const handleSettingChange = (key: string, value: any) => {
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      setSettings(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as any,
          [child]: value
        }
      }));
    } else {
      setSettings(prev => ({ ...prev, [key]: value }));
    }
  };

  const saveSettings = () => {
    alert('Settings saved successfully!');
  };

  const resetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      setSettings({
        recognitionThreshold: 90,
        autoCapture: true,
        notifications: true,
        emailAlerts: false,
        workingHours: {
          start: '09:00',
          end: '18:00'
        },
        graceTime: 15,
        maxFaceDistance: 0.6,
        cameraResolution: '720p',
        captureInterval: 5,
        dataRetention: 365
      });
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: 'ri-settings-line' },
    { id: 'recognition', label: 'Recognition', icon: 'ri-face-recognition-line' },
    { id: 'notifications', label: 'Notifications', icon: 'ri-notification-line' },
    { id: 'security', label: 'Security', icon: 'ri-shield-line' },
    { id: 'backup', label: 'Backup', icon: 'ri-database-line' }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">System Settings</h1>
        <p className="text-gray-600">Configure face recognition and attendance system parameters</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings Categories</h2>
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <i className={`${tab.icon} text-lg`}></i>
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {activeTab === 'general' && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">General Settings</h3>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Working Hours Start
                    </label>
                    <input
                      type="time"
                      value={settings.workingHours.start}
                      onChange={(e) => handleSettingChange('workingHours.start', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Working Hours End
                    </label>
                    <input
                      type="time"
                      value={settings.workingHours.end}
                      onChange={(e) => handleSettingChange('workingHours.end', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grace Time (minutes)
                  </label>
                  <input
                    type="number"
                    value={settings.graceTime}
                    onChange={(e) => handleSettingChange('graceTime', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    min="0"
                    max="60"
                  />
                  <p className="text-sm text-gray-500 mt-1">Time allowed for late arrivals before marking as late</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Camera Resolution
                  </label>
                  <select
                    value={settings.cameraResolution}
                    onChange={(e) => handleSettingChange('cameraResolution', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-8"
                  >
                    <option value="480p">480p</option>
                    <option value="720p">720p</option>
                    <option value="1080p">1080p</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Auto Capture Mode</h4>
                    <p className="text-sm text-gray-600">Automatically capture faces when detected</p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('autoCapture', !settings.autoCapture)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer ${
                      settings.autoCapture ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        settings.autoCapture ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'recognition' && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Face Recognition Settings</h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recognition Threshold ({settings.recognitionThreshold}%)
                  </label>
                  <input
                    type="range"
                    min="70"
                    max="99"
                    value={settings.recognitionThreshold}
                    onChange={(e) => handleSettingChange('recognitionThreshold', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>Less Strict (70%)</span>
                    <span>More Strict (99%)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Face Distance ({settings.maxFaceDistance})
                  </label>
                  <input
                    type="range"
                    min="0.3"
                    max="1.0"
                    step="0.1"
                    value={settings.maxFaceDistance}
                    onChange={(e) => handleSettingChange('maxFaceDistance', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-sm text-gray-500 mt-1">Maximum allowed distance for face comparison</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capture Interval (seconds)
                  </label>
                  <input
                    type="number"
                    value={settings.captureInterval}
                    onChange={(e) => handleSettingChange('captureInterval', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    min="1"
                    max="60"
                  />
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Model Information</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>Model: FaceNet (128d)</p>
                    <p>Last Updated: January 15, 2024</p>
                    <p>Trained Faces: 50</p>
                    <p>Accuracy: 98.5%</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Notification Settings</h3>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">System Notifications</h4>
                    <p className="text-sm text-gray-600">Show system alerts and updates</p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('notifications', !settings.notifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer ${
                      settings.notifications ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        settings.notifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Email Alerts</h4>
                    <p className="text-sm text-gray-600">Send email notifications for important events</p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('emailAlerts', !settings.emailAlerts)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer ${
                      settings.emailAlerts ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        settings.emailAlerts ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Email Recipients</h4>
                  <div className="space-y-2">
                    <input
                      type="email"
                      placeholder="admin@company.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer whitespace-nowrap">
                      <i className="ri-add-line mr-1"></i>
                      Add Recipient
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h3>

              <div className="space-y-6">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-medium text-yellow-900 mb-2">
                    <i className="ri-shield-check-line mr-2"></i>
                    Privacy Protection
                  </h4>
                  <p className="text-sm text-yellow-800">
                    All face data is encrypted and stored locally. No data is transmitted to external servers.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data Retention Period (days)
                  </label>
                  <input
                    type="number"
                    value={settings.dataRetention}
                    onChange={(e) => handleSettingChange('dataRetention', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    min="30"
                    max="1095"
                  />
                  <p className="text-sm text-gray-500 mt-1">Attendance records older than this will be automatically deleted</p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Access Control</h4>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <span className="text-gray-700">Admin Access</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Active
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <span className="text-gray-700">Manager Access</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Active
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <span className="text-gray-700">Employee Access</span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                        Read Only
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Backup & Recovery</h3>

              <div className="space-y-6">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Database Status</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>Database Size: 125 MB</p>
                    <p>Last Backup: 2 hours ago</p>
                    <p>Total Records: 15,420</p>
                    <p>Face Encodings: 50 users</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer whitespace-nowrap text-left">
                    <i className="ri-download-cloud-line text-xl text-indigo-600 mb-2"></i>
                    <h4 className="font-medium text-gray-900">Create Backup</h4>
                    <p className="text-sm text-gray-600">Export all attendance data</p>
                  </button>

                  <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer whitespace-nowrap text-left">
                    <i className="ri-upload-cloud-line text-xl text-green-600 mb-2"></i>
                    <h4 className="font-medium text-gray-900">Restore Backup</h4>
                    <p className="text-sm text-gray-600">Import attendance data</p>
                  </button>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Automatic Backup</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <label className="text-gray-700">Enable daily backups</label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input type="checkbox" className="rounded" />
                      <label className="text-gray-700">Export to cloud storage</label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <label className="text-gray-700">Keep local backups for 30 days</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={resetSettings}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer whitespace-nowrap"
            >
              Reset to Default
            </button>
            <button
              onClick={saveSettings}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer whitespace-nowrap"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
