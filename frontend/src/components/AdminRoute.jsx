import { Navigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userState } from '../store/atoms';

export default function AdminRoute({ children }) {
  const user = useRecoilValue(userState);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin/login" />;
  }

  return children;
} 