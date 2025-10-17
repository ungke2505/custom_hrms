// AppRoutes.jsx
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import EmployeeList from "../pages/EmployeeList";
import Attendance from "../pages/Attendance";
import BottomNav from "../components/BottomNav";
import LeaveRequest from "../pages/LeaveRequest";
import Login from "../pages/Login";
import MyAttendance from "../pages/MyAttendance";

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
        </Routes>
      </div>

      {loggedIn && !hideBottomNav && <BottomNav />}
    </>
  );
};

export default AppRoutes;
