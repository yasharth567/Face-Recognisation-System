
'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { advancedFaceRecognitionService } from '../lib/faceRecognition';

interface AttendanceRecord {
  id: number;
  name: string;
  employeeId: string;
  timestamp: string;
  status: 'check-in' | 'check-out';
  confidence: number;
  avatar: string;
  method: string;
  matchScore: number;
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

export default function AttendanceCapture() {
  const [isActive, setIsActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [captureQuality, setCaptureQuality] = useState<'low' | 'medium' | 'high'>('high');
  const [attendanceMode, setAttendanceMode] = useState<'check-in' | 'check-out'>('check-in');
  const [enrolledUsers, setEnrolledUsers] = useState<EnrolledUser[]>([]);
  const [detectionMethod, setDetectionMethod] = useState<'haar' | 'hog' | 'mtcnn' | 'retinaface' | 'multi'>('multi');
  const [recognitionThreshold, setRecognitionThreshold] = useState(70);
  const [isModelLoading, setIsModelLoading] = useState(false);
  
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord[]>([]);
  
  const [recognitionResult, setRecognitionResult] = useState<{
    name: string;
    confidence: number;
    status: 'success' | 'error';
    employeeId?: string;
    method?: string;
    details?: string;
  } | null>(null);

  useEffect(() => {
    const initializeAdvancedRecognition = async () => {
      setIsModelLoading(true);
      
      // Load enrolled users
      const savedUsers = localStorage.getItem('attendeye-enrolled-users');
      if (savedUsers) {
        const users = JSON.parse(savedUsers);
        setEnrolledUsers(users);
      }

      // Initialize advanced face recognition
      await advancedFaceRecognitionService.initializeModel();
      
      // Set recognition threshold
      advancedFaceRecognitionService.setRecognitionThreshold(recognitionThreshold / 100);
      
      // Set detection method
      advancedFaceRecognitionService.setDetectionMethod(detectionMethod);
      
      // Sync with enrolled users
      await advancedFaceRecognitionService.syncWithEnrolledUsers();
      
      setIsModelLoading(false);
    };

    initializeAdvancedRecognition();

    // Load attendance records
    const savedAttendance = localStorage.getItem('attendeye-today-attendance');
    if (savedAttendance) {
      const attendance = JSON.parse(savedAttendance);
      const today = new Date().toDateString();
      if (attendance.date === today) {
        setTodayAttendance(attendance.records);
      } else {
        localStorage.removeItem('attendeye-today-attendance');
      }
    }
  }, [recognitionThreshold, detectionMethod]);

  const saveAttendanceToStorage = (records: AttendanceRecord[]) => {
    const attendanceData = {
      date: new Date().toDateString(),
      records: records
    };
    localStorage.setItem('attendeye-today-attendance', JSON.stringify(attendanceData));
  };

  const webcamRef = useRef<Webcam>(null);

  const videoConstraints = {
    width: captureQuality === 'high' ? 1280 : captureQuality === 'medium' ? 720 : 480,
    height: captureQuality === 'high' ? 720 : captureQuality === 'medium' ? 480 : 360,
    facingMode: 'user',
    frameRate: { ideal: 30, max: 30 }
  };

  const performAdvancedRecognition = useCallback(async () => {
    setIsProcessing(true);
    setCameraError(null);
    
    try {
      // Capture current frame
      const imageSrc = webcamRef.current?.getScreenshot();
      if (!imageSrc) {
        throw new Error('Failed to capture image from camera');
      }

      // Show processing status
      setRecognitionResult({
        name: 'Processing with AI algorithms...',
        confidence: 0,
        status: 'error',
        details: 'Analyzing with Haar, HOG, MTCNN, and RetinaFace'
      });

      // Perform advanced face recognition
      const recognitionResult = await advancedFaceRecognitionService.recognizeFaceAdvanced(imageSrc);
      
      if (recognitionResult.userId && recognitionResult.confidence > recognitionThreshold) {
        // Check for duplicate attendance
        const existingRecord = todayAttendance.find(
          record => record.employeeId === recognitionResult.employeeId && record.status === attendanceMode
        );

        if (existingRecord) {
          setRecognitionResult({
            name: `${recognitionResult.name} - Already ${attendanceMode.replace('-', ' ')}ed today`,
            confidence: recognitionResult.confidence,
            status: 'error',
            employeeId: recognitionResult.employeeId,
            method: recognitionResult.method,
            details: `Last ${attendanceMode}: ${existingRecord.timestamp}`
          });
        } else {
          // Create new attendance record
          const newRecord: AttendanceRecord = {
            id: Date.now(),
            name: recognitionResult.name,
            employeeId: recognitionResult.employeeId,
            timestamp: new Date().toLocaleTimeString(),
            status: attendanceMode,
            confidence: recognitionResult.confidence,
            avatar: enrolledUsers.find(u => u.employeeId === recognitionResult.employeeId)?.avatar || '',
            method: recognitionResult.method,
            matchScore: recognitionResult.matchScore
          };
          
          const updatedAttendance = [newRecord, ...todayAttendance];
          setTodayAttendance(updatedAttendance);
          saveAttendanceToStorage(updatedAttendance);
          
          setRecognitionResult({
            name: `✅ ${recognitionResult.name} - ${attendanceMode.replace('-', ' ')} successful`,
            confidence: recognitionResult.confidence,
            status: 'success',
            employeeId: recognitionResult.employeeId,
            method: recognitionResult.method,
            details: `Verified using ${recognitionResult.method}`
          });
        }
      } else {
        setRecognitionResult({
          name: recognitionResult.userId ? 'Low confidence match' : 'Employee not recognized',
          confidence: recognitionResult.confidence,
          status: 'error',
          method: recognitionResult.method,
          details: `Threshold: ${recognitionThreshold}% | Methods: ${detectionMethod} | Enrolled: ${enrolledUsers.length} employees`
        });
      }
      
    } catch (error) {
      console.error('Recognition error:', error);
      setRecognitionResult({
        name: 'Recognition system error',
        confidence: 0,
        status: 'error',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setIsProcessing(false);
      
      // Clear result after 6 seconds
      setTimeout(() => {
        setRecognitionResult(null);
      }, 6000);
    }
  }, [todayAttendance, attendanceMode, enrolledUsers, recognitionThreshold, detectionMethod]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && enrolledUsers.length > 0 && !isModelLoading) {
      interval = setInterval(() => {
        if (!isProcessing && Math.random() > 0.7) {
          performAdvancedRecognition();
        }
      }, 8000);
    }
    
    return () => clearInterval(interval);
  }, [isActive, isProcessing, performAdvancedRecognition, enrolledUsers.length, isModelLoading]);

  const handleCameraError = (error: any) => {
    console.error('Camera error:', error);
    setCameraError('Camera access denied or not available. Please check permissions.');
    setIsActive(false);
  };

  const manualCapture = () => {
    if (!isProcessing && !cameraError && enrolledUsers.length > 0 && !isModelLoading) {
      performAdvancedRecognition();
    } else if (enrolledUsers.length === 0) {
      alert('No enrolled employees found. Please enroll employees first in the Face Enrollment section.');
    } else if (isModelLoading) {
      alert('AI models are still loading. Please wait a moment.');
    }
  };

  const toggleCamera = () => {
    if (isActive) {
      setIsActive(false);
      setCameraError(null);
    } else {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(() => {
          setIsActive(true);
          setCameraError(null);
        })
        .catch((error) => {
          handleCameraError(error);
        });
    }
  };

  const handleThresholdChange = (threshold: number) => {
    setRecognitionThreshold(threshold);
    advancedFaceRecognitionService.setRecognitionThreshold(threshold / 100);
  };

  const handleMethodChange = (method: 'haar' | 'hog' | 'mtcnn' | 'retinaface' | 'multi') => {
    setDetectionMethod(method);
    advancedFaceRecognitionService.setDetectionMethod(method);
  };

  const getAttendanceStats = () => {
    const checkIns = todayAttendance.filter(record => record.status === 'check-in').length;
    const checkOuts = todayAttendance.filter(record => record.status === 'check-out').length;
    const uniqueEmployees = new Set(todayAttendance.map(record => record.employeeId)).size;
    
    return { checkIns, checkOuts, total: todayAttendance.length, unique: uniqueEmployees };
  };

  const stats = getAttendanceStats();

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto bg-black min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          <i className="ri-eye-line mr-3 text-blue-400"></i>
          AttendEye - Advanced AI Recognition
        </h1>
        <p className="text-gray-400">Multi-algorithm face recognition with enhanced accuracy</p>
      </div>

      {isModelLoading && (
        <div className="mb-6 p-4 bg-blue-900/30 border border-blue-500/30 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="animate-spin w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full"></div>
            <div>
              <p className="text-blue-300 font-medium">Loading AI Recognition Models...</p>
              <p className="text-blue-400 text-sm">Initializing Haar, HOG, MTCNN, and RetinaFace algorithms</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 bg-gray-900 rounded-xl shadow-xl border border-gray-800 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-xl font-semibold text-white">Smart AI Camera System</h2>
              <p className="text-gray-400 text-sm mt-1">Multi-algorithm employee recognition</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Detection Method</label>
              <select
                value={detectionMethod}
                onChange={(e) => handleMethodChange(e.target.value as any)}
                className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg text-sm pr-8"
                disabled={isActive || isModelLoading}
              >
                <option value="multi">Multi-Algorithm (Best)</option>
                <option value="retinaface">RetinaFace (Deep Learning)</option>
                <option value="mtcnn">MTCNN (CNN)</option>
                <option value="hog">HOG + SVM</option>
                <option value="haar">Haar Cascades</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Recognition Threshold: {recognitionThreshold}%
              </label>
              <input
                type="range"
                min="50"
                max="95"
                value={recognitionThreshold}
                onChange={(e) => handleThresholdChange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                disabled={isModelLoading}
              />
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">Attendance Mode</h3>
              <div className="bg-gray-800 rounded-lg p-1 flex">
                <button
                  onClick={() => setAttendanceMode('check-in')}
                  className={`px-4 py-2 rounded-md transition-colors cursor-pointer whitespace-nowrap text-sm font-medium ${
                    attendanceMode === 'check-in'
                      ? 'bg-green-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <i className="ri-login-circle-line mr-2"></i>
                  Check In
                </button>
                <button
                  onClick={() => setAttendanceMode('check-out')}
                  className={`px-4 py-2 rounded-md transition-colors cursor-pointer whitespace-nowrap text-sm font-medium ${
                    attendanceMode === 'check-out'
                      ? 'bg-red-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <i className="ri-logout-circle-line mr-2"></i>
                  Check Out
                </button>
              </div>
            </div>
          </div>

          <div className="relative mb-6">
            {cameraError ? (
              <div className="w-full h-64 sm:h-80 bg-gray-800 rounded-lg flex items-center justify-center border-2 border-red-500/50">
                <div className="text-center p-4">
                  <i className="ri-camera-off-line text-red-400 text-4xl mb-3"></i>
                  <p className="text-red-400 font-medium mb-2">Camera Error</p>
                  <p className="text-gray-400 text-sm">{cameraError}</p>
                  <button
                    onClick={toggleCamera}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    Retry Camera Access
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative">
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  onUserMediaError={handleCameraError}
                  className="w-full h-64 sm:h-80 object-cover rounded-lg"
                  mirrored={true}
                />
                
                {isActive && (
                  <div className={`absolute inset-0 border-2 rounded-lg pointer-events-none ${
                    attendanceMode === 'check-in' ? 'border-green-500' : 'border-red-500'
                  }`}>
                    <div className={`absolute top-4 left-4 w-6 h-6 sm:w-8 sm:h-8 border-t-2 border-l-2 ${
                      attendanceMode === 'check-in' ? 'border-green-500' : 'border-red-500'
                    }`}></div>
                    <div className={`absolute top-4 right-4 w-6 h-6 sm:w-8 sm:h-8 border-t-2 border-r-2 ${
                      attendanceMode === 'check-in' ? 'border-green-500' : 'border-red-500'
                    }`}></div>
                    <div className={`absolute bottom-4 left-4 w-6 h-6 sm:w-8 sm:h-8 border-b-2 border-l-2 ${
                      attendanceMode === 'check-in' ? 'border-green-500' : 'border-red-500'
                    }`}></div>
                    <div className={`absolute bottom-4 right-4 w-6 h-6 sm:w-8 sm:h-8 border-b-2 border-r-2 ${
                      attendanceMode === 'check-in' ? 'border-green-500' : 'border-red-500'
                    }`}></div>
                    
                    <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                      attendanceMode === 'check-in' ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      <i className="ri-ai-generate mr-1"></i>
                      AI {attendanceMode.toUpperCase().replace('-', ' ')} MODE
                    </div>
                    
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-xs">
                      {detectionMethod.toUpperCase()} • {videoConstraints.width}x{videoConstraints.height}
                    </div>
                  </div>
                )}

                {isProcessing && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-lg">
                    <div className="bg-gray-900 p-4 sm:p-6 rounded-xl text-center border border-gray-700">
                      <div className="animate-spin w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                      <p className="text-white font-medium">AI Processing Employee...</p>
                      <p className="text-gray-400 text-sm mt-1">Multi-algorithm analysis in progress</p>
                    </div>
                  </div>
                )}

                {recognitionResult && (
                  <div className={`absolute top-4 left-4 right-4 p-3 sm:p-4 rounded-lg border-2 backdrop-blur-sm ${
                    recognitionResult.status === 'success' 
                      ? 'bg-green-900/90 border-green-500' 
                      : 'bg-red-900/90 border-red-500'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <i className={`text-2xl ${
                        recognitionResult.status === 'success' 
                          ? 'ri-check-circle-fill text-green-400' 
                          : 'ri-error-warning-fill text-red-400'
                      }`}></i>
                      <div className="flex-1">
                        <p className={`font-semibold text-sm sm:text-base ${
                          recognitionResult.status === 'success' ? 'text-green-100' : 'text-red-100'
                        }`}>
                          {recognitionResult.name}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center space-x-2">
                            <span className={`text-xs sm:text-sm ${
                              recognitionResult.status === 'success' ? 'text-green-300' : 'text-red-300'
                            }`}>
                              {recognitionResult.confidence > 0 ? `${recognitionResult.confidence.toFixed(1)}% confidence` : 'No match'}
                            </span>
                            {recognitionResult.employeeId && (
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                recognitionResult.status === 'success' 
                                  ? 'bg-green-500/20 text-green-300' 
                                  : 'bg-red-500/20 text-red-300'
                              }`}>
                                {recognitionResult.employeeId}
                              </span>
                            )}
                          </div>
                          {recognitionResult.method && (
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              recognitionResult.status === 'success' 
                                ? 'bg-blue-500/20 text-blue-300' 
                                : 'bg-orange-500/20 text-orange-300'
                            }`}>
                              {recognitionResult.method}
                            </span>
                          )}
                        </div>
                        {recognitionResult.details && (
                          <p className={`text-xs mt-1 ${
                            recognitionResult.status === 'success' ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {recognitionResult.details}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={toggleCamera}
              disabled={isModelLoading}
              className={`py-2 sm:py-3 rounded-lg transition-colors cursor-pointer whitespace-nowrap font-medium text-sm sm:text-base disabled:opacity-50 ${
                isActive 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isActive ? (
                <>
                  <i className="ri-stop-line mr-1 sm:mr-2"></i>
                  Stop Camera
                </>
              ) : (
                <>
                  <i className="ri-play-line mr-1 sm:mr-2"></i>
                  Start Camera
                </>
              )}
            </button>
            <button
              onClick={manualCapture}
              disabled={isProcessing || !isActive || !!cameraError || enrolledUsers.length === 0 || isModelLoading}
              className="py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 transition-colors cursor-pointer whitespace-nowrap font-medium text-sm sm:text-base"
            >
              <i className="ri-ai-generate mr-1 sm:mr-2"></i>
              AI Capture
            </button>
          </div>

          <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
            <h3 className="font-medium text-white mb-3">AI System Status</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isActive && !cameraError ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className="text-gray-300">Camera: {isActive && !cameraError ? 'Active' : 'Inactive'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${!isModelLoading ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                <span className="text-gray-300">AI Models: {isModelLoading ? 'Loading' : 'Ready'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${enrolledUsers.length > 0 ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className="text-gray-300">Employees: {enrolledUsers.length}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-yellow-400' : 'bg-blue-400'}`}></div>
                <span className="text-gray-300">Status: {isProcessing ? 'Processing' : detectionMethod.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl shadow-xl border border-gray-800 p-4 sm:p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Today's Attendance</h2>
          
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                <p className="text-xl sm:text-2xl font-bold text-green-400">{stats.checkIns}</p>
                <p className="text-xs sm:text-sm text-green-400">Check Ins</p>
              </div>
              <div className="p-3 bg-red-500/20 rounded-lg border border-red-500/30">
                <p className="text-xl sm:text-2xl font-bold text-red-400">{stats.checkOuts}</p>
                <p className="text-xs sm:text-sm text-red-400">Check Outs</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
                <p className="text-xl sm:text-2xl font-bold text-blue-400">{stats.unique}</p>
                <p className="text-xs sm:text-sm text-blue-400">Employees</p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-lg border border-purple-500/30">
                <p className="text-xl sm:text-2xl font-bold text-purple-400">{stats.total}</p>
                <p className="text-xs sm:text-sm text-purple-400">AI Events</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {todayAttendance.length === 0 ? (
              <div className="text-center py-8">
                <i className="ri-ai-generate text-gray-500 text-4xl mb-3"></i>
                <p className="text-gray-400">No AI attendance records today</p>
                <p className="text-gray-500 text-sm">Start the camera for AI recognition</p>
              </div>
            ) : (
              todayAttendance.map((record) => (
                <div key={record.id} className="flex items-center space-x-3 sm:space-x-4 p-3 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors">
                  <img
                    src={record.avatar}
                    alt={record.name}
                    className="w-10 h-10 rounded-full object-cover object-top border border-gray-600"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{record.name}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      <span>{record.employeeId}</span>
                      <span>•</span>
                      <span className="bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">
                        {record.method}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-medium text-white">{record.timestamp}</p>
                    <div className="flex items-center justify-end space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        record.status === 'check-in' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        <i className={`mr-1 ${record.status === 'check-in' ? 'ri-login-circle-line' : 'ri-logout-circle-line'}`}></i>
                        {record.status.replace('-', ' ').toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">{record.confidence.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {enrolledUsers.length === 0 && (
            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <i className="ri-information-line text-yellow-400 text-lg"></i>
                <div>
                  <p className="text-yellow-400 font-medium text-sm">No Enrolled Employees</p>
                  <p className="text-yellow-300 text-xs">Please enroll employees first to use AI attendance</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
