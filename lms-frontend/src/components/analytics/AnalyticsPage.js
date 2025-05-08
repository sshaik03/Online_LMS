import React from 'react';
import { Activity, Users, Clock, Award } from 'lucide-react';

// Stat Card Component
const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <div className="flex justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// Chart Component (Placeholder)
const ChartPlaceholder = ({ title, height = 'h-64' }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-medium text-gray-900">{title}</h3>
      </div>
      <div className={`${height} flex items-center justify-center bg-gray-50`}>
        <div className="text-center p-6">
          <Activity size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">Chart visualization will appear here</p>
        </div>
      </div>
    </div>
  );
};

// Main Analytics Page Component
const AnalyticsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <div className="flex space-x-4">
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>This Year</option>
          </select>
          <button className="border border-gray-300 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm">
            Export Report
          </button>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Students" 
          value="1,245" 
          icon={<Users size={24} />} 
          color="bg-blue-100 text-blue-600" 
        />
        <StatCard 
          title="Course Completion" 
          value="68%" 
          icon={<Award size={24} />} 
          color="bg-green-100 text-green-600" 
        />
        <StatCard 
          title="Avg. Time Spent" 
          value="4.2h" 
          icon={<Clock size={24} />} 
          color="bg-purple-100 text-purple-600" 
        />
        <StatCard 
          title="Active Courses" 
          value="24" 
          icon={<Activity size={24} />} 
          color="bg-amber-100 text-amber-600" 
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartPlaceholder title="Course Engagement" />
        <ChartPlaceholder title="Student Progress" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartPlaceholder title="Popular Courses" height="h-80" />
        <ChartPlaceholder title="Assignment Completion" height="h-80" />
        <ChartPlaceholder title="Discussion Activity" height="h-80" />
      </div>
    </div>
  );
};

export default AnalyticsPage;