// // App.jsx
// import { useEffect, useState } from "react";
// import { BrowserRouter as Router } from "react-router-dom";
// import AppRoutes from "./routes/AppRoutes";

// function App() {
//   const [loggedIn, setLoggedIn] = useState(localStorage.getItem("loggedIn") === "1");

//   useEffect(() => {
//     const onStorage = () => {
//       setLoggedIn(localStorage.getItem("loggedIn") === "1");
//     };
//     window.addEventListener("storage", onStorage);
//     return () => window.removeEventListener("storage", onStorage);
//   }, []);

//   return (
//     <Router>
//       <AppRoutes loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
//     </Router>
//   );
// }

// export default App;

import { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem("loggedIn") === "1");

  useEffect(() => {
    const onStorage = () => {
      setLoggedIn(localStorage.getItem("loggedIn") === "1");
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <Router basename="/custom_hrms">
      <AppRoutes loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
    </Router>
  );
}

export default App;
