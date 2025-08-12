/**
 * Main App Component for Learning Website
 * Provides authentication flow and main application dashboard
 * Includes comprehensive logging and state management
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Authentication from '@/components/Authentication';
import CoursesPage from '@/components/pages/CoursesPage';
import CourseViewer from '@/components/pages/CourseViewer';
import AnalyticsDashboard from '@/components/pages/AnalyticsDashboard';
import LearningProgress from '@/components/pages/LearningProgress';
import QuizPage from '@/components/pages/QuizPage';
import VideoPage from '@/components/pages/VideoPage';
import clickstreamService from '@/services/clickstreamService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Enhanced logger for app component
const appLogger = {
  info: (message, data = null) => {
    console.log(`🚀 [APP] ${message}`, data ? { data } : '');
  },
  success: (message, data = null) => {
    console.log(`✅ [APP] ${message}`, data ? { data } : '');
  },
  user: (message, data = null) => {
    console.log(`👤 [APP] ${message}`, data ? { data } : '');
  }
};

// Main Dashboard Component (shown when authenticated)
function Dashboard() {
  const { user, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  // Statistics state
  const [statistics, setStatistics] = useState({
    coursesEnrolled: 0,
    coursesCompleted: 0,
    studyHours: 0,
    achievements: 0,
    recentActivities: [],
    weeklyHours: 0,
    streak: 0,
    rank: 'Beginner',
    overallProgress: 0
  });

  appLogger.info('Dashboard component rendered', { user: user?.username, currentPage });

  // Initialize clickstream tracking and load statistics when Dashboard mounts
  useEffect(() => {
    if (user) {
      clickstreamService.initialize(user);
      appLogger.info('Clickstream tracking initialized for user', { 
        user: user?.username,
        userId: user?.id 
      });
      
      // Add small delay to ensure clickstream is fully initialized
      setTimeout(() => {
        loadUserStatistics();
      }, 500);
    }
  }, [user]);

  // Function to load user statistics from API
  const loadUserStatistics = async () => {
    try {
      const userId = user?.username || user?.id;
      appLogger.info('Loading user statistics', { 
        userId: userId,
        endpoint: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/clickstream/user/${userId}` 
      });
      
      // Fetch user's clickstream data to calculate statistics
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/clickstream/user/${userId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const userData = await response.json();
      
      appLogger.info('API response received', { 
        success: userData.success,
        totalActions: userData.totalActions,
        dataLength: userData.data?.length 
      });
      
      if (userData.success && userData.data) {
        const userActions = userData.data;
        
        // Calculate statistics from user actions
        const courseViews = userActions.filter(action => action.action === 'course_view');
        const quizStarts = userActions.filter(action => action.action === 'quiz_start');
        const quizCompletes = userActions.filter(action => action.action === 'quiz_complete');
        const videoPlays = userActions.filter(action => action.action === 'video_play');
        
        // Get unique courses viewed
        const uniqueCourses = [...new Set(courseViews.map(action => action.details?.courseId).filter(Boolean))];
        
        // Calculate study time from session durations (approximate)
        const sessionStartTimes = new Map();
        let totalStudyMinutes = 0;
        
        userActions.forEach(action => {
          const sessionId = action.sessionId;
          if (!sessionStartTimes.has(sessionId)) {
            sessionStartTimes.set(sessionId, new Date(action.timestamp));
          }
        });
        
        // Approximate 30 minutes per course viewed
        totalStudyMinutes = uniqueCourses.length * 30;
        
        // Get recent activities (last 10 actions)
        const recentActivities = userActions
          .slice(-10)
          .reverse()
          .map(action => ({
            id: action.id,
            action: action.action,
            details: action.details,
            timestamp: action.timestamp
          }));
        
        // Calculate achievements based on milestones
        let achievements = 0;
        if (uniqueCourses.length >= 1) achievements++; // First course viewed
        if (quizStarts.length >= 1) achievements++; // First quiz attempt
        if (videoPlays.length >= 1) achievements++; // First video watched
        if (quizCompletes.length >= 1) achievements++; // First quiz completed
        if (uniqueCourses.length >= 5) achievements++; // Course explorer
        
        // Calculate weekly hours (last 7 days)
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const weeklyActions = userActions.filter(action => 
          new Date(action.timestamp) >= weekAgo
        );
        const weeklyHours = Math.floor(weeklyActions.length * 5 / 60); // 5 minutes per action approx
        
        // Calculate streak (consecutive days with activity)
        const dailyActivity = new Map();
        userActions.forEach(action => {
          const date = new Date(action.timestamp).toDateString();
          dailyActivity.set(date, true);
        });
        
        let streak = 0;
        const today = new Date();
        let currentDate = new Date(today);
        
        while (dailyActivity.has(currentDate.toDateString())) {
          streak++;
          currentDate.setDate(currentDate.getDate() - 1);
        }
        
        // Determine rank based on activity
        let rank = 'Beginner';
        if (achievements >= 3) rank = 'Intermediate';
        if (achievements >= 5) rank = 'Advanced';
        if (achievements >= 7) rank = 'Expert';
        
        // Calculate overall progress (based on course completion)
        const overallProgress = Math.min(100, Math.floor((quizCompletes.length / Math.max(uniqueCourses.length, 1)) * 100));
        
        setStatistics({
          coursesEnrolled: uniqueCourses.length,
          coursesCompleted: quizCompletes.length,
          studyHours: Math.floor(totalStudyMinutes / 60),
          achievements,
          recentActivities,
          weeklyHours,
          streak,
          rank,
          overallProgress
        });
        
        appLogger.success('User statistics loaded successfully', {
          coursesEnrolled: uniqueCourses.length,
          achievements,
          studyHours: Math.floor(totalStudyMinutes / 60)
        });
      } else {
        // Show sample activities for new users
        const sampleActivities = [
          {
            id: 'sample-1',
            action: 'course_view',
            details: { courseTitle: 'Welcome to EduTrack Pro' },
            timestamp: new Date().toISOString()
          }
        ];
        
        setStatistics(prev => ({
          ...prev,
          recentActivities: sampleActivities
        }));
      }
    } catch (error) {
      appLogger.info('Error loading statistics, using defaults', { error: error.message });
      
      // Show welcome activity for completely new users
      const welcomeActivity = [
        {
          id: 'welcome-1',
          action: 'course_view',
          details: { courseTitle: 'Welcome to EduTrack Pro' },
          timestamp: new Date().toISOString()
        }
      ];
      
      setStatistics(prev => ({
        ...prev,
        recentActivities: welcomeActivity
      }));
    }
  };

  // Function to refresh statistics after user actions
  const refreshStatistics = () => {
    if (user) {
      setTimeout(() => {
        loadUserStatistics();
      }, 1000); // Small delay to ensure backend has processed the action
    }
  };

  const handleLogout = () => {
    appLogger.user('User initiated logout');
    clickstreamService.trackEvent('logout', { user: user?.username });
    logout();
  };

  // Navigation handlers
  const handleBrowseCourses = () => {
    appLogger.info('Navigating to courses page');
    clickstreamService.trackNavigation('dashboard', 'courses');
    clickstreamService.trackButtonClick('browse_courses', { from: 'dashboard' });
    setCurrentPage('courses');
    refreshStatistics();
  };

  const handleBackToDashboard = () => {
    appLogger.info('Navigating back to dashboard');
    clickstreamService.trackNavigation(currentPage, 'dashboard');
    clickstreamService.trackButtonClick('back_to_dashboard', { from: currentPage });
    setCurrentPage('dashboard');
    setSelectedCourse(null);
    refreshStatistics();
  };

  const handleBackToCourses = () => {
    appLogger.info('Navigating back to courses');
    clickstreamService.trackNavigation(currentPage, 'courses');
    clickstreamService.trackButtonClick('back_to_courses', { from: currentPage });
    setCurrentPage('courses');
    setSelectedCourse(null);
    refreshStatistics();
  };

  const handleSelectCourse = (course) => {
    appLogger.info('Course selected', { courseId: course.id });
    clickstreamService.trackNavigation('courses', 'course-view');
    clickstreamService.trackCourseView(course.id, course.title, course.type);
    clickstreamService.trackButtonClick('select_course', { 
      courseId: course.id, 
      courseTitle: course.title,
      courseType: course.type 
    });
    setSelectedCourse(course);
    setCurrentPage('course-view');
    refreshStatistics();
  };

  const handleViewAnalytics = () => {
    appLogger.info('Navigating to analytics dashboard');
    clickstreamService.trackNavigation('dashboard', 'analytics');
    clickstreamService.trackButtonClick('view_analytics', { from: 'dashboard' });
    setCurrentPage('analytics');
    refreshStatistics();
  };

  const handleViewProgress = () => {
    appLogger.info('Navigating to learning progress');
    clickstreamService.trackNavigation('dashboard', 'progress');
    clickstreamService.trackButtonClick('view_progress', { from: 'dashboard' });
    setCurrentPage('progress');
    refreshStatistics();
  };

  const handleTakeQuiz = () => {
    appLogger.info('Navigating to quiz section');
    clickstreamService.trackNavigation('dashboard', 'quiz');
    clickstreamService.trackButtonClick('take_quiz', { from: 'dashboard' });
    setCurrentPage('quiz');
    refreshStatistics();
  };

  const handleWatchVideos = () => {
    appLogger.info('Navigating to video section');
    clickstreamService.trackNavigation('dashboard', 'videos');
    clickstreamService.trackButtonClick('watch_videos', { from: 'dashboard' });
    setCurrentPage('videos');
    refreshStatistics();
  };

  // Render different pages based on currentPage state
  if (currentPage === 'courses') {
    return (
      <CoursesPage 
        onBack={handleBackToDashboard}
        onSelectCourse={handleSelectCourse}
      />
    );
  }

  if (currentPage === 'course-view' && selectedCourse) {
    return (
      <CourseViewer 
        course={selectedCourse}
        onBack={handleBackToCourses}
      />
    );
  }

  if (currentPage === 'analytics') {
    return (
      <AnalyticsDashboard 
        onBack={handleBackToDashboard}
      />
    );
  }

  if (currentPage === 'progress') {
    return (
      <LearningProgress 
        onBack={handleBackToDashboard}
      />
    );
  }

  if (currentPage === 'quiz') {
    return (
      <QuizPage 
        onBack={handleBackToDashboard}
        onSelectQuiz={handleSelectCourse}
      />
    );
  }

  if (currentPage === 'videos') {
    return (
      <VideoPage 
        onBack={handleBackToDashboard}
        onSelectVideo={handleSelectCourse}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-[radial-gradient(100%_50%_at_50%_0%,rgba(0,163,255,0.13)_0,rgba(0,163,255,0)_50%,rgba(0,163,255,0)_100%)]"></div>
      {/* Header */}
      <header className="bg-white/5 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-2 shadow-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">EduTrack Pro</h1>
                <p className="text-xs text-gray-400">Welcome back, {user?.username || 'learner'}!</p>
              </div>
            </div>

            {/* User Section */}
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-xs bg-blue-500/20 text-blue-300 border-blue-500/30">
                👤 {user?.role || 'learner'}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-white/10">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold">
                        {(user?.username || 'L')[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-gray-800/80 backdrop-blur-sm border-white/10 text-white" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-white">{user?.username}</p>
                      <p className="text-xs leading-none text-gray-400">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem className="cursor-pointer text-gray-300 focus:bg-white/10 focus:text-white">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer text-gray-300 focus:bg-white/10 focus:text-white">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Learning Progress
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer text-gray-300 focus:bg-white/10 focus:text-white">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Preferences
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-400 cursor-pointer focus:bg-red-500/20 focus:text-red-300">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-white tracking-tight">Your Learning Dashboard</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Track your progress, explore new content, and achieve your learning goals with personalized insights.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="flex items-center justify-between p-6">
                <div className="space-y-2">
                  <p className="text-blue-300 text-sm font-medium">Courses Enrolled</p>
                  <p className="text-3xl font-bold">{statistics.coursesEnrolled}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="flex items-center justify-between p-6">
                <div className="space-y-2">
                  <p className="text-green-300 text-sm font-medium">Completed</p>
                  <p className="text-3xl font-bold">{statistics.coursesCompleted}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="flex items-center justify-between p-6">
                <div className="space-y-2">
                  <p className="text-purple-300 text-sm font-medium">Study Hours</p>
                  <p className="text-3xl font-bold">{statistics.studyHours}h</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="flex items-center justify-between p-6">
                <div className="space-y-2">
                  <p className="text-orange-300 text-sm font-medium">Achievements</p>
                  <p className="text-3xl font-bold">{statistics.achievements}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Quick Actions */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Actions Card */}
              <Card className="shadow-xl border-0 bg-white/5 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-3 text-2xl">
                    <span className="text-3xl">🚀</span>
                    <span className="bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">Quick Actions</span>
                  </CardTitle>
                  <CardDescription className="text-base text-gray-400">
                    Start your learning journey with these quick actions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button 
                      onClick={handleBrowseCourses}
                      className="h-24 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                      <div className="text-center space-y-2">
                        <div className="text-3xl group-hover:scale-110 transition-transform duration-300">📚</div>
                        <div className="text-sm font-semibold">Browse Courses</div>
                      </div>
                    </Button>
                    <Button 
                      onClick={handleTakeQuiz}
                      className="h-24 bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                      <div className="text-center space-y-2">
                        <div className="text-3xl group-hover:scale-110 transition-transform duration-300">📝</div>
                        <div className="text-sm font-semibold">Take a Quiz</div>
                      </div>
                    </Button>
                    <Button 
                      onClick={handleWatchVideos}
                      className="h-24 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                      <div className="text-center space-y-2">
                        <div className="text-3xl group-hover:scale-110 transition-transform duration-300">🎥</div>
                        <div className="text-sm font-semibold">Watch Videos</div>
                      </div>
                    </Button>
                    <Button 
                      onClick={handleViewAnalytics}
                      className="h-24 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                      <div className="text-center space-y-2">
                        <div className="text-3xl group-hover:scale-110 transition-transform duration-300">📊</div>
                        <div className="text-sm font-semibold">View Analytics</div>
                      </div>
                    </Button>
                    <Button 
                      onClick={handleViewProgress}
                      className="h-24 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                      <div className="text-center space-y-2">
                        <div className="text-3xl group-hover:scale-110 transition-transform duration-300">🏆</div>
                        <div className="text-sm font-semibold">Learning Progress</div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="shadow-xl border-0 bg-white/5 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-xl">
                    <span className="text-2xl">📈</span>
                    <span>Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {statistics.recentActivities.length > 0 ? (
                    <div className="space-y-3">
                      {statistics.recentActivities.slice(0, 6).map((activity, index) => (
                        <div key={activity.id || index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="text-lg">
                              {activity.action === 'course_view' && '📚'}
                              {activity.action === 'quiz_start' && '📝'}
                              {activity.action === 'quiz_complete' && '✅'}
                              {activity.action === 'video_play' && '▶️'}
                              {activity.action === 'navigation' && '🧭'}
                              {activity.action === 'button_click' && '👆'}
                              {!['course_view', 'quiz_start', 'quiz_complete', 'video_play', 'navigation', 'button_click'].includes(activity.action) && '🎯'}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-300">
                                {activity.action === 'course_view' && `Viewed course: ${activity.details?.courseTitle || 'Unknown'}`}
                                {activity.action === 'quiz_start' && `Started quiz: ${activity.details?.courseTitle || 'Unknown'}`}
                                {activity.action === 'quiz_complete' && `Completed quiz: ${activity.details?.courseTitle || 'Unknown'}`}
                                {activity.action === 'video_play' && `Watched video: ${activity.details?.courseTitle || 'Unknown'}`}
                                {activity.action === 'navigation' && `Navigated to ${activity.details?.to || 'page'}`}
                                {activity.action === 'button_click' && `Clicked: ${activity.details?.buttonId || 'button'}`}
                                {!['course_view', 'quiz_start', 'quiz_complete', 'video_play', 'navigation', 'button_click'].includes(activity.action) && `Action: ${activity.action}`}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(activity.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4 opacity-50">🎯</div>
                      <h3 className="text-xl font-semibold mb-3 text-gray-300">Ready to start learning?</h3>
                      <p className="text-gray-400 mb-6 max-w-md mx-auto">Your learning activities will appear here as you progress through courses and complete quizzes.</p>
                      <Button 
                        onClick={handleBrowseCourses}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      >
                        Get Started
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Progress & Status */}
            <div className="space-y-8">
              {/* Progress Section */}
              <Card className="shadow-xl border-0 bg-white/5 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-xl">
                    <span className="text-2xl">📊</span>
                    <span>Your Progress</span>
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Track your learning journey and achievements
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold">Overall Progress</span>
                      <span className="text-sm text-gray-400">{statistics.overallProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200/20 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500" 
                        style={{width: `${statistics.overallProgress}%`}}
                      ></div>
                    </div>
                    
                    <Separator className="bg-white/10" />
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-blue-500/10 rounded-lg">
                        <span className="text-sm font-medium">This Week</span>
                        <span className="text-sm text-blue-300 font-semibold">{statistics.weeklyHours} hours</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-500/10 rounded-lg">
                        <span className="text-sm font-medium">Streak</span>
                        <span className="text-sm text-green-300 font-semibold">{statistics.streak} days</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-500/10 rounded-lg">
                        <span className="text-sm font-medium">Rank</span>
                        <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">{statistics.rank}</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Learning Tips */}
              <Card className="shadow-xl border-0 bg-white/5 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-xl">
                    <span className="text-2xl">💡</span>
                    <span>Learning Tips</span>
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Boost your learning efficiency with these tips
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                      <p className="text-sm text-blue-300 font-medium mb-1">📚 Consistent Practice</p>
                      <p className="text-xs text-gray-400">Study for 30 minutes daily for better retention</p>
                    </div>
                    
                    <div className="p-3 bg-green-500/10 rounded-lg">
                      <p className="text-sm text-green-300 font-medium mb-1">🎯 Set Goals</p>
                      <p className="text-xs text-gray-400">Complete one course module per week</p>
                    </div>
                    
                    <div className="p-3 bg-purple-500/10 rounded-lg">
                      <p className="text-sm text-purple-300 font-medium mb-1">📝 Take Notes</p>
                      <p className="text-xs text-gray-400">Write down key concepts while watching videos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// App Content Component (handles auth state)
function AppContent() {
  const { isAuthenticated, isLoading, user } = useAuth();

  appLogger.info('AppContent rendered', { 
    isAuthenticated, 
    isLoading, 
    user: user?.username 
  });

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading your learning environment...</p>
        </div>
      </div>
    );
  }

  // Show dashboard if authenticated, otherwise show authentication
  return isAuthenticated ? <Dashboard /> : <Authentication />;
}

// Main App Component
function App() {
  appLogger.info('App component initialized');

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
