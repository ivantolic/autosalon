import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    const { user, role, loading } = useAuth();

    if (loading) return <div>Ucitavanje...</div>;

    if (!user || role !== 'admin') {
        return <Navigate to="/" />;
    }

    return children;
};

export default AdminRoute;
