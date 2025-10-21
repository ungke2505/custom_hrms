import { useEffect, useState } from "react";

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showIOSMessage, setShowIOSMessage] = useState(false);

  // Deteksi iOS
  const isIOS = () => {
    const ua = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(ua);
  };

  // Deteksi mode standalone
  const isInStandaloneMode =
    "standalone" in window.navigator && window.navigator.standalone;

  useEffect(() => {
    // iOS case (tidak support beforeinstallprompt)
    if (isIOS() && !isInStandaloneMode) {
      setShowIOSMessage(true);
    }

    const handler = (e) => {
      e.preventDefault();
      console.log("✅ beforeinstallprompt event fired");
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      console.log("✅ User accepted the install prompt");
    } else {
      console.log("❌ User dismissed the install prompt");
    }
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  // ✅ Popup Android Install Prompt
  if (showPrompt) {
    return (
      <div className="fixed bottom-5 inset-x-0 flex justify-center z-50">
        <div className="bg-white border shadow-xl rounded-xl px-5 py-4 w-[90%] max-w-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-1 text-center">
            Install Gembira HR
          </h2>
          <p className="text-gray-700 text-sm text-center mb-4">
            Dapatkan aplikasi di perangkat Anda untuk akses lebih cepat dan pengalaman yang lebih baik!
          </p>
          <button
            onClick={handleInstallClick}
            className="bg-red-600 hover:bg-red-700 w-full text-white py-2 rounded-lg text-sm font-medium"
          >
            Install Sekarang
          </button>
        </div>
      </div>
    );
  }

  // ✅ Popup iOS Manual Install Message
  if (showIOSMessage) {
    return (
      <div className="fixed bottom-5 inset-x-0 flex justify-center z-50 px-3">
        <div className="bg-blue-50 border border-blue-200 shadow-md rounded-2xl px-5 py-4 w-[90%] max-w-md">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-base font-semibold text-blue-800">
              Install Gembira HR
            </h2>
            <button
              onClick={() => setShowIOSMessage(false)}
              className="text-blue-700 text-sm font-bold"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-blue-800">
            Untuk menambahkan aplikasi ke layar utama:
          </p>
          <ol className="list-decimal list-inside text-sm text-blue-900 mt-2 space-y-1">
            <li>Tap ikon <strong>Share</strong> di bawah layar Safari.</li>
            <li>Pilih <strong>Add to Home Screen</strong> / <strong>Tambahkan ke Layar Utama</strong>.</li>
            <li>Tekan <strong>Add</strong> di pojok kanan atas.</li>
          </ol>
        </div>
      </div>
    );
  }

  return null;
};

export default PWAInstallPrompt;
