// Mock data for the attendance management system

export type UserRole = 'admin' | 'faculty' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  time: string;
  confidenceScore: number;
  status: 'present' | 'absent' | 'late';
  subject: string;
}

export interface ClassInfo {
  id: string;
  subject: string;
  facultyName: string;
  schedule: string;
  totalStudents: number;
  presentToday: number;
}

export const currentUser: User = {
  id: '1',
  name: 'Dr. Sarah Mitchell',
  email: 'sarah.mitchell@university.edu',
  role: 'admin',
  department: 'Computer Science',
};

export const dashboardStats = {
  totalStudents: 2847,
  presentToday: 2156,
  absentToday: 691,
  attendanceRate: 75.7,
  totalFaculty: 186,
  totalClasses: 42,
  averageConfidence: 94.2,
  flaggedStudents: 23,
};

export const weeklyAttendance = [
  { day: 'Mon', present: 2320, absent: 527 },
  { day: 'Tue', present: 2450, absent: 397 },
  { day: 'Wed', present: 2180, absent: 667 },
  { day: 'Thu', present: 2390, absent: 457 },
  { day: 'Fri', present: 2156, absent: 691 },
];

export const monthlyTrend = [
  { month: 'Jan', rate: 82 },
  { month: 'Feb', rate: 79 },
  { month: 'Mar', rate: 84 },
  { month: 'Apr', rate: 77 },
  { month: 'May', rate: 81 },
  { month: 'Jun', rate: 76 },
  { month: 'Jul', rate: 0 },
  { month: 'Aug', rate: 85 },
  { month: 'Sep', rate: 83 },
  { month: 'Oct', rate: 80 },
  { month: 'Nov', rate: 78 },
  { month: 'Dec', rate: 75 },
];

export const departmentStats = [
  { name: 'Computer Science', rate: 82, students: 620 },
  { name: 'Electronics', rate: 78, students: 480 },
  { name: 'Mechanical', rate: 74, students: 550 },
  { name: 'Civil', rate: 80, students: 410 },
  { name: 'Mathematics', rate: 85, students: 320 },
  { name: 'Physics', rate: 77, students: 467 },
];

export const recentAttendance: AttendanceRecord[] = [
  { id: '1', studentId: 'STU001', studentName: 'Alex Johnson', date: '2026-02-22', time: '09:02', confidenceScore: 97.3, status: 'present', subject: 'Data Structures' },
  { id: '2', studentId: 'STU002', studentName: 'Maria Garcia', date: '2026-02-22', time: '09:05', confidenceScore: 94.8, status: 'present', subject: 'Data Structures' },
  { id: '3', studentId: 'STU003', studentName: 'James Wilson', date: '2026-02-22', time: '09:18', confidenceScore: 91.2, status: 'late', subject: 'Data Structures' },
  { id: '4', studentId: 'STU004', studentName: 'Emily Chen', date: '2026-02-22', time: '-', confidenceScore: 0, status: 'absent', subject: 'Data Structures' },
  { id: '5', studentId: 'STU005', studentName: 'Ryan Patel', date: '2026-02-22', time: '08:58', confidenceScore: 98.1, status: 'present', subject: 'Data Structures' },
  { id: '6', studentId: 'STU006', studentName: 'Sophie Brown', date: '2026-02-22', time: '09:01', confidenceScore: 96.5, status: 'present', subject: 'Algorithms' },
  { id: '7', studentId: 'STU007', studentName: 'Daniel Kim', date: '2026-02-22', time: '-', confidenceScore: 0, status: 'absent', subject: 'Algorithms' },
  { id: '8', studentId: 'STU008', studentName: 'Olivia Martinez', date: '2026-02-22', time: '09:12', confidenceScore: 89.4, status: 'late', subject: 'Algorithms' },
];

export const classes: ClassInfo[] = [
  { id: '1', subject: 'Data Structures', facultyName: 'Dr. Sarah Mitchell', schedule: 'Mon, Wed, Fri - 9:00 AM', totalStudents: 65, presentToday: 58 },
  { id: '2', subject: 'Algorithms', facultyName: 'Prof. David Lee', schedule: 'Tue, Thu - 10:30 AM', totalStudents: 72, presentToday: 61 },
  { id: '3', subject: 'Database Systems', facultyName: 'Dr. Lisa Wang', schedule: 'Mon, Wed - 2:00 PM', totalStudents: 55, presentToday: 48 },
  { id: '4', subject: 'Operating Systems', facultyName: 'Prof. Mark Taylor', schedule: 'Tue, Thu - 11:00 AM', totalStudents: 68, presentToday: 54 },
];

export const studentAttendanceCalendar = Array.from({ length: 28 }, (_, i) => {
  const day = i + 1;
  const isWeekend = (day % 7 === 0) || (day % 7 === 6);
  const rand = Math.random();
  return {
    day,
    date: `2026-02-${String(day).padStart(2, '0')}`,
    status: isWeekend ? 'weekend' as const : rand > 0.2 ? 'present' as const : rand > 0.1 ? 'late' as const : 'absent' as const,
  };
});

export const studentStats = {
  totalClasses: 120,
  attended: 98,
  percentage: 81.7,
  streak: 5,
  rank: 12,
};

export const activityLogs = [
  { id: '1', action: 'Attendance marked via face recognition', performedBy: 'System', timestamp: '2026-02-22 09:02:15', type: 'attendance' as const },
  { id: '2', action: 'New student registered', performedBy: 'Admin', timestamp: '2026-02-22 08:45:30', type: 'admin' as const },
  { id: '3', action: 'Faculty login', performedBy: 'Dr. Sarah Mitchell', timestamp: '2026-02-22 08:30:00', type: 'auth' as const },
  { id: '4', action: 'Attendance report exported', performedBy: 'Admin', timestamp: '2026-02-21 16:20:45', type: 'admin' as const },
  { id: '5', action: 'Face model retrained', performedBy: 'System', timestamp: '2026-02-21 02:00:00', type: 'system' as const },
];
