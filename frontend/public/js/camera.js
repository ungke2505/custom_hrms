
// export async function openCameraAndCapture(overlayText = "") {
//   return new Promise(async (resolve, reject) => {
//     try {
//       document.body.classList.add("camera-active"); // ⬅️ sembunyikan bottom nav

//       const container = document.createElement("div");
//       container.className =
//         "fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-[9999] p-4";
//       container.innerHTML = `
//         <div class="relative w-full max-w-md mx-auto flex flex-col items-center bg-white rounded-xl shadow-lg overflow-hidden">
          
//           <!-- Video Kamera -->
//           <div class="relative w-full bg-black">
//             <video id="cameraStream" autoplay playsinline class="w-full aspect-video object-cover"></video>
//             <div id="overlayText" class="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded">${overlayText}</div>
//           </div>

//           <!-- Tombol Aksi -->
//           <div class="flex w-full justify-center items-center gap-3 px-4 py-4 bg-white border-t mt-auto">
//             <button
//               id="captureBtn"
//               class="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold text-base shadow-md active:scale-95 transition-all"
//               style="flex: 2;"
//             >
//               Ambil Foto
//             </button>

//             <button
//               id="cancelBtn"
//               class="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold text-base shadow-md active:scale-95 transition-all"
//               style="flex: 1;"
//             >
//               Batal
//             </button>
//           </div>

//         </div>
//       `;
//       document.body.appendChild(container);

//       const video = container.querySelector("#cameraStream");
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: { facingMode: "user" },
//       });
//       video.srcObject = stream;

//       // 🔹 Hilangkan mirror effect pada elemen video
//       video.style.transform = "scaleX(-1)";

//       const captureBtn = container.querySelector("#captureBtn");
//       const cancelBtn = container.querySelector("#cancelBtn");

//       cancelBtn.onclick = () => {
//         stream.getTracks().forEach((t) => t.stop());
//         container.remove();
//         document.body.classList.remove("camera-active");
//         reject(new Error("Pengambilan foto dibatalkan."));
//       };

//       captureBtn.onclick = () => {
//         const canvas = document.createElement("canvas");
//         canvas.width = video.videoWidth || 640;
//         canvas.height = video.videoHeight || 480;
//         const ctx = canvas.getContext("2d");

//         // 🔸 Koreksi mirror effect saat menggambar ke canvas
//         ctx.translate(canvas.width, 0);
//         ctx.scale(-1, 1);

//         // Gambar frame video yang sudah di-flip
//         ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

//         // 🔸 Tambahkan timestamp dan overlay text
//         const timestamp = new Date().toLocaleString("id-ID");
//         ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform agar teks tidak mirror
//         ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
//         ctx.fillRect(10, canvas.height - 60, 380, 50);
//         ctx.fillStyle = "white";
//         ctx.font = "16px Arial";
//         ctx.fillText(timestamp, 20, canvas.height - 35);
//         ctx.fillText(overlayText || "", 20, canvas.height - 15);

//         const photo = canvas.toDataURL("image/jpeg", 0.9);
//         stream.getTracks().forEach((t) => t.stop());
//         container.remove();
//         document.body.classList.remove("camera-active");
//         resolve(photo);
//       };
//     } catch (err) {
//       document.body.classList.remove("camera-active");
//       reject(
//         new Error("Tidak dapat mengakses kamera. Pastikan izin kamera diaktifkan.")
//       );
//     }
//   });
// }


export async function openCameraAndCapture(overlayText = "") {
  return new Promise(async (resolve, reject) => {
    try {
      document.body.classList.add("camera-active"); // ⬅️ sembunyikan bottom nav

      const container = document.createElement("div");
      container.className =
        "fixed inset-0 bg-black bg-opacity-90 flex flex-col z-[9999]";

      container.innerHTML = `
        <div class="relative w-full h-full">
          
          <!-- 🎥 Video Kamera FULL -->
          <div class="relative w-full h-full bg-black">
            <video id="cameraStream" autoplay playsinline class="w-full h-full object-cover"></video>

            <!-- 🔹 Hint UX (biar user ngerti harus ngapain) -->
            <div class="absolute top-4 w-full text-center text-white text-sm px-4">
              Arahkan wajah ke kamera lalu tekan tombol di bawah
            </div>

            <!-- 🔹 Overlay Info -->
            <div id="overlayText" class="absolute bottom-24 left-1/2 -translate-x-1/2 text-xs text-white bg-black/50 px-3 py-1 rounded">
              ${overlayText}
            </div>
          </div>

          <!-- 🔘 Tombol (SAFE AREA FIX) -->
          <div 
            class="absolute bottom-0 left-0 w-full flex justify-center items-center gap-3 px-4 pt-3 bg-black/40"
            style="padding-bottom: calc(env(safe-area-inset-bottom) + 12px);"
          >
            <button
              id="captureBtn"
              class="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold text-base shadow-md active:scale-95 transition-all"
              style="flex: 2;"
            >
              Foto dulu Guys!
            </button>

            <button
              id="cancelBtn"
              class="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold text-base shadow-md active:scale-95 transition-all"
              style="flex: 1;"
            >
              Batal
            </button>
          </div>

        </div>
      `;
      document.body.appendChild(container);

      const video = container.querySelector("#cameraStream");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      video.srcObject = stream;

      // 🔹 Mirror untuk selfie
      video.style.transform = "scaleX(-1)";

      const captureBtn = container.querySelector("#captureBtn");
      const cancelBtn = container.querySelector("#cancelBtn");

      cancelBtn.onclick = () => {
        stream.getTracks().forEach((t) => t.stop());
        container.remove();
        document.body.classList.remove("camera-active");
        reject(new Error("Pengambilan foto dibatalkan."));
      };

      captureBtn.onclick = () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext("2d");

        // 🔸 Fix mirror saat capture
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // 🔸 Reset transform
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        // 🔸 Tambahkan timestamp + overlay
        const timestamp = new Date().toLocaleString("id-ID");
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(10, canvas.height - 60, 380, 50);

        ctx.fillStyle = "white";
        ctx.font = "16px Arial";
        ctx.fillText(timestamp, 20, canvas.height - 35);
        ctx.fillText(overlayText || "", 20, canvas.height - 15);

        const photo = canvas.toDataURL("image/jpeg", 0.9);

        stream.getTracks().forEach((t) => t.stop());
        container.remove();
        document.body.classList.remove("camera-active");

        resolve(photo);
      };
    } catch (err) {
      document.body.classList.remove("camera-active");
      reject(
        new Error("Tidak dapat mengakses kamera. Pastikan izin kamera diaktifkan.")
      );
    }
  });
}