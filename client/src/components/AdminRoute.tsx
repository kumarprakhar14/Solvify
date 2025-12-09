import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../store/store";

const AdminRoute = () => {
    const { user, status } = useSelector((state: RootState) => state.auth);

    if (status === 'idle') {
        return <div>Loading...</div>; // Or a proper loading spinner
    }

    if (!user || user.role !== 'admin') {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;
