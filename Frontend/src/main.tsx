import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import {store} from "@/store/store";
import App from "./App";
import { setUserFromSession } from "./store/user/authSlice";

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
      <App />
    </Provider>
  </StrictMode>
);
