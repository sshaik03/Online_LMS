import React from 'react';
import { mockDiscussions } from '../../data/mockData';

// Discussion Item Component
const DiscussionItem = ({ discussion }) => {
  return (
    <div className="p-4 hover:bg-gray-50">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium text-gray-900 flex items-center">
            {discussion.title}
            {discussion.unread && (
              <span className="ml-2 w-2 h-2 bg-blue-600 rounded-full"></span>
            )}
          </h4>
          <p className="text-sm text-gray-500 mt-1">{discussion.course}</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">{discussion.replies} replies</div>
          <div className="text-xs text-gray-500 mt-1">{discussion.lastActivity}</div>
        </div>
      </div>
    </div>
  );
};

// Main Discussions Page Component
const DiscussionsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Discussions</h1>
        <div className="flex space-x-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
            Start New Discussion
          </button>
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option>All Courses</option>
            <option>Introduction to Computer Science</option>
            <option>Advanced Mathematics</option>
            <option>Digital Marketing Fundamentals</option>
            <option>Business Ethics</option>
          </select>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-200">
          {mockDiscussions.map(discussion => (
            <DiscussionItem key={discussion.id} discussion={discussion} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiscussionsPage;