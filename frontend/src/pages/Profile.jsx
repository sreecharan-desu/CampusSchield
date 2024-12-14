import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userState } from '../store/atoms';
import axios from 'axios';
import { PhoneIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import Alert from '../components/Alert';
import MobileLayout from '../components/MobileLayout';

export default function Profile() {
  const navigate = useNavigate();
  const user = useRecoilValue(userState);
  const setUser = useSetRecoilState(userState);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [alert, setAlert] = useState(null);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    relationship: '',
    phone: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchUserDetails();
    fetchEmergencyContacts();
  }, [navigate]);

  const fetchUserDetails = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/verify');
      setUserDetails(res.data.user);
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

  const fetchEmergencyContacts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/emergency-contacts');
      setEmergencyContacts(response.data);
    } catch (error) {
      console.error('Failed to fetch emergency contacts:', error);
      showAlert('Failed to fetch emergency contacts', 'error');
    }
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/emergency-contacts', newContact);
      setEmergencyContacts([...emergencyContacts, response.data]);
      setNewContact({ name: '', relationship: '', phone: '' });
      setShowAddContact(false);
      showAlert('Emergency contact added successfully', 'success');
    } catch (error) {
      console.error('Failed to add contact:', error);
      showAlert('Failed to add emergency contact', 'error');
    }
  };

  const handleDeleteContact = async (contactId) => {
    try {
      await axios.delete(`http://localhost:5000/api/emergency-contacts/${contactId}`);
      setEmergencyContacts(contacts => contacts.filter(c => c._id !== contactId));
      showAlert('Emergency contact removed successfully', 'success');
    } catch (error) {
      console.error('Failed to delete contact:', error);
      showAlert('Failed to remove emergency contact', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
  };

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
            {userDetails && (
              <>
                <div className={`w-20 h-20 ${getRandomColor(userDetails.name)} rounded-full flex items-center justify-center text-3xl font-bold text-white mb-3 shadow-lg`}>
                  {getInitial(userDetails.name)}
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">{userDetails.name}</h2>
                <p className="text-gray-500 text-sm mt-1">{userDetails.department}</p>
              </>
            )}
          </div>
          {userDetails && (
            <div className="space-y-5">
              <div className="border-b border-gray-100 pb-4">
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="mt-1 text-lg text-gray-800">{userDetails.email}</p>
              </div>
              <div className="border-b border-gray-100 pb-4">
                <label className="text-sm font-medium text-gray-500">Student ID</label>
                <p className="mt-1 text-lg text-gray-800">{userDetails.studentId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Department</label>
                <p className="mt-1 text-lg text-gray-800">{userDetails.department}</p>
              </div>
            </div>
          )}
        </div>

        {/* Emergency Contacts Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Emergency Contacts</h2>
            <button
              onClick={() => setShowAddContact(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors duration-200"
            >
              <PlusIcon className="h-5 w-5 mr-1" />
              <span className="text-sm font-medium">Add Contact</span>
            </button>
          </div>
          
          {emergencyContacts.length > 0 ? (
            <div className="space-y-4">
              {emergencyContacts.map(contact => (
                <div 
                  key={contact._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                >
                  <div>
                    <h3 className="font-medium text-gray-800">{contact.name}</h3>
                    <p className="text-sm text-gray-600">{contact.relationship}</p>
                    <p className="text-sm text-blue-600 font-medium">{contact.phone}</p>
                  </div>
                  <div className="flex space-x-3">
                    <a
                      href={`tel:${contact.phone}`}
                      className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors duration-200 shadow-sm"
                    >
                      <PhoneIcon className="h-5 w-5" />
                    </a>
                    <button
                      onClick={() => handleDeleteContact(contact._id)}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200 shadow-sm"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">No emergency contacts added yet.</p>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-3 px-4 rounded-xl hover:bg-red-600 transition-colors duration-200 shadow-sm font-medium"
        >
          Logout
        </button>

        {/* Add Contact Modal */}
        {showAddContact && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add Emergency Contact</h2>
              <form onSubmit={handleAddContact} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={newContact.name}
                    onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Relationship
                  </label>
                  <input
                    type="text"
                    value={newContact.relationship}
                    onChange={(e) => setNewContact({...newContact, relationship: e.target.value})}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddContact(false)}
                    className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
                  >
                    Add Contact
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MobileLayout>
  );
} 