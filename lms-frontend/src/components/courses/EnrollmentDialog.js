// lms-frontend/src/components/courses/EnrollmentDialog.js
import React, { useState } from 'react';
import { X, Info, Loader } from 'lucide-react';
import { getCourseById, enrollInCourse } from '../../services/enrollmentService';

const EnrollmentDialog = ({ isOpen, onClose, onEnrollmentSuccess }) => {
  const [courseId, setCourseId] = useState('');
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [courseFound, setCourseFound] = useState(false);

  const handleCourseIdChange = (e) => {
    setCourseId(e.target.value);
    // Reset state when ID changes
    setCourse(null);
    setError(null);
    setCourseFound(false);
  };

  const fetchCourseById = async () => {
    if (!courseId.trim()) {
      setError('Please enter a course ID');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const courseData = await getCourseById(courseId);
      setCourse(courseData);
      setCourseFound(true);
    } catch (err) {
      console.error('Error fetching course:', err);
      setError('Course not found. Please check the ID and try again.');
      setCourse(null);
      setCourseFound(false);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!courseId || !courseFound) return;
    
    try {
      setEnrolling(true);
      setError(null);
      await enrollInCourse(courseId);
      onEnrollmentSuccess();
      onClose();
    } catch (err) {
      console.error('Error enrolling in course:', err);
      setError('Failed to enroll in course. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  const handleReset = () => {
    setCourseId('');
    setCourse(null);
    setError(null);
    setCourseFound(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        {/* Dialog Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Enroll by Course ID</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>

        {/* Dialog Content */}
        <div className="p-6">
          {/* Course ID Input */}
          <div className="mb-6">
            <label htmlFor="courseId" className="block text-sm font-medium text-gray-700 mb-1">
              Course ID
            </label>
            <div className="flex">
              <input
                id="courseId"
                type="text"
                placeholder="Enter the course ID"
                value={courseId}
                onChange={handleCourseIdChange}
                className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading || courseFound}
              />
              <button
                onClick={courseFound ? handleReset : fetchCourseById}
                disabled={loading}
                className="px-4 py-2 bg-gray-100 border border-gray-300 border-l-0 rounded-r-lg text-gray-700 hover:bg-gray-200"
              >
                {courseFound ? 'Reset' : 'Find'}
              </button>
            </div>
          </div>

          {/* Loading, Error, or Course Info */}
          {loading ? (
            <div className="flex justify-center items-center py-6">
              <Loader className="animate-spin h-8 w-8 text-blue-500 mr-2" />
              <span className="text-gray-600">Looking for course...</span>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          ) : courseFound && course ? (
            <div className="mb-6 border rounded-lg p-4 bg-gray-50">
              <h4 className="font-medium text-gray-900 mb-1">{course.title}</h4>
              <p className="text-sm text-gray-500 mb-2">
                {course.instructor?.username ? `Instructor: ${course.instructor.username}` : 'No instructor assigned'}
              </p>
              <p className="text-sm text-gray-700">{course.description}</p>
            </div>
          ) : null}

          {/* Info Message */}
          <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded flex items-start">
            <Info size={20} className="mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm">
              Enter the course ID to enroll. Once enrolled, you'll have immediate access to the course content and can track your progress.
            </p>
          </div>
        </div>

        {/* Dialog Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="mr-3 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleEnroll}
            disabled={!courseFound || loading || enrolling}
            className={`px-4 py-2 rounded-lg text-white ${
              !courseFound || loading || enrolling
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {enrolling ? (
              <>
                <span className="inline-block animate-spin mr-2">●</span>
                Enrolling...
              </>
            ) : (
              'Enroll in Course'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentDialog;