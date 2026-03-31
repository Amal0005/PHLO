import { BrowserRouter } from "react-router-dom";
import { AdminRoutes } from "@/routes/adminRoutes";
import { UserRoutes } from "@/routes/userRoutes";
import { CreatorRoutes } from "@/routes/creatorRoutes";
import { ToastContainer } from "react-toastify";


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
        toastStyle={{
          borderRadius: '20px',
          background: 'rgba(10, 10, 10, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          padding: '12px 24px',
        }}
      />
    </>
  );
}
