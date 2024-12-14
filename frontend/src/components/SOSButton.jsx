import { useState } from 'react';
import axios from 'axios';

export default function SOSButton() {
  const [isActive, setIsActive] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const handleSOSPress = () => {
    setIsActive(true);
    let count = 3;
    
    const timer = setInterval(() => {
      count -= 1;
      setCountdown(count);
      
      if (count === 0) {
        clearInterval(timer);
        sendSOSAlert();
      }
    }, 1000);
  };

  const sendSOSAlert = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/sos', {
        location: 'Current Location',
        timestamp: new Date()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Emergency services have been notified');
    } catch (error) {
      alert('Failed to send SOS alert');
    } finally {
      setIsActive(false);
      setCountdown(3);
    }
  };

  return (
    <div className="fixed bottom-20 right-4">
      <button
        onTouchStart={handleSOSPress}
        onTouchEnd={() => {
          setIsActive(false);
          setCountdown(3);
        }}
        className={`w-16 h-16 rounded-full ${
          isActive ? 'bg-red-600 animate-pulse' : 'bg-red-500'
        } text-white font-bold shadow-lg flex items-center justify-center`}
      >
        {isActive ? countdown : 'SOS'}
      </button>
    </div>
  );
} 