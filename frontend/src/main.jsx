// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import App from './App.jsx'



// =====================================================
// SERVICE WORKER AUTO UPDATE
// =====================================================

if ("serviceWorker" in navigator) {

  window.addEventListener("load", () => {

    navigator.serviceWorker.getRegistrations()
      .then((registrations) => {

        for (const registration of registrations) {

          console.log("🔄 Checking Service Worker update");

          registration.update();

        }

      });

    navigator.serviceWorker.addEventListener(
      "controllerchange",
      () => {

        console.log("✅ New version loaded");

        window.location.reload();

      }
    );

  });

}



// =====================================================
// RENDER APP
// =====================================================

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)