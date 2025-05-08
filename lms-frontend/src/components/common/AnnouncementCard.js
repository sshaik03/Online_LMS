import React from 'react';
import { Bell, Calendar } from 'lucide-react';

const AnnouncementCard = ({ announcement }) => {
  const { title, content, date, type, author } = announcement;

  const getTypeStyles = () => {
    switch (type) {
      case 'important':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'course':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'event':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-sm transition-shadow">
      <div className="p-4">
        {/* Announcement Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <Bell className="w-5 h-5 text-gray-400 mr-2" />
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${getTypeStyles()}`}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date(date).toLocaleDateString()}
          </div>
        </div>

        {/* Announcement Content */}
        <h4 className="font-medium text-gray-900 mb-2">{title}</h4>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{content}</p>

        {/* Announcement Footer */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            Posted by <span className="text-gray-900">{author}</span>
          </span>
          <button className="text-blue-600 hover:text-blue-800 font-medium">
            Read More
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementCard;