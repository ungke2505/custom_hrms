// // import { useEffect, useState } from "react";

// // const EmployeeList = () => {
// //   const [user, setUser] = useState(null);
// //   const [month, setMonth] = useState(() => {
// //     const now = new Date();
// //     return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
// //   });
// //   const [totalFine, setTotalFine] = useState(0);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   // Ambil user login
// //   useEffect(() => {
// //     fetch("/api/method/frappe.auth.get_logged_user", { credentials: "include" })
// //       .then((res) => res.json())
// //       .then((data) => {
// //         if (data.message) {
// //           setUser(data.message);
// //         }
// //       })
// //       .catch((err) => {
// //         console.warn("Failed to get logged user:", err);
// //         setError("Gagal mengambil data user.");
// //       });
// //   }, []);

// //   // Ambil total denda dari API custom
// //   useEffect(() => {
// //     if (!user) return;
// //     setLoading(true);
// //     setError(null);

// //     const [year, monthNum] = month.split("-");
// //     fetch(
// //       `/api/method/custom_hrms.api.employee.get_total_late_fines?employee=${user}&year=${year}&month=${monthNum}`,
// //       { credentials: "include" }
// //     )
// //       .then((res) => res.json())
// //       .then((data) => {
// //         if (data.message !== undefined) {
// //           setTotalFine(data.message);
// //         } else {
// //           setError("Tidak ada data denda ditemukan.");
// //         }
// //       })
// //       .catch((err) => {
// //         console.error("Error fetching fines:", err);
// //         setError("Gagal memuat data denda.");
// //       })
// //       .finally(() => setLoading(false));
// //   }, [user, month]);

// //   return (
// //     <div className="p-4 space-y-6">
// //       <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-5 rounded-2xl shadow">
// //         <h2 className="text-lg font-semibold">
// //           Total Denda Keterlambatan 💸
// //         </h2>
// //         <p className="text-sm opacity-90">
// //           Periode:{" "}
// //           <input
// //             type="month"
// //             value={month}
// //             onChange={(e) => setMonth(e.target.value)}
// //             className="bg-transparent border-b border-white ml-2 focus:outline-none"
// //           />
// //         </p>
// //       </div>

// //       <div className="bg-white p-5 rounded-2xl shadow border border-gray-100">
// //         {loading ? (
// //           <p>Memuat data denda...</p>
// //         ) : error ? (
// //           <p className="text-red-500">{error}</p>
// //         ) : (
// //           <div>
// //             <p className="text-gray-700 text-lg mb-2">
// //               Total Denda Bulan Ini:
// //             </p>
// //             <p className="text-3xl font-bold text-indigo-600">
// //               Rp {parseInt(totalFine).toLocaleString("id-ID")}
// //             </p>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default EmployeeList;

// import { useEffect, useState } from "react";

// const EmployeeList = () => {
//   const [user, setUser] = useState(null);
//   const [month, setMonth] = useState(() => {
//     const now = new Date();
//     return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
//   });
//   const [totalFine, setTotalFine] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // 🔹 Ambil user login dari session
//   useEffect(() => {
//     fetch("/api/method/frappe.auth.get_logged_user", { credentials: "include" })
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.message) {
//           setUser(data.message);
//         }
//       })
//       .catch((err) => {
//         console.warn("Failed to get logged user:", err);
//         setError("Gagal mengambil data user.");
//       });
//   }, []);

//   // 🔹 Ambil total denda dari API custom
//   useEffect(() => {
//     if (!user) return;
//     setLoading(true);
//     setError(null);

//     const [year, monthNum] = month.split("-");
//     fetch(
//       `/api/method/custom_hrms.api.employee.get_total_late_fines?employee=${user}&year=${year}&month=${monthNum}`,
//       { credentials: "include" }
//     )
//       .then((res) => res.json())
//       .then((data) => {
//         // ✅ Perbaikan utama di sini
//         if (data.message && data.message.total_late_fines !== undefined) {
//           setTotalFine(data.message.total_late_fines);
//         } else {
//           setError("Tidak ada data denda ditemukan.");
//         }
//       })
//       .catch((err) => {
//         console.error("Error fetching fines:", err);
//         setError("Gagal memuat data denda.");
//       })
//       .finally(() => setLoading(false));
//   }, [user, month]);

//   return (
//     <div className="p-4 space-y-6">
//       {/* Header Section */}
//       <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-5 rounded-2xl shadow">
//         <h2 className="text-lg font-semibold">Total Denda Keterlambatan 💸</h2>
//         <p className="text-sm opacity-90">
//           Periode:{" "}
//           <input
//             type="month"
//             value={month}
//             onChange={(e) => setMonth(e.target.value)}
//             className="bg-transparent border-b border-white ml-2 focus:outline-none"
//           />
//         </p>
//       </div>

//       {/* Content Section */}
//       <div className="bg-white p-5 rounded-2xl shadow border border-gray-100">
//         {loading ? (
//           <p>Memuat data denda...</p>
//         ) : error ? (
//           <p className="text-red-500">{error}</p>
//         ) : (
//           <div>
//             <p className="text-gray-700 text-lg mb-2">
//               Total Denda Bulan Ini:
//             </p>
//             <p className="text-3xl font-bold text-indigo-600">
//               Rp {Number(totalFine || 0).toLocaleString("id-ID")}
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EmployeeList;


import { useEffect, useState } from "react";

const EmployeeList = () => {
  const [user, setUser] = useState(null);
  const [fromDate, setFromDate] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  });
  const [toDate, setToDate] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
      new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
    ).padStart(2, "0")}`;
  });
  const [totalFine, setTotalFine] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ambil user login
  useEffect(() => {
    fetch("/api/method/frappe.auth.get_logged_user", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) setUser(data.message);
      })
      .catch(() => setError("Gagal mengambil data user."));
  }, []);

  // Ambil total denda berdasarkan range tanggal
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setError(null);

    fetch(
      `/api/method/custom_hrms.api.employee.get_total_late_fines?from_date=${fromDate}&to_date=${toDate}`,
    { credentials: "include" }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.message && data.message.total_late_fines !== undefined) {
          setTotalFine(data.message.total_late_fines);
        } else {
          setError("Tidak ada data denda ditemukan.");
        }
      })
      .catch(() => setError("Gagal memuat data denda."))
      .finally(() => setLoading(false));
  }, [user, fromDate, toDate]);

  return (
    <div className="p-4 space-y-6">
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-5 rounded-2xl shadow">
        <h2 className="text-lg font-semibold">Total Denda Keterlambatan 💸</h2>
        <p className="text-sm opacity-90">
          Periode:{" "}
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="bg-transparent border-b border-white ml-2 focus:outline-none"
          />
          {"  s/d  "}
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="bg-transparent border-b border-white ml-2 focus:outline-none"
          />
        </p>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow border border-gray-100">
        {loading ? (
          <p>Memuat data denda...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div>
            <p className="text-gray-700 text-lg mb-2">Total Denda Periode Ini:</p>
            <p className="text-3xl font-bold text-indigo-600">
              Rp {Math.round(Number(totalFine || 0)).toLocaleString("id-ID")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeList;
