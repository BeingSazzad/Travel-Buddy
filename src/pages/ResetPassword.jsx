import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/** Legacy link route — app uses in-app OTP flow on /forgot-password. */
export default function ResetPassword() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/forgot-password", { replace: true });
  }, [navigate]);

  return null;
}
