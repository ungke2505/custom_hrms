import { useEffect, useState } from "react";
import { format } from "date-fns";

const MyAttendance = () => {
  const [month, setMonth] = useState(() => format(new Date(), "yyyy-MM"));
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSummary = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("month", month);

    try {
      const res = await fetch(
        "/api/method/custom_hrms.api.get_attendance_summary",
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      const data = await res.json();
      setSummary(data.message);
    } catch (err) {
      console.error("Fetch failed:", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchSummary();
  }, [month]);

  const formatMinutes = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h} Jam ${m} Menit`;
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">My Attendance & Deposit</h2>

      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium">
          Select Month
        </label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : summary ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* ================= DENDA ================= */}
          <div className="p-4 bg-red-50 rounded shadow">
            <p className="text-gray-500 text-sm">
              Total Terlambat + Denda
            </p>
            <p className="text-lg font-bold">
              {formatMinutes(summary.total_late_minutes)}
            </p>
          </div>

          <div className="p-4 bg-red-50 rounded shadow">
            <p className="text-gray-500 text-sm">
              Total Lebih Istirahat + Denda
            </p>
            <p className="text-lg font-bold">
              {formatMinutes(summary.total_overbreak_minutes)}
            </p>
          </div>

          <div className="p-4 bg-red-100 rounded shadow">
            <p className="text-gray-700 text-sm">
              Total Denda
            </p>
            <p className="text-xl font-bold text-red-600">
              {formatMinutes(summary.total_penalty_minutes)}
            </p>
          </div>

          {/* ================= DEPOSIT ================= */}
          <div className="p-4 bg-green-50 rounded shadow">
            <p className="text-gray-500 text-sm">
              Total Deposit yang didapat
            </p>
            <p className="text-lg font-bold">
              {formatMinutes(summary.total_deposit_minutes)}
            </p>
          </div>

          <div className="p-4 bg-yellow-50 rounded shadow">
            <p className="text-gray-500 text-sm">
              Total Deposit yang digunakan
            </p>
            <p className="text-lg font-bold">
              {formatMinutes(summary.total_used_minutes)}
            </p>
          </div>

          <div className="p-4 bg-blue-50 rounded shadow">
            <p className="text-gray-500 text-sm">
              Total Deposit Sisa
            </p>
            <p className="text-xl font-bold text-blue-600">
              {formatMinutes(summary.remaining_minutes)}
            </p>
          </div>

        </div>
      ) : (
        <p>No data found for this month.</p>
      )}
    </div>
  );
};

export default MyAttendance;