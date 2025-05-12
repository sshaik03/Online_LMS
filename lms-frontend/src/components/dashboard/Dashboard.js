import React, { useState } from 'react';
import { CheckCircle, Clock, X, PlusCircle, HelpCircle, Award, Bookmark, Activity, Book, FileText, MessageSquare, ChevronRight } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { mockCourses, mockAnnouncements, mockAssignments, mockCalendarEvents, mockDiscussions } from '../../data/mockData';

// Dashboard Component
const Dashboard = () => {
  const [currentTab, setCurrentTab] = useState('overview');
  const { userRole, username } = useUser();
  
  return (
    <div className="space-y-8">
      {/* Welcome Card */}
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md overflow-hidden">
        <div className="p-8 flex flex-col md:flex-row gap-6 justify-between items-center">
          <div className="text-white">
            <h2 className="text-2xl font-bold">Welcome back, {username?.charAt(0).toUpperCase() + username?.slice(1)}!</h2>
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
              <Activity size={64} className="text-white opacity-50" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Dashboard Tabs */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setCurrentTab('overview')}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${currentTab === 'overview' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Overview
            </button>
            <button
              onClick={() => setCurrentTab('courses')}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${currentTab === 'courses' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              My Courses
            </button>
            <button
              onClick={() => setCurrentTab('assignments')}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${currentTab === 'assignments' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Assignments
            </button>
            <button
              onClick={() => setCurrentTab('discussions')}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${currentTab === 'discussions' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Discussions
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {currentTab === 'overview' && <DashboardOverview userRole={userRole} />}
          {currentTab === 'courses' && <DashboardCourses />}
          {currentTab === 'assignments' && <DashboardAssignments />}
          {currentTab === 'discussions' && <DashboardDiscussions />}
        </div>
      </div>
    </div>
  );
};

// Dashboard Overview Tab
const DashboardOverview = ({ userRole }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard 
            title="Courses" 
            value={userRole === 'student' ? '4' : userRole === 'instructor' ? '6' : '24'} 
            icon={<Book />} 
            color="bg-blue-100 text-blue-600" 
          />
          <StatCard 
            title="Assignments" 
            value={userRole === 'student' ? '12' : userRole === 'instructor' ? '18' : '86'} 
            icon={<FileText />} 
            color="bg-purple-100 text-purple-600" 
          />
          <StatCard 
            title="Discussions" 
            value={userRole === 'student' ? '8' : userRole === 'instructor' ? '14' : '42'} 
            icon={<MessageSquare />} 
            color="bg-emerald-100 text-emerald-600" 
          />
        </div>
        
        {/* Recent Courses */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {userRole === 'student' ? 'My Courses' : 'Courses You Teach'}
            </h3>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
              View All <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockCourses.slice(0, 2).map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
        
        {/* Assignments */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {userRole === 'student' ? 'Upcoming Assignments' : 'Assignments to Grade'}
            </h3>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
              View All <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-200">
              {mockAssignments.map(assignment => (
                <AssignmentItem key={assignment.id} assignment={assignment} userRole={userRole} />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Column */}
      <div className="space-y-6">
        {/* Announcements */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">Announcements</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {mockAnnouncements.map(announcement => (
              <AnnouncementItem key={announcement.id} announcement={announcement} />
            ))}
          </div>
          <div className="p-3 bg-gray-50 border-t border-gray-200 text-center">
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              View All Announcements
            </button>
          </div>
        </div>
        
        {/* Calendar Events */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-medium text-gray-900">Upcoming Events</h3>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Calendar
            </button>
          </div>
          <div className="divide-y divide-gray-200">
            {mockCalendarEvents.map(event => (
              <CalendarEventItem key={event.id} event={event} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard Courses Tab
const DashboardCourses = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCourses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

// Dashboard Assignments Tab
const DashboardAssignments = () => {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-200">
          {mockAssignments.map(assignment => (
            <AssignmentItem key={assignment.id} assignment={assignment} expanded />
          ))}
        </div>
      </div>
    </div>
  );
};

// Dashboard Discussions Tab
const DashboardDiscussions = () => {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-200">
          {mockDiscussions.map(discussion => (
            <DiscussionItem key={discussion.id} discussion={discussion} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <div className="flex justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// Course Card Component
const CourseCard = ({ course }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className={`h-24 bg-gradient-to-r ${course.color} flex items-center justify-center text-white`}>
        {course.img ? (
          <img src={course.img} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <Book size={48} className="opacity-50" />
        )}
      </div>
      <div className="p-4">
        <h4 className="font-medium text-gray-900 mb-1">{course.title}</h4>
        <p className="text-sm text-gray-500 mb-3">{course.instructor}</p>
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">{course.enrolled} students</div>
          <div className="flex items-center">
            <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${course.progress * 100}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-500">{Math.round(course.progress * 100)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Assignment Item Component
const AssignmentItem = ({ assignment, userRole, expanded = false }) => {
  const getStatusBadge = (status) => {
    switch(status) {
      case 'Completed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle size={12} className="mr-1" /> Completed</span>;
      case 'In Progress':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><Clock size={12} className="mr-1" /> In Progress</span>;
      case 'Not Started':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"><X size={12} className="mr-1" /> Not Started</span>;
      default:
        return null;
    }
  };
  
  return (
    <div className="p-4 hover:bg-gray-50">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-medium text-gray-900">{assignment.title}</h4>
          <p className="text-sm text-gray-500 mt-1">{assignment.course}</p>
          {expanded && (
            <p className="text-sm text-gray-600 mt-2">
              Type: {assignment.type} • Points: {assignment.points}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end">
          <div className="text-sm text-gray-500 mb-2">Due: {assignment.dueDate}</div>
          {getStatusBadge(assignment.status)}
        </div>
      </div>
    </div>
  );
};

// Announcement Item Component
const AnnouncementItem = ({ announcement }) => {
  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'high':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">High</span>;
      case 'medium':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">Medium</span>;
      case 'low':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Low</span>;
      default:
        return null;
    }
  };
  
  return (
    <div className="p-4 hover:bg-gray-50">
      <div className="flex justify-between items-start">
        <h4 className="font-medium text-gray-900">{announcement.title}</h4>
        {getPriorityBadge(announcement.priority)}
      </div>
      <p className="text-sm text-gray-600 mt-1">{announcement.content}</p>
      <div className="text-xs text-gray-500 mt-2">{announcement.date}</div>
    </div>
  );
};

// Calendar Event Item Component
const CalendarEventItem = ({ event }) => {
  return (
    <div className="p-4 hover:bg-gray-50">
      <h4 className="font-medium text-gray-900">{event.title}</h4>
      <div className="flex justify-between items-center mt-1">
        <p className="text-sm text-gray-500">{event.course}</p>
        <p className="text-sm text-gray-500">{event.date}</p>
      </div>
    </div>
  );
};

// Discussion Item Component
const DiscussionItem = ({ discussion }) => {
  return (
    <div className="p-4 hover:bg-gray-50">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium text-gray-900 flex items-center">
            {discussion.title}
            {discussion.unread && (
              <span className="ml-2 w-2 h-2 bg-blue-600 rounded-full"></span>
            )}
          </h4>
          <p className="text-sm text-gray-500 mt-1">{discussion.course}</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">{discussion.replies} replies</div>
          <div className="text-xs text-gray-500 mt-1">{discussion.lastActivity}</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;