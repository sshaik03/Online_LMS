// lms-frontend/src/components/instructor/InstructorCoursesPage.js
import React, { useState, useEffect } from 'react';
import { Book, Plus, Edit, Trash, Eye, Settings, Users } from 'lucide-react';
import { getInstructorCourses, deleteCourse, updateCourseActiveStatus } from '../../services/courseService';
import CourseCreationDialog from '../courses/CourseCreationDialog';

const CourseCard = ({ course, onEdit, onDelete, onToggleStatus, onViewStudents }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-sm transition-shadow">
      <div className={`h-24 bg-gradient-to-r ${getCourseBgColor(course.category)} flex items-center justify-center text-white`}>
        {course.image ? (
          <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <Book size={48} className="opacity-50" />
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h4 className="font-medium text-gray-900 mb-1">{course.title}</h4>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            course.isActive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {course.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
        
        <p className="text-sm text-gray-500 mb-2">
          {course.students?.length || 0} students enrolled
        </p>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
        
        <div className="border-t border-gray-100 pt-3 flex justify-between">
          <div className="space-x-2">
            <button
              onClick={() => onEdit(course._id)}
              className="text-blue-600 hover:text-blue-800"
              title="Edit Course"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => onToggleStatus(course._id, !course.isActive)}
              className={`${
                course.isActive ? 'text-amber-600 hover:text-amber-800' : 'text-green-600 hover:text-green-800'
              }`}
              title={course.isActive ? 'Deactivate Course' : 'Activate Course'}
            >
              <Settings size={16} />
            </button>
            <button
              onClick={() => onDelete(course._id)}
              className="text-red-600 hover:text-red-800"
              title="Delete Course"
            >
              <Trash size={16} />
            </button>
          </div>
          
          <div className="space-x-2">
            <button
              onClick={() => onViewStudents(course._id)}
              className="text-gray-600 hover:text-gray-800"
              title="View Enrolled Students"
            >
              <Users size={16} />
            </button>
            <button
              onClick={() => window.location.href = `/courses/${course._id}`}
              className="text-gray-600 hover:text-gray-800"
              title="Preview Course"
            >
              <Eye size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get a color based on category
const getCourseBgColor = (category) => {
  const colors = {
    'Computer Science': 'from-blue-500 to-indigo-600',
    'Mathematics': 'from-emerald-500 to-teal-600',
    'Business': 'from-amber-500 to-orange-600',
    'Marketing': 'from-pink-500 to-rose-600',
    'Ethics': 'from-purple-500 to-violet-600',
    'Science': 'from-cyan-500 to-blue-600',
    'Languages': 'from-lime-500 to-green-600',
    'Arts': 'from-red-500 to-pink-600'
  };
  
  return colors[category] || 'from-gray-500 to-gray-600';
};

const InstructorCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [filterActive, setFilterActive] = useState('all');
  
  useEffect(() => {
    fetchCourses();
  }, []);
  
  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getInstructorCourses();
      setCourses(data);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateCourse = (course) => {
    setCourses([...courses, course]);
    setSuccessMessage('Course created successfully!');
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };
  
  const handleEditCourse = (courseId) => {
    // Navigate to edit page or open edit dialog
    window.location.href = `/instructor/courses/${courseId}/edit`;
  };
  
  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      try {
        await deleteCourse(courseId);
        setCourses(courses.filter(course => course._id !== courseId));
        setSuccessMessage('Course deleted successfully!');
        
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      } catch (err) {
        console.error('Error deleting course:', err);
        setError('Failed to delete course. Please try again.');
      }
    }
  };
  
  const handleToggleStatus = async (courseId, isActive) => {
    try {
      await updateCourseActiveStatus(courseId, isActive);
      
      // Update course status in local state
      setCourses(courses.map(course => 
        course._id === courseId 
          ? { ...course, isActive } 
          : course
      ));
      
      setSuccessMessage(`Course ${isActive ? 'activated' : 'deactivated'} successfully!`);
      
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (err) {
      console.error('Error updating course status:', err);
      setError('Failed to update course status. Please try again.');
    }
  };
  
  const handleViewStudents = (courseId) => {
    // Navigate to students view
    window.location.href = `/instructor/courses/${courseId}/students`;
  };
  
  // Filter courses by active status
  const filteredCourses = courses.filter(course => {
    if (filterActive === 'all') return true;
    return filterActive === 'active' ? course.isActive : !course.isActive;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Courses</h1>
        <button
          onClick={() => setShowCreateDialog(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Create New Course
        </button>
      </div>
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}
      
      {/* Filter Controls */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setFilterActive('all')}
          className={`px-4 py-2 rounded-lg text-sm ${
            filterActive === 'all' 
              ? 'bg-blue-100 text-blue-800 font-medium'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          All Courses
        </button>
        <button
          onClick={() => setFilterActive('active')}
          className={`px-4 py-2 rounded-lg text-sm ${
            filterActive === 'active' 
              ? 'bg-green-100 text-green-800 font-medium'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilterActive('inactive')}
          className={`px-4 py-2 rounded-lg text-sm ${
            filterActive === 'inactive' 
              ? 'bg-gray-700 text-white font-medium'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          Inactive
        </button>
      </div>
      
      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your courses...</p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <Book size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filterActive !== 'all' 
              ? `No ${filterActive} courses found` 
              : "You haven't created any courses yet"}
          </h3>
          <p className="text-gray-600 mb-6">
            {filterActive !== 'all' 
              ? `You don't have any ${filterActive} courses. Change the filter to see other courses.` 
              : "Create your first course to start teaching on the platform."}
          </p>
          <button
            onClick={() => setShowCreateDialog(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-flex items-center"
          >
            <Plus size={16} className="mr-2" />
            Create Course
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <CourseCard 
              key={course._id} 
              course={course} 
              onEdit={handleEditCourse}
              onDelete={handleDeleteCourse}
              onToggleStatus={handleToggleStatus}
              onViewStudents={handleViewStudents}
            />
          ))}
        </div>
      )}
      
      {/* Course Creation Dialog */}
      <CourseCreationDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onCourseCreated={handleCreateCourse}
      />
    </div>
  );
};

export default InstructorCoursesPage;