import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Book, FileText, MessageSquare, CalendarDays, BarChart2, Users, LogOut, ChevronRight } from 'lucide-react';
import { useUser } from '../../context/UserContext';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { userRole, handleLogout } = useUser();
  const navigate = useNavigate();
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={collapsed ? 24 : 20} />, path: '/' },
    { id: 'courses', label: 'Courses', icon: <Book size={collapsed ? 24 : 20} />, path: '/courses' },
    { id: 'assignments', label: 'Assignments', icon: <FileText size={collapsed ? 24 : 20} />, path: '/assignments' },
    { id: 'discussions', label: 'Discussions', icon: <MessageSquare size={collapsed ? 24 : 20} />, path: '/discussions' },
  ];
  
  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogoutClick = () => {
    handleLogout();
    navigate('/login');
  };

  return (
    <div className={`${collapsed ? 'w-20' : 'w-64'} bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col transition-all duration-300`}>
      <div className={`p-6 flex ${collapsed ? 'justify-center' : 'justify-between'} items-center`}>
        {!collapsed && <h1 className="text-2xl font-bold text-blue-400">LearningHub</h1>}
        {collapsed && <Book size={32} className="text-blue-400" />}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white"
        >
          <ChevronRight 
            size={20} 
            className={`transform transition-transform ${collapsed ? 'rotate-180' : ''}`} 
          />
        </button>
      </div>
      
      <nav className="flex-1 mt-6">
        <ul className="space-y-2 px-3">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center px-3 py-3 rounded-lg text-left transition-colors
                  ${window.location.pathname === item.path 
                    ? 'bg-blue-700 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  } ${collapsed ? 'justify-center' : ''}
                `}
              >
                <span className={`${collapsed ? '' : 'mr-3'}`}>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4">
        <div className="border-t border-gray-700 pt-4 space-y-2">
          <button 
            onClick={handleLogoutClick}
            className={`w-full flex items-center px-3 py-2 rounded-lg text-left text-gray-400 hover:bg-gray-700 hover:text-white transition-colors ${collapsed ? 'justify-center' : ''}`}
          >
            <LogOut size={collapsed ? 24 : 20} className={`${collapsed ? '' : 'mr-3'}`} />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;