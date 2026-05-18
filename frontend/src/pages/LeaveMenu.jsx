import { useNavigate } from "react-router-dom";

const LeaveMenu = () => {
  const navigate = useNavigate();

  const leaveOptions = [
    {
      label: "Cuti Tahunan",
      description: "Ajukan cuti tahunan kamu di sini",
      icon: "🌴",
      path: "/leave-request",
    },
    { label: "Izin Terlambat",
      description: "Gunakan saat kamu terlambat masuk kerja",
      icon: "⏰",
      path: "/late-entry-permission",
    },
    {
      label: "Izin Pulang Cepat",
      description: "Gunakan saat kamu perlu pulang sebelum jam kerja berakhir",
      icon: "🏃‍♂️",
      path: "/early-leave-permission",
    },
    {
      label: "Izin Sakit",
      description: "Ajukan izin jika kamu tidak bisa masuk karena sakit",
      icon: "🤒",
      path: "/sick-leave-permission",
    },
  ];

  return (
    <div className="p-5 space-y-5">
      <h2 className="text-xl font-semibold text-gray-800 mb-3">
        📝 Cuti & Izin Lainnya
      </h2>

      <div className="grid grid-cols-1 gap-4">
        {leaveOptions.map((opt) => (
          <button
            key={opt.path}
            onClick={() => navigate(opt.path)}
            className="flex items-center p-4 bg-white rounded-2xl shadow hover:bg-blue-50 border border-gray-100 transition"
          >
            <span className="text-3xl mr-4">{opt.icon}</span>
            <div className="text-left">
              <h3 className="text-base font-semibold text-gray-800">{opt.label}</h3>
              <p className="text-sm text-gray-500">{opt.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LeaveMenu;
