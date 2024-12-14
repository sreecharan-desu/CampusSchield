import React, { useState, useEffect } from 'react';
import { PhoneIcon, BellIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { userState } from '../store/atoms';
import Alert from './Alert';

export default function Emergency() {
  const [showEmergencyPanel, setShowEmergencyPanel] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [alert, setAlert] = useState(null);
  const user = useRecoilValue(userState);

  const [newContact, setNewContact] = useState({
    name: '',
    relationship: '',
    phone: ''
  });

  // Campus emergency numbers
  const emergencyNumbers = {
    campus_security: '1234567890', // Replace with actual campus security number
    police: '100',
    medical: '108',
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/notifications');
      setNotifications(response.data.filter(n => !n.read));
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      showAlert('Failed to fetch notifications', 'error');
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

  useEffect(() => {
    if (user) {
      fetchEmergencyContacts();
      fetchNotifications();
    }
  }, [user]);

  const handleAddContact = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/emergency-contacts', newContact);
      setEmergencyContacts([...emergencyContacts, response.data]);
      setNewContact({ name: '', relationship: '', phone: '' });
      setShowAddContact(false);
      showAlert('Emergency contact added successfully', 'success');
    } catch (error) {
      console.error('Failed to add emergency contact:', error);
      showAlert(error.response?.data?.error || 'Failed to add emergency contact', 'error');
    }
  };

  const notifyEmergencyContacts = async () => {
    try {
      await axios.post('http://localhost:5000/api/notifications/emergency', {
        userId: user._id,
        location: 'Using browser geolocation' // You can add actual geolocation here
      });
      showAlert('Emergency contacts have been notified', 'success');
    } catch (error) {
      console.error('Failed to notify emergency contacts:', error);
      showAlert('Failed to notify emergency contacts', 'error');
    }
  };

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
  };

  const handleEmergencyCall = (number) => {
    window.location.href = `tel:${number}`;
    notifyEmergencyContacts();
  };

  // Add delete contact functionality
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

  return (
    <>
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Emergency Button */}
      <button
        onClick={() => setShowEmergencyPanel(true)}
        className="fixed bottom-20 right-4 z-50 bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        <PhoneIcon className="h-6 w-6" />
      </button>

      {/* Emergency Panel */}
      {showEmergencyPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Emergency Contacts</h2>
            
            {/* Campus Security */}
            <button
              onClick={() => handleEmergencyCall(emergencyNumbers.campus_security)}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg mb-3 flex items-center justify-center"
            >
              <PhoneIcon className="h-5 w-5 mr-2" />
              Call Campus Security
            </button>

            <button
              onClick={() => handleEmergencyCall(emergencyNumbers.police)}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg mb-3 flex items-center justify-center"
            >
              <PhoneIcon className="h-5 w-5 mr-2" />
              Call Police (100)
            </button>


            {/* Emergency Contacts List */}
            {emergencyContacts.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Emergency Contacts</h3>
                <div className="space-y-3">
                  {emergencyContacts.map(contact => (
                    <div 
                      key={contact._id}
                      className="bg-gray-50 p-4 rounded-lg flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-medium text-gray-900">{contact.name}</h4>
                        <p className="text-sm text-gray-600">{contact.relationship}</p>
                        <p className="text-sm text-gray-600">{contact.phone}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEmergencyCall(contact.phone)}
                          className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700"
                        >
                          <PhoneIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteContact(contact._id)}
                          className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add Contact Button */}
            <button
              onClick={() => setShowAddContact(true)}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg mt-4 flex items-center justify-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Emergency Contact
            </button>

            <button
              onClick={() => setShowEmergencyPanel(false)}
              className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg mt-3"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Add Contact Form Modal */}
      {showAddContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Add Emergency Contact</h2>
            <form onSubmit={handleAddContact}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={newContact.name}
                  onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Relationship
                </label>
                <input
                  type="text"
                  value={newContact.relationship}
                  onChange={(e) => setNewContact({...newContact, relationship: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddContact(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md"
                >
                  Add Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
} 