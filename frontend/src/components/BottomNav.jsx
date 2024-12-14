import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, PlusCircleIcon, BookOpenIcon, UserIcon } from '@heroicons/react/24/outline';

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200">
      <div className="flex justify-around py-3">
        <Link to="/" className={`flex flex-col items-center ${location.pathname === '/' ? 'text-blue-600' : 'text-gray-500'}`}>
          <HomeIcon className="w-6 h-6" />
          <span className="text-xs">Home</span>
        </Link>
        <Link to="/report" className={`flex flex-col items-center ${location.pathname === '/report' ? 'text-blue-600' : 'text-gray-500'}`}>
          <PlusCircleIcon className="w-6 h-6" />
          <span className="text-xs">Report</span>
        </Link>
        <Link to="/resources" className={`flex flex-col items-center ${location.pathname === '/resources' ? 'text-blue-600' : 'text-gray-500'}`}>
          <BookOpenIcon className="w-6 h-6" />
          <span className="text-xs">Resources</span>
        </Link>
        <Link to="/profile" className={`flex flex-col items-center ${location.pathname === '/profile' ? 'text-blue-600' : 'text-gray-500'}`}>
          <UserIcon className="w-6 h-6" />
          <span className="text-xs">Profile</span>
        </Link>
      </div>
    </nav>
  );
}
