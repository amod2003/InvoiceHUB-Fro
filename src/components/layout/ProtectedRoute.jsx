import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { CenterSpinner } from '../ui/Spinner';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, hydrated } = useAuth();
  const location = useLocation();

  if (!hydrated) return <CenterSpinner />;
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

export function PublicOnlyRoute({ children }) {
  const { isAuthenticated, hydrated } = useAuth();
  if (!hydrated) return <CenterSpinner />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}
