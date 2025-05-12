import React from 'react';
import { Bell, Search } from 'lucide-react';
import { useUser } from '../../context/UserContext';

const Header = () => {
  const { userRole, username } = useUser();
  const roleName = userRole.charAt(0).toUpperCase() + userRole.slice(1);
  const initials = username
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase();
  
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center">
          <h1 className="text-2xl font-semibold text-gray-800">
            {roleName} Dashboard
          </h1>
          <div className="ml-4 hidden md:flex">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-64 px-4 py-2 pl-10 bg-gray-100 border border-transparent rounded-lg focus:bg-white focus:border-blue-500 focus:ring-0 text-sm"
              />
              <Search size={18} className="absolute left-3 top-2.5 text-gray-500" />
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-5">
          <button className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
            <Bell size={22} />
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">3</span>
          </button>
          
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white">
              <span className="font-medium">{initials}</span>
            </div>
            <div className="ml-3 hidden md:block">
              <div className="font-medium text-gray-800">{username}</div>
              <div className="text-sm text-gray-500 flex items-center">
                {roleName}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;