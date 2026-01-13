import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AdminRoutes } from "./routes/adminRoutes";
import { UserRoutes } from "./routes/userRoutes";
import { CreatorRoutes } from "./routes/creatorRoutes";
import { ToastContainer } from "react-toastify";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<UserRoutes />} />
          <Route path="/creator/*" element={<CreatorRoutes />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Routes>
      </BrowserRouter>
     <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />    </>
  );
}
