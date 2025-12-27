// import { useState, useEffect } from "react";
// import { openCameraAndCapture } from "/public/js/camera.js";

// const SickLeavePermission = () => {
//   const [employee, setEmployee] = useState("");
//   const [employeeName, setEmployeeName] = useState("");
//   const [reason, setReason] = useState("");
//   const [photo, setPhoto] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   // Ambil data employee berdasarkan user login
//   useEffect(() => {
//     const fetchEmployee = async () => {
//       try {
//         const res = await fetch("/api/method/frappe.auth.get_logged_user", {
//           credentials: "include",
//         });
//         const userData = await res.json();
//         const user = userData?.message;

//         if (!user || user === "Guest") {
//           setError("Kamu harus login untuk mengirim izin sakit.");
//           return;
//         }

//         const empRes = await fetch("/api/method/frappe.client.get_list", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify({
//             doctype: "Employee",
//             filters: { user_id: user },
//             fields: ["name", "employee_name"],
//             limit_page_length: 1,
//           }),
//         });

//         const empData = await empRes.json();
//         const emp = empData?.message?.[0];

//         if (emp) {
//           setEmployee(emp.name);
//           setEmployeeName(emp.employee_name || "—");
//         } else {
//           setError("Data Employee tidak ditemukan untuk user ini.");
//         }
//       } catch (err) {
//         console.error("Gagal memuat data employee:", err);
//         setError("Tidak dapat memuat data karyawan.");
//       }
//     };

//     fetchEmployee();
//   }, []);

//   const handleSubmit = async () => {
//     if (!reason.trim()) {
//       setError("Harap isi alasan izin sakit terlebih dahulu.");
//       return;
//     }

//     if (!employee) {
//       setError("Data employee tidak ditemukan, hubungi admin HR.");
//       return;
//     }

//     if (!window.confirm("Yakin ingin mengirim izin sakit?")) return;

//     setLoading(true);
//     setError("");
//     setMessage("");

//     try {
//       // 📸 Ambil foto menggunakan kamera belakang
//       let capturedPhoto = null;
//       try {
//         const overlayText = `Izin Sakit • ${new Date().toLocaleString("id-ID")}`;
//         capturedPhoto = await openCameraAndCapture(overlayText, {
//           video: { facingMode: { exact: "environment" } }, // kamera belakang
//         });
//         setPhoto(capturedPhoto);
//       } catch (err) {
//         setError("Gagal mengambil foto: " + err.message);
//         setLoading(false);
//         return;
//       }

//       // 🚀 Kirim data ke backend
//       const res = await fetch(
//         "/api/method/custom_hrms.api.sick_leave_permission.create_sick_leave",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify({
//             employee,
//             reason,
//             attachment: capturedPhoto || null,
//           }),
//         }
//       );

//       const data = await res.json();
//       const payload = data?.message || data;

//       if (payload.status === "success") {
//         setMessage(
//           `Izin sakit berhasil dikirim untuk ${employeeName} (No. Dokumen: ${payload.name || "—"}).`
//         );
//         setReason("");
//         setPhoto(null);
//       } else {
//         setError(payload.message || "Gagal mengirim izin sakit.");
//       }
//     } catch (err) {
//       console.error("Error:", err);
//       setError("Terjadi kesalahan pada server.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center p-6 sm:p-8 min-h-screen bg-gray-50">
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 space-y-4 border border-gray-100">
//         <h2 className="text-xl font-bold text-gray-800 text-center">
//           🤒 Form Izin Sakit
//         </h2>

//         {employee && (
//           <p className="text-sm text-gray-600 text-center">
//             <strong>Karyawan:</strong> {employeeName} ({employee})
//           </p>
//         )}

//         {message && <p className="text-green-600 text-center">{message}</p>}
//         {error && <p className="text-red-600 text-center">{error}</p>}

//         <textarea
//           value={reason}
//           onChange={(e) => setReason(e.target.value)}
//           placeholder="Tuliskan alasan izin sakit..."
//           className="border rounded-lg p-3 w-full resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
//           rows={4}
//           disabled={loading}
//         />

//         <button
//           onClick={handleSubmit}
//           disabled={loading}
//           className={`w-full py-3 text-white font-medium rounded-lg transition ${
//             loading
//               ? "bg-gray-400 cursor-not-allowed"
//               : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
//           }`}
//         >
//           {loading ? "Mengirim..." : "Kirim Izin Sakit"}
//         </button>

//         {photo && (
//           <div className="mt-4">
//             <p className="text-sm text-gray-600 mb-1">📸 Bukti Foto:</p>
//             <img
//               src={photo}
//               alt="Bukti Izin Sakit"
//               className="rounded-lg shadow border w-full"
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SickLeavePermission;

import { useState, useEffect } from "react";

const SickLeavePermission = () => {
  const [employee, setEmployee] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [reason, setReason] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Ambil data employee berdasarkan user login
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await fetch("/api/method/frappe.auth.get_logged_user", {
          credentials: "include",
        });
        const userData = await res.json();
        const user = userData?.message;

        if (!user || user === "Guest") {
          setError("Kamu harus login untuk mengirim izin sakit.");
          return;
        }

        const empRes = await fetch("/api/method/frappe.client.get_list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            doctype: "Employee",
            filters: { user_id: user },
            fields: ["name", "employee_name"],
            limit_page_length: 1,
          }),
        });

        const empData = await empRes.json();
        const emp = empData?.message?.[0];

        if (emp) {
          setEmployee(emp.name);
          setEmployeeName(emp.employee_name || "—");
        } else {
          setError("Data Employee tidak ditemukan untuk user ini.");
        }
      } catch (err) {
        console.error("Gagal memuat data employee:", err);
        setError("Tidak dapat memuat data karyawan.");
      }
    };

    fetchEmployee();
  }, []);

  // Handle upload foto bukti sakit
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar (jpg/png).");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result); // base64 string
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setError("Harap isi alasan izin sakit terlebih dahulu.");
      return;
    }

    if (!employee) {
      setError("Data employee tidak ditemukan, hubungi admin HR.");
      return;
    }

    if (!photo) {
      setError("Harap upload bukti foto terlebih dahulu.");
      return;
    }

    if (!window.confirm("Yakin ingin mengirim izin sakit?")) return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(
        "/api/method/custom_hrms.api.sick_leave_permission.create_sick_leave",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            employee,
            reason,
            attachment: photo, // base64 image
          }),
        }
      );

      const data = await res.json();
      const payload = data?.message || data;

      if (payload.status === "success") {
        setMessage(
          `Izin sakit berhasil dikirim untuk ${employeeName} (No. Dokumen: ${
            payload.name || "—"
          }).`
        );
        setReason("");
        setPhoto(null);
        setPhotoPreview(null);
      } else {
        setError(payload.message || "Gagal mengirim izin sakit.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Terjadi kesalahan pada server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 sm:p-8 min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 space-y-4 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 text-center">
          🤒 Form Izin Sakit
        </h2>

        {employee && (
          <p className="text-sm text-gray-600 text-center">
            <strong>Karyawan:</strong> {employeeName} ({employee})
          </p>
        )}

        {message && <p className="text-green-600 text-center">{message}</p>}
        {error && <p className="text-red-600 text-center">{error}</p>}

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Tuliskan alasan izin sakit..."
          className="border rounded-lg p-3 w-full resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
          rows={4}
          disabled={loading}
        />

        <div className="flex flex-col items-start space-y-2">
          <label className="text-sm text-gray-700 font-medium">
            Upload Bukti Foto (Wajib!):
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={loading}
            className="text-sm border border-gray-300 rounded-lg p-2 w-full"
          />
          {photoPreview && (
            <img
              src={photoPreview}
              alt="Preview"
              className="mt-2 rounded-lg shadow border w-full"
            />
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-3 text-white font-medium rounded-lg transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
          }`}
        >
          {loading ? "Mengirim..." : "Kirim Izin Sakit"}
        </button>
      </div>
    </div>
  );
};

export default SickLeavePermission;
