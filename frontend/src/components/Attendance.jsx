

// =====================================Working Version=====================================
// import { useEffect, useState } from "react";
// import Button from "@/components/ui/Button";

// const Attendance = ({ location }) => {
//   const [error, setError] = useState("");
//   const [checkedIn, setCheckedIn] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [shiftLocation, setShiftLocation] = useState("");

//   // Load status terakhir dari backend
//   useEffect(() => {
//     const fetchStatus = async () => {
//       try {
//         const res = await fetch(
//           "/api/method/custom_hrms.api.employee_checkin.get_last_checkin_status",
//           { credentials: "include" }
//         );
//         const data = await res.json();
//         if (res.ok && data.message) {
//           if (data.message.status === "IN") {
//             setCheckedIn(true);
//           }
//         }
//       } catch (err) {
//         console.error("Error fetching status:", err);
//       }
//     };
//     fetchStatus();
//   }, []);

//   const handleClick = async () => {
//     if (!location) {
//       setError("Lokasi belum tersedia");
//       return;
//     }

//     setLoading(true);
//     setError("");
//     setMessage("");

//     try {
//       const res = await fetch(
//         "/api/method/custom_hrms.api.employee_checkin.employee_checkin",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify({
//             log_type: checkedIn ? "OUT" : "IN",
//             latitude: location.latitude,
//             longitude: location.longitude,
//           }),
//         }
//       );

//       const data = await res.json();
//       console.log("Response dari backend:", data);

//       // data.message berisi object seperti { message: "success", shift_location: "...", shift: "..." }
//       const payload = data.message || {};

//       if (res.ok && payload.message === "success") {
//         setCheckedIn(!checkedIn);
//         setShiftLocation(payload.shift_location || "");
//         setMessage(
//           `Berhasil ${checkedIn ? "Check Out" : "Check In"}${
//             payload.shift_location ? " di " + payload.shift_location : ""
//           }`
//         );
//       } else {
//         setError(payload.message || "Gagal melakukan check-in/out");
//       }
//     } catch (err) {
//       console.error("Error:", err);
//       setError("Server error. Silakan coba lagi.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4">
//       {typeof message === "string" && message && (
//         <p className="text-green-600 mb-2">{message}</p>
//       )}
//       {error && <p className="text-red-600 mb-2">{error}</p>}

//       <Button
//         onClick={handleClick}
//         disabled={loading || !location}
//         className={`w-full ${checkedIn ? "bg-red-500" : "bg-green-500"}`}
//       >
//         {loading ? "Processing..." : checkedIn ? "Check Out" : "Check In"}
//       </Button>

//       {shiftLocation && (
//         <p className="text-sm text-gray-500 mt-2">
//           Lokasi Shift: {shiftLocation}
//         </p>
//       )}
//     </div>
//   );
// };

// export default Attendance;
// =====================================Working Version=====================================


// import { useEffect, useState } from "react";
// import Button from "@/components/ui/Button";

// const Attendance = ({ location }) => {
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [shiftLocation, setShiftLocation] = useState("");
//   const [currentAction, setCurrentAction] = useState(null); // aksi yang akan dilakukan selanjutnya

//   // Ambil status aksi berikut dari backend
//   const fetchNextAction = async () => {
//     try {
//       const res = await fetch(
//         "/api/method/custom_hrms.api.employee_checkin.get_next_action",
//         { credentials: "include" }
//       );
//       const data = await res.json();

//       if (res.ok && data.message) {
//         const { default_action } = data.message;
//         setCurrentAction(default_action);
//       } else {
//         setError("Gagal mengambil status absensi.");
//       }
//     } catch (err) {
//       console.error("Fetch error:", err);
//       setError("Tidak dapat terhubung ke server.");
//     }
//   };

//   useEffect(() => {
//     fetchNextAction();
//   }, []);

//   const handleClick = async () => {
//     if (!location) {
//       setError("Lokasi belum tersedia");
//       return;
//     }
//     if (!currentAction) {
//       setError("Tidak ada aksi yang tersedia");
//       return;
//     }

//     setLoading(true);
//     setError("");
//     setMessage("");

//     try {
//       const res = await fetch(
//         "/api/method/custom_hrms.api.employee_checkin.employee_checkin",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify({
//             log_type: currentAction,
//             latitude: location.latitude,
//             longitude: location.longitude,
//           }),
//         }
//       );

//       const data = await res.json();
//       console.log("Response dari backend:", data);

//       const payload = data.message || {};
//       if (res.ok && payload.message === "success") {
//         setShiftLocation(payload.shift_location || "");
//         setMessage(`Berhasil ${currentAction.replaceAll("_", " ")}`);
//         // refresh next action
//         await fetchNextAction();
//       } else {
//         setError(payload.message || "Gagal melakukan absensi.");
//       }
//     } catch (err) {
//       console.error("Error:", err);
//       setError("Server error. Silakan coba lagi.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4">
//       {message && <p className="text-green-600 mb-2">{message}</p>}
//       {error && <p className="text-red-600 mb-2">{error}</p>}

//       <Button
//         onClick={handleClick}
//         disabled={loading || !location || !currentAction}
//         className={`w-full ${
//           currentAction?.includes("OUT") ? "bg-red-500" : "bg-green-500"
//         }`}
//       >
//         {loading
//           ? "Processing..."
//           : currentAction
//           ? currentAction.replaceAll("_", " ")
//           : "Loading..."}
//       </Button>

//       {shiftLocation && (
//         <p className="text-sm text-gray-500 mt-2">
//           Lokasi Shift: {shiftLocation}
//         </p>
//       )}
//     </div>
//   );
// };

// export default Attendance;


// import { useEffect, useState } from "react";
// import Button from "@/components/ui/Button";

// const Attendance = ({ location }) => {
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [shiftLocation, setShiftLocation] = useState("");
//   const [nextActions, setNextActions] = useState([]);

//   const fetchNextAction = async () => {
//     try {
//       const res = await fetch(
//         "/api/method/custom_hrms.api.employee_checkin.get_next_action",
//         { credentials: "include" }
//       );
//       const data = await res.json();
//       if (res.ok && data.message) {
//         setNextActions(data.message.next_actions || []);
//       } else {
//         setError("Gagal mengambil status absensi.");
//       }
//     } catch (err) {
//       console.error("Fetch error:", err);
//       setError("Tidak dapat terhubung ke server.");
//     }
//   };

//   useEffect(() => {
//     fetchNextAction();
//   }, []);

//   const handleAction = async (action) => {
//     if (!location) {
//       setError("Lokasi belum tersedia");
//       return;
//     }

//     if (!window.confirm(`Yakin ingin melakukan ${action.replaceAll("_", " ")}?`))
//       return;

//     setLoading(true);
//     setError("");
//     setMessage("");

//     try {
//       const res = await fetch(
//         "/api/method/custom_hrms.api.employee_checkin.employee_checkin",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify({
//             log_type: action,
//             latitude: location.latitude,
//             longitude: location.longitude,
//           }),
//         }
//       );

//       const data = await res.json();
//       console.log("Response dari backend:", data);

//       const payload = data.message || {};
//       if (res.ok && payload.message === "success") {
//         setShiftLocation(payload.shift_location || "");
//         setMessage(`Berhasil ${action.replaceAll("_", " ")}`);
//         await fetchNextAction();
//       } else {
//         setError(payload.message || "Gagal melakukan absensi.");
//       }
//     } catch (err) {
//       console.error("Error:", err);
//       setError("Server error. Silakan coba lagi.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4 space-y-2">
//       {message && <p className="text-green-600 mb-2">{message}</p>}
//       {error && <p className="text-red-600 mb-2">{error}</p>}

//       <div className="flex flex-col gap-2">
//         {nextActions.map((action) => (
//           <Button
//             key={action}
//             onClick={() => handleAction(action)}
//             disabled={loading || !location}
//             className={`w-full ${
//               action.includes("OUT") ? "bg-red-500" : "bg-green-500"
//             }`}
//           >
//             {loading ? "Processing..." : action.replaceAll("_", " ")}
//           </Button>
//         ))}
//       </div>

//       {shiftLocation && (
//         <p className="text-sm text-gray-500 mt-2">
//           Lokasi Shift: {shiftLocation}
//         </p>
//       )}
//     </div>
//   );
// };

// export default Attendance;


// import { useEffect, useState } from "react";
// import Button from "@/components/ui/Button";

// const Attendance = ({ location }) => {
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [shiftLocation, setShiftLocation] = useState("");
//   const [nextActions, setNextActions] = useState([]);

//   // Label custom untuk tombol absensi
//   const ACTION_LABELS = {
//     IN: "Absen Datang",
//     BREAK_OUT_1: "Istirahat Makan",
//     BREAK_IN_1: "Selesai Istirahat Makan",
//     BREAK_OUT_2: "Istirahat Tidur",
//     BREAK_IN_2: "Selesai Istirahat Tidur",
//     OUT: "Absen Pulang",
//   };

//   // Fungsi untuk menentukan warna tombol berdasarkan jenis aksi
//   const getButtonColor = (action) => {
//     if (action === "OUT") return "bg-red-500 hover:bg-red-600"; // Absen pulang
//     if (action.startsWith("BREAK_")) return "bg-yellow-500 hover:bg-yellow-600"; // Istirahat
//     return "bg-green-500 hover:bg-green-600"; // Default (Absen datang)
//   };

//   const fetchNextAction = async () => {
//     try {
//       const res = await fetch(
//         "/api/method/custom_hrms.api.employee_checkin.get_next_action",
//         { credentials: "include" }
//       );
//       const data = await res.json();
//       if (res.ok && data.message) {
//         setNextActions(data.message.next_actions || []);
//       } else {
//         setError("Gagal mengambil status absensi.");
//       }
//     } catch (err) {
//       console.error("Fetch error:", err);
//       setError("Tidak dapat terhubung ke server.");
//     }
//   };

//   useEffect(() => {
//     fetchNextAction();
//   }, []);

//   const handleAction = async (action) => {
//     if (!location) {
//       setError("Lokasi belum tersedia");
//       return;
//     }

//     const confirmText = `Yakin ingin melakukan ${ACTION_LABELS[action] || action.replaceAll("_", " ")}?`;
//     if (!window.confirm(confirmText)) return;

//     setLoading(true);
//     setError("");
//     setMessage("");

//     try {
//       const res = await fetch(
//         "/api/method/custom_hrms.api.employee_checkin.employee_checkin",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify({
//             log_type: action,
//             latitude: location.latitude,
//             longitude: location.longitude,
//           }),
//         }
//       );

//       const data = await res.json();
//       console.log("Response dari backend:", data);

//       const payload = data.message || {};
//       if (res.ok && payload.message === "success") {
//         setShiftLocation(payload.shift_location || "");
//         setMessage(`Berhasil ${ACTION_LABELS[action] || action.replaceAll("_", " ")}`);
//         await fetchNextAction();
//       } else {
//         setError(payload.message || "Gagal melakukan absensi.");
//       }
//     } catch (err) {
//       console.error("Error:", err);
//       setError("Server error. Silakan coba lagi.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4 space-y-2">
//       {message && <p className="text-green-600 mb-2">{message}</p>}
//       {error && <p className="text-red-600 mb-2">{error}</p>}

//       <div className="flex flex-col gap-2">
//         {nextActions.map((action) => (
//           <Button
//             key={action}
//             onClick={() => handleAction(action)}
//             disabled={loading || !location}
//             className={`w-full text-white font-semibold py-2 rounded-lg transition-all ${getButtonColor(action)}`}
//           >
//             {loading
//               ? "Processing..."
//               : ACTION_LABELS[action] || action.replaceAll("_", " ")}
//           </Button>
//         ))}
//       </div>

//       {shiftLocation && (
//         <p className="text-sm text-gray-500 mt-2">
//           Lokasi Shift: {shiftLocation}
//         </p>
//       )}
//     </div>
//   );
// };

// export default Attendance;


// import { useEffect, useState } from "react";
// import Button from "@/components/ui/Button";

// const Attendance = ({ location }) => {
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [shiftLocation, setShiftLocation] = useState("");
//   const [nextActions, setNextActions] = useState([]);

//   const ACTION_LABELS = {
//     IN: "Absen Datang",
//     BREAK_OUT: "Mulai Istirahat",
//     BREAK_IN: "Selesai Istirahat",
//     OUT: "Absen Pulang",
//   };

//   const getButtonColor = (action) => {
//     switch (action) {
//       case "IN":
//         return "bg-green-600 hover:bg-green-700";
//       case "BREAK_OUT":
//         return "bg-yellow-500 hover:bg-yellow-600";
//       case "BREAK_IN":
//         return "bg-blue-500 hover:bg-blue-600";
//       case "OUT":
//         return "bg-red-600 hover:bg-red-700";
//       default:
//         return "bg-gray-500 hover:bg-gray-600";
//     }
//   };

//   const fetchNextAction = async () => {
//   try {
//     const res = await fetch(
//       "/api/method/custom_hrms.api.employee_checkin.get_next_action",
//       { credentials: "include" }
//     );
//     const data = await res.json();

//     if (res.ok && data.message?.status === "success") {
//       setNextActions(data.message.next_actions || []);
//       setError("");
//       setMessage(""); // kosongkan, biar bukan object
//     } else {
//       setNextActions([]);
//       setError(data.message?.message || "Gagal mengambil status absensi.");
//     }
//   } catch (err) {
//     console.error("Fetch error:", err);
//     setNextActions([]);
//     setError("Tidak dapat terhubung ke server.");
//   }
// };


//   useEffect(() => {
//     fetchNextAction();
//   }, []);

//   const handleAction = async (action) => {
//     if (!location) {
//       setError("Lokasi belum tersedia");
//       return;
//     }

//     const confirmText = `Yakin ingin melakukan ${ACTION_LABELS[action] || action}?`;
//     if (!window.confirm(confirmText)) return;

//     setLoading(true);
//     setError("");
//     setMessage("");

//     try {
//       const res = await fetch(
//         "/api/method/custom_hrms.api.employee_checkin.employee_checkin",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify({
//             log_type: action,
//             latitude: location.latitude,
//             longitude: location.longitude,
//           }),
//         }
//       );

//       const data = await res.json();
//       const payload = data.message || {};
//       if (res.ok && payload.status === "success") {
//         setShiftLocation(payload.shift_location || "");
//         setMessage(payload.message || `Berhasil ${ACTION_LABELS[action] || action}`);
//         await fetchNextAction();
//       } else {
//         setError(payload.message || "Gagal melakukan absensi.");
//       }

//     } catch (err) {
//       console.error("Error:", err);
//       setError("Server error. Silakan coba lagi.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4 space-y-3">
//       {message && <p className="text-green-600 mb-2">{message}</p>}
//       {error && <p className="text-red-600 mb-2">{error}</p>}

//       <div className="flex flex-col gap-2">
//         {nextActions.map((action) => (
//           <Button
//             key={action}
//             onClick={() => handleAction(action)}
//             disabled={loading || !location}
//             className={`w-full text-white font-semibold py-2 rounded-lg transition-all ${getButtonColor(action)}`}
//           >
//             {loading
//               ? "Processing..."
//               : ACTION_LABELS[action] || action.replaceAll("_", " ")}
//           </Button>
//         ))}
//       </div>

//       {shiftLocation && (
//         <p className="text-sm text-gray-500 mt-2">
//           Lokasi Shift: {shiftLocation}
//         </p>
//       )}
//     </div>
//   );
// };

// export default Attendance;


// import { useEffect, useState } from "react";
// import Button from "@/components/ui/Button";

// const Attendance = ({ location }) => {
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [shiftLocation, setShiftLocation] = useState("");
//   const [nextActions, setNextActions] = useState([]);
  

//   const ACTION_LABELS = {
//     IN: "Absen Datang",
//     BREAK_OUT: "Mulai Istirahat",
//     BREAK_IN: "Selesai Istirahat",
//     OUT: "Absen Pulang",
//   };

//   const getButtonColor = (action) => {
//     switch (action) {
//       case "IN":
//         return "bg-green-600 hover:bg-green-700";
//       case "BREAK_OUT":
//         return "bg-yellow-500 hover:bg-yellow-600";
//       case "BREAK_IN":
//         return "bg-blue-500 hover:bg-blue-600";
//       case "OUT":
//         return "bg-red-600 hover:bg-red-700";
//       default:
//         return "bg-gray-500 hover:bg-gray-600";
//     }
//   };

//   const fetchNextAction = async () => {
//     try {
//       const res = await fetch(
//         "/api/method/custom_hrms.api.employee_checkin.get_next_action",
//         { credentials: "include" }
//       );
//       const data = await res.json();

//       const msg = data?.message || {};
//       if (res.ok && msg.status === "success") {
//         setNextActions(msg.next_actions || []);
//         setShiftLocation(msg.shift_location || "");
//         setMessage("");
//         setError("");
//       } else {
//         setNextActions([]);
//         setError(typeof msg.message === "string" ? msg.message : "Gagal mengambil status absensi.");
//       }
//     } catch (err) {
//       console.error("Fetch error:", err);
//       setNextActions([]);
//       setError("Tidak dapat terhubung ke server.");
//     }
//   };

//   useEffect(() => {
//     fetchNextAction();
//   }, []);

//   const handleAction = async (action) => {
//     if (!location) {
//       setError("Lokasi belum tersedia.");
//       return;
//     }

//     const confirmText = `Yakin ingin melakukan ${ACTION_LABELS[action] || action}?`;
//     if (!window.confirm(confirmText)) return;

//     setLoading(true);
//     setError("");
//     setMessage("");

//     try {
//       const res = await fetch(
//         "/api/method/custom_hrms.api.employee_checkin.employee_checkin",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify({
//             log_type: action,
//             latitude: location.latitude,
//             longitude: location.longitude,
//           }),
//         }
//       );

//       const data = await res.json();
//       console.log("Response dari backend:", data);

//       const payload = data?.status ? data : data?.message || {};

//       if (payload.status === "success") {
//         setMessage(payload.message || `Berhasil ${ACTION_LABELS[action] || action}`);
//         setShiftLocation(payload.shift_location || "");
//         await fetchNextAction();
//       } else {
//         setError(payload.message || "Gagal melakukan absensi.");
//       }

//           } catch (err) {
//             console.error("Error:", err);
//             setError("Server error. Silakan coba lagi.");
//           } finally {
//             setLoading(false);
//           }
//         };

//   return (
//     <div className="p-4 space-y-3">
//       {typeof message === "string" && message && (
//         <p className="text-green-600 mb-2">{message}</p>
//       )}
//       {typeof error === "string" && error && (
//         <p className="text-red-600 mb-2">{error}</p>
//       )}

//       <div className="flex flex-col gap-2">
//         {nextActions.map((action) => (
//           <Button
//             key={action}
//             onClick={() => handleAction(action)}
//             disabled={loading || !location}
//             className={`w-full text-white font-semibold py-2 rounded-lg transition-all ${getButtonColor(
//               action
//             )}`}
//           >
//             {loading
//               ? "Processing..."
//               : ACTION_LABELS[action] || action.replaceAll("_", " ")}
//           </Button>
//         ))}

//         {nextActions.length === 0 && !error && (
//           <p className="text-gray-500 text-sm text-center">
//             Tidak ada aksi yang tersedia untuk saat ini.
//           </p>
//         )}
//       </div>

//       {shiftLocation && (
//         <p className="text-sm text-gray-500 mt-2">
//           Lokasi Shift: {shiftLocation}
//         </p>
//       )}
//     </div>
//   );
// };

// export default Attendance;

// import { useEffect, useState } from "react";
// import Button from "@/components/ui/Button";

// const Attendance = ({ location }) => {
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [shiftLocation, setShiftLocation] = useState("");
//   const [nextActions, setNextActions] = useState([]);
//   const [distance, setDistance] = useState(null);
//   const [isWithinRadius, setIsWithinRadius] = useState(true);

//   const ACTION_LABELS = {
//     IN: "Absen Datang",
//     BREAK_OUT: "Mulai Istirahat",
//     BREAK_IN: "Selesai Istirahat",
//     OUT: "Absen Pulang",
//   };

//   const getButtonColor = (action) => {
//     switch (action) {
//       case "IN":
//         return "bg-green-600 hover:bg-green-700";
//       case "BREAK_OUT":
//         return "bg-yellow-500 hover:bg-yellow-600";
//       case "BREAK_IN":
//         return "bg-blue-500 hover:bg-blue-600";
//       case "OUT":
//         return "bg-red-600 hover:bg-red-700";
//       default:
//         return "bg-gray-500 hover:bg-gray-600";
//     }
//   };

//   // 🧮 Fungsi hitung jarak (haversine)
//   const haversine = (lat1, lon1, lat2, lon2) => {
//     const R = 6371; // km
//     const toRad = (deg) => (deg * Math.PI) / 180;
//     const dLat = toRad(lat2 - lat1);
//     const dLon = toRad(lon2 - lon1);
//     const a =
//       Math.sin(dLat / 2) ** 2 +
//       Math.cos(toRad(lat1)) *
//         Math.cos(toRad(lat2)) *
//         Math.sin(dLon / 2) ** 2;
//     const c = 2 * Math.asin(Math.sqrt(a));
//     return R * c * 1000; // meter
//   };

//   const fetchNextAction = async () => {
//     try {
//       const res = await fetch(
//         "/api/method/custom_hrms.api.employee_checkin.get_next_action",
//         { credentials: "include" }
//       );
//       const data = await res.json();

//       const msg = data?.message || data;
//       if (res.ok && msg.status === "success") {
//         setNextActions(msg.next_actions || []);
//         setShiftLocation(msg.shift_location || "");
//         setMessage("");
//         setError("");

//         // 🔍 Hitung jarak ke lokasi shift
//         if (msg.shift_location_detail && location) {
//           const { latitude, longitude, radius } = msg.shift_location_detail;
//           const jarak = haversine(
//             location.latitude,
//             location.longitude,
//             parseFloat(latitude),
//             parseFloat(longitude)
//           );
//           setDistance(jarak.toFixed(1));
//           setIsWithinRadius(jarak <= parseFloat(radius));
//         }
//       } else {
//         setNextActions([]);
//         setError(
//           typeof msg.message === "string"
//             ? msg.message
//             : "Gagal mengambil status absensi."
//         );
//       }
//     } catch (err) {
//       console.error("Fetch error:", err);
//       setNextActions([]);
//       setError("Tidak dapat terhubung ke server.");
//     }
//   };

//   useEffect(() => {
//     fetchNextAction();
//   }, [location]); // refresh tiap lokasi berubah

//   const handleAction = async (action) => {
//     if (!location) {
//       setError("Lokasi belum tersedia.");
//       return;
//     }

//     if (!isWithinRadius) {
//       setError("Anda berada di luar radius lokasi shift. Tidak dapat melakukan absensi.");
//       return;
//     }
    

//     const confirmText = `Yakin ingin melakukan ${ACTION_LABELS[action] || action}?`;
//     if (!window.confirm(confirmText)) return;

//     setLoading(true);
//     setError("");
//     setMessage("");

//     try {
//       const res = await fetch(
//         "/api/method/custom_hrms.api.employee_checkin.employee_checkin",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify({
//             log_type: action,
//             latitude: location.latitude,
//             longitude: location.longitude,
//           }),
//         }
//       );

//       const data = await res.json();
//       const payload = data?.status ? data : data?.message || {};

//       if (payload.status === "success") {
//         setMessage(payload.message || `Berhasil ${ACTION_LABELS[action] || action}`);
//         setShiftLocation(payload.shift_location || "");
//         await fetchNextAction();
//       } else {
//         setError(payload.message || "Gagal melakukan absensi.");
//       }
//     } catch (err) {
//       console.error("Error:", err);
//       setError("Server error. Silakan coba lagi.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4 space-y-3">
//       {message && <p className="text-green-600 mb-2">{message}</p>}
//       {error && <p className="text-red-600 mb-2">{error}</p>}

//       <div className="flex flex-col gap-2">
//         {nextActions.map((action) => (
//           <Button
//             key={action}
//             onClick={() => handleAction(action)}
//             disabled={loading || !location || !isWithinRadius}
//             className={`w-full text-white font-semibold py-2 rounded-lg transition-all ${getButtonColor(
//               action
//             )} ${!isWithinRadius ? "opacity-50 cursor-not-allowed" : ""}`}
//           >
//             {loading
//               ? "Processing..."
//               : ACTION_LABELS[action] || action.replaceAll("_", " ")}
//           </Button>
//         ))}

//         {nextActions.length === 0 && !error && (
//           <p className="text-gray-500 text-sm text-center">
//             Tidak ada aksi yang tersedia untuk saat ini.
//           </p>
//         )}
//       </div>

//       {shiftLocation && (
//         <p className="text-sm text-gray-500 mt-2">
//           Lokasi Shift: {shiftLocation}
//         </p>
//       )}

//       {distance && (
//         <p
//           className={`text-sm mt-2 ${
//             isWithinRadius ? "text-green-600" : "text-red-600"
//           }`}
//         >
//           {isWithinRadius
//             ? `Anda berada dalam area shift (${distance} m dari lokasi).`
//             : `Anda berada di luar area shift (${distance} m dari lokasi).`}
//         </p>
//       )}
//     </div>
//   );
// };

// export default Attendance;


import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { openCameraAndCapture } from "/public/js/camera.js";


const Attendance = ({ location }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [shiftLocation, setShiftLocation] = useState("");
  const [nextActions, setNextActions] = useState([]);
  const [distance, setDistance] = useState(null);
  const [isWithinRadius, setIsWithinRadius] = useState(true);

  const ACTION_LABELS = {
    IN: "Absen Datang",
    BREAK_OUT: "Mulai Istirahat",
    BREAK_IN: "Selesai Istirahat",
    OUT: "Absen Pulang",
  };

  const getButtonColor = (action) => {
    switch (action) {
      case "IN":
        return "bg-green-600 hover:bg-green-700";
      case "BREAK_OUT":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "BREAK_IN":
        return "bg-blue-500 hover:bg-blue-600";
      case "OUT":
        return "bg-red-600 hover:bg-red-700";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  // 🧮 Fungsi hitung jarak (haversine)
  const haversine = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
    const toRad = (deg) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.asin(Math.sqrt(a));
    return R * c * 1000; // meter
  };

  const fetchNextAction = async () => {
    try {
      const res = await fetch(
        "/api/method/custom_hrms.api.employee_checkin.get_next_action",
        { credentials: "include" }
      );
      const data = await res.json();

      const msg = data?.message || data;
      if (res.ok && msg.status === "success") {
        setNextActions(msg.next_actions || []);
        setShiftLocation(msg.shift_location || "");
        setMessage("");
        setError("");

        // 🔍 Hitung jarak ke lokasi shift
        if (msg.shift_location_detail && location) {
          const { latitude, longitude, radius } = msg.shift_location_detail;
          const jarak = haversine(
            location.latitude,
            location.longitude,
            parseFloat(latitude),
            parseFloat(longitude)
          );
          setDistance(jarak.toFixed(1));
          setIsWithinRadius(jarak <= parseFloat(radius));
        }
      } else {
        setNextActions([]);
        setError(
          typeof msg.message === "string"
            ? msg.message
            : "Gagal mengambil status absensi."
        );
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setNextActions([]);
      setError("Tidak dapat terhubung ke server.");
    }
  };

  useEffect(() => {
    fetchNextAction();
  }, [location]); // refresh tiap lokasi berubah

  const handleAction = async (action) => {
    if (!location) {
      setError("Lokasi belum tersedia.");
      return;
    }

    if (!isWithinRadius) {
      setError("Anda berada di luar radius lokasi shift. Tidak dapat melakukan absensi.");
      return;
    }

    const confirmText = `Yakin ingin melakukan ${ACTION_LABELS[action] || action}?`;
    if (!window.confirm(confirmText)) return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      let photo = null;

      // 📸 Ambil foto hanya untuk absen datang & pulang
      if (action === "IN" || action === "OUT") {
        try {
          const overlayText = `${ACTION_LABELS[action]} • ${shiftLocation || "Unknown"} • ${new Date().toLocaleTimeString("id-ID")}`;
          photo = await openCameraAndCapture(overlayText);
        } catch (err) {
          setError(err.message);
          setLoading(false);
          return;
        }
      }

      const res = await fetch(
        "/api/method/custom_hrms.api.employee_checkin.employee_checkin",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            log_type: action,
            latitude: location.latitude,
            longitude: location.longitude,
            photo, // kirim base64 ke backend
          }),
        }
      );

      const data = await res.json();
      const payload = data?.status ? data : data?.message || {};

      if (payload.status === "success") {
        setMessage(payload.message || `Berhasil ${ACTION_LABELS[action] || action}`);
        setShiftLocation(payload.shift_location || "");
        await fetchNextAction();
      } else {
        setError(payload.message || "Gagal melakukan absensi.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Server error. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-3">
      {message && <p className="text-green-600 mb-2">{message}</p>}
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <div className="flex flex-col gap-2">
        {nextActions.map((action) => (
          <Button
            key={action}
            onClick={() => handleAction(action)}
            disabled={loading || !location || !isWithinRadius}
            className={`w-full text-white font-semibold py-2 rounded-lg transition-all ${getButtonColor(
              action
            )} ${!isWithinRadius ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading
              ? "Processing..."
              : ACTION_LABELS[action] || action.replaceAll("_", " ")}
          </Button>
        ))}

        {nextActions.length === 0 && !error && (
          <p className="text-gray-500 text-sm text-center">
            Tidak ada aksi yang tersedia untuk saat ini.
          </p>
        )}
      </div>

      {shiftLocation && (
        <p className="text-sm text-gray-500 mt-2">
          Lokasi Shift: {shiftLocation}
        </p>
      )}

      {distance && (
        <p
          className={`text-sm mt-2 ${
            isWithinRadius ? "text-green-600" : "text-red-600"
          }`}
        >
          {isWithinRadius
            ? `Anda berada dalam area shift (${distance} m dari lokasi).`
            : `Anda berada di luar area shift (${distance} m dari lokasi).`}
        </p>
      )}
    </div>
  );
};

export default Attendance;
