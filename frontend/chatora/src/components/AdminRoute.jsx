import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <Navigate to="/login" />;

  return user.role === "admin" ? children : <Navigate to="/" />;
};

export default AdminRoute;