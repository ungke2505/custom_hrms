import { useState } from "react";
import { useNavigate } from "react-router-dom";
import posImage from "@/assets/img/pos.png";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import { APP_VERSION } from "@/config/version";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/method/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          usr: username,
          pwd: password,
        }),
      });

      const data = await res.json();

      console.log("Login response:", data);

      // =====================================================
      // PASSWORD EXPIRED / FORCE RESET
      // =====================================================
      if (
        data.redirect_to &&
        data.redirect_to.includes("/update-password")
      ) {

        navigate("/change-password", {
          state: {
            redirectTo: data.redirect_to,
            oldPassword: password,
          },
        });

        return;
      }

      // =====================================================
      // LOGIN SUCCESS
      // =====================================================
      if (res.ok && !data.exc) {
        localStorage.setItem("loggedIn", "1");

        if (onLogin) {
          onLogin();
        }

        navigate("/");
        return;
      }

      // =====================================================
      // LOGIN FAILED
      // =====================================================
      setError(
        data.message ||
        "Username atau password salah"
      );

    } catch (err) {
      console.error("Login error:", err);

      setError("Server error. Silakan coba lagi.");
    } finally {
      setLoading(false);
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
          <div className="text-red-600 text-sm mb-4 text-center">
            {error}
          </div>
        )}

        <form
          onSubmit={handleLogin}
          className="space-y-4 w-full"
        >

          <input
            type="text"
            placeholder="Username atau Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            autoComplete="username"
            required
          />

          <div className="relative">

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded pr-10"
              autoComplete="current-password"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? "🙈" : "🙉"}
            </button>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? "Loading..." : "Login"}
          </button>

        </form>
        {/* FOOTER */}
        <div className="mt-6 text-center text-xs text-gray-400 space-y-1">
          <div>
            Powered by ITech Gembira
          </div>
          <div>
            {APP_VERSION}
          </div>
          <div>
            © 2026 Gembira Houseware. All rights reserved.
          </div>

        </div>

      </div>

      <PWAInstallPrompt />

    </div>
  );
};

export default Login;