import { Navigate } from "react-router-dom";

const DeliveryRoute = ({ children }) => {
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const token = localStorage.getItem("token");

  // ❌ Not logged in
  if (!user || !token) {
    return <Navigate to="/login" />;
  }

  // ❌ Not delivery boy
  if (user.role?.toLowerCase() !== "delivery") {
    return <Navigate to="/" />;
  }

  return children;
};

export default DeliveryRoute;