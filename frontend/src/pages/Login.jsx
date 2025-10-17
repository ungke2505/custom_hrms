
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import posImage from "@/assets/img/pos.png"; 

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/method/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usr: username, pwd: password }),
        credentials: "include",
      });

      const text = await res.text();
      console.log("Login response:", text);

      if (res.ok) {
        localStorage.setItem("loggedIn", "1");
        if (onLogin) onLogin();
        navigate("/");
      } else {
        setError("Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm flex flex-col items-center">
        
        <img
          src={posImage}
          alt="Absensi Gembira Houseware"
          className="w-28 h-28 object-contain mb-4"
        />

        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Gembira Houseware
        </h2>

        {error && (
          <div className="text-red-600 text-sm mb-4 text-center">{error}</div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 w-full">
          <input
            type="text"
            placeholder="Username or Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
