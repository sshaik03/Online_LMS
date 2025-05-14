import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User } from 'lucide-react';
import { useUser } from '../../context/UserContext';

const Header = () => {
  const { user, handleLogout } = useUser();
  const navigate = useNavigate();
  
  // Add a safe check for user data before using split
  const getInitials = (name) => {
    if (!name) return 'U'; // Default initial if name is undefined
    
    return name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  const handleLogoutClick = () => {
    handleLogout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center">
      <div className="flex-1">
        {/* Search bar or other elements */}
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Bell size={20} />
        </button>
        
        <div className="relative group">
          <button className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
              {user ? getInitials(user.username) : 'U'}
            </div>
            <span className="text-sm font-medium">
              {user ? user.username : 'User'}
            </span>
          </button>
          
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
            <button
              onClick={handleLogoutClick}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;