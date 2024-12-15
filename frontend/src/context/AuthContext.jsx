import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';import { BASE_URL } from '../BASE_URL';
import { useRecoilState } from 'recoil';
import { userState } from '../atoms/userAtom';

const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export function AuthProvider({ children }) {
  const [user, setUser] = useRecoilState(userState);
  const [loading, setLoading] = useState(true);

  const verifyToken = async (token) => {
    try {
      const res = await axios.get(`${BASE_URL}api/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data.user);
    } catch (error) {
      // localStorage.removeItem('token');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      console.log(email)
      console.log(password);
      const res = await axios.post(`${BASE_URL}api/auth/login`,{email,password});
      if(res.data.user){
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
      }
      return res.data;
    } catch (error) {
      return error;
    }
  };

  const register = async (userData) => {
    try {
      const res = await axios.post(`${BASE_URL}api/auth/register`, userData);
      // console.log(res);
      if(res.data.msg){
        if(!res.data.success){
          return {message : res.data.msg,success : res.data.success};
        }
        return;
      }
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      return {message : `Account with userId : ${res.data.user._id} created successfully`,success : true};
    } catch (error) {
      throw error.response.data;
    }
  };

  // const logout = () => {
  //   localStorage.removeItem('token');
  //   setUser(null);
  // };

  return (
    <AuthContext.Provider value={{ user, login, register,loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);