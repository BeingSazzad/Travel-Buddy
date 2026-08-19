import { Navigate } from "react-router-dom";

export default function MyEvents() {
  return <Navigate to="/events?tab=mine" replace />;
}
