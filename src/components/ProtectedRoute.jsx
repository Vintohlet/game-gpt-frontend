import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const ProtectedRoute = ({ children }) => {
 const isAuth = useSelector((state) => state.user.isAuth);
 return isAuth ? children : <Navigate to="/auth" replace />;
};