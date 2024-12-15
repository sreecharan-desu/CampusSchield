import { useRecoilState } from 'recoil';
import { userState, loadingState } from '../store/atoms';
import axios from 'axios';
import { BASE_URL } from '../BASE_URL';

export function useAuth() {
  const [user, setUser] = useRecoilState(userState);
  const [loading, setLoading] = useRecoilState(loadingState);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}api/auth/login`, { 
        email, 
        password 
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userName', res.data.user.name);
      setUser(res.data.user);
      return res.data;
    } catch (error) {
      throw error.response.data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}api/auth/register`, userData);
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      return res.data;
    } catch (error) {
      throw error.response.data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setUser(null);
  };

  const verifyToken = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${BASE_URL}api/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data.user);
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
    verifyToken
  };
} 