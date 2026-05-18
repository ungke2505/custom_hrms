import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { openCameraAndCapture } from "/public/js/camera.js";

const StockOpname = ({ location }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [schedule, setSchedule] = useState(null);
  const [nextAction, setNextAction] = useState(null);
  const [distance, setDistance] = useState(null);
  const [isWithinRadius, setIsWithinRadius] = useState(true);
  const [todayLogs, setTodayLogs] = useState([]);

  const ACTION_LABELS = {
    IN: "Check In Stock Opname",
    OUT: "Check Out Stock Opname",
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

  const fetchStatus = async () => {
    try {
      const res = await fetch(
        "/api/method/custom_hrms.api.stock_opname.get_next_action_stock_opname",
        { credentials: "include" }
      );

      const data = await res.json();
      const msg = data?.message || data;

      if (msg.status === "success") {
        const newSchedule = {
          name: msg.schedule,
          warehouse: msg.warehouse,
          location: msg.location,
          opname_date: msg.opname_date,
          start_time: msg.start_time,
        };

        setSchedule(newSchedule);
        setNextAction(msg.next_action);
        setError("");
        setMessage("");

      } else {
        setSchedule(null);
        setNextAction(null);
        setError(msg.message || "Tidak ada jadwal Stock Opname aktif.");
      }
    } catch (err) {
      console.error(err);
      setError("Gagal mengambil status Stock Opname.");
    }
  };

  const fetchTodayLogs = async () => {
    try {
      const res = await fetch(
        "/api/method/custom_hrms.api.stock_opname.get_today_logs_stock_opname",
        { credentials: "include" }
      );
      const data = await res.json();
      const msg = data?.message || data;

      if (msg.status === "success") {
        setTodayLogs(msg.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (location) {
      fetchStatus();
      fetchTodayLogs();
    }
  }, [location]);

  const handleAction = async () => {
    if (!location) {
      setError("Lokasi belum tersedia.");
      return;
    }

    if (!schedule || !nextAction) {
      setError("Schedule tidak tersedia.");
      return;
    }

    if (!["IN", "OUT"].includes(nextAction)) {
      setError("Tipe aksi tidak valid.");
      return;
    }

    if (!window.confirm(`Yakin ingin melakukan ${ACTION_LABELS[nextAction]}?`))
      return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const overlayText = `${ACTION_LABELS[nextAction]} • ${
        schedule.warehouse
      } • ${new Date().toLocaleTimeString("id-ID")}`;

      const photo = await openCameraAndCapture(overlayText);

      if (!photo || typeof photo !== "string") {
        setError("Gagal mengambil foto.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("schedule_name", schedule.name);
      formData.append("log_type", nextAction);
      formData.append("latitude", location.latitude);
      formData.append("longitude", location.longitude);
      formData.append("photo", photo);

      const res = await fetch(
        "/api/method/custom_hrms.api.stock_opname_log.create_stock_opname_log",
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const data = await res.json();
      const payload = data?.message || data;

      if (payload.status === "success") {
        setMessage(payload.message);
        await fetchStatus();
        await fetchTodayLogs();
      } else {
        setError(payload.message || "Terjadi kesalahan.");
      }
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat merekam Stock Opname.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-3">
      {message && <p className="text-green-600">{message}</p>}
      {error && <p className="text-red-600">{error}</p>}

      {schedule && (
        <div className="text-sm text-gray-600">
          <p>
            Warehouse: <strong>{schedule.warehouse || "-"}</strong>
          </p>
          <p>
            Location: <strong>{schedule.location || "-"}</strong>
          </p>
        </div>
      )}

      {nextAction && (
        <Button
          onClick={handleAction}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg"
        >
          {loading ? "Processing..." : ACTION_LABELS[nextAction]}
        </Button>
      )}

      {todayLogs.length > 0 && (
        <div className="bg-white p-4 rounded shadow mt-4">
          <h3 className="text-md font-semibold mb-2">
            Log Stock Opname Hari Ini
          </h3>
          <div className="text-sm space-y-1">
            <p>
              IN:{" "}
              {todayLogs.find((l) => l.log_type === "IN")
                ? new Date(
                    todayLogs.find((l) => l.log_type === "IN").log_time
                  ).toLocaleTimeString("id-ID")
                : "-"}
            </p>
            <p>
              OUT:{" "}
              {todayLogs.find((l) => l.log_type === "OUT")
                ? new Date(
                    todayLogs.find((l) => l.log_type === "OUT").log_time
                  ).toLocaleTimeString("id-ID")
                : "-"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockOpname;