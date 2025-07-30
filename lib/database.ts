export interface User {
  id: number;
  firstName: string;
  lastName: string;
  employeeId: string;
  department: string;
  email: string;
  phone?: string;
  faceEncodings: number[][];
  enrolledDate: string;
  isActive: boolean;
}

export interface AttendanceRecord {
  id: number;
  userId: number;
  timestamp: Date;
  type: 'in' | 'out';
  confidence: number;
  location?: string;
  notes?: string;
}

export interface FaceRecognitionSettings {
  threshold: number;
  maxDistance: number;
  captureInterval: number;
  autoCapture: boolean;
}

class AttendanceDatabase {
  private users: User[] = [];
  private attendanceRecords: AttendanceRecord[] = [];
  private settings: FaceRecognitionSettings = {
    threshold: 0.9,
    maxDistance: 0.6,
    captureInterval: 5,
    autoCapture: true
  };

  async addUser(userData: Omit<User, 'id' | 'enrolledDate' | 'isActive'>): Promise<User> {
    const newUser: User = {
      ...userData,
      id: this.users.length + 1,
      enrolledDate: new Date().toISOString(),
      isActive: true
    };
    
    this.users.push(newUser);
    return newUser;
  }

  async getAllUsers(): Promise<User[]> {
    return this.users.filter(user => user.isActive);
  }

  async getUserById(id: number): Promise<User | null> {
    return this.users.find(user => user.id === id && user.isActive) || null;
  }

  async getUserByEmployeeId(employeeId: string): Promise<User | null> {
    return this.users.find(user => user.employeeId === employeeId && user.isActive) || null;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | null> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return null;
    
    this.users[userIndex] = { ...this.users[userIndex], ...updates };
    return this.users[userIndex];
  }

  async deleteUser(id: number): Promise<boolean> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return false;
    
    this.users[userIndex].isActive = false;
    return true;
  }

  async recordAttendance(attendance: Omit<AttendanceRecord, 'id'>): Promise<AttendanceRecord> {
    const newRecord: AttendanceRecord = {
      ...attendance,
      id: this.attendanceRecords.length + 1
    };
    
    this.attendanceRecords.push(newRecord);
    return newRecord;
  }

  async getAttendanceByDate(date: string): Promise<AttendanceRecord[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return this.attendanceRecords.filter(
      record => record.timestamp >= startOfDay && record.timestamp <= endOfDay
    );
  }

  async getAttendanceByUser(userId: number, startDate?: string, endDate?: string): Promise<AttendanceRecord[]> {
    let records = this.attendanceRecords.filter(record => record.userId === userId);
    
    if (startDate) {
      const start = new Date(startDate);
      records = records.filter(record => record.timestamp >= start);
    }
    
    if (endDate) {
      const end = new Date(endDate);
      records = records.filter(record => record.timestamp <= end);
    }
    
    return records;
  }

  async getAttendanceStats(date: string) {
    const records = await this.getAttendanceByDate(date);
    const users = await this.getAllUsers();
    
    const presentUsers = new Set(records.map(r => r.userId));
    
    return {
      totalRegistered: users.length,
      present: presentUsers.size,
      absent: users.length - presentUsers.size,
      attendanceRate: users.length > 0 ? (presentUsers.size / users.length) * 100 : 0
    };
  }

  async getSettings(): Promise<FaceRecognitionSettings> {
    return this.settings;
  }

  async updateSettings(newSettings: Partial<FaceRecognitionSettings>): Promise<FaceRecognitionSettings> {
    this.settings = { ...this.settings, ...newSettings };
    return this.settings;
  }

  async exportData(format: 'json' | 'csv' = 'json') {
    const data = {
      users: this.users,
      attendanceRecords: this.attendanceRecords,
      settings: this.settings,
      exportDate: new Date().toISOString()
    };
    
    if (format === 'json') {
      return JSON.stringify(data, null, 2);
    } else {
      return this.convertToCSV(data);
    }
  }

  private convertToCSV(data: any): string {
    const headers = ['Date', 'Employee ID', 'Name', 'Department', 'Type', 'Timestamp', 'Confidence'];
    const rows = data.attendanceRecords.map((record: AttendanceRecord) => {
      const user = data.users.find((u: User) => u.id === record.userId);
      return [
        record.timestamp.toISOString().split('T')[0],
        user?.employeeId || '',
        `${user?.firstName} ${user?.lastName}` || '',
        user?.department || '',
        record.type,
        record.timestamp.toISOString(),
        record.confidence
      ].join(',');
    });
    
    return [headers.join(','), ...rows].join('\n');
  }

  async importData(jsonData: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.users) this.users = data.users;
      if (data.attendanceRecords) this.attendanceRecords = data.attendanceRecords;
      if (data.settings) this.settings = data.settings;
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
}

export const attendanceDB = new AttendanceDatabase();