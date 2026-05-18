import { useEffect, useState } from "react";

const EmployeeList = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ===============================
  // Ambil user login
  // ===============================
  useEffect(() => {
    fetch("/api/method/frappe.auth.get_logged_user", { credentials: "include" })
      .then((res) => res.json())
      .then((res) => {
        if (res.message) setUser(res.message);
      })
      .catch(() => setError("Gagal mengambil data user."));
  }, []);

  // ===============================
  // Ambil data dari backend
  // ===============================
  useEffect(() => {
    if (!user) return;

    setLoading(true);
    setError(null);

    fetch(
      `/api/method/custom_hrms.api.employee.get_employee_fine_and_deposit?from_date=${fromDate}&to_date=${toDate}`,
      { credentials: "include" }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.message) {
          setData(res.message);
        } else {
          setError("Tidak ada data ditemukan.");
        }
      })
      .catch(() => setError("Gagal memuat data."))
      .finally(() => setLoading(false));
  }, [user, fromDate, toDate]);

  // ===============================
  // FORMAT MINUTES (ANTI NaN)
  // ===============================
  const formatMinutes = (value) => {
    const minutes = Number(value || 0);
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h} Jam ${m} Menit`;
  };

  // ===============================
  // FORMAT RUPIAH
  // ===============================
  const formatRupiah = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(value || 0));
  };

  return (
    <div className="p-4 space-y-6">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-5 rounded-2xl shadow">
        <h2 className="text-lg font-semibold">Ringkasan Denda & Deposit</h2>
        <p className="text-sm opacity-90">
          Periode:
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
          <p>Memuat data...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : data && (
          <div className="space-y-4">

            {/* TERLAMBAT */}
            <div>
              <p className="text-gray-600">Total Terlambat</p>
              <p className="font-bold">
                {formatMinutes(data.total_late_minutes)}
              </p>
            </div>

            {/* TOTAL DENDA */}
            <div className="border-t pt-3">
              <p className="text-gray-800 font-semibold">Total Denda</p>
              <p className="text-xl font-bold text-red-600">
                {formatRupiah(data.total_fine)}
              </p>
            </div>

            {/* DEPOSIT */}
            <div className="border-t pt-3">
              <p className="text-gray-600">Total Deposit Didapat</p>
              <p className="font-bold">
                {formatMinutes(data.total_deposit_earned_minutes)}
              </p>
            </div>

            <div>
              <p className="text-gray-600">Total Deposit Digunakan</p>
              <p className="font-bold">
                {formatMinutes(data.total_deposit_used_minutes)}
              </p>
            </div>

            <div>
              <p className="text-gray-800 font-semibold">Sisa Deposit</p>
              <p className="text-xl font-bold text-indigo-600">
                {formatMinutes(data.remaining_deposit_minutes)}
              </p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeList;