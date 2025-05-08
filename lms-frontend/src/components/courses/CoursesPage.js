import React from 'react';
import { Book } from 'lucide-react';
import { mockCourses } from '../../data/mockData';

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

// Main Courses Page Component
const CoursesPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Courses</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
          <span className="mr-2">Enroll in New Course</span>
          <span className="text-lg">+</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCourses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;