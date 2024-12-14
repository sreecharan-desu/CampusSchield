import { Navigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userState } from '../store/atoms';

export default function ProtectedRoute({ children }) {
  const user = useRecoilValue(userState);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
} 