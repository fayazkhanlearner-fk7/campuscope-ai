import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";
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
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            {/* Admin / Faculty routes */}
            <Route path="/dashboard" element={<ProtectedRoute allowedRoles={["admin", "faculty"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/attendance" element={<ProtectedRoute allowedRoles={["admin", "faculty"]}><AttendancePage /></ProtectedRoute>} />
            <Route path="/students" element={<ProtectedRoute allowedRoles={["admin", "faculty"]}><StudentsPage /></ProtectedRoute>} />
            <Route path="/faculty" element={<ProtectedRoute allowedRoles={["admin"]}><FacultyPage /></ProtectedRoute>} />
            <Route path="/classes" element={<ProtectedRoute allowedRoles={["admin", "faculty"]}><ClassesPage /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute allowedRoles={["admin", "faculty"]}><AnalyticsPage /></ProtectedRoute>} />
            <Route path="/activity" element={<ProtectedRoute allowedRoles={["admin"]}><ActivityLogPage /></ProtectedRoute>} />
            {/* Student routes */}
            <Route path="/student" element={<ProtectedRoute allowedRoles={["student"]}><StudentDashboard /></ProtectedRoute>} />
            <Route path="/student/attendance" element={<ProtectedRoute allowedRoles={["student"]}><StudentAttendancePage /></ProtectedRoute>} />
            <Route path="/student/notifications" element={<ProtectedRoute allowedRoles={["student"]}><StudentNotificationsPage /></ProtectedRoute>} />
            {/* Shared routes */}
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            {/* Catch-all 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
