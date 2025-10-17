// import { useEffect, useState } from "react";

// const PWAInstallPrompt = () => {
//   const [deferredPrompt, setDeferredPrompt] = useState(null);
//   const [showInstall, setShowInstall] = useState(false);
//   const [showIOSInfo, setShowIOSInfo] = useState(false);

//   // Deteksi apakah user pakai iOS
//   const isIos = () => {
//     const userAgent = window.navigator.userAgent.toLowerCase();
//     return /iphone|ipad|ipod/.test(userAgent);
//   };

//   // Deteksi apakah sudah di mode standalone (sudah diinstall)
//   const isInStandaloneMode = () =>
//     window.matchMedia("(display-mode: standalone)").matches ||
//     window.navigator.standalone === true;

//   useEffect(() => {
//     if (isIos() && !isInStandaloneMode()) {
//       setShowIOSInfo(true);
//     }

//     const handler = (e) => {
//       e.preventDefault();
//       setDeferredPrompt(e);
//       setShowInstall(true);
//     };

//     window.addEventListener("beforeinstallprompt", handler);

//     window.addEventListener("appinstalled", () => {
//       setShowInstall(false);
//       setShowIOSInfo(false);
//       setDeferredPrompt(null);
//     });

//     return () => {
//       window.removeEventListener("beforeinstallprompt", handler);
//     };
//   }, []);

//   const handleInstallClick = async () => {
//     if (!deferredPrompt) return;
//     deferredPrompt.prompt();
//     const { outcome } = await deferredPrompt.userChoice;
//     if (outcome === "accepted") console.log("✅ PWA installed");
//     setShowInstall(false);
//     setDeferredPrompt(null);
//   };

//   // ---- Tampilan popup Android ----
//   if (showInstall) {
//     return (
//       <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50">
//         <div className="bg-white shadow-xl rounded-lg p-4 w-80 border">
//           <h2 className="font-semibold text-lg mb-2 text-gray-900">
//             Install Absensi Gembira
//           </h2>
//           <p className="text-sm text-gray-600 mb-3">
//             Dapatkan aplikasi di perangkat Anda untuk akses mudah & pengalaman lebih baik.
//           </p>
//           <button
//             onClick={handleInstallClick}
//             className="w-full bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 rounded"
//           >
//             Install
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // ---- Petunjuk iOS ----
//   if (showIOSInfo) {
//     return (
//       <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50">
//         <div className="bg-blue-100 text-gray-900 rounded-lg shadow-xl w-80 p-4">
//           <div className="flex justify-between items-center mb-2">
//             <h2 className="font-semibold text-base">Install Absensi Gembira</h2>
//             <button
//               onClick={() => setShowIOSInfo(false)}
//               className="text-gray-600 hover:text-gray-900 text-sm"
//             >
//               ✕
//             </button>
//           </div>
//           <p className="text-sm leading-snug">
//             Untuk menginstal di iPhone: tap <span className="font-semibold">Share</span> → pilih{" "}
//             <span className="font-semibold">Tambahkan ke Layar Utama</span>.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return null;
// };

// export default PWAInstallPrompt;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import posImage from "@/assets/img/pos.png";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/method/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usr: username, pwd: password }),
        credentials: "include",
      });

      const text = await res.text();
      console.log("Login response:", text);

      if (res.ok) {
        localStorage.setItem("loggedIn", "1");
        if (onLogin) onLogin();

        // Gunakan path absolut sesuai subfolder PWA
        navigate("/custom_hrms/");
      } else {
        setError("Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm flex flex-col items-center">
        <img
          src={posImage}
          alt="Absensi Gembira Houseware"
          className="w-28 h-28 object-contain mb-4"
        />

        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Gembira Houseware
        </h2>

        {error && (
          <div className="text-red-600 text-sm mb-4 text-center">{error}</div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 w-full">
          <input
            type="text"
            placeholder="Username or Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
