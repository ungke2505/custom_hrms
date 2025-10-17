import { Home, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 bg-white border-r p-4">
      <h1 className="text-xl font-bold mb-6">HRMS</h1>
      <nav className="flex flex-col gap-2">
        <Link to="/" className="flex items-center gap-2 p-2 rounded hover:bg-gray-100">
          <Home size={20} /> Dashboard
        </Link>
        <Link to="/employees" className="flex items-center gap-2 p-2 rounded hover:bg-gray-100">
          <Users size={20} /> Employee List
        </Link>
        <Link to="/attendance" className="flex items-center gap-2 p-2 rounded hover:bg-gray-100">
          <Users size={20} /> Attendance
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
