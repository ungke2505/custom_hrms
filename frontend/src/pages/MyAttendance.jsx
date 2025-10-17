import { useEffect, useState } from "react";
import { format } from "date-fns";

const MyAttendance = () => {
  const [month, setMonth] = useState(() => format(new Date(), "yyyy-MM"));
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSummary = async () => {
    const formData = new FormData();
    formData.append("month", "2025-06");

    try {
        const res = await fetch("/api/method/custom_hrms.api.get_attendance_summary", {
        method: "POST",
        body: formData,
        credentials: "include",
        });

        const data = await res.json();
        console.log("Attendance Summary:", data.message);
    } catch (err) {
        console.error("Fetch failed:", err);
    }
};



  useEffect(() => {
    fetchSummary();
  }, [month]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">My Attendance</h2>

      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium">Select Month</label>
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
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded shadow">
            <p className="text-gray-500 text-sm">Total Days Present</p>
            <p className="text-xl font-bold">{summary.present}</p>
          </div>
          <div className="p-4 bg-white rounded shadow">
            <p className="text-gray-500 text-sm">Days Late</p>
            <p className="text-xl font-bold">{summary.late}</p>
          </div>
          <div className="p-4 bg-white rounded shadow">
            <p className="text-gray-500 text-sm">Leave Days</p>
            <p className="text-xl font-bold">{summary.leave}</p>
          </div>
          <div className="p-4 bg-white rounded shadow">
            <p className="text-gray-500 text-sm">Working Days</p>
            <p className="text-xl font-bold">{summary.working_days}</p>
          </div>
        </div>
      ) : (
        <p>No data found for this month.</p>
      )}
    </div>
  );
};

export default MyAttendance;
