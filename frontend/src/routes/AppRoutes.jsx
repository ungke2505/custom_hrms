// AppRoutes.jsx
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import EmployeeList from "../pages/EmployeeList";
import Attendance from "../pages/Attendance";
import BottomNav from "../components/BottomNav";
import LeaveRequest from "../pages/LeaveRequest";
import Login from "../pages/Login";
import MyAttendance from "../pages/MyAttendance";
import LateEntryPermission from "../pages/LateEntryPermission";
import LeaveMenu from "../pages/LeaveMenu";
import EarlyLeavePermission from "../pages/EarlyLeavePermission";
import SickLeavePermission from "../pages/SickLeavePermission";

const AppRoutes = ({ loggedIn, setLoggedIn }) => {
  const location = useLocation();
  const hideBottomNav = location.pathname === "/login";

  return (
    <>
      <div className="pb-16">
        <Routes>
          <Route path="/login" element={<Login onLogin={() => setLoggedIn(true)} />} />
          <Route
            path="/"
            element={loggedIn ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/employees"
            element={loggedIn ? <EmployeeList /> : <Navigate to="/login" />}
          />
          <Route
            path="/attendance"
            element={loggedIn ? <Attendance /> : <Navigate to="/login" />}
          />
          <Route
            path="/leave-request"
            element={loggedIn ? <LeaveRequest /> : <Navigate to="/login" />}
          />
          <Route
            path="/my-attendance"
            element={loggedIn ? <MyAttendance /> : <Navigate to="/login" />}
            />
          <Route
            path="/late-entry-permission"
            element={loggedIn ? <LateEntryPermission /> : <Navigate to="/login" />}
          />
          <Route
            path="/leave-menu"
            element={loggedIn ? <LeaveMenu /> : <Navigate to="/login" />}
          />
          <Route
            path="/early-leave-permission"
            element={loggedIn ? <EarlyLeavePermission /> : <Navigate to="/login" />}
          />
          <Route
            path="/sick-leave-permission"
            element={loggedIn ? <SickLeavePermission /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>

      {loggedIn && !hideBottomNav && <BottomNav />}
    </>
  );
};

export default AppRoutes;
