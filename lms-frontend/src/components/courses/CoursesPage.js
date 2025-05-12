// lms-frontend/src/components/courses/CoursesPage.js
import React, { useState, useEffect } from 'react';
import { Book, Plus, Check, AlertCircle } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { getStudentEnrollments, updateEnrollmentStatus } from '../../services/enrollmentService';
import EnrollmentDialog from './EnrollmentDialog';

// Course Card Component
const CourseCard = ({ course, onDropCourse }) => {
  const getStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><Check size={12} className="mr-1" />Active</span>;
      case 'completed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><Check size={12} className="mr-1" />Completed</span>;
      case 'dropped':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"><AlertCircle size={12} className="mr-1" />Dropped</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className={`h-24 bg-gradient-to-r ${course.color || 'from-blue-500 to-indigo-600'} flex items-center justify-center text-white`}>
        {course.image ? (
          <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <Book size={48} className="opacity-50" />
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h4 className="font-medium text-gray-900 mb-1">{course.title}</h4>
          {course.status && getStatusBadge(course.status)}
        </div>
        <p className="text-sm text-gray-500 mb-3">Instructor: {course.instructor}</p>
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">{course.modules} modules</div>
          <div className="flex items-center">
            <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-500">{course.progress}%</span>
          </div>
        </div>
        {course.status === 'active' && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <button
              onClick={() => onDropCourse(course.id)}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Drop Course
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Courses Page Component
const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrollmentDialogOpen, setEnrollmentDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const { userRole } = useUser();
  
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (userRole === 'student') {
        const enrollments = await getStudentEnrollments();
        
        // Transform data to match the component's expected format
        const formattedCourses = enrollments.map(enrollment => ({
          id: enrollment.id,
          courseId: enrollment.courseId,
          title: enrollment.title,
          instructor: enrollment.instructor,
          modules: enrollment.modules,
          progress: enrollment.progress,
          status: enrollment.status,
          color: getRandomColor(),
          image: enrollment.image
        }));
        
        setCourses(formattedCourses);
      }
      // Add similar logic for instructor courses if needed
      
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getRandomColor = () => {
    const colors = [
      'from-blue-500 to-indigo-600',
      'from-purple-500 to-pink-600',
      'from-emerald-500 to-teal-600',
      'from-amber-500 to-orange-600',
      'from-red-500 to-pink-600',
      'from-cyan-500 to-blue-600'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  const handleEnrollmentSuccess = () => {
    fetchCourses();
    setSuccessMessage('Successfully enrolled in course!');
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };
  
  const handleDropCourse = async (enrollmentId) => {
    if (window.confirm('Are you sure you want to drop this course?')) {
      try {
        await updateEnrollmentStatus(enrollmentId, 'dropped');
        fetchCourses();
        setSuccessMessage('Course has been dropped');
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      } catch (err) {
        console.error('Error dropping course:', err);
        setError('Failed to drop course. Please try again.');
      }
    }
  };
  
  const openEnrollmentDialog = () => {
    setEnrollmentDialogOpen(true);
  };
  
  const closeEnrollmentDialog = () => {
    setEnrollmentDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Courses</h1>
        <button 
          onClick={openEnrollmentDialog}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <span className="mr-2">Enroll in New Course</span>
          <Plus size={16} />
        </button>
      </div>
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your courses...</p>
        </div>
      ) : courses.length == 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <Book size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-600 mb-6">
            You're not enrolled in any courses yet. Click the "Enroll in New Course" button to browse available courses.
          </p>
          <button
            onClick={openEnrollmentDialog}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-flex items-center"
          >
            <Plus size={16} className="mr-2" />
            Enroll Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <CourseCard 
              key={course.id} 
              course={course} 
              onDropCourse={handleDropCourse}
            />
          ))}
        </div>
      )}
      
      <EnrollmentDialog 
        isOpen={enrollmentDialogOpen}
        onClose={closeEnrollmentDialog}
        onEnrollmentSuccess={handleEnrollmentSuccess}
      />
    </div>
  );
};

export default CoursesPage;