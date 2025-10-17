// import { useEffect, useState } from "react";
// import Button from "@/components/ui/Button";

// const Attendance = () => {
//   const [checkedIn, setCheckedIn] = useState(false);

//   const handleClick = () => {
//     setCheckedIn(!checkedIn);
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">Attendance</h2>
//       <Button onClick={handleClick}>
//         {checkedIn ? "Check Out" : "Check In"}
//       </Button>
//     </div>
//   );
// };

// export default Attendance;


import { useEffect, useState } from "react";
import Attendance from "@/components/Attendance";

const AttendancePage = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation({ latitude, longitude });
        },
        (err) => {
          setError("Gagal mendapatkan lokasi");
          console.error(err);
        }
      );
    } else {
      setError("Geolocation tidak didukung oleh browser ini.");
    }
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Attendance</h2>

      {location ? (
        <div className="mb-4">
          <p className="text-sm text-gray-500">Lokasi Anda:</p>
          <p className="text-sm font-medium">
            Lat: {location.latitude}, Lng: {location.longitude}
          </p>
          <iframe
            className="mt-2 rounded border"
            width="100%"
            height="200"
            loading="lazy"
            allowFullScreen
            src={`https://maps.google.com/maps?q=${location.latitude},${location.longitude}&z=15&output=embed`}
          ></iframe>
        </div>
      ) : (
        <p className="text-red-500 mb-4">{error || "Mengambil lokasi..."}</p>
      )}

      <Attendance location={location} />
    </div>
  );
};

export default AttendancePage;
