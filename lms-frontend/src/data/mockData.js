// Mock data for the LMS application

export const mockCourses = [
  { 
    id: 1, 
    title: 'Introduction to Computer Science', 
    instructor: 'Dr. Alan Turing', 
    enrolled: 156, 
    progress: 0.75, 
    img: '',
    color: 'from-blue-500 to-indigo-600',
    description: 'Learn the fundamental concepts of computer science including algorithms, data structures, and programming basics.'
  },
  { 
    id: 2, 
    title: 'Advanced Mathematics', 
    instructor: 'Dr. Katherine Johnson', 
    enrolled: 89, 
    progress: 0.4, 
    img: '',
    color: 'from-purple-500 to-pink-600',
    description: 'Explore complex mathematical concepts including calculus, linear algebra, and differential equations.'
  },
  { 
    id: 3, 
    title: 'Digital Marketing Fundamentals', 
    instructor: 'Prof. Sarah Miller', 
    enrolled: 210, 
    progress: 0.6, 
    img: '',
    color: 'from-emerald-500 to-teal-600',
    description: 'Master modern digital marketing strategies, social media tactics, and analytics for business growth.'
  },
  { 
    id: 4, 
    title: 'Business Ethics', 
    instructor: 'Dr. Michael Rodriguez', 
    enrolled: 130, 
    progress: 0.2, 
    img: '',
    color: 'from-amber-500 to-orange-600',
    description: 'Examine ethical principles in business environments and develop professional decision-making skills.'
  }
];

export const mockAnnouncements = [
  { 
    id: 1, 
    title: 'System Maintenance', 
    content: 'The LMS will be undergoing maintenance this Saturday from 2-4 AM EST.', 
    date: '2 hours ago',
    priority: 'medium'
  },
  { 
    id: 2, 
    title: 'New Feature: Live Sessions', 
    content: "We've added support for live classroom sessions! Check the guide for details.", 
    date: '1 day ago',
    priority: 'high'
  },
  { 
    id: 3, 
    title: 'Fall Semester Registration Open', 
    content: 'Registration for fall semester courses is now open. Early enrollment ends August 31.', 
    date: '3 days ago',
    priority: 'low'
  }
];

export const mockAssignments = [
  { 
    id: 1, 
    title: 'Research Paper', 
    course: 'Business Ethics', 
    dueDate: 'Sep 15, 2025', 
    status: 'Not Started',
    points: 100,
    type: 'Paper' 
  },
  { 
    id: 2, 
    title: 'Programming Project', 
    course: 'Introduction to Computer Science', 
    dueDate: 'Sep 10, 2025', 
    status: 'In Progress',
    points: 150,
    type: 'Project'
  },
  { 
    id: 3, 
    title: 'Marketing Campaign Analysis', 
    course: 'Digital Marketing Fundamentals', 
    dueDate: 'Sep 05, 2025', 
    status: 'Completed',
    points: 80,
    type: 'Analysis'
  }
];

export const mockCalendarEvents = [
  { id: 1, title: 'Live Lecture: CS Fundamentals', date: 'Today, 10:00 AM', course: 'Introduction to Computer Science' },
  { id: 2, title: 'Group Project Meeting', date: 'Today, 2:30 PM', course: 'Digital Marketing Fundamentals' },
  { id: 3, title: 'Assignment Deadline', date: 'Tomorrow, 11:59 PM', course: 'Advanced Mathematics' },
  { id: 4, title: 'Office Hours', date: 'Friday, 1:00 PM', course: 'Business Ethics' }
];

export const mockDiscussions = [
  { 
    id: 1, 
    title: 'Introduction and Welcome Thread', 
    course: 'Introduction to Computer Science', 
    replies: 24, 
    lastActivity: '2 hours ago',
    unread: true 
  },
  { 
    id: 2, 
    title: 'Assignment #2 Questions', 
    course: 'Advanced Mathematics', 
    replies: 8, 
    lastActivity: '1 day ago',
    unread: false
  },
  { 
    id: 3, 
    title: 'Marketing Strategy Project Ideas', 
    course: 'Digital Marketing Fundamentals', 
    replies: 15, 
    lastActivity: '3 days ago',
    unread: true
  }
];