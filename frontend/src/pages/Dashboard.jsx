// import { useEffect, useState } from "react";
// import QuickLinkCard from "../components/QuickLinkCard";

// const Dashboard = () => {
//   const [user, setUser] = useState(null);
//   const [userName, setUserName] = useState(null);
//   const [announcements, setAnnouncements] = useState([]);
//   const [events, setEvents] = useState({ birthdays: [], anniversaries: [] });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showBirthdays, setShowBirthdays] = useState(false);
//   const [showAnniversaries, setShowAnniversaries] = useState(false);

//   const links = [
//     { label: "Absensi", to: "/attendance", icon: "check-in" },
//     { label: "Ijin Terlambat", to: "/late-entry-permission", icon: "leave-request" },
//     { label: "Tukar Shift", to: "/my-attendance", icon: "employees" },
//     { label: "Rekap Absensi", to: "/employees", icon: "attendance" },
//   ];

//   useEffect(() => {
//     fetch("/api/method/frappe.auth.get_logged_user", { credentials: "include" })
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.message) {
//           setUser(data.message);
//           fetch(
//             `/api/method/frappe.client.get_value?doctype=User&filters={"name":"${data.message}"}&fieldname=full_name`,
//             { credentials: "include" }
//           )
//             .then((res) => res.json())
//             .then((userData) => {
//               if (userData.message?.full_name) {
//                 setUserName(userData.message.full_name);
//               }
//             });
//         }
//       })
//       .catch((err) => console.warn("Failed to get logged user:", err));
//   }, []);

//   useEffect(() => {
//     const fetchAll = async () => {
//       setLoading(true);
//       try {
//         const [annRes, evRes] = await Promise.all([
//           fetch("/api/method/custom_hrms.api.dashboard.get_company_announcements", {
//             credentials: "include",
//           }),
//           fetch("/api/method/custom_hrms.api.dashboard.get_today_events", {
//             credentials: "include",
//           }),
//         ]);

//         const annData = await annRes.json();
//         const evData = await evRes.json();

//         setAnnouncements(annData.message?.announcements || []);
//         setEvents({
//           birthdays: evData.message?.birthdays || [],
//           anniversaries: evData.message?.anniversaries || [],
//         });
//         setError(null);
//       } catch (err) {
//         console.error("Error fetching dashboard data:", err);
//         setError("Gagal memuat data dashboard.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAll();
//   }, []);

//   const handleLogout = () => {
//     fetch("/api/method/logout", { method: "GET", credentials: "include" });
//     localStorage.removeItem("loggedIn");
//     window.location.href = "/custom_hrms/login";
//   };

//   return (
//     <div className="p-4 space-y-6">
//       {/* Welcome Section */}
//       <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-5 rounded-2xl shadow">
//         <h2 className="text-lg font-semibold capitalize">
//           Selamat datang{userName ? `, ${userName}` : user ? `, ${user}` : ""} 👋
//         </h2>
//         <p className="text-sm opacity-90">Semoga harimu menyenangkan di tempat kerja</p>
//       </div>

//       {/* Event Hari Ini */}
//       <div className="bg-white p-5 rounded-2xl shadow border border-gray-100">
//         <h3 className="text-lg font-semibold mb-3 text-gray-800">🎉 Hari Ini di Perusahaan</h3>
//         {loading ? (
//           <p className="text-sm text-gray-500">Memuat data...</p>
//         ) : (
//           <>
//             {events.birthdays.length === 0 && events.anniversaries.length === 0 ? (
//               <p className="text-gray-500 text-sm">Tidak ada event hari ini</p>
//             ) : (
//               <div className="space-y-2">
//                 {/* Birthdays */}
//                 {events.birthdays.length > 0 && (
//                   <div className="border rounded-xl overflow-hidden">
//                     <button
//                       onClick={() => setShowBirthdays(!showBirthdays)}
//                       className="w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 transition text-blue-700 font-medium flex justify-between items-center text-sm"
//                     >
//                       <span>🎂 Ulang Tahun</span>
//                       <span>{showBirthdays ? "▲" : "▼"}</span>
//                     </button>
//                     {showBirthdays && (
//                       <ul className="p-4 text-sm text-gray-700 bg-white">
//                         {events.birthdays.map((e) => (
//                           <li key={e.name} className="py-1 border-b last:border-none">
//                             {e.employee_name}
//                           </li>
//                         ))}
//                       </ul>
//                     )}
//                   </div>
//                 )}

//                 {/* Anniversaries */}
//                 {events.anniversaries.length > 0 && (
//                   <div className="border rounded-xl overflow-hidden">
//                     <button
//                       onClick={() => setShowAnniversaries(!showAnniversaries)}
//                       className="w-full text-left px-4 py-2 bg-green-50 hover:bg-green-100 transition text-green-700 font-medium flex justify-between items-center text-sm"
//                     >
//                       <span>💼 Anniversary Kerja</span>
//                       <span>{showAnniversaries ? "▲" : "▼"}</span>
//                     </button>
//                     {showAnniversaries && (
//                       <ul className="p-4 text-sm text-gray-700 bg-white">
//                         {events.anniversaries.map((e) => (
//                           <li key={e.name} className="py-1 border-b last:border-none">
//                             {e.employee_name}
//                             {e.years_of_service ? (
//                               <span className="text-gray-500 ml-1">
//                                 ({e.years_of_service} tahun)
//                               </span>
//                             ) : null}
//                           </li>
//                         ))}
//                       </ul>
//                     )}
//                   </div>
//                 )}
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* Company Announcements */}
//       <div className="bg-white p-5 rounded-2xl shadow border border-gray-100">
//         <h3 className="text-lg font-semibold mb-3 text-gray-800">📢 Kabar Gembira</h3>
//         {loading ? (
//           <p className="text-sm text-gray-500">Memuat pengumuman...</p>
//         ) : error ? (
//           <p className="text-sm text-red-500">{error}</p>
//         ) : announcements.length === 0 ? (
//           <p className="text-gray-500 text-sm">Tidak ada pengumuman aktif</p>
//         ) : (
//           <ul className="space-y-3">
//             {announcements.map((a) => (
//               <li key={a.name} className="border-b pb-3 last:border-none">
//                 <h4 className="font-medium text-gray-900 text-base">{a.title}</h4>
//                 <div
//                   className="text-sm text-gray-700 mt-1 leading-relaxed"
//                   dangerouslySetInnerHTML={{ __html: a.content }}
//                 />
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       {/* Quick Links */}
//       <div>
//         <h2 className="text-lg font-semibold mb-4 text-gray-800">🔗 Quick Links</h2>
//         <div className="grid grid-cols-2 gap-4">
//           {links.map((link) => (
//             <QuickLinkCard key={link.to} {...link} />
//           ))}
//         </div>
//       </div>

//       {/* Logout */}
//       <button
//         onClick={handleLogout}
//         className="bg-red-500 hover:bg-red-600 transition text-white px-4 py-3 rounded-xl w-full font-medium mt-6 shadow"
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
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState({ birthdays: [], anniversaries: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBirthdays, setShowBirthdays] = useState(false);
  const [showAnniversaries, setShowAnniversaries] = useState(false);

  const links = [
    { label: "Absensi", to: "/attendance", icon: "check-in" },
    { label: "Izin Terlambat", to: "/late-entry-permission", icon: "leave-request" },
    { label: "Cuti dan Lainnya", to: "/leave-menu", icon: "leave-request" },
    { label: "Rekap Absensi", to: "/employees", icon: "attendance" },
  ];

  useEffect(() => {
    fetch("/api/method/frappe.auth.get_logged_user", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setUser(data.message);
          fetch(
            `/api/method/frappe.client.get_value?doctype=User&filters={"name":"${data.message}"}&fieldname=full_name`,
            { credentials: "include" }
          )
            .then((res) => res.json())
            .then((userData) => {
              if (userData.message?.full_name) {
                setUserName(userData.message.full_name);
              }
            });
        }
      })
      .catch((err) => console.warn("Failed to get logged user:", err));
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [annRes, evRes] = await Promise.all([
          fetch("/api/method/custom_hrms.api.dashboard.get_company_announcements", {
            credentials: "include",
          }),
          fetch("/api/method/custom_hrms.api.dashboard.get_today_events", {
            credentials: "include",
          }),
        ]);

        const annData = await annRes.json();
        const evData = await evRes.json();

        setAnnouncements(annData.message?.announcements || []);
        setEvents({
          birthdays: evData.message?.birthdays || [],
          anniversaries: evData.message?.anniversaries || [],
        });
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Gagal memuat data dashboard.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleLogout = () => {
    fetch("/api/method/logout", { method: "GET", credentials: "include" });
    localStorage.removeItem("loggedIn");
    window.location.href = "/custom_hrms/login";
  };

  return (
    <div className="p-4 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-5 rounded-2xl shadow">
        <h2 className="text-lg font-semibold capitalize">
          Selamat datang{userName ? `, ${userName}` : user ? `, ${user}` : ""} 👋
        </h2>
        <p className="text-sm opacity-90">Semoga harimu menyenangkan di tempat kerja</p>
      </div>

      {/* Event Hari Ini */}
      <div className="bg-white p-5 rounded-2xl shadow border border-gray-100">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">🎉 Hari Ini di Perusahaan</h3>
        {loading ? (
          <p className="text-sm text-gray-500">Memuat data...</p>
        ) : (
          <>
            {events.birthdays.length === 0 && events.anniversaries.length === 0 ? (
              <p className="text-gray-500 text-sm">Tidak ada event hari ini</p>
            ) : (
              <div className="space-y-2">
                {/* Birthdays */}
                {events.birthdays.length > 0 && (
                  <div className="border rounded-xl overflow-hidden">
                    <button
                      onClick={() => setShowBirthdays(!showBirthdays)}
                      className="w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 transition text-blue-700 font-medium flex justify-between items-center text-sm"
                    >
                      <span>🎂 Ulang Tahun</span>
                      <span>{showBirthdays ? "▲" : "▼"}</span>
                    </button>
                    {showBirthdays && (
                      <ul className="p-4 text-sm text-gray-700 bg-white">
                        {events.birthdays.map((e) => (
                          <li key={e.name} className="py-1 border-b last:border-none">
                            {e.employee_name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {/* Anniversaries */}
                {events.anniversaries.length > 0 && (
                  <div className="border rounded-xl overflow-hidden">
                    <button
                      onClick={() => setShowAnniversaries(!showAnniversaries)}
                      className="w-full text-left px-4 py-2 bg-green-50 hover:bg-green-100 transition text-green-700 font-medium flex justify-between items-center text-sm"
                    >
                      <span>💼 Anniversary Kerja</span>
                      <span>{showAnniversaries ? "▲" : "▼"}</span>
                    </button>
                    {showAnniversaries && (
                      <ul className="p-4 text-sm text-gray-700 bg-white">
                        {events.anniversaries.map((e) => (
                          <li key={e.name} className="py-1 border-b last:border-none">
                            {e.employee_name}
                            {e.years_of_service ? (
                              <span className="text-gray-500 ml-1">
                                ({e.years_of_service} tahun)
                              </span>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Company Announcements */}
      <div className="bg-white p-5 rounded-2xl shadow border border-gray-100">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">📢 Kabar Gembira</h3>
        {loading ? (
          <p className="text-sm text-gray-500">Memuat pengumuman...</p>
        ) : error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : announcements.length === 0 ? (
          <p className="text-gray-500 text-sm">Tidak ada pengumuman aktif</p>
        ) : (
          <ul className="space-y-3">
            {announcements.map((a) => (
              <li key={a.name} className="border-b pb-3 last:border-none">
                <h4 className="font-medium text-gray-900 text-base">{a.title}</h4>
                <div
                  className="text-sm text-gray-700 mt-1 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: a.content }}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-gray-800">🔗 Quick Links</h2>
        <div className="grid grid-cols-2 gap-4">
          {links.map((link) => (
            <QuickLinkCard key={link.to} {...link} />
          ))}
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 transition text-white px-4 py-3 rounded-xl w-full font-medium mt-6 shadow"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
