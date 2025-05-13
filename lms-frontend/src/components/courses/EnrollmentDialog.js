import React, { useState } from 'react';
import { X, Check, AlertCircle } from 'lucide-react';
import { enrollWithCode } from '../../services/enrollmentService';

const EnrollmentDialog = ({ isOpen, onClose, onEnrollmentSuccess }) => {
  const [enrollmentCode, setEnrollmentCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!enrollmentCode.trim()) {
      setError('Please enter an enrollment code');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await enrollWithCode(enrollmentCode.trim());
      
      // Handle successful enrollment
      if (onEnrollmentSuccess) {
        onEnrollmentSuccess(result.course);
      }
      
      // Reset form and close dialog
      setEnrollmentCode('');
      onClose();
    } catch (err) {
      console.error('Error enrolling in course:', err);
      setError(
        err.response?.data?.message || 
        'Failed to enroll in course. Please check the enrollment code and try again.'
      );
    } finally {
      setLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        {/* Dialog Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Enroll in a Course</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Dialog Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
              <AlertCircle size={20} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          <div className="mb-6">
            <label htmlFor="enrollmentCode" className="block text-sm font-medium text-gray-700 mb-1">
              Course Enrollment Code
            </label>
            <input
              id="enrollmentCode"
              type="text"
              value={enrollmentCode}
              onChange={(e) => setEnrollmentCode(e.target.value)}
              placeholder="Enter the code provided by your instructor"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              autoComplete="off"
            />
            <p className="mt-1 text-sm text-gray-500">
              This code was provided by your instructor to join their course.
            </p>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center"
            >
              {loading ? (
                <>
                  <span className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Enrolling...
                </>
              ) : (
                <>
                  <Check size={16} className="mr-2" />
                  Enroll
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnrollmentDialog;