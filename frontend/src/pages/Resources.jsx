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
      <div className="p-4 space-y-8">
        {/* Emergency Numbers Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Emergency Numbers</h2>
          <div className="space-y-4">
            {emergencyNumbers.map((contact) => (
              <div key={contact.number} className="bg-white rounded-lg shadow-lg p-5 transition duration-300 ease-in-out hover:shadow-xl">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{contact.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{contact.description}</p>
                  </div>
                  <a
                    href={`tel:${contact.number}`}
                    className="flex items-center justify-center bg-green-500 text-white px-4 py-2 rounded-lg text-center w-32 mt-2 hover:bg-green-600 transition duration-200"
                  >
                    <PhoneIcon className="h-5 w-5" />
                    <span className="ml-2 font-medium">{contact.number}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Tips Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Safety Tips</h2>
          <div className="bg-white rounded-lg shadow-lg p-5 space-y-3">
            <p className="text-gray-700">• Save emergency numbers on speed dial</p>
            <p className="text-gray-700">• Use campus escort services at night</p>
            <p className="text-gray-700">• Stay aware of your surroundings</p>
            <p className="text-gray-700">• Keep your friends informed of your location</p>
            <p className="text-gray-700">• Report suspicious activities immediately</p>
            <p className="text-gray-700">• Download safety apps recommended by the institution</p>
            <p className="text-gray-700">• Know the locations of emergency phones on campus</p>
            <p className="text-gray-700">• Always carry your student ID</p>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
