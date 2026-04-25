import { BrowserRouter } from "react-router-dom";
import { AdminRoutes } from "@/routes/adminRoutes";
import { UserRoutes } from "@/routes/userRoutes";
import { CreatorRoutes } from "@/routes/creatorRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function App() {
  return (
    <>
      <BrowserRouter>
        <CreatorRoutes />
        <AdminRoutes />
        <UserRoutes />
      </BrowserRouter>
      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}
