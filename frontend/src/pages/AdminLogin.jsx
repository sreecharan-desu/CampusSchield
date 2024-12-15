import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { userState } from '../atoms/userAtom';
import axios from 'axios';
import MobileLayout from '../components/MobileLayout';
import Input from '../components/Input';
import { BASE_URL } from '../BASE_URL';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const setUser = useSetRecoilState(userState);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const adminCredentials = {
        email: "sreecharan309@gmail.com",
        password: "1234567890"
      };

      if (email === adminCredentials.email && password === adminCredentials.password) {
        const res = await axios.post(`${BASE_URL}api/admin/login`, {
          email,
          password
        });
        
        localStorage.setItem('token', res.data.token);
        setUser({ ...res.data.admin, role: 'admin' });
        navigate('/admin');
      } else {
        setError('Invalid admin credentials');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <MobileLayout header="Admin Login">
      <div className="px-4 py-6">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Admin Portal
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access admin dashboard
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email"
            type="email"
            required
            placeholder="Enter admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Password"
            type="password"
            required
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full h-12 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Sign in as Admin
          </button>
        </form>

      </div>
    </MobileLayout>
  );
} 