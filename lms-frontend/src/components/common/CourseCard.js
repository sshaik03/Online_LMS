import React from 'react';
import { Book, Users, Clock } from 'lucide-react';

const CourseCard = ({ course }) => {
  const { title, instructor, thumbnail, progress, totalStudents, duration, description } = course;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Course Thumbnail */}
      <div className="aspect-video bg-gray-100 relative overflow-hidden">
        {thumbnail ? (
          <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Book className="w-12 h-12 text-gray-400" />
          </div>
        )}
        {progress && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
            <div 
              className="h-full bg-green-500" 
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Course Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>

        <div className="flex items-center text-sm text-gray-500 mb-3">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            {totalStudents} students
          </div>
          <div className="flex items-center ml-4">
            <Clock className="w-4 h-4 mr-1" />
            {duration}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm">
            <span className="text-gray-500">Instructor:</span>
            <span className="ml-1 text-gray-900">{instructor}</span>
          </div>
          {progress && (
            <span className="text-sm font-medium text-green-600">
              {progress}% Complete
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;