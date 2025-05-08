import React from 'react';
import { Activity, Book, FileText, MessageSquare, Calendar, User } from 'lucide-react';

const ActivityIcon = ({ type }) => {
  const iconProps = { className: 'w-5 h-5' };
  switch (type) {
    case 'course':
      return <Book {...iconProps} />;
    case 'assignment':
      return <FileText {...iconProps} />;
    case 'discussion':
      return <MessageSquare {...iconProps} />;
    case 'event':
      return <Calendar {...iconProps} />;
    case 'user':
      return <User {...iconProps} />;
    default:
      return <Activity {...iconProps} />;
  }
};

const ActivityItem = ({ activity }) => {
  const { type, title, description, time, status } = activity;

  const getStatusStyles = () => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex space-x-4 p-4 hover:bg-gray-50 transition-colors">
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${type === 'course' ? 'bg-blue-100' : 'bg-gray-100'}`}>
        <ActivityIcon type={type} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
          <span className="text-xs text-gray-500">{time}</span>
        </div>
        <p className="text-sm text-gray-500 line-clamp-2 mt-1">{description}</p>
        {status && (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${getStatusStyles()}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        )}
      </div>
    </div>
  );
};

const ActivityFeed = ({ activities, title = 'Activity Feed', emptyMessage = 'No recent activities' }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Feed Header */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
      </div>

      {/* Feed Content */}
      <div className="divide-y divide-gray-200">
        {activities && activities.length > 0 ? (
          activities.map((activity, index) => (
            <ActivityItem key={index} activity={activity} />
          ))
        ) : (
          <div className="p-4 text-center text-sm text-gray-500">
            {emptyMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;