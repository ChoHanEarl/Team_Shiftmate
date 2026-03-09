import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import Navbar from './NavBar';

export default function PrivateRoute({ children, allowedRole }) {
    const { token, user } = useAuthStore();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRole && user?.userType !== allowedRole) {
        alert('権限がありません。');
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <>
            <Navbar />
            {children}
        </>
    );
}