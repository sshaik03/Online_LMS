// lms-frontend/src/components/courses/CourseCreationDialog.js
import React, { useState } from 'react';
import { X, Save, Calendar, Book, Tag, FileText, User } from 'lucide-react';
import { createCourse } from '../../services/courseService';

const CourseCreationDialog = ({ isOpen, onClose, onCourseCreated }) => {
  const initialFormState = {
    title: '',
    description: '',
    category: 'Other',
    startDate: '',
    endDate: '',
    isActive: true,
    modules: [{ title: '', content: '', resources: [] }]
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState('basic');

  // Categories for dropdown
  const categories = [
    'Computer Science',
    'Mathematics',
    'Business',
    'Marketing',
    'Ethics',
    'Science',
    'Languages',
    'Arts',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when field is modified
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleModuleChange = (index, field, value) => {
    const updatedModules = [...formData.modules];
    updatedModules[index] = {
      ...updatedModules[index],
      [field]: value
    };
    
    setFormData({
      ...formData,
      modules: updatedModules
    });
  };

  const addModule = () => {
    setFormData({
      ...formData,
      modules: [
        ...formData.modules,
        { title: '', content: '', resources: [] }
      ]
    });
  };

  const removeModule = (index) => {
    const updatedModules = [...formData.modules];
    updatedModules.splice(index, 1);
    setFormData({
      ...formData,
      modules: updatedModules
    });
  };

  const validateForm = () => {
    const newErrors = {};

    // Basic validation
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    
    // Module validation (if on the modules tab)
    if (currentTab === 'modules') {
      const moduleErrors = formData.modules.map(module => {
        if (!module.title.trim()) return { title: 'Module title is required' };
        return null;
      });
      
      if (moduleErrors.some(error => error !== null)) {
        newErrors.modules = moduleErrors;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      // Format dates properly for API
      const formattedData = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null
      };
      
      const response = await createCourse(formattedData);
      
      onCourseCreated(response.course);
      onClose();
      resetForm();
    } catch (err) {
      console.error('Error creating course:', err);
      setErrors({
        ...errors,
        submit: err.response?.data?.message || 'Failed to create course. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setErrors({});
    setCurrentTab('basic');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl my-8 overflow-hidden relative">
        {/* Dialog Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Create New Course</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setCurrentTab('basic')}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                currentTab === 'basic'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Basic Information
            </button>
            <button
              onClick={() => setCurrentTab('modules')}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                currentTab === 'modules'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Course Modules
            </button>
          </nav>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {/* Error Message */}
            {errors.submit && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {errors.submit}
              </div>
            )}

            {currentTab === 'basic' && (
              <div className="space-y-6">
                {/* Course Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Course Title <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="title"
                      name="title"
                      type="text"
                      value={formData.title}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 border ${errors.title ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="e.g., Introduction to Web Development"
                    />
                    <Book className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                {/* Course Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Course Description <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className={`w-full pl-10 pr-4 py-2 border ${errors.description ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="Provide a detailed description of your course"
                    />
                    <FileText className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    <Tag className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                {/* Dates Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Start Date */}
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="startDate"
                        name="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2 border ${errors.startDate ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      />
                      <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                    {errors.startDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
                    )}
                  </div>

                  {/* End Date */}
                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                      End Date (Optional)
                    </label>
                    <div className="relative">
                      <input
                        id="endDate"
                        name="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Active Status */}
                <div className="flex items-center">
                  <input
                    id="isActive"
                    name="isActive"
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                    Make course available for enrollment
                  </label>
                </div>
              </div>
            )}

            {currentTab === 'modules' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-medium text-gray-900">Course Modules</h4>
                  <button
                    type="button"
                    onClick={addModule}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200"
                  >
                    + Add Module
                  </button>
                </div>

                {formData.modules.map((module, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h5 className="font-medium text-gray-700">Module {index + 1}</h5>
                      {formData.modules.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeModule(index)}
                          className="text-red-600 text-sm hover:text-red-800"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    {/* Module Title */}
                    <div className="mb-4">
                      <label htmlFor={`module-title-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Module Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        id={`module-title-${index}`}
                        type="text"
                        value={module.title}
                        onChange={(e) => handleModuleChange(index, 'title', e.target.value)}
                        className={`w-full px-4 py-2 border ${
                          errors.modules && errors.modules[index]?.title ? 'border-red-300' : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="e.g., Getting Started with HTML"
                      />
                      {errors.modules && errors.modules[index]?.title && (
                        <p className="mt-1 text-sm text-red-600">{errors.modules[index].title}</p>
                      )}
                    </div>

                    {/* Module Content */}
                    <div>
                      <label htmlFor={`module-content-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Module Content
                      </label>
                      <textarea
                        id={`module-content-${index}`}
                        value={module.content}
                        onChange={(e) => handleModuleChange(index, 'content', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Describe what this module covers"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dialog Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between">
            <div>
              {currentTab === 'modules' && (
                <button
                  type="button"
                  onClick={() => setCurrentTab('basic')}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Back
                </button>
              )}
            </div>
            <div className="flex">
              <button
                type="button"
                onClick={onClose}
                className="mr-3 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              
              {currentTab === 'basic' ? (
                <button
                  type="button"
                  onClick={() => {
                    if (validateForm()) setCurrentTab('modules');
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center"
                >
                  Next: Add Modules
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg text-white flex items-center ${
                    loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {loading ? (
                    <>
                      <span className="inline-block animate-spin mr-2">●</span>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save size={18} className="mr-2" />
                      Create Course
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseCreationDialog;