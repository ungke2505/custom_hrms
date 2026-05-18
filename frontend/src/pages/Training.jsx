
import { useNavigate } from "react-router-dom";

const Training = () => {

  const navigate = useNavigate();

  const trainingOptions = [

    {
      label: "Training Courses",
      description: "Lihat daftar training yang tersedia",
      icon: "🎓",
      path: "/courses",
    },

    {
      label: "Training Results",
      description: "Lihat hasil quiz training yang pernah kamu ikuti",
      icon: "📊",
      path: "/training-results",
    },
    {
      label: "My Certificates",
      description: "Sertifikat training yang kamu peroleh",
      icon: "🏅",
      path: "/certificates"
    }

  ];

  return (

<div className="p-5 space-y-5">

<h2 className="text-xl font-semibold text-gray-800 mb-3">
🎓 Training Center
</h2>

<div className="grid grid-cols-1 gap-4">

{trainingOptions.map((opt) => (

<button
key={opt.path}
onClick={() => navigate(opt.path)}
className="flex items-center p-4 bg-white rounded-2xl shadow hover:bg-blue-50 border border-gray-100 transition"
>

<span className="text-3xl mr-4">{opt.icon}</span>

<div className="text-left">

<h3 className="text-base font-semibold text-gray-800">
{opt.label}
</h3>

<p className="text-sm text-gray-500">
{opt.description}
</p>

</div>

</button>

))}

</div>

</div>

  );

};

export default Training;