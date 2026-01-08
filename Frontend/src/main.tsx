import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import {store} from "@/store/store";
import App from "./App";
import { setUserFromSession } from "./store/user/authSlice";
import { GoogleOAuthProvider } from "@react-oauth/google";


const savedUser = localStorage.getItem("user");
const savedToken = localStorage.getItem("token");

if (savedUser && savedToken) {
  store.dispatch(
    setUserFromSession({
    user: JSON.parse(savedUser),
    token: savedToken,
    })
  );
}
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    </Provider>
  </StrictMode>
);