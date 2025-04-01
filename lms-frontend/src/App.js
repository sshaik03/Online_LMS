import React, { useState, useEffect } from 'react';
import { Bell, Book, CalendarDays, Home, MessageSquare, Settings, User, Users, FileText, 
  BarChart2, LogOut, ChevronRight, Search, CheckCircle, Clock, X, PlusCircle, 
  HelpCircle, Award, Bookmark, Activity } from 'lucide-react';

// Mock data
const mockCourses = [
  { 
    id: 1, 
    title: 'Introduction to Computer Science', 
    instructor: 'Dr. Alan Turing', 
    enrolled: 156, 
    progress: 0.75, 
    img: '',
    color: 'from-blue-500 to-indigo-600',
    description: 'Learn the fundamental concepts of computer science including algorithms, data structures, and programming basics.'
  },
  { 
    id: 2, 
    title: 'Advanced Mathematics', 
    instructor: 'Dr. Katherine Johnson', 
    enrolled: 89, 
    progress: 0.4, 
    img: '',
    color: 'from-purple-500 to-pink-600',
    description: 'Explore complex mathematical concepts including calculus, linear algebra, and differential equations.'
  },
  { 
    id: 3, 
    title: 'Digital Marketing Fundamentals', 
    instructor: 'Prof. Sarah Miller', 
    enrolled: 210, 
    progress: 0.6, 
    img: '',
    color: 'from-emerald-500 to-teal-600',
    description: 'Master modern digital marketing strategies, social media tactics, and analytics for business growth.'
  },
  { 
    id: 4, 
    title: 'Business Ethics', 
    instructor: 'Dr. Michael Rodriguez', 
    enrolled: 130, 
    progress: 0.2, 
    img: '',
    color: 'from-amber-500 to-orange-600',
    description: 'Examine ethical principles in business environments and develop professional decision-making skills.'
  }
];

const mockAnnouncements = [
  { 
    id: 1, 
    title: 'System Maintenance', 
    content: 'The LMS will be undergoing maintenance this Saturday from 2-4 AM EST.', 
    date: '2 hours ago',
    priority: 'medium'
  },
  { 
    id: 2, 
    title: 'New Feature: Live Sessions', 
    content: "We've added support for live classroom sessions! Check the guide for details.", 
    date: '1 day ago',
    priority: 'high'
  },
  { 
    id: 3, 
    title: 'Fall Semester Registration Open', 
    content: 'Registration for fall semester courses is now open. Early enrollment ends August 31.', 
    date: '3 days ago',
    priority: 'low'
  }
];

const mockAssignments = [
  { 
    id: 1, 
    title: 'Research Paper', 
    course: 'Business Ethics', 
    dueDate: 'Sep 15, 2025', 
    status: 'Not Started',
    points: 100,
    type: 'Paper' 
  },
  { 
    id: 2, 
    title: 'Programming Project', 
    course: 'Introduction to Computer Science', 
    dueDate: 'Sep 10, 2025', 
    status: 'In Progress',
    points: 150,
    type: 'Project'
  },
  { 
    id: 3, 
    title: 'Marketing Campaign Analysis', 
    course: 'Digital Marketing Fundamentals', 
    dueDate: 'Sep 05, 2025', 
    status: 'Completed',
    points: 80,
    type: 'Analysis'
  }
];

const mockCalendarEvents = [
  { id: 1, title: 'Live Lecture: CS Fundamentals', date: 'Today, 10:00 AM', course: 'Introduction to Computer Science' },
  { id: 2, title: 'Group Project Meeting', date: 'Today, 2:30 PM', course: 'Digital Marketing Fundamentals' },
  { id: 3, title: 'Assignment Deadline', date: 'Tomorrow, 11:59 PM', course: 'Advanced Mathematics' },
  { id: 4, title: 'Office Hours', date: 'Friday, 1:00 PM', course: 'Business Ethics' }
];

const mockDiscussions = [
  { 
    id: 1, 
    title: 'Introduction and Welcome Thread', 
    course: 'Introduction to Computer Science', 
    replies: 24, 
    lastActivity: '2 hours ago',
    unread: true 
  },
  { 
    id: 2, 
    title: 'Assignment #2 Questions', 
    course: 'Advanced Mathematics', 
    replies: 8, 
    lastActivity: '1 day ago',
    unread: false
  },
  { 
    id: 3, 
    title: 'Marketing Strategy Project Ideas', 
    course: 'Digital Marketing Fundamentals', 
    replies: 15, 
    lastActivity: '3 days ago',
    unread: true
  }
];

// LMS Main Application
const LMSApp = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const handleLogin = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
    // Simulate loading state
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} userRole={userRole} />
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <Header userRole={userRole} />
        
        {/* Main Content */}
        <main className="p-6 md:p-8">
          {isLoading ? (
            <LoadingState />
          ) : (
            <>
              {currentView === 'dashboard' && <Dashboard userRole={userRole} />}
              {currentView === 'courses' && <Courses userRole={userRole} />}
              {currentView === 'assignments' && <Assignments userRole={userRole} />}
              {currentView === 'discussions' && <Discussions userRole={userRole} />}
              {currentView === 'calendar' && <Calendar />}
              {currentView === 'analytics' && <Analytics userRole={userRole} />}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

// Loading State Component
const LoadingState = () => {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm animate-pulse h-36"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm animate-pulse h-24"></div>
        <div className="bg-white rounded-xl shadow-sm animate-pulse h-24"></div>
        <div className="bg-white rounded-xl shadow-sm animate-pulse h-24"></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm animate-pulse h-96"></div>
        <div className="bg-white rounded-xl shadow-sm animate-pulse h-96"></div>
      </div>
    </div>
  );
};

// Login Page Component
const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('student');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      onLogin(selectedRole);
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

// Sidebar Component
const Sidebar = ({ currentView, setCurrentView, userRole }) => {
  const [collapsed, setCollapsed] = useState(false);
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={collapsed ? 24 : 20} /> },
    { id: 'courses', label: 'Courses', icon: <Book size={collapsed ? 24 : 20} /> },
    { id: 'assignments', label: 'Assignments', icon: <FileText size={collapsed ? 24 : 20} /> },
    { id: 'discussions', label: 'Discussions', icon: <MessageSquare size={collapsed ? 24 : 20} /> },
    { id: 'calendar', label: 'Calendar', icon: <CalendarDays size={collapsed ? 24 : 20} /> }
  ];
  
  // Add analytics for instructors and admins
  if (userRole === 'instructor' || userRole === 'admin') {
    navItems.push({ id: 'analytics', label: 'Analytics', icon: <BarChart2 size={collapsed ? 24 : 20} /> });
  }
  
  // Add user management for admins
  if (userRole === 'admin') {
    navItems.push({ id: 'users', label: 'User Management', icon: <Users size={collapsed ? 24 : 20} /> });
  }

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
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center px-3 py-3 rounded-lg text-left transition-colors
                  ${currentView === item.id 
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
          <button className={`w-full flex items-center px-3 py-2 rounded-lg text-left text-gray-400 hover:bg-gray-700 hover:text-white transition-colors ${collapsed ? 'justify-center' : ''}`}>
            <Settings size={collapsed ? 24 : 20} className={`${collapsed ? '' : 'mr-3'}`} />
            {!collapsed && <span>Settings</span>}
          </button>
          <button className={`w-full flex items-center px-3 py-2 rounded-lg text-left text-gray-400 hover:bg-gray-700 hover:text-white transition-colors ${collapsed ? 'justify-center' : ''}`}>
            <LogOut size={collapsed ? 24 : 20} className={`${collapsed ? '' : 'mr-3'}`} />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

// Header Component
const Header = ({ userRole }) => {
  const roleName = userRole.charAt(0).toUpperCase() + userRole.slice(1);
  
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
              <span className="font-medium">JD</span>
            </div>
            <div className="ml-3 hidden md:block">
              <div className="font-medium text-gray-800">John Doe</div>
              <div className="text-sm text-gray-500 flex items-center">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                {roleName}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// Dashboard Component
const Dashboard = ({ userRole }) => {
  const [currentTab, setCurrentTab] = useState('overview');
  
  return (
    <div className="space-y-8">
      {/* Welcome Card */}
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md overflow-hidden">
        <div className="p-8 flex flex-col md:flex-row gap-6 justify-between items-center">
          <div className="text-white">
            <h2 className="text-2xl font-bold">Welcome back, John!</h2>
            <p className="mt-2 opacity-90">
              {userRole === 'student' 
                ? 'You have 3 assignments due this week. Keep up the good work!'
                : userRole === 'instructor'
                  ? 'You have 12 assignments to grade and 2 upcoming lectures.'
                  : 'System usage is up 12% this week. View analytics for more details.'
              }
            </p>
            <button className="mt-4 bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition-colors">
              {userRole === 'student' ? 'Continue Learning' : 'View Tasks'}
            </button>
          </div>
          <div className="w-64 h-48 bg-blue-400 bg-opacity-20 rounded-lg p-4 hidden lg:block">
            {/* Placeholder for illustration */}
            <div className="w-full h-full flex items-center justify-center">
              <Award size={80} className="text-white opacity-50" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Active Courses"
          value={userRole === 'student' ? '4' : '6'}
          subtitle={userRole === 'student' ? '75% completion rate' : '210 enrolled students'}
          icon={<Book size={28} className="text-blue-500" />}
          color="blue"
        />
        <StatCard
          title="Pending Assignments"
          value={userRole === 'student' ? '3' : '12'}
          subtitle={userRole === 'student' ? 'Next due in 2 days' : 'Awaiting grading'}
          icon={<FileText size={28} className="text-amber-500" />}
          color="amber"
        />
        <StatCard
          title="Discussion Posts"
          value={userRole === 'student' ? '8' : '24'}
          subtitle="5 unread messages"
          icon={<MessageSquare size={28} className="text-emerald-500" />}
          color="emerald"
        />
      </div>
      
      {/* Main Content Tabs */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex px-6 -mb-px">
            <button
              onClick={() => setCurrentTab('overview')}
              className={`py-4 px-4 font-medium text-sm border-b-2 transition-colors ${
                currentTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setCurrentTab('courses')}
              className={`py-4 px-4 font-medium text-sm border-b-2 transition-colors ${
                currentTab === 'courses'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Recent Courses
            </button>
            <button
              onClick={() => setCurrentTab('calendar')}
              className={`py-4 px-4 font-medium text-sm border-b-2 transition-colors ${
                currentTab === 'calendar'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Calendar
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {currentTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Courses</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mockCourses.slice(0, 2).map((course) => (
                    <CourseCard key={course.id} course={course} userRole={userRole} />
                  ))}
                </div>
                
                <h3 className="text-lg font-medium text-gray-800 mt-8 mb-4">Upcoming Assignments</h3>
                <div className="bg-white rounded-lg border border-gray-200">
                  {mockAssignments.map((assignment, index) => (
                    <div 
                      key={assignment.id}
                      className={`p-4 flex justify-between items-center ${
                        index !== mockAssignments.length - 1 ? 'border-b border-gray-200' : ''
                      }`}
                    >
                      <div>
                        <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                        <p className="text-sm text-gray-500">{assignment.course}</p>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600 mr-4">{assignment.dueDate}</span>
                        <StatusBadge status={assignment.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Announcements</h3>
                <div className="space-y-4">
                  {mockAnnouncements.map((announcement) => (
                    <AnnouncementCard key={announcement.id} announcement={announcement} />
                  ))}
                </div>
                
                <h3 className="text-lg font-medium text-gray-800 mt-8 mb-4">Today's Schedule</h3>
                <div className="bg-white rounded-lg border border-gray-200">
                  {mockCalendarEvents.slice(0, 2).map((event, index) => (
                    <div 
                      key={event.id}
                      className={`p-4 ${index !== 1 ? 'border-b border-gray-200' : ''}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{event.title}</h4>
                          <p className="text-sm text-gray-500">{event.course}</p>
                        </div>
                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">{event.date}</span>
                      </div>
                    </div>
                  ))}
                  <div className="p-3 bg-gray-50 border-t border-gray-200 text-center">
                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                      View Full Schedule
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {currentTab === 'courses' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockCourses.map((course) => (
                <CourseCard key={course.id} course={course} userRole={userRole} />
              ))}
            </div>
          )}
          
          {currentTab === 'calendar' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-800">Upcoming Events</h3>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">Today</button>
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">Week</button>
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">Month</button>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200">
                {mockCalendarEvents.map((event, index) => (
                  <div 
                    key={event.id}
                    className={`p-4 flex justify-between items-start ${
                      index !== mockCalendarEvents.length - 1 ? 'border-b border-gray-200' : ''
                    }`}
                  >
                    <div className="flex">
                      <div className="w-2 h-12 bg-blue-500 rounded-full mr-4"></div>
                      <div>
                        <h4 className="font-medium text-gray-900">{event.title}</h4>
                        <p className="text-sm text-gray-500">{event.course}</p>
                      </div>
                    </div>
                    <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{event.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Courses Component
const Courses = ({ userRole }) => {
  const [showNewCourse, setShowNewCourse] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', 'Computer Science', 'Mathematics', 'Business', 'Marketing'];
  
  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.title.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-semibold text-gray-800">Courses</h1>
        
        {(userRole === 'instructor' || userRole === 'admin') && (
          <button 
            onClick={() => setShowNewCourse(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <PlusCircle size={18} className="mr-2" />
            Create New Course
          </button>
        )}
      </div>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
            </div>
            
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {showNewCourse && (
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Create New Course</h2>
                <button 
                  onClick={() => setShowNewCourse(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Computer Science</option>
                    <option>Mathematics</option>
                    <option>Business</option>
                    <option>Engineering</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Description</label>
                  <textarea rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                
                <div className="md:col-span-2 flex justify-end space-x-4">
                  <button 
                    onClick={() => setShowNewCourse(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => setShowNewCourse(false)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Course
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="p-6">
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} userRole={userRole} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Search size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No courses found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Assignments Component
const Assignments = ({ userRole }) => {
  const isStudent = userRole === 'student';
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState('All Courses');
  
  const statuses = ['All', 'Not Started', 'In Progress', 'Completed', 'Graded'];
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-semibold text-gray-800">Assignments</h1>
        
        {!isStudent && (
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
            <PlusCircle size={18} className="mr-2" />
            Create Assignment
          </button>
        )}
      </div>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <h2 className="text-lg font-semibold text-gray-800">
              {isStudent ? 'My Assignments' : 'Manage Assignments'}
            </h2>
            
            <div className="flex flex-wrap gap-2">
              <select 
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                <option>All Courses</option>
                {mockCourses.map(course => (
                  <option key={course.id}>{course.title}</option>
                ))}
              </select>
              
              <div className="flex space-x-1 overflow-x-auto">
                {statuses.filter(status => isStudent ? status !== 'Graded' : true).map(status => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap ${
                      selectedStatus === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {isStudent ? 'Points' : 'Submissions'}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockAssignments.map((assignment) => (
                <tr key={assignment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                        {assignment.type === 'Paper' && <FileText size={20} />}
                        {assignment.type === 'Project' && <Activity size={20} />}
                        {assignment.type === 'Analysis' && <BarChart2 size={20} />}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{assignment.title}</div>
                        <div className="text-sm text-gray-500">{assignment.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{assignment.course}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{assignment.dueDate}</div>
                    <div className="text-xs text-gray-500">
                      {/* Calculate days remaining */}
                      {assignment.dueDate.includes('Sep 05') ? '4 days left' : 
                       assignment.dueDate.includes('Sep 10') ? '9 days left' :
                       assignment.dueDate.includes('Sep 15') ? '14 days left' : 'Due soon'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={assignment.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {isStudent ? (
                      <span className="font-medium">{assignment.points} pts</span>
                    ) : (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">12/25 submitted</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex items-center justify-end space-x-3">
                      <button className="text-blue-600 hover:text-blue-800 transition-colors">View</button>
                      {!isStudent && (
                        <button className="text-blue-600 hover:text-blue-800 transition-colors">Edit</button>
                      )}
                      {isStudent && assignment.status !== 'Completed' && (
                        <button className="px-3 py-1 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors">Submit</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Discussions Component
const Discussions = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-semibold text-gray-800">Discussion Forums</h1>
        
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
          <PlusCircle size={18} className="mr-2" />
          New Discussion
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-800">Active Discussions</h2>
            
            <div className="flex">
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option>All Courses</option>
                {mockCourses.map(course => (
                  <option key={course.id}>{course.title}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {mockDiscussions.map((discussion) => (
              <div 
                key={discussion.id} 
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all hover:border-blue-300"
              >
                <div className="flex justify-between items-start">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        <MessageSquare size={20} />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-blue-600 flex items-center">
                        {discussion.title}
                        {discussion.unread && (
                          <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">New</span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{discussion.course}</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm flex items-center">
                    <MessageSquare size={14} className="mr-1" />
                    {discussion.replies} replies
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                    View Discussion
                    <ChevronRight size={16} className="ml-1" />
                  </button>
                  <p className="text-xs text-gray-500 flex items-center">
                    <Clock size={12} className="mr-1" />
                    Last activity: {discussion.lastActivity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Create New Discussion</h2>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Topic Title</label>
              <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter a title for your discussion" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">Select a course</option>
                {mockCourses.map(course => (
                  <option key={course.id} value={course.id}>{course.title}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea rows="6" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Write your message here..."></textarea>
            </div>
            
            <div className="flex items-center justify-end space-x-4">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Post Discussion
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Calendar = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Calendar</h1>
        
        <div className="flex space-x-2">
          <button className="px-3 py-1 rounded-lg bg-blue-600 text-white">Today</button>
          <button className="px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-50">Month</button>
          <button className="px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-50">Week</button>
          <button className="px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-50">Day</button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        <div className="lg:col-span-5 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">September 2025</h2>
              <div className="flex space-x-2">
                <button className="p-1 rounded-full hover:bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button className="p-1 rounded-full hover:bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-7 text-center gap-px bg-gray-200">
              <div className="bg-white py-2 text-sm font-medium text-gray-500">Sun</div>
              <div className="bg-white py-2 text-sm font-medium text-gray-500">Mon</div>
              <div className="bg-white py-2 text-sm font-medium text-gray-500">Tue</div>
              <div className="bg-white py-2 text-sm font-medium text-gray-500">Wed</div>
              <div className="bg-white py-2 text-sm font-medium text-gray-500">Thu</div>
              <div className="bg-white py-2 text-sm font-medium text-gray-500">Fri</div>
              <div className="bg-white py-2 text-sm font-medium text-gray-500">Sat</div>
            </div>
            
            <div className="grid grid-cols-7 grid-rows-5 text-center gap-px bg-gray-200">
              {/* Calendar implementation would go here */}
              {Array(35).fill().map((_, i) => {
                const day = i - 3; // Starting from August 29
                const isToday = day === 1;
                const hasEvent = [1, 5, 10, 15].includes(day);
                
                return (
                  <div 
                    key={i} 
                    className={`min-h-24 bg-white p-1 ${isToday ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    <div className="flex justify-between">
                      <span className={`text-sm inline-flex h-6 w-6 items-center justify-center rounded-full ${
                        isToday 
                          ? 'bg-blue-600 text-white' 
                          : day < 1 || day > 30 
                            ? 'text-gray-400' 
                            : 'text-gray-700'
                      }`}>
                        {day < 1 ? day + 31 : day > 30 ? day - 30 : day}
                      </span>
                      {hasEvent && (
                        <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                      )}
                    </div>
                    
                    {hasEvent && day > 0 && day <= 30 && (
                      <div className="mt-1 text-left">
                        <div className="text-xs bg-blue-100 text-blue-800 p-1 rounded truncate">
                          {day === 1 ? 'Live Lecture' : 
                           day === 5 ? 'Assignment Due' : 
                           day === 10 ? 'Group Meeting' : 
                           'Office Hours'}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Upcoming Events</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {mockCalendarEvents.map((event) => (
              <div key={event.id} className="p-4">
                <div className="flex justify-between">
                  <h3 className="font-medium text-gray-900">{event.title}</h3>
                  <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{event.date}</div>
                </div>
                <p className="text-sm text-gray-500 mt-1">{event.course}</p>
              </div>
            ))}
          </div>
          
          <div className="p-4 bg-gray-50 text-center">
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              + Add New Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Analytics Component
const Analytics = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Analytics & Reporting</h1>
        
        <div className="flex items-center space-x-4">
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option>Last 30 Days</option>
            <option>Last Quarter</option>
            <option>Last Year</option>
            <option>All Time</option>
          </select>
          <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value="583"
          subtitle="↑ 12% from last month"
          icon={<Users size={28} className="text-blue-500" />}
          color="blue"
        />
        <StatCard
          title="Course Completion"
          value="76%"
          subtitle="↑ 5% from last month"
          icon={<CheckCircle size={28} className="text-emerald-500" />}
          color="emerald"
        />
        <StatCard
          title="Average Grade"
          value="86%"
          subtitle="↑ 2% from last month"
          icon={<Award size={28} className="text-amber-500" />}
          color="amber"
        />
        <StatCard
          title="Active Discussions"
          value="42"
          subtitle="↑ 8% from last month"
          icon={<MessageSquare size={28} className="text-purple-500" />}
          color="purple"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Course Engagement</h2>
          </div>
          <div className="p-6 h-80">
            {/* This would be a line chart in a real implementation */}
            <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center p-6">
                <BarChart2 size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Course engagement metrics visualization would appear here.</p>
                <p className="text-gray-500 text-sm mt-2">(Using Recharts library data)</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Grade Distribution</h2>
          </div>
          <div className="p-6 h-80">
            {/* This would be a bar chart in a real implementation */}
            <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center p-6">
                <BarChart2 size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Grade distribution visualization would appear here.</p>
                <p className="text-gray-500 text-sm mt-2">(Using Recharts library data)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Course Completion Rates</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">In Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion Rate</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockCourses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br rounded-md overflow-hidden">
                        <div className={`w-full h-full bg-gradient-to-br ${course.color}`}></div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{course.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.instructor}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.enrolled}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{Math.floor(course.enrolled * 0.7)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{Math.floor(course.enrolled * 0.5)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full bg-gradient-to-r ${course.color}`}
                          style={{ width: `${course.progress * 100}%` }}
                        ></div>
                      </div>
                      <span className="ml-4 text-sm text-gray-700">{Math.round(course.progress * 100)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const StatCard = ({ title, value, subtitle, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700',
    amber: 'bg-amber-50 text-amber-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    purple: 'bg-purple-50 text-purple-700',
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 transition-transform hover:transform hover:scale-105">
      <div className="flex items-center">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          {icon}
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};

const CourseCard = ({ course, userRole }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full">
      <div className={`h-3 bg-gradient-to-r ${course.color}`}></div>
      
      <div className="p-5 flex-grow">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{course.title}</h3>
        <p className="text-sm text-gray-600 mb-3">{course.instructor}</p>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
        
        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Users size={14} className="mr-1" />
            <span>{course.enrolled} Students</span>
          </div>
          <span>{Math.round(course.progress * 100)}% Complete</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4 overflow-hidden">
          <div className={`h-1.5 rounded-full bg-gradient-to-r ${course.color}`} style={{ width: `${course.progress * 100}%` }}></div>
        </div>
      </div>
      
      <div className="px-5 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex justify-between">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-colors">
            {userRole === 'student' ? 'Go to Course' : 'Manage Course'}
          </button>
          
          {userRole !== 'student' && (
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 text-sm transition-colors">
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const AnnouncementCard = ({ announcement }) => {
  const priorityClasses = {
    low: 'bg-gray-100',
    medium: 'bg-amber-100',
    high: 'bg-red-100'
  };
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-gray-900">{announcement.title}</h3>
        <span className={`${priorityClasses[announcement.priority]} px-2 py-1 text-xs rounded-full`}>
          {announcement.priority}
        </span>
      </div>
      <p className="text-sm text-gray-600 mt-2">{announcement.content}</p>
      <div className="flex justify-between items-center mt-3">
        <p className="text-xs text-gray-500">{announcement.date}</p>
        <button className="text-xs text-blue-600 hover:text-blue-800">Read More</button>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const statusStyles = {
    'Not Started': 'bg-gray-100 text-gray-800',
    'In Progress': 'bg-amber-100 text-amber-800',
    'Completed': 'bg-green-100 text-green-800',
    'Graded': 'bg-blue-100 text-blue-800',
  };
  
  const statusIcons = {
    'Not Started': <Clock size={12} className="mr-1" />,
    'In Progress': <Activity size={12} className="mr-1" />,
    'Completed': <CheckCircle size={12} className="mr-1" />,
    'Graded': <Award size={12} className="mr-1" />,
  };
  
  return (
    <span className={`px-2 py-1 rounded-lg text-xs inline-flex items-center ${statusStyles[status] || statusStyles['Not Started']}`}>
      {statusIcons[status]}
      {status}
    </span>
  );
};

export default LMSApp;