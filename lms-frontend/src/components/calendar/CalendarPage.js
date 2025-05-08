import React from 'react';
import { mockCalendarEvents } from '../../data/mockData';

// Calendar Event Item Component
const CalendarEventItem = ({ event }) => {
  return (
    <div className="p-4 hover:bg-gray-50">
      <h4 className="font-medium text-gray-900">{event.title}</h4>
      <div className="flex justify-between items-center mt-1">
        <p className="text-sm text-gray-500">{event.course}</p>
        <p className="text-sm text-gray-500">{event.date}</p>
      </div>
    </div>
  );
};

// Main Calendar Page Component
const CalendarPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <div className="flex space-x-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
            Add Event
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
      
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        {/* Calendar Grid - Simplified Version */}
        <div className="lg:col-span-5 bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-center mb-4">
            <h2 className="text-xl font-semibold">September 2025</h2>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
            {Array.from({ length: 30 }, (_, i) => i + 1).map(date => (
              <div 
                key={date} 
                className={`
                  h-24 border border-gray-100 p-1 text-sm
                  ${date === 15 ? 'bg-blue-50 border-blue-200' : ''}
                `}
              >
                <div className="font-medium">{date}</div>
                {date === 15 && (
                  <div className="mt-1 p-1 bg-blue-100 text-blue-800 text-xs rounded">
                    Research Paper Due
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Upcoming Events */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">Upcoming Events</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {mockCalendarEvents.map(event => (
              <CalendarEventItem key={event.id} event={event} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;