// import QuickLinkCard from "../components/QuickLinkCard";

// const Dashboard = () => {
//   const links = [
//     { label: "Check In", to: "/attendance", icon: "check-in" },
//     { label: "Leave Request", to: "/leave-request", icon: "leave-request" },
//     { label: "My Attendance", to: "/my-attendance", icon: "attendance" },
//     { label: "Employees", to: "/employees", icon: "employees" },
//   ];

//   const handleLogout = () => {
//     // (Opsional) Logout Frappe session jika perlu
//     fetch("/api/method/logout", { method: "GET", credentials: "include" });

//     localStorage.removeItem("loggedIn");
//     window.location.href = "/custom_hrms/login";
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
//       <div className="grid grid-cols-2 gap-4">
//         {links.map((link) => (
//           <QuickLinkCard key={link.to} {...link} />
//         ))}
//       </div>

//       <button
//         onClick={handleLogout}
//         className="mt-6 bg-red-500 text-white px-4 py-2 rounded w-full"
//       >
//         Logout
//       </button>
//     </div>
//   );
// };

// export default Dashboard;

// import { useEffect, useState } from "react";
// import QuickLinkCard from "../components/QuickLinkCard";

// const Dashboard = () => {
//   const [logs, setLogs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const links = [
//     { label: "Check In", to: "/attendance", icon: "check-in" },
//     { label: "Leave Request", to: "/leave-request", icon: "leave-request" },
//     { label: "My Attendance", to: "/my-attendance", icon: "attendance" },
//     { label: "Employees", to: "/employees", icon: "employees" },
//   ];

//   useEffect(() => {
//     fetch("/api/method/custom_hrms.api.employee_checkin.get_today_logs", {
//       credentials: "include",
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.status === "success" && data.logs) {
//           setLogs(data.logs); // logs is an array of { log_type, time }
//         }
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   const handleLogout = () => {
//     fetch("/api/method/logout", { method: "GET", credentials: "include" });
//     localStorage.removeItem("loggedIn");
//     window.location.href = "/custom_hrms/login";
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-semibold mb-4">Dashboard</h2>

//       <div className="grid grid-cols-2 gap-4 mb-6">
//         {links.map((link) => (
//           <QuickLinkCard key={link.to} {...link} />
//         ))}
//       </div>

//       {/* Today Attendance Logs */}
//       <div className="bg-white p-4 rounded shadow mb-6">
//         <h3 className="text-lg font-semibold mb-2">Today's Attendance</h3>
//         {loading ? (
//           <p>Loading...</p>
//         ) : logs.length === 0 ? (
//           <p>No logs yet</p>
//         ) : (
//           <ul className="space-y-1">
//             {logs.map((log, idx) => (
//               <li key={idx}>
//                 {log.log_type.replace("_", " ")}: {log.time}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       <button
//         onClick={handleLogout}
//         className="bg-red-500 text-white px-4 py-2 rounded w-full"
//       >
//         Logout
//       </button>
//     </div>
//   );
// };

// export default Dashboard;


import { useEffect, useState } from "react";
import QuickLinkCard from "../components/QuickLinkCard";

const Dashboard = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const links = [
    { label: "Check In", to: "/attendance", icon: "check-in" },
    { label: "Leave Request", to: "/leave-request", icon: "leave-request" },
    { label: "My Attendance", to: "/my-attendance", icon: "attendance" },
    { label: "Employees", to: "/employees", icon: "employees" },
  ];

  useEffect(() => {
    fetch("/api/method/custom_hrms.api.employee_checkin.get_today_logs", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setLogs(data.logs);
        }
      })
      .catch((err) => console.error("Error fetching logs:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    fetch("/api/method/logout", { method: "GET", credentials: "include" });
    localStorage.removeItem("loggedIn");
    window.location.href = "/custom_hrms/login";
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Dashboard</h2>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {links.map((link) => (
          <QuickLinkCard key={link.to} {...link} />
        ))}
      </div>

      {/* Today's Attendance Logs */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="text-lg font-semibold mb-2">Today's Attendance</h3>
        {loading ? (
          <p>Loading...</p>
        ) : logs.length === 0 ? (
          <p>No logs today.</p>
        ) : (
          <ul className="space-y-1">
            {logs.map((log, index) => (
              <li key={index}>
                {log.log_type}: {log.time}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded w-full"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
