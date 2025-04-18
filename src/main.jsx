import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'



createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <StrictMode>
      <App />
      <ToastContainer
        position="bottom-left"
        autoClose={500000000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        className="toast-position"
      />
    </StrictMode>
    //{" "}
  </Provider>
);
