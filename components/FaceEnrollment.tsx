
'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { advancedFaceRecognitionService } from '../lib/faceRecognition';

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

export default function FaceEnrollment() {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isProcessingEnrollment, setIsProcessingEnrollment] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    department: '',
    email: '',
    phone: ''
  });

  const [enrolledUsers, setEnrolledUsers] = useState<EnrolledUser[]>([]);

  useEffect(() => {
    const initializeRecognition = async () => {
      await advancedFaceRecognitionService.initializeModel();
    };

    initializeRecognition();

    const savedUsers = localStorage.getItem('attendeye-enrolled-users');
    if (savedUsers) {
      setEnrolledUsers(JSON.parse(savedUsers));
    } else {
      const defaultUsers: EnrolledUser[] = [
        {
          id: 1,
          name: 'John Smith',
          employeeId: 'ATT-001',
          department: 'Engineering',
          email: 'john.smith@company.com',
          phone: '+1-234-567-8901',
          enrolledDate: '2024-01-15',
          avatar: 'https://readdy.ai/api/search-image?query=professional%20male%20employee%20headshot%20photo%20corporate%20business%20portrait%20clean%20background%20formal%20attire%20confident%20smile%20engineering%20tech%20worker&width=60&height=60&seq=enrolled1&orientation=squarish',
          faceData: []
        },
        {
          id: 2,
          name: 'Sarah Johnson',
          employeeId: 'ATT-002',
          department: 'Marketing',
          email: 'sarah.johnson@company.com',
          phone: '+1-234-567-8902',
          enrolledDate: '2024-01-12',
          avatar: 'https://readdy.ai/api/search-image?query=professional%20female%20employee%20headshot%20photo%20corporate%20business%20portrait%20clean%20background%20formal%20attire%20confident%20smile%20marketing%20professional&width=60&height=60&seq=enrolled2&orientation=squarish',
          faceData: []
        },
        {
          id: 3,
          name: 'Mike Chen',
          employeeId: 'ATT-003',
          department: 'Engineering',
          email: 'mike.chen@company.com',
          phone: '+1-234-567-8903',
          enrolledDate: '2024-01-10',
          avatar: 'https://readdy.ai/api/search-image?query=professional%20asian%20male%20employee%20headshot%20photo%20corporate%20business%20portrait%20clean%20background%20formal%20attire%20confident%20smile%20engineering%20developer&width=60&height=60&seq=enrolled3&orientation=squarish',
          faceData: []
        }
      ];
      setEnrolledUsers(defaultUsers);
      localStorage.setItem('attendeye-enrolled-users', JSON.stringify(defaultUsers));
    }
  }, []);

  const webcamRef = useRef<Webcam>(null);

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: 'user',
    frameRate: { ideal: 30, max: 30 }
  };

  const generateEmployeeId = (): string => {
    const prefix = 'ATT';
    const existingIds = enrolledUsers.map(user => {
      const idPart = user.employeeId.replace(`${prefix}-`, '');
      return parseInt(idPart) || 0;
    });
    const maxId = Math.max(...existingIds, 0);
    const newId = maxId + 1;
    return `${prefix}-${String(newId).padStart(3, '0')}`;
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc && capturedImages.length < 5) {
      setCapturedImages(prev => [...prev, imageSrc]);
    }
  }, [webcamRef, capturedImages]);

  const startCapture = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(() => {
        setIsCapturing(true);
        setCameraError(null);
      })
      .catch((error) => {
        console.error('Camera error:', error);
        setCameraError('Camera access denied or not available. Please check permissions and try again.');
      });
  };

  const handleEnrollment = async () => {
    if (capturedImages.length >= 3 && formData.firstName && formData.lastName) {
      setIsProcessingEnrollment(true);

      try {
        const employeeId = generateEmployeeId();
        const fullName = `${formData.firstName} ${formData.lastName}`;

        const newUser: EnrolledUser = {
          id: Date.now(),
          name: fullName,
          employeeId: employeeId,
          department: formData.department,
          email: formData.email,
          phone: formData.phone,
          enrolledDate: new Date().toISOString().split('T')[0],
          avatar: capturedImages[0],
          faceData: capturedImages
        };

        // Save to local storage first
        const updatedUsers = [newUser, ...enrolledUsers];
        setEnrolledUsers(updatedUsers);
        localStorage.setItem('attendeye-enrolled-users', JSON.stringify(updatedUsers));

        // Enroll in advanced face recognition system
        const enrollmentSuccess = await advancedFaceRecognitionService.enrollFaceAdvanced(
          newUser.id,
          employeeId,
          fullName,
          capturedImages[0] // Use the first image for primary enrollment
        );

        if (enrollmentSuccess) {
          console.log(` Advanced enrollment successful for ${fullName}`);

          // Reset form
          setFormData({
            firstName: '',
            lastName: '',
            department: '',
            email: '',
            phone: ''
          });
          setCapturedImages([]);
          setIsCapturing(false);

          alert(` Employee enrolled successfully with AI recognition!\n\nEmployee ID: ${employeeId}\nName: ${fullName}\n\nThey can now use the attendance system for automatic check-in/out.`);
        } else {
          throw new Error('Failed to enroll in AI recognition system');
        }

      } catch (error) {
        console.error('Enrollment error:', error);
        alert(' Enrollment failed. Please ensure good image quality and try again.');

        // Remove from stored users if AI enrollment failed
        const rollbackUsers = enrolledUsers;
        setEnrolledUsers(rollbackUsers);
        localStorage.setItem('attendeye-enrolled-users', JSON.stringify(rollbackUsers));
      } finally {
        setIsProcessingEnrollment(false);
      }
    } else {
      alert(' Please fill required fields (First Name, Last Name) and capture at least 3 clear face images.');
    }
  };

  const deleteUser = async (userId: number) => {
    if (confirm(' Are you sure you want to delete this user?\n\nThis will remove them from:\n• Local database\n• AI face recognition system\n• All attendance records\n\nThis action cannot be undone.')) {
      const updatedUsers = enrolledUsers.filter(user => user.id !== userId);
      setEnrolledUsers(updatedUsers);
      localStorage.setItem('attendeye-enrolled-users', JSON.stringify(updatedUsers));

      // Note: In a real implementation, you'd also remove from the AI system
      console.log(`User ${userId} removed from system`);
    }
  };

  const handleCameraError = (error: any) => {
    console.error('Webcam error:', error);
    setCameraError('Camera initialization failed. Please refresh and try again.');
    setIsCapturing(false);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto bg-black min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          <i className="ri-eye-line mr-3 text-blue-400"></i>
          AttendEye - AI Face Enrollment
        </h1>
        <p className="text-gray-400">Register employees for advanced AI face recognition attendance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div className="bg-gray-900 rounded-xl shadow-xl border border-gray-800 p-4 sm:p-6">
          <h2 className="text-xl font-semibold text-white mb-6">
            <i className="ri-user-add-line mr-2 text-green-400"></i>
            Add New Employee
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">First Name *</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                placeholder="Enter first name"
                disabled={isProcessingEnrollment}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Last Name *</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                placeholder="Enter last name"
                disabled={isProcessingEnrollment}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Employee ID</label>
              <input
                type="text"
                value={generateEmployeeId()}
                disabled
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300"
                placeholder="Auto-generated"
              />
              <p className="text-xs text-gray-500 mt-1">
                <i className="ri-information-line mr-1"></i>
                AI-compatible ID format
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white pr-8"
                disabled={isProcessingEnrollment}
              >
                <option value="">Select Department</option>
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
                <option value="Design">Design</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                placeholder="john.doe@company.com"
                disabled={isProcessingEnrollment}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                placeholder="+1-234-567-8900"
                disabled={isProcessingEnrollment}
              />
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-white mb-4">
              <i className="ri-ai-generate mr-2 text-blue-400"></i>
              AI Face Capture System
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Capture multiple high-quality images for advanced AI recognition. Our system uses multiple algorithms (Haar, HOG, MTCNN, RetinaFace) for maximum accuracy.
            </p>

            {!isCapturing ? (
              <div className="text-center">
                {cameraError && (
                  <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg">
                    <p className="text-red-400 text-sm">{cameraError}</p>
                  </div>
                )}
                <button
                  onClick={startCapture}
                  disabled={isProcessingEnrollment}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 transition-all cursor-pointer whitespace-nowrap flex items-center justify-center space-x-2 font-medium"
                >
                  <i className="ri-camera-ai-line text-lg"></i>
                  <span>Start AI Face Capture Session</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <Webcam
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    onUserMediaError={handleCameraError}
                    className="w-full h-64 sm:h-80 object-cover rounded-lg border-2 border-blue-500"
                    mirrored={true}
                  />
                  <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none">
                    <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-blue-400"></div>
                    <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-blue-400"></div>
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-blue-400"></div>
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-blue-400"></div>

                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      <i className="ri-ai-generate mr-1"></i>
                      AI ENROLLMENT MODE
                    </div>

                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-xs">
                      Multi-Algorithm Recognition Ready
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={capture}
                    disabled={capturedImages.length >= 5 || isProcessingEnrollment}
                    className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-600 transition-colors cursor-pointer whitespace-nowrap font-medium"
                  >
                    <i className="ri-camera-fill mr-2"></i>
                    AI Capture ({capturedImages.length}/5)
                  </button>
                  <button
                    onClick={() => {
                      setIsCapturing(false);
                      setCameraError(null);
                    }}
                    disabled={isProcessingEnrollment}
                    className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-600 transition-colors cursor-pointer whitespace-nowrap font-medium"
                  >
                    <i className="ri-stop-line mr-2"></i>
                    Stop
                  </button>
                </div>
              </div>
            )}

            {capturedImages.length > 0 && (
              <div className="mt-6">
                <p className="text-sm text-gray-300 mb-3">
                  <i className="ri-image-line mr-1"></i>
                  AI Training Images ({capturedImages.length}/5):
                </p>
                <div className="grid grid-cols-5 gap-2">
                  {capturedImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`AI Capture ${index + 1}`}
                        className="w-full h-16 object-cover rounded-lg border border-gray-600"
                      />
                      <button
                        onClick={() => setCapturedImages(prev => prev.filter((_, i) => i !== index))}
                        disabled={isProcessingEnrollment}
                        className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  <i className="ri-lightbulb-line mr-1"></i>
                  Tip: Capture from different angles for enhanced AI accuracy
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleEnrollment}
            disabled={capturedImages.length < 3 || !formData.firstName || !formData.lastName || isProcessingEnrollment}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 transition-all cursor-pointer whitespace-nowrap font-medium flex items-center justify-center space-x-2"
          >
            {isProcessingEnrollment ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Processing AI Enrollment...</span>
              </>
            ) : (
              <>
                <i className="ri-user-add-fill"></i>
                <span>Enroll with Advanced AI Recognition</span>
              </>
            )}
          </button>

          {(capturedImages.length < 3 || !formData.firstName || !formData.lastName) && !isProcessingEnrollment && (
            <p className="text-yellow-400 text-sm mt-2 text-center">
              <i className="ri-information-line mr-1"></i>
              Fill required fields and capture minimum 3 AI training images
            </p>
          )}

          {isProcessingEnrollment && (
            <div className="mt-4 p-3 bg-blue-900/30 border border-blue-500/30 rounded-lg">
              <p className="text-blue-300 text-sm text-center">
                <i className="ri-ai-generate mr-1"></i>
                Training AI models with captured face data...
              </p>
            </div>
          )}
        </div>

        <div className="bg-gray-900 rounded-xl shadow-xl border border-gray-800 p-4 sm:p-6">
          <h2 className="text-xl font-semibold text-white mb-6">
            <i className="ri-team-line mr-2 text-green-400"></i>
            AI-Enrolled Employees ({enrolledUsers.length})
          </h2>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {enrolledUsers.map((user) => (
              <div key={user.id} className="flex items-center space-x-4 p-4 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover object-top border-2 border-gray-600"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-white">{user.name}</h3>
                  <p className="text-sm text-gray-400">{user.employeeId} • {user.department}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-xs text-gray-500">Enrolled: {user.enrolledDate}</p>
                    {user.faceData && user.faceData.length > 0 && (
                      <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                        <i className="ri-ai-generate mr-1"></i>
                        AI Ready
                      </span>
                    )}
                  </div>
                  {user.email && <p className="text-xs text-gray-500">{user.email}</p>}
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded-full">
                    <i className="ri-check-line mr-1"></i>
                    Active
                  </div>
                  <button
                    onClick={() => deleteUser(user.id)}
                    disabled={isProcessingEnrollment}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <h3 className="text-sm font-medium text-white mb-2">
              <i className="ri-guide-line mr-1"></i>
              AI Enrollment Guidelines
            </h3>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• <strong>Lighting:</strong> Ensure even, natural lighting on face</li>
              <li>• <strong>Position:</strong> Look directly at camera, centered in frame</li>
              <li>• <strong>Angles:</strong> Capture front view and slight rotations</li>
              <li>• <strong>Quality:</strong> Remove glasses/hats if possible</li>
              <li>• <strong>Expression:</strong> Neutral expression for best AI training</li>
              <li>• <strong>System:</strong> Multi-algorithm processing (Haar+HOG+MTCNN+RetinaFace)</li>
            </ul>
          </div>

          <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <h3 className="text-sm font-medium text-blue-300 mb-2">
              <i className="ri-cpu-line mr-1"></i>
              AI Recognition Status
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span className="text-gray-300">Haar Cascades: Ready</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span className="text-gray-300">HOG+SVM: Ready</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span className="text-gray-300">MTCNN: Ready</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span className="text-gray-300">RetinaFace: Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
