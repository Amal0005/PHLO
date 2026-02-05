import { BrowserRouter } from "react-router-dom";
import { AdminRoutes } from "./routes/adminRoutes";
import { UserRoutes } from "./routes/userRoutes";
import { CreatorRoutes } from "./routes/creatorRoutes";
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
  autoClose={2500}
  hideProgressBar={true}
  newestOnTop={true}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss={false}
  draggable={false}
  pauseOnHover
  theme="dark"
  toastClassName="custom-toast"
  bodyClassName="custom-toast-body"
/>
    </>
  );
}
