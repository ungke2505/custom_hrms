import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ChangePassword = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const redirectTo =
    location.state?.redirectTo || "";

  const oldPassword =
    location.state?.oldPassword || "";



  // =====================================================
  // EXTRACT RESET KEY FROM ERPNext URL
  // =====================================================

  let key = "";

  try {

    const url = new URL(
      redirectTo,
      window.location.origin
    );

    key = url.searchParams.get("key") || "";

  } catch (err) {

    console.error("INVALID RESET URL", err);

  }



  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");



  // =====================================================
  // PASSWORD MATCH CHECK
  // =====================================================

  const passwordsMatch =
    newPassword &&
    confirmPassword &&
    newPassword === confirmPassword;



  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");



    // =====================================================
    // VALIDATION
    // =====================================================

    if (!newPassword || !confirmPassword) {

      setError("Password baru wajib diisi");

      return;

    }

    if (newPassword.length < 6) {

      setError("Password minimal 6 karakter");

      return;

    }

    if (!passwordsMatch) {

      setError("Konfirmasi password tidak cocok");

      return;

    }

    if (!key) {

      setError("Reset key tidak valid");

      return;

    }



    // =====================================================
    // API REQUEST
    // =====================================================

    try {

      setLoading(true);

      const res = await fetch(
        "/api/method/frappe.core.doctype.user.user.update_password",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },

          credentials: "include",

          body:
            "key=" + encodeURIComponent(key) +
            "&old_password=" + encodeURIComponent(oldPassword) +
            "&new_password=" + encodeURIComponent(newPassword) +
            "&confirm_password=" + encodeURIComponent(confirmPassword) +
            "&logout_all_sessions=1",
        }
      );

      const data = await res.json();

      console.log(
        "CHANGE PASSWORD RESPONSE:",
        data
      );



      // =====================================================
      // SUCCESS
      // =====================================================

      if (res.ok && !data.exc) {

        setSuccess("Password berhasil diubah");

        setTimeout(() => {

          navigate("/login");

        }, 1500);

        return;

      }



      // =====================================================
      // FAILED
      // =====================================================

      setError(
        data.message ||
        "Gagal mengubah password"
      );

    } catch (err) {

      console.error(err);

      setError("Server error");

    } finally {

      setLoading(false);

    }

  };



  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">

      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">

        <h1 className="text-2xl font-semibold mb-2 text-center">
          Ubah Password
        </h1>

        <p className="text-sm text-gray-500 text-center mb-6">
          Password Anda sudah expired.
        </p>



        {/* ERROR */}

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}



        {/* SUCCESS */}

        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">
            {success}
          </div>
        )}



        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >



          {/* NEW PASSWORD */}

          <div className="relative">

            <input
              type={
                showNewPassword
                  ? "text"
                  : "password"
              }
              placeholder="Password Baru"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
              className="w-full border rounded px-3 py-2 pr-10"
              required
            />

            <button
              type="button"
              onClick={() =>
                setShowNewPassword(
                  !showNewPassword
                )
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showNewPassword ? "🙈" : "🙉"}
            </button>

          </div>



          {/* CONFIRM PASSWORD */}

          <div className="relative">

            <input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              placeholder="Konfirmasi Password Baru"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              className="w-full border rounded px-3 py-2 pr-10"
              required
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showConfirmPassword ? "🙈" : "🙉"}
            </button>

          </div>



          {/* PASSWORD MATCH INDICATOR */}

          {confirmPassword && (

            <div
              className={`text-sm mt-1 ${
                passwordsMatch
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >

              {passwordsMatch
                ? "✓ Password cocok"
                : "✗ Password tidak cocok"}

            </div>

          )}



          {/* SUBMIT BUTTON */}

          <button
            type="submit"
            disabled={
              loading ||
              !passwordsMatch
            }
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition disabled:opacity-50"
          >

            {loading
              ? "Loading..."
              : "Simpan Password"}

          </button>

        </form>

      </div>

    </div>

  );

};

export default ChangePassword;