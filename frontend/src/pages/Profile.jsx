import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState} from 'recoil';
import { userState } from '../atoms/userAtom';
import axios from 'axios';
import Alert from '../components/Alert';
import MobileLayout from '../components/MobileLayout';
import { BASE_URL } from '../BASE_URL';

export default function Profile() {
  const navigate = useNavigate();
  const [user,setUser] = useRecoilState(userState);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchUserDetails();
  }, [navigate]);

  const fetchUserDetails = async () => {
    try {
      const res = await axios.get(`${BASE_URL}api/auth/verify`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUser(res.data.user);
    } catch (error) {
      console.log('Profile fetch error:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };


  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  // const showAlert = (message, type = 'success') => {
  //   setAlert({ message, type });
  // };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  const getRandomColor = (name) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-indigo-500',
      'bg-pink-500',
      'bg-teal-500'
    ];
    const index = name ? name.length % colors.length : 0;
    return colors[index];
  };

  if (loading) {
    return <MobileLayout header="Profile"><div className="p-4">Loading...</div></MobileLayout>;
  }

  return (
    <MobileLayout header="Profile">
      <div className="max-w-lg mx-auto p-4 pb-24">
        {alert && (
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
          />
        )}

        {/* User Profile Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex flex-col items-center mb-6">
            {user && (
              <>
                <div className={`w-20 h-20 ${getRandomColor(user.name)} rounded-full flex items-center justify-center text-3xl font-bold text-white mb-3 shadow-lg`}>
                  {getInitial(user.name)}
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
                <p className="text-gray-500 text-sm mt-1">{user.department}</p>
              </>
            )}
          </div>
          {user && (
            <div className="space-y-5">
              <div className="border-b border-gray-100 pb-4">
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="mt-1 text-lg text-gray-800">{user.email}</p>
              </div>
              <div className="border-b border-gray-100 pb-4">
                <label className="text-sm font-medium text-gray-500">Student ID</label>
                <p className="mt-1 text-lg text-gray-800">{user.studentId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Department</label>
                <p className="mt-1 text-lg text-gray-800">{user.department}</p>
              </div>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-3 px-4 rounded-xl hover:bg-red-600 transition-colors duration-200 shadow-sm font-medium"
        >
          Logout
        </button>
      </div>
    </MobileLayout>
  );
} 