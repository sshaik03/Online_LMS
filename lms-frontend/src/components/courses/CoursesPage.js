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
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrollmentDialogOpen, setEnrollmentDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch enrolled courses
  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      const courses = await getStudentEnrollments();
      setEnrolledCourses(courses);
      setError(null);
    } catch (err) {
      console.error('Error fetching enrolled courses:', err);
      setError('Failed to load your courses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch courses on component mount and after successful enrollment
  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const handleEnrollmentSuccess = (course) => {
    // Refresh the course list
    fetchEnrolledCourses();
    
    setSuccessMessage(`Successfully enrolled in ${course.title}!`);
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Courses</h1>
        <button 
          onClick={() => setEnrollmentDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Enroll in a Course
        </button>
      </div>

      {/* Success message */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="text-center py-10">
          <p>Loading your courses...</p>
        </div>
      ) : (
        <>
          {/* Course list */}
          {enrolledCourses.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <p className="text-gray-600">You are not enrolled in any courses yet.</p>
              <p className="mt-2">Click the "Enroll in a Course" button to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map(course => (
                <div key={course.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
                    <p className="text-gray-600 mb-4">{course.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {course.modules} {course.modules === 1 ? 'module' : 'modules'}
                      </span>
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {course.progress}% complete
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 border-t">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
                      Continue Learning
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Enrollment dialog */}
      <EnrollmentDialog 
        isOpen={enrollmentDialogOpen} 
        onClose={() => setEnrollmentDialogOpen(false)} 
        onEnrollmentSuccess={handleEnrollmentSuccess} 
      />
    </div>
  );
};

export default CoursesPage;