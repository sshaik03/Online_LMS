import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, X, Plus } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import AssignmentDialog from './AssignmentDialog';
// Update your imports at the top of the file
import { getAssignments, createAssignment, completeAssignment } from '../../services/assignmentService';
import { getInstructorCourses, getEnrolledCourses } from '../../services/courseService';

const AssignmentItem = ({ assignment, isStudent, onComplete }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="p-4 border-b border-gray-200 hover:bg-gray-50">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-medium text-gray-900">{assignment.title}</h4>
          <p className="text-sm text-gray-500 mt-1">
            {assignment.courseName || assignment.course?.title || 'Unknown Course'}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Type: {assignment.type} • Points: {assignment.points}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-sm text-gray-500 mb-2">
            Due: {formatDate(assignment.dueDate)}
          </div>
          {isStudent && assignment.status !== 'Completed' && (
            <button
              onClick={() => onComplete(assignment._id)}
              className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700"
            >
              Complete Assignment
            </button>
          )}
          {!isStudent && (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
              ${assignment.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                assignment.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                'bg-gray-100 text-gray-800'}`}>
              {assignment.status}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const AssignmentsPage = () => {
  const { user, isLoggedIn } = useUser();
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const isInstructor = user?.role === 'instructor';
  const isStudent = user?.role === 'student';

  // Add this function to check enrollments
  const checkEnrollments = async () => {
    try {
      // You'll need to create this function in your courseService.js
      const enrolledCourses = await getEnrolledCourses();
      console.log("Student enrolled courses:", enrolledCourses);
      
      if (enrolledCourses.length === 0) {
        setError('You are not enrolled in any courses. Enroll in courses to see assignments.');
      }
    } catch (err) {
      console.error('Error checking enrollments:', err);
    }
  };

  // Call this in useEffect
  useEffect(() => {
    if (isLoggedIn) {
      fetchAssignments();
      if (isInstructor) {
        fetchInstructorCourses();
      } else if (isStudent) {
        checkEnrollments();
      }
    }
  }, [isLoggedIn, isInstructor, isStudent]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      console.log("Fetching assignments for user:", user);
      console.log("User role:", user?.role);
      
      const data = await getAssignments();
      console.log("Fetched assignments:", data);
      setAssignments(data);
      setError(null);
    } catch (err) {
      setError('Failed to load assignments');
      console.error('Error fetching assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInstructorCourses = async () => {
    try {
      const data = await getInstructorCourses();
      setCourses(data);
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  const handleCreateAssignment = async (assignmentData) => {
    try {
      const newAssignment = await createAssignment(assignmentData);
      setAssignments([...assignments, newAssignment]);
      setIsDialogOpen(false);
    } catch (err) {
      setError('Failed to create assignment');
      console.error('Error creating assignment:', err);
    }
  };

  const handleCompleteAssignment = async (assignmentId) => {
    try {
      await completeAssignment(assignmentId);
      setAssignments(assignments.map(assignment =>
        assignment._id === assignmentId
          ? { ...assignment, status: 'Completed' }
          : assignment
      ));
    } catch (err) {
      setError('Failed to complete assignment');
      console.error('Error completing assignment:', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {isStudent ? 'My Assignments' : 'Manage Assignments'}
        </h1>
        {isInstructor && (
          <button
            onClick={() => setIsDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Create Assignment
          </button>
        )}
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-10">Loading assignments...</div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {assignments.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              {isStudent 
                ? "You don't have any assignments from your enrolled courses." 
                : "No assignments found."}
            </div>
          ) : (
            <div>
              {assignments.map(assignment => (
                <AssignmentItem
                  key={assignment._id || assignment.id}
                  assignment={assignment}
                  isStudent={isStudent}
                  onComplete={handleCompleteAssignment}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {isInstructor && (
        <AssignmentDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onCreateAssignment={handleCreateAssignment}
          courses={courses}
        />
      )}
    </div>
  );
};

export default AssignmentsPage;