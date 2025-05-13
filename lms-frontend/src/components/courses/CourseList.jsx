import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../../context/UserContext';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ title: '', description: '' });
  const [enrollmentCode, setEnrollmentCode] = useState('');
  const { user } = useUser();

  // Add this check
  useEffect(() => {
    if (!user) {
      return;
    }
    fetchCourses();
  }, [user]);

  // Modify the handleCreateCourse function
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      await axios.post('http://localhost:3001/api/courses', newCourse, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      fetchCourses();
      setNewCourse({ title: '', description: '' });
    } catch (error) {
      console.error('Error creating course:', error.response?.data || error.message);
      // Add error handling UI feedback here
    }
  };

  // Add a loading state
  const [isLoading, setIsLoading] = useState(true);

  // Modify the fetchCourses function
  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await axios.get('http://localhost:3001/api/courses', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Add loading state to the render
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in to view courses</div>;
  }

  const handleEnroll = async (courseId) => {
    try {
      await axios.post(`http://localhost:3001/api/courses/enroll/${courseId}`, 
        { enrollmentCode },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      );
      fetchCourses();
      setEnrollmentCode('');
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Courses</h2>
      
      {user.role === 'instructor' && (
        <div className="mb-8 p-4 bg-white rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Create New Course</h3>
          <form onSubmit={handleCreateCourse}>
            <input
              type="text"
              placeholder="Course Title"
              value={newCourse.title}
              onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
              className="w-full p-2 mb-4 border rounded"
            />
            <textarea
              placeholder="Course Description"
              value={newCourse.description}
              onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
              className="w-full p-2 mb-4 border rounded"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Create Course
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course._id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
            <p className="text-gray-600 mb-4">{course.description}</p>
            
            {user.role === 'student' && (
              <div>
                <input
                  type="text"
                  placeholder="Enter enrollment code"
                  value={enrollmentCode}
                  onChange={(e) => setEnrollmentCode(e.target.value)}
                  className="w-full p-2 mb-2 border rounded"
                />
                <button
                  onClick={() => handleEnroll(course._id)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Enroll
                </button>
              </div>
            )}

            {user.role === 'instructor' && course.enrollmentCode && (
              <div className="mt-4 p-2 bg-gray-100 rounded">
                <p className="text-sm">Enrollment Code: {course.enrollmentCode}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList;