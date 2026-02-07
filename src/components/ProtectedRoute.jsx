import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token"); // check if user is logged in

  if (!token) {
    // redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  // else render the page
  return children;
}
