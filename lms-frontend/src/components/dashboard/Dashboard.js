import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, X, Book, FileText, MessageSquare, ChevronRight, Activity } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { getStudentEnrollments } from '../../services/enrollmentService';
import { getInstructorCourses } from '../../services/courseService';
import { getAssignments } from '../../services/assignmentService';
import axios from 'axios';

// Dashboard Component
const Dashboard = () => {
  const [currentTab, setCurrentTab] = useState('overview');
  const { user, userRole } = useUser();
  
  return (
    <div className="space-y-8">
      {/* Welcome Card */}
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md overflow-hidden">
        <div className="p-8 flex flex-col md:flex-row gap-6 justify-between items-center">
          <div className="text-white">
            <h2 className="text-2xl font-bold">Welcome back, {user?.username ? user.username.charAt(0).toUpperCase() + user.username.slice(1) : 'User'}!</h2>
            <p className="mt-2 opacity-90">
              Your personalized dashboard is ready for you.
            </p>
            <button onClick={() => window.location.href = '/courses'}
            className="mt-4 bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition-colors">
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
          {currentTab === 'overview' && <DashboardOverview />}
          {currentTab === 'courses' && <DashboardCourses />}
          {currentTab === 'assignments' && <DashboardAssignments />}
          {currentTab === 'discussions' && <DashboardDiscussions />}
        </div>
      </div>
    </div>
  );
};

// Dashboard Overview Tab
const DashboardOverview = () => {
  const { userRole } = useUser();
  const [stats, setStats] = useState({
    courses: 0,
    assignments: 0,
    discussions: 0
  });
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        let courseData = [];
        
        // Fetch courses based on user role
        if (userRole === 'instructor') {
          courseData = await getInstructorCourses();
        } else {
          courseData = await getStudentEnrollments();
        }
        
        // Fetch assignments
        const assignmentData = await getAssignments();
        
        // Fetch discussions count (just making a simple count request)
        const API_URL = 'http://localhost:3001/api';
        const token = localStorage.getItem('token');
        const discussionsResponse = await axios.get(`${API_URL}/discussions`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        setStats({
          courses: courseData.length || 0,
          assignments: assignmentData.length || 0,
          discussions: discussionsResponse.data.length || 0
        });
        
        setCourses(courseData.slice(0, 2)); // Just show first 2 courses
        setAssignments(assignmentData.slice(0, 3)); // Show first 3 assignments
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userRole]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Left Column */}
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard 
            title="Courses" 
            value={stats.courses.toString()} 
            icon={<Book />} 
            color="bg-blue-100 text-blue-600" 
          />
          <StatCard 
            title="Assignments" 
            value={stats.assignments.toString()} 
            icon={<FileText />} 
            color="bg-purple-100 text-purple-600" 
          />
          <StatCard 
            title="Discussions" 
            value={stats.discussions.toString()} 
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
            <button 
              onClick={() => window.location.href = '/courses'}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
            >
              View All <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.length > 0 ? (
              courses.map(course => (
                <CourseCard key={course.id || course._id} course={course} />
              ))
            ) : (
              <div className="col-span-2 p-6 border border-gray-200 rounded-lg text-center">
                <p className="text-gray-500">No courses found. {userRole === 'student' ? 'Enroll in a course to get started.' : 'Create your first course to get started.'}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Assignments */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {userRole === 'student' ? 'Upcoming Assignments' : 'Assignments to Grade'}
            </h3>
            <button 
              onClick={() => window.location.href = '/assignments'}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
            >
              View All <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-200">
              {assignments.length > 0 ? (
                assignments.map(assignment => (
                  <AssignmentItem key={assignment._id || assignment.id} assignment={assignment} userRole={userRole} />
                ))
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-500">No assignments found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard Courses Tab
const DashboardCourses = () => {
  const { userRole } = useUser();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        let data;
        
        if (userRole === 'instructor') {
          data = await getInstructorCourses();
        } else {
          data = await getStudentEnrollments();
        }
        
        setCourses(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again.');
        setLoading(false);
      }
    };

    fetchCourses();
  }, [userRole]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <CourseCard key={course.id || course._id} course={course} />
          ))}
        </div>
      ) : (
        <div className="p-6 border border-gray-200 rounded-lg text-center">
          <p className="text-gray-500">
            No courses found. {userRole === 'student' ? 'Enroll in a course to get started.' : 'Create your first course to get started.'}
          </p>
          <button
            onClick={() => window.location.href = userRole === 'student' ? '/courses' : '/courses'}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            {userRole === 'student' ? 'Browse Courses' : 'Create a Course'}
          </button>
        </div>
      )}
    </div>
  );
};

// Dashboard Assignments Tab
const DashboardAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userRole } = useUser();

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const data = await getAssignments();
        setAssignments(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching assignments:', err);
        setError('Failed to load assignments. Please try again.');
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {assignments.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {assignments.map(assignment => (
              <AssignmentItem key={assignment._id || assignment.id} assignment={assignment} expanded userRole={userRole} />
            ))}
          </div>
        </div>
      ) : (
        <div className="p-6 border border-gray-200 rounded-lg text-center">
          <p className="text-gray-500">No assignments found.</p>
          {userRole === 'instructor' && (
            <button
              onClick={() => window.location.href = '/assignments'}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Create an Assignment
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// Dashboard Discussions Tab
const DashboardDiscussions = () => {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        setLoading(true);
        const API_URL = 'http://localhost:3001/api';
        const token = localStorage.getItem('token');
        
        const response = await axios.get(`${API_URL}/discussions`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        setDiscussions(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching discussions:', err);
        setError('Failed to load discussions. Please try again.');
        setLoading(false);
      }
    };

    fetchDiscussions();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {discussions.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-medium text-gray-900">Recent Discussions</h3>
            <button 
              onClick={() => window.location.href = '/discussions'}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              New Discussion
            </button>
          </div>
          <div className="divide-y divide-gray-200">
            {discussions.slice(0, 5).map(discussion => (
              <DiscussionItem key={discussion._id} discussion={discussion} />
            ))}
          </div>
        </div>
      ) : (
        <div className="p-6 border border-gray-200 rounded-lg text-center">
          <p className="text-gray-500">No discussions found.</p>
          <button
            onClick={() => window.location.href = '/discussions'}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Start a Discussion
          </button>
        </div>
      )}
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
  // Extract data safely with defaults
  const title = course.title || 'Untitled Course';
  const instructor = course.instructor || 'Unknown Instructor';
  const description = course.description || '';
  const progress = course.progress || 0;
  const enrollmentCode = course.enrollmentCode;
  const students = course.students?.length || 0;
  const category = course.category || 'Other';
  
  // Dynamic color based on category (similar to your InstructorCoursesPage)
  const getCategoryColor = (category) => {
    const colors = {
      'Computer Science': 'from-blue-500 to-indigo-600',
      'Mathematics': 'from-emerald-500 to-teal-600',
      'Business': 'from-amber-500 to-orange-600',
      'Marketing': 'from-pink-500 to-rose-600',
      'Ethics': 'from-purple-500 to-violet-600',
      'Science': 'from-cyan-500 to-blue-600',
      'Languages': 'from-lime-500 to-green-600',
      'Arts': 'from-red-500 to-pink-600',
      'Other': 'from-gray-500 to-gray-600'
    };
    
    return colors[category] || colors['Other'];
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className={`h-24 bg-gradient-to-r ${getCategoryColor(category)} flex items-center justify-center text-white`}>
        <Book size={48} className="opacity-50" />
      </div>
      <div className="p-4">
        <h4 className="font-medium text-gray-900 mb-1">{title}</h4>
        <p className="text-sm text-gray-500 mb-3">
          {typeof instructor === 'string' ? instructor : 'Unknown Instructor'}
        </p>
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">{students} students</div>
          {typeof progress === 'number' && (
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500">{progress}%</span>
            </div>
          )}
        </div>
        
        {/* Show enrollment code for instructors */}
        {enrollmentCode && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">Enrollment Code: <span className="font-medium">{enrollmentCode}</span></p>
          </div>
        )}
      </div>
    </div>
  );
};

// Assignment Item Component
const AssignmentItem = ({ assignment, userRole, expanded = false }) => {
  const getStatusBadge = (status) => {
    if (!status) return null;
    
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
  
  // Extract data safely with defaults
  const title = assignment.title || 'Untitled Assignment';
  const course = assignment.course || assignment.courseName || 'Unknown Course';
  const type = assignment.type || '';
  const points = assignment.points || 0;
  const dueDate = assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'No due date';
  const status = assignment.status || 'Not Started';
  
  return (
    <div className="p-4 hover:bg-gray-50">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-medium text-gray-900">{title}</h4>
          <p className="text-sm text-gray-500 mt-1">{course}</p>
          {expanded && (
            <p className="text-sm text-gray-600 mt-2">
              Type: {type} • Points: {points}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end">
          <div className="text-sm text-gray-500 mb-2">Due: {dueDate}</div>
          {getStatusBadge(status)}
        </div>
      </div>
    </div>
  );
};

// Discussion Item Component
const DiscussionItem = ({ discussion }) => {
  // Extract data safely with defaults
  const title = discussion.title || 'Untitled Discussion';
  const courseTitle = discussion.course?.title || 'Unknown Course';
  const replies = discussion.replies?.length || 0;
  const lastActivity = discussion.updatedAt ? new Date(discussion.updatedAt).toLocaleDateString() : 'Unknown';
  
  return (
    <div className="p-4 hover:bg-gray-50">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium text-gray-900 flex items-center">
            {title}
          </h4>
          <p className="text-sm text-gray-500 mt-1">{courseTitle}</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">{replies} replies</div>
          <div className="text-xs text-gray-500 mt-1">Last activity: {lastActivity}</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;