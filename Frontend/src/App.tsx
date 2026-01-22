import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AdminRoutes } from "./routes/adminRoutes";
import { UserRoutes } from "./routes/userRoutes";
import { CreatorRoutes } from "./routes/creatorRoutes";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { store } from "./store/store";
import { hydrateAuth } from "./store/tokenSlice";
import { useDispatch } from "react-redux";

function AuthHydrator() {
  const dispatch = useDispatch();

  useEffect(() => {
    const state = store.getState().token;
    if (state.token && state.role) {
      dispatch(hydrateAuth({ token: state.token, role: state.role }));
    }
  }, []);

  return null;
}

export default function App() {
  return (
    <>
      <BrowserRouter>
       <AuthHydrator />
        <Routes>
          <Route path="/*" element={<UserRoutes />} />
          <Route path="/creator/*" element={<CreatorRoutes />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Routes>
      </BrowserRouter>
  <ToastContainer
  position="top-right"
  autoClose={2000}
  hideProgressBar={false}
  closeButton={false}
  newestOnTop
  pauseOnHover={false}
  draggable={false}
  theme="dark"
/>
      </>
  );
}
