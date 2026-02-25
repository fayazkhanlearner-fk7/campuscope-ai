import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import AttendancePage from "./pages/AttendancePage";
import SettingsPage from "./pages/SettingsPage";
import StudentsPage from "./pages/StudentsPage";
import ClassesPage from "./pages/ClassesPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import FacultyPage from "./pages/FacultyPage";
import ActivityLogPage from "./pages/ActivityLogPage";
import StudentAttendancePage from "./pages/StudentAttendancePage";
import StudentNotificationsPage from "./pages/StudentNotificationsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          {/* Admin / Faculty routes */}
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/faculty" element={<FacultyPage />} />
          <Route path="/classes" element={<ClassesPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/activity" element={<ActivityLogPage />} />
          {/* Student routes */}
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/attendance" element={<StudentAttendancePage />} />
          <Route path="/student/notifications" element={<StudentNotificationsPage />} />
          {/* Shared routes */}
          <Route path="/settings" element={<SettingsPage />} />
          {/* Catch-all 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
