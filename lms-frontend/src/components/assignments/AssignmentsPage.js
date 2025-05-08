import React from 'react';
import { CheckCircle, Clock, X } from 'lucide-react';
import { mockAssignments } from '../../data/mockData';

// Assignment Item Component
const AssignmentItem = ({ assignment }) => {
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
          <p className="text-sm text-gray-600 mt-2">
            Type: {assignment.type} • Points: {assignment.points}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-sm text-gray-500 mb-2">Due: {assignment.dueDate}</div>
          {getStatusBadge(assignment.status)}
        </div>
      </div>
    </div>
  );
};

// Main Assignments Page Component
const AssignmentsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Assignments</h1>
        <div className="flex space-x-4">
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option>All Courses</option>
            <option>Introduction to Computer Science</option>
            <option>Advanced Mathematics</option>
            <option>Digital Marketing Fundamentals</option>
            <option>Business Ethics</option>
          </select>
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option>All Statuses</option>
            <option>Completed</option>
            <option>In Progress</option>
            <option>Not Started</option>
          </select>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-200">
          {mockAssignments.map(assignment => (
            <AssignmentItem key={assignment.id} assignment={assignment} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssignmentsPage;