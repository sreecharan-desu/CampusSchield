/* eslint-disable react/prop-types */
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  PlusCircleIcon, 
  UserIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import { 
  HomeIcon as HomeIconSolid, 
  PlusCircleIcon as PlusCircleIconSolid, 
  UserIcon as UserIconSolid,
  PhoneIcon as PhoneIconSolid
} from '@heroicons/react/24/solid';

export default function MobileLayout({ 
  children, 
  header, 
}) {
  const location = useLocation();
  const path = location.pathname;

  // const handleEmergency = () => {
  //   // You can customize this based on your needs
  //   const emergencyNumber = '911'; // or your campus security number
  //   window.location.href = `tel:${emergencyNumber}`;
  // };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{header}</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-24 px-4 max-w-7xl mx-auto">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-white/80 backdrop-blur-lg border-t border-gray-200 shadow-lg shadow-gray-100/50 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-around">
            {/* Home */}
            <Link
              to="/"
              className="flex flex-col items-center py-3 px-5 transition-all duration-200 ease-in-out"
            >
              {path === '/' ? (
                <HomeIconSolid className="h-6 w-6 text-indigo-600" />
              ) : (
                <HomeIcon className="h-6 w-6 text-gray-500 hover:text-indigo-500" />
              )}
              <span className={`text-xs mt-1 font-medium ${
                path === '/' ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-500'
              }`}>
                Home
              </span>
            </Link>

            {/* Report */}
            <Link
              to="/report"
              className="flex flex-col items-center py-3 px-5 transition-all duration-200 ease-in-out"
            >
              {path === '/report' ? (
                <PlusCircleIconSolid className="h-6 w-6 text-indigo-600" />
              ) : (
                <PlusCircleIcon className="h-6 w-6 text-gray-500 hover:text-indigo-500" />
              )}
              <span className={`text-xs mt-1 font-medium ${
                path === '/report' ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-500'
              }`}>
                Report
              </span>
            </Link>

            {/* Resources */}
            <Link
              to="/resources"
              className="flex flex-col items-center py-3 px-5 transition-all duration-200 ease-in-out"
            >
              {path === '/resources' ? (
                <PhoneIconSolid className="h-6 w-6 text-indigo-600" />
              ) : (
                <PhoneIcon className="h-6 w-6 text-gray-500 hover:text-indigo-500" />
              )}
              <span className={`text-xs mt-1 font-medium ${
                path === '/resources' ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-500'
              }`}>
                Resources
              </span>
            </Link>

            {/* Profile */}
            <Link
              to="/profile"
              className="flex flex-col items-center py-3 px-5 transition-all duration-200 ease-in-out"
            >
              {path === '/profile' ? (
                <UserIconSolid className="h-6 w-6 text-indigo-600" />
              ) : (
                <UserIcon className="h-6 w-6 text-gray-500 hover:text-indigo-500" />
              )}
              <span className={`text-xs mt-1 font-medium ${
                path === '/profile' ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-500'
              }`}>
                Profile
              </span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
} 