import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // 👈 block render until auth check

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
