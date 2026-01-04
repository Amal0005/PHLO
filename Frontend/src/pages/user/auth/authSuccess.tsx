import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("accessToken", token);
      navigate("/home");
    } else {
      navigate("/login");
    }
  }, []);
  return <h2 style={{ color: "white" }}>Logging you in...</h2>;

}
