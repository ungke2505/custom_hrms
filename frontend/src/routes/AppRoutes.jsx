import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import EmployeeList from "../pages/EmployeeList";
import Attendance from "../pages/Attendance";
import StockOpnamePage from "../pages/StockOpnamePage";
import BottomNav from "../components/BottomNav";
import LeaveRequest from "../pages/LeaveRequest";
import Login from "../pages/Login";
import ChangePassword from "../pages/ChangePassword";
import MyAttendance from "../pages/MyAttendance";
import LateEntryPermission from "../pages/LateEntryPermission";
import LeaveMenu from "../pages/LeaveMenu";
import EarlyLeavePermission from "../pages/EarlyLeavePermission";
import SickLeavePermission from "../pages/SickLeavePermission";

/* LMS Pages */
import Training from "../pages/Training";
import CourseDetail from "../pages/CourseDetail";
import Lesson from "../pages/Lesson";
import Quiz from "../pages/Quiz";
import QuizResult from "../pages/QuizResult";
import TrainingResults from "../pages/TrainingResults";
import CourseList from "../pages/CourseList";

function AppRoutes({ loggedIn, setLoggedIn }) {

const location = useLocation();
const hideBottomNav = location.pathname === "/login";

return (
<> <div className="pb-16">
    <Routes>

      <Route
        path="/login"
        element={<Login onLogin={() => setLoggedIn(true)} />}
      />

       <Route
        path="/change-password"
        element={<ChangePassword />}
      />

      <Route
        path="/"
        element={loggedIn ? <Dashboard /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/employees"
        element={loggedIn ? <EmployeeList /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/attendance"
        element={loggedIn ? <Attendance /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/leave-request"
        element={loggedIn ? <LeaveRequest /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/stock-opname"
        element={loggedIn ? <StockOpnamePage /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/my-attendance"
        element={loggedIn ? <MyAttendance /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/late-entry-permission"
        element={loggedIn ? <LateEntryPermission /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/leave-menu"
        element={loggedIn ? <LeaveMenu /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/early-leave-permission"
        element={loggedIn ? <EarlyLeavePermission /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/sick-leave-permission"
        element={loggedIn ? <SickLeavePermission /> : <Navigate to="/login" replace />}
      />

      {/* ================= LMS ================= */}

      <Route
        path="/training"
        element={loggedIn ? <Training /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/courses"
        element={loggedIn ? <CourseList /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/training-results"
        element={loggedIn ? <TrainingResults /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/training/:course"
        element={loggedIn ? <CourseDetail /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/lesson/:lesson"
        element={loggedIn ? <Lesson /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/quiz/:quiz"
        element={loggedIn ? <Quiz /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/quiz-result/:quiz"
        element={loggedIn ? <QuizResult /> : <Navigate to="/login" replace />}
      />

      {/* <Route
        path="/training"
        element={loggedIn ? <Training /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/training/:course"
        element={loggedIn ? <CourseDetail /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/lesson/:lesson"
        element={loggedIn ? <Lesson /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/quiz/:quiz"
        element={loggedIn ? <Quiz /> : <Navigate to="/login" replace />}
      />
      <Route 
      path="/quiz-result/:quiz"
      element={loggedIn ? <QuizResult /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/training-results"
        element={loggedIn ? <TrainingResults /> : <Navigate to="/login" replace />}
      /> */}

      {/* <Route
        path="/courses"
        element={loggedIn ? <CourseList /> : <Navigate to="/login" replace />}
      /> */}

    </Routes>

  </div>

  {loggedIn && !hideBottomNav && <BottomNav />}
</>

);
}

export default AppRoutes;
