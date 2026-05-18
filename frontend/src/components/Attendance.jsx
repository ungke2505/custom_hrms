
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
  const [todayLogs, setTodayLogs] = useState([]);

  const ACTION_LABELS = {
    IN: "Absen Datang",
    BREAK_OUT: "Mulai Istirahat",
    BREAK_IN: "Selesai Istirahat",
    OUT: "Absen Pulang",
  };

  const LOG_LABELS_ID = {
    IN: "Datang",
    BREAK_OUT: "Istirahat Keluar",
    BREAK_IN: "Istirahat Masuk",
    OUT: "Pulang",
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

  const haversine = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const toRad = (deg) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.asin(Math.sqrt(a));
    return R * c * 1000;
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

  const fetchTodayLogs = async () => {
    try {
      const res = await fetch(
        "/api/method/custom_hrms.api.employee_checkin.get_today_logs",
        { credentials: "include" }
      );
      const data = await res.json();
      if (data?.message?.logs) setTodayLogs(data.message.logs);
    } catch (err) {
      console.error("Gagal ambil log hari ini:", err);
    }
  };

  useEffect(() => {
    fetchNextAction();
    fetchTodayLogs();
  }, [location]);

  const handleAction = async (action) => {
    if (!location) {
    setError("Lokasi belum tersedia.");
    return;
    }

    if (!isWithinRadius) {
    setError("Anda berada di luar radius lokasi shift.");
    return;
    }

    const confirmText = `Yakin ingin melakukan ${ACTION_LABELS[action] || action}?`;
    if (!window.confirm(confirmText)) return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
    // 🔥 WAJIB FOTO UNTUK SEMUA ACTION
    let photo = null;


    try {
      const overlayText = `${ACTION_LABELS[action]} • ${
        shiftLocation || "Unknown"
      } • ${new Date().toLocaleTimeString("id-ID")}`;

      photo = await openCameraAndCapture(overlayText);

      if (!photo) {
        setError("Foto wajib diambil.");
        setLoading(false);
        return;
      }
    } catch (err) {
      setError("Gagal mengambil foto. Silakan coba lagi.");
      setLoading(false);
      return;
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
          photo,
        }),
      }
    );

    const data = await res.json();
    const payload = data?.status ? data : data?.message || {};

    if (payload.status === "success") {
      setMessage(payload.message || `Berhasil ${ACTION_LABELS[action]}`);
      setShiftLocation(payload.shift_location || "");

      const newLog = {
        log_type: action,
        time: new Date().toLocaleTimeString("id-ID"),
      };

      setTodayLogs((prev) => [...prev, newLog]);

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


  // const handleAction = async (action) => {
  //   if (!location) {
  //     setError("Lokasi belum tersedia.");
  //     return;
  //   }

  //   if (!isWithinRadius) {
  //     setError("Anda berada di luar radius lokasi shift.");
  //     return;
  //   }

  //   const confirmText = `Yakin ingin melakukan ${ACTION_LABELS[action] || action}?`;
  //   if (!window.confirm(confirmText)) return;

  //   setLoading(true);
  //   setError("");
  //   setMessage("");

  //   try {
  //     let photo = null;
  //     if (action === "IN" || action === "OUT") {
  //       try {
  //         const overlayText = `${ACTION_LABELS[action]} • ${
  //           shiftLocation || "Unknown"
  //         } • ${new Date().toLocaleTimeString("id-ID")}`;
  //         photo = await openCameraAndCapture(overlayText);
  //       } catch (err) {
  //         setError(err.message);
  //         setLoading(false);
  //         return;
  //       }
  //     }

  //     const res = await fetch(
  //       "/api/method/custom_hrms.api.employee_checkin.employee_checkin",
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         credentials: "include",
  //         body: JSON.stringify({
  //           log_type: action,
  //           latitude: location.latitude,
  //           longitude: location.longitude,
  //           photo,
  //         }),
  //       }
  //     );

  //     const data = await res.json();
  //     const payload = data?.status ? data : data?.message || {};

  //     if (payload.status === "success") {
  //       setMessage(payload.message || `Berhasil ${ACTION_LABELS[action]}`);
  //       setShiftLocation(payload.shift_location || "");

  //       const newLog = {
  //         log_type: action,
  //         time: new Date().toLocaleTimeString("id-ID"),
  //       };
  //       setTodayLogs((prev) => [...prev, newLog]);

  //       await fetchNextAction();
  //     } else {
  //       setError(payload.message || "Gagal melakukan absensi.");
  //     }
  //   } catch (err) {
  //     console.error("Error:", err);
  //     setError("Server error. Silakan coba lagi.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // 🧮 Hitung total menit istirahat dari pasangan BREAK_OUT & BREAK_IN
  const getTotalBreakMinutes = () => {
    let total = 0;
    let lastBreakOut = null;

    for (const log of todayLogs) {
      if (log.log_type === "BREAK_OUT") {
        lastBreakOut = log.time;
      } else if (log.log_type === "BREAK_IN" && lastBreakOut) {
        const start = new Date(`${new Date().toDateString()} ${lastBreakOut}`);
        const end = new Date(`${new Date().toDateString()} ${log.time}`);
        const diff = (end - start) / 60000;
        if (diff > 0) total += diff;
        lastBreakOut = null;
      }
    }

    return Math.round(total);
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
            Terima kasih untuk hari ini. Sampai jumpa besok!
          </p>
        )}
      </div>

      {/* 🕒 Riwayat absensi hari ini */}
      <div className="bg-white p-4 rounded shadow mt-4">
        <h3 className="text-md font-semibold mb-2">Log Absensi Hari Ini</h3>
        {todayLogs.length > 0 ? (
          <>
            <ul className="text-sm space-y-1">
              {todayLogs.map((log, i) => (
                <li key={i}>
                  <span className="font-medium">
                    {LOG_LABELS_ID[log.log_type] || log.log_type}
                  </span>
                  : {log.time}
                </li>
              ))}
            </ul>

            {todayLogs.some((l) => l.log_type.startsWith("BREAK")) && (
              <p className="text-sm text-gray-700 mt-3">
                🕒 Total Waktu Istirahat:{" "}
                <span className="font-semibold">
                  {getTotalBreakMinutes()} menit
                </span>
              </p>
            )}
          </>
        ) : (
          <p className="text-gray-500 text-sm">Belum ada aktivitas hari ini.</p>
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
