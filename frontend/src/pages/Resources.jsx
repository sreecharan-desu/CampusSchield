import React from 'react';
import MobileLayout from '../components/MobileLayout';
import { PhoneIcon } from '@heroicons/react/24/solid';

export default function Resources() {
  const emergencyNumbers = [
    { name: 'Police', number: '100', description: 'National Police Emergency Number' },
    { name: 'Ambulance', number: '108', description: 'Medical & Emergency Services' },
    { name: 'Fire', number: '101', description: 'Fire Emergency Services' },
    { name: 'Women Helpline', number: '1091', description: 'Women in Distress' },
    { name: 'Child Helpline', number: '1098', description: 'Child in Distress' },
    { name: 'Anti-Ragging', number: '1800-180-5522', description: 'UGC Anti-Ragging Helpline' },
    { name: 'Disaster Management', number: '112', description: 'National Emergency Number' },
    { name: 'Railway Protection', number: '1322', description: 'Railway Security Helpline' },
    { name: 'Cyber Crime', number: '1930', description: 'Report Cyber Crime' },
    { name: 'Student Counseling', number: 'YOUR-COLLEGE-NUMBER', description: 'Campus Counseling Services' },
  ];

  return (
    <MobileLayout header="Emergency Resources">
      <div className="p-4 space-y-6">
        {/* Emergency Numbers Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Emergency Numbers</h2>
          <div className="space-y-3">
            {emergencyNumbers.map((contact) => (
              <div key={contact.number} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-900">{contact.name}</h3>
                    <p className="text-sm text-gray-500">{contact.description}</p>
                  </div>
                  <a
                    href={`tel:${contact.number}`}
                    className="flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg"
                  >
                    <PhoneIcon className="h-5 w-5" />
                    <span>{contact.number}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Tips Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Safety Tips</h2>
          <div className="bg-white rounded-lg shadow p-4 space-y-3">
            <p>• Save emergency numbers on speed dial</p>
            <p>• Use campus escort services at night</p>
            <p>• Stay aware of your surroundings</p>
            <p>• Keep your friends informed of your location</p>
            <p>• Report suspicious activities immediately</p>
            <p>• Download safety apps recommended by the institution</p>
            <p>• Know the locations of emergency phones on campus</p>
            <p>• Always carry your student ID</p>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
} 