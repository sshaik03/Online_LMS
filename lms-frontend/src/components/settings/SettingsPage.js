import React, { useState } from 'react';
import { User, Bell, Lock, Globe, Monitor } from 'lucide-react';

// Settings Tab Component
const SettingsTab = ({ icon, label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-3 p-3 w-full rounded-lg text-left transition-colors ${active ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
    >
      <span className={`${active ? 'text-blue-600' : 'text-gray-500'}`}>{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
};

// Form Input Component
const FormInput = ({ label, type = 'text', placeholder, value, onChange }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
};

// Toggle Switch Component
const ToggleSwitch = ({ label, description, enabled, onChange }) => {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <h4 className="font-medium text-gray-900">{label}</h4>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-blue-600' : 'bg-gray-200'}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
        />
      </button>
    </div>
  );
};

// Main Settings Page Component
const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Student at Example University, majoring in Computer Science.'
  });
  
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    assignmentReminders: true,
    discussionAlerts: false,
    courseUpdates: true
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-medium text-gray-900">Settings</h3>
            </div>
            <div className="p-3 space-y-1">
              <SettingsTab 
                icon={<User size={20} />} 
                label="Profile" 
                active={activeTab === 'profile'} 
                onClick={() => setActiveTab('profile')} 
              />
              <SettingsTab 
                icon={<Bell size={20} />} 
                label="Notifications" 
                active={activeTab === 'notifications'} 
                onClick={() => setActiveTab('notifications')} 
              />
              <SettingsTab 
                icon={<Lock size={20} />} 
                label="Security" 
                active={activeTab === 'security'} 
                onClick={() => setActiveTab('security')} 
              />
              <SettingsTab 
                icon={<Globe size={20} />} 
                label="Language" 
                active={activeTab === 'language'} 
                onClick={() => setActiveTab('language')} 
              />
              <SettingsTab 
                icon={<Monitor size={20} />} 
                label="Appearance" 
                active={activeTab === 'appearance'} 
                onClick={() => setActiveTab('appearance')} 
              />
            </div>
          </div>
        </div>
        
        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6">
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
                  <div className="mb-6 flex items-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
                      JD
                    </div>
                    <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                      Change Photo
                    </button>
                  </div>
                  
                  <form>
                    <FormInput 
                      label="Full Name" 
                      placeholder="Enter your full name" 
                      value={formData.name} 
                      onChange={(e) => handleInputChange({ target: { name: 'name', value: e.target.value } })}
                    />
                    <FormInput 
                      label="Email Address" 
                      type="email" 
                      placeholder="Enter your email address" 
                      value={formData.email} 
                      onChange={(e) => handleInputChange({ target: { name: 'email', value: e.target.value } })}
                    />
                    <FormInput 
                      label="Phone Number" 
                      placeholder="Enter your phone number" 
                      value={formData.phone} 
                      onChange={(e) => handleInputChange({ target: { name: 'phone', value: e.target.value } })}
                    />
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                      <textarea
                        placeholder="Tell us about yourself"
                        value={formData.bio}
                        onChange={(e) => handleInputChange({ target: { name: 'bio', value: e.target.value } })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
                      />
                    </div>
                    <button type="button" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                      Save Changes
                    </button>
                  </form>
                </div>
              )}
              
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
                  <div className="space-y-3 divide-y divide-gray-100">
                    <ToggleSwitch 
                      label="Email Notifications" 
                      description="Receive email notifications for important updates" 
                      enabled={notifications.emailNotifications} 
                      onChange={() => toggleNotification('emailNotifications')} 
                    />
                    <ToggleSwitch 
                      label="Assignment Reminders" 
                      description="Get reminders before assignment due dates" 
                      enabled={notifications.assignmentReminders} 
                      onChange={() => toggleNotification('assignmentReminders')} 
                    />
                    <ToggleSwitch 
                      label="Discussion Alerts" 
                      description="Be notified when someone replies to your discussions" 
                      enabled={notifications.discussionAlerts} 
                      onChange={() => toggleNotification('discussionAlerts')} 
                    />
                    <ToggleSwitch 
                      label="Course Updates" 
                      description="Receive notifications about course content updates" 
                      enabled={notifications.courseUpdates} 
                      onChange={() => toggleNotification('courseUpdates')} 
                    />
                  </div>
                  <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                    Save Preferences
                  </button>
                </div>
              )}
              
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
                  <form>
                    <FormInput 
                      label="Current Password" 
                      type="password" 
                      placeholder="Enter your current password" 
                    />
                    <FormInput 
                      label="New Password" 
                      type="password" 
                      placeholder="Enter your new password" 
                    />
                    <FormInput 
                      label="Confirm New Password" 
                      type="password" 
                      placeholder="Confirm your new password" 
                    />
                    <button type="button" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                      Update Password
                    </button>
                  </form>
                </div>
              )}
              
              {activeTab === 'language' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Language Settings</h2>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Language</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="zh">Chinese</option>
                    </select>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                    Save Preferences
                  </button>
                </div>
              )}
              
              {activeTab === 'appearance' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Appearance Settings</h2>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="border border-blue-500 rounded-lg p-4 bg-white text-center">
                        <div className="h-20 bg-white border border-gray-200 rounded mb-2"></div>
                        <span className="text-sm font-medium">Light</span>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4 bg-white text-center">
                        <div className="h-20 bg-gray-900 rounded mb-2"></div>
                        <span className="text-sm font-medium">Dark</span>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4 bg-white text-center">
                        <div className="h-20 bg-gradient-to-b from-white to-gray-900 rounded mb-2"></div>
                        <span className="text-sm font-medium">System</span>
                      </div>
                    </div>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                    Save Preferences
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;