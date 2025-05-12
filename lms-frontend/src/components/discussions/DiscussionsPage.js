import React, { useState, useEffect } from 'react';
import { discussionApi } from '../../services/api';
import { useUser } from '../../context/UserContext';
import NewDiscussionModal from './NewDiscussionModal';
import axios from 'axios';

// Discussion Detail Component
const DiscussionDetail = ({ discussion, onClose, onReplyAdded }) => {
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { userRole } = useUser();

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    
    if (!replyContent.trim()) {
      setError('Reply content cannot be empty');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      
      // Get the user object from localStorage and extract the token
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData || !userData.token) {
        setError('Authentication required');
        setIsSubmitting(false);
        return;
      }
      
      // Use axios directly with authentication header
      const response = await axios.post(`http://localhost:3001/api/discussions/${discussion._id}/reply`, {
        content: replyContent
      }, {
        headers: {
          Authorization: `Bearer ${userData.token}`
        }
      });
      
      setIsSubmitting(false);
      setReplyContent('');
      
      // Notify parent component about the new reply
      if (onReplyAdded) {
        onReplyAdded(response.data);
      }
    } catch (err) {
      setIsSubmitting(false);
      setError(err.response?.data?.message || 'Failed to add reply');
      console.error('Error adding reply:', err);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Header with close button */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">{discussion.title}</h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Main discussion content */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-start mb-4">
          <span className="text-sm text-gray-600">
            Posted by {discussion.author?.username || 'Anonymous'} on {formatDate(discussion.createdAt)}
          </span>
          {discussion.tags && discussion.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {discussion.tags.map((tag, index) => (
                <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <p className="text-gray-800 whitespace-pre-line">{discussion.content}</p>
      </div>
      
      {/* Replies section */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h3 className="font-medium text-gray-900">
          {discussion.replies?.length || 0} {discussion.replies?.length === 1 ? 'Reply' : 'Replies'}
        </h3>
      </div>
      
      <div className="divide-y divide-gray-200">
        {discussion.replies && discussion.replies.length > 0 ? (
          discussion.replies.map((reply, index) => (
            <div key={index} className="p-6">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-gray-900">
                  {reply.author?.username || 'Anonymous'}
                </span>
                <span className="text-sm text-gray-500">
                  {formatDate(reply.createdAt)}
                </span>
              </div>
              <p className="text-gray-800 whitespace-pre-line">{reply.content}</p>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-gray-500">
            No replies yet. Be the first to reply!
          </div>
        )}
      </div>
      
      {/* Reply form */}
      <div className="p-6 bg-gray-50">
        <h3 className="font-medium text-gray-900 mb-3">Add a Reply</h3>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmitReply}>
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Write your reply here..."
            required
          ></textarea>
          
          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Reply'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DiscussionItem = ({ discussion, onClick }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div 
      className="p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{discussion.title}</h3>
          <p className="mt-1 text-sm text-gray-600 line-clamp-2">{discussion.content}</p>
          <div className="mt-2 flex items-center">
            <span className="text-sm text-gray-500">
              Posted by {discussion.author?.username || 'Anonymous'} on {formatDate(discussion.createdAt)}
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {discussion.replies?.length || 0} replies
          </span>
        </div>
      </div>
      {discussion.tags && discussion.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {discussion.tags.map((tag, index) => (
            <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const DiscussionsPage = () => {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  
  useEffect(() => {
    fetchDiscussions();
  }, []);

  const fetchDiscussions = async () => {
    try {
      setLoading(true);
      const response = selectedCourse 
        ? await discussionApi.getByCourse(selectedCourse)
        : await discussionApi.getAll();
      
      setDiscussions(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching discussions:', err);
      setError('Failed to load discussions. Please try again later.');
      setLoading(false);
    }
  };

  const handleDiscussionCreated = (newDiscussion) => {
    setDiscussions([newDiscussion, ...discussions]);
  };

  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
    // Fetch discussions for the selected course
    if (e.target.value) {
      fetchDiscussionsByCourse(e.target.value);
    } else {
      fetchDiscussions();
    }
  };

  const fetchDiscussionsByCourse = async (courseId) => {
    try {
      setLoading(true);
      const response = await discussionApi.getByCourse(courseId);
      setDiscussions(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching discussions by course:', err);
      setError('Failed to load discussions for this course.');
      setLoading(false);
    }
  };

  const handleDiscussionClick = async (discussion) => {
    try {
      // Fetch the full discussion with replies
      const response = await discussionApi.getById(discussion._id);
      setSelectedDiscussion(response.data);
    } catch (err) {
      console.error('Error fetching discussion details:', err);
      // Show the discussion anyway with what we have
      setSelectedDiscussion(discussion);
    }
  };

  const handleReplyAdded = (updatedDiscussion) => {
    // Update the selected discussion with the new reply
    setSelectedDiscussion(updatedDiscussion);
    
    // Also update the discussion in the list
    setDiscussions(discussions.map(disc => 
      disc._id === updatedDiscussion._id ? updatedDiscussion : disc
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Discussions</h1>
        <div className="flex space-x-4">
          <select
            value={selectedCourse}
            onChange={handleCourseChange}
            className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">All Courses</option>
            <option value="60a1b5b9c6d7b32b4c9e5f2a">Introduction to Computer Science</option>
            <option value="60a1b5c3c6d7b32b4c9e5f2b">Data Structures and Algorithms</option>
            <option value="60a1b5cdc6d7b32b4c9e5f2c">Web Development</option>
            <option value="60a1b5d7c6d7b32b4c9e5f2d">Database Systems</option>
          </select>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create New Discussion
          </button>
        </div>
      </div>

      {/* Selected Discussion Detail View */}
      {selectedDiscussion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <DiscussionDetail 
              discussion={selectedDiscussion} 
              onClose={() => setSelectedDiscussion(null)}
              onReplyAdded={handleReplyAdded}
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-lg font-medium text-gray-500">Loading discussions...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      ) : discussions.length === 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md p-6 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No discussions</h3>
          <p className="mt-1 text-sm text-gray-500">
            {selectedCourse ? 'No discussions found for this course.' : 'Get started by creating a new discussion.'}
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Create New Discussion
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {discussions.map((discussion) => (
              <li key={discussion._id}>
                <DiscussionItem 
                  discussion={discussion} 
                  onClick={() => handleDiscussionClick(discussion)}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      <NewDiscussionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDiscussionCreated={handleDiscussionCreated}
      />
    </div>
  );
};

export default DiscussionsPage;