import QuickLinkCard from "../components/QuickLinkCard";

const Dashboard = () => {
  const links = [
    { label: "Check In", to: "/attendance", icon: "check-in" },
    { label: "Leave Request", to: "/leave-request", icon: "leave-request" },
    { label: "My Attendance", to: "/my-attendance", icon: "attendance" },
    { label: "Employees", to: "/employees", icon: "employees" },
  ];

  const handleLogout = () => {
    // (Opsional) Logout Frappe session jika perlu
    fetch("/api/method/logout", { method: "GET", credentials: "include" });

    localStorage.removeItem("loggedIn");
    window.location.href = "/login";
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
      <div className="grid grid-cols-2 gap-4">
        {links.map((link) => (
          <QuickLinkCard key={link.to} {...link} />
        ))}
      </div>

      <button
        onClick={handleLogout}
        className="mt-6 bg-red-500 text-white px-4 py-2 rounded w-full"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
