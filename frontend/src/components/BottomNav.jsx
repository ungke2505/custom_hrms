
// import { Home, Users, CalendarCheck } from "lucide-react";
// import { Link, useLocation } from "react-router-dom";

// const BottomNav = () => {
//   const location = useLocation();
//   const hideBottomNav = location.pathname === "/login";

//   const navItems = [
//     { to: "/", icon: <Home size={24} />, label: "Dashboard" },
//     { to: "/employees", icon: <Users size={24} />, label: "Employees" },
//     { to: "/attendance", icon: <CalendarCheck size={24} />, label: "Attendance" },
//     { to: "/leave-request", icon: <CalendarCheck size={24} />, label: "Leave Request" },
//   ];

//   return (
//     <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center h-16 z-50">
//       {navItems.map((item) => (
//         <Link
//           key={item.to}
//           to={item.to}
//           className={`flex flex-col items-center text-sm ${
//             location.pathname === item.to ? "text-blue-600" : "text-gray-500"
//           }`}
//         >
//           {item.icon}
//           <span>{item.label}</span>
//         </Link>
//       ))}
//     </div>
//   );
// };

// export default BottomNav;

import { Home, Users, CalendarCheck } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const BottomNav = () => {
  const location = useLocation();
  const hideBottomNav = location.pathname === "/login";

  if (hideBottomNav || document.body.classList.contains("camera-active")) {
    return null;
  }

  const navItems = [
    { to: "/", icon: <Home size={24} />, label: "Dashboard" },
    { to: "/employees", icon: <Users size={24} />, label: "Employees" },
    { to: "/attendance", icon: <CalendarCheck size={24} />, label: "Attendance" },
    { to: "/leave-request", icon: <CalendarCheck size={24} />, label: "Leave Request" },
  ];

  return (
    <div className="bottom-nav fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center h-16 z-50">
      {navItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className={`flex flex-col items-center text-sm ${
            location.pathname === item.to ? "text-blue-600" : "text-gray-500"
          }`}
        >
          {item.icon}
          <span>{item.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default BottomNav;
