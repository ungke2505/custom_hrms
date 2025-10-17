import { Link } from "react-router-dom";
import { CalendarCheck, Users, FilePlus, Clock } from "lucide-react";

const icons = {
  "check-in": <Clock size={24} />,
  "leave-request": <FilePlus size={24} />,
  "employees": <Users size={24} />,
  "attendance": <CalendarCheck size={24} />,
};

const QuickLinkCard = ({ label, to, icon }) => {
  return (
    <Link
      to={to}
      className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow hover:shadow-md transition"
    >
      <div className="mb-2 text-blue-600">{icons[icon]}</div>
      <span className="text-sm font-medium text-gray-700 text-center">{label}</span>
    </Link>
  );
};

export default QuickLinkCard;
