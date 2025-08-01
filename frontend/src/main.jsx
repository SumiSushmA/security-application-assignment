import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App.jsx";
import { UserProvider } from "./context/UserContext";
import "./index.css";
import store from "./store/index.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Provider store={store}>
        <UserProvider>
          <Toaster />
          <App />
        </UserProvider>
      </Provider>
    </Router>
  </StrictMode>
);
