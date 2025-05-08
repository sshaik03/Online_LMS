import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, User, Users, Settings, BarChart2 } from 'lucide-react';
import { useUser } from '../../context/UserContext';

// Role Option Component
const RoleOption = ({ id, label, icon, selected, onChange }) => {
  return (
    <label htmlFor={id} className={`
      border rounded-lg p-3 flex flex-col items-center cursor-pointer transition-all
      ${selected ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'}
    `}>
      <input
        type="radio"
        id={id}
        name="role"
        className="sr-only"
        checked={selected}
        onChange={onChange}
      />
      <div className={`
        w-8 h-8 rounded-full flex items-center justify-center mb-2
        ${selected ? 'bg-blue-100' : 'bg-gray-100'}
      `}>
        {icon}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </label>
  );
};

// Feature Item for Login Page
const FeatureItem = ({ icon, text }) => {
  return (
    <div className="flex items-start">
      <div className="flex-shrink-0 p-1">
        {icon}
      </div>
      <p className="ml-3 text-white">{text}</p>
    </div>
  );
};

// Main Login Page Component
const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const { handleLogin } = useUser();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      handleLogin(selectedRole);
      navigate('/');
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - illustration/branding */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-blue-600 to-indigo-800 justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"></div>
        <div className="text-white z-10 max-w-xl p-12">
          <h1 className="text-5xl font-bold mb-6">LearningHub</h1>
          <p className="text-xl opacity-90 mb-8">Transform your educational experience with our comprehensive learning management system. Access courses, collaborate with peers, and track your progress all in one place.</p>
          <div className="space-y-4">
            <FeatureItem icon={<Book />} text="Access to a library of courses across multiple disciplines" />
            <FeatureItem icon={<Users />} text="Collaborate with instructors and peers in real-time" />
            <FeatureItem icon={<BarChart2 />} text="Track your progress with detailed analytics" />
          </div>
        </div>
      </div>

      {/* Right side - login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600 mt-2">Sign in to continue to LearningHub</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your username"
                  required
                />
                <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-800">Forgot password?</a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your password"
                  required
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Login As</label>
              <div className="grid grid-cols-3 gap-4">
                <RoleOption 
                  id="student"
                  label="Student"
                  icon={<User className="h-5 w-5" />}
                  selected={selectedRole === 'student'}
                  onChange={() => setSelectedRole('student')}
                />
                <RoleOption 
                  id="instructor"
                  label="Instructor"
                  icon={<Book className="h-5 w-5" />}
                  selected={selectedRole === 'instructor'}
                  onChange={() => setSelectedRole('instructor')}
                />
                <RoleOption 
                  id="admin"
                  label="Admin"
                  icon={<Settings className="h-5 w-5" />}
                  selected={selectedRole === 'admin'}
                  onChange={() => setSelectedRole('admin')}
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">Don't have an account? <a href="#" className="text-blue-600 font-medium hover:text-blue-800">Sign up</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;