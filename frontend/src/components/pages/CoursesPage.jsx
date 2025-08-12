/**
 * Courses Page Component
 * Displays available learning content/courses
 * Includes content filtering and interactive course cards
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Enhanced logger for courses page
const coursesLogger = {
  info: (message, data = null) => {
    console.log(`📚 [COURSES_PAGE] ${message}`, data ? { data } : '');
  },
  success: (message, data = null) => {
    console.log(`✅ [COURSES_PAGE] ${message}`, data ? { data } : '');
  },
  error: (message, error = null) => {
    console.error(`❌ [COURSES_PAGE] ${message}`, error ? { error } : '');
  }
};

export function CoursesPage({ onBack, onSelectCourse }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  coursesLogger.info('CoursesPage component rendered');

  // Fetch courses from API
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      coursesLogger.info('Fetching courses from API');
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:5000/api/content');
      const data = await response.json();

      if (data.success) {
        setCourses(data.content || []);
        coursesLogger.success('Courses fetched successfully', { count: data.content?.length });
      } else {
        throw new Error(data.message || 'Failed to fetch courses');
      }
    } catch (err) {
      coursesLogger.error('Failed to fetch courses', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter courses by type
  const filteredCourses = courses.filter(course => {
    if (filter === 'all') return true;
    return course.type === filter;
  });

  // Get content type icon and color
  const getContentTypeInfo = (type) => {
    switch (type) {
      case 'text':
        return { icon: '📄', color: 'bg-blue-500', label: 'Reading' };
      case 'video':
        return { icon: '🎥', color: 'bg-purple-500', label: 'Video' };
      case 'quiz':
        return { icon: '📝', color: 'bg-green-500', label: 'Quiz' };
      default:
        return { icon: '📚', color: 'bg-gray-500', label: 'Content' };
    }
  };

  // Handle course selection
  const handleCourseSelect = (course) => {
    coursesLogger.info('Course selected', { courseId: course.id, title: course.title });
    if (onSelectCourse) {
      onSelectCourse(course);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-4">
              <div className="animate-spin text-4xl">📚</div>
              <p className="text-gray-300">Loading courses...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Card className="bg-red-50 border-red-200 max-w-md">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">❌</div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load Courses</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <div className="space-x-2">
                  <Button onClick={fetchCourses} className="bg-red-600 hover:bg-red-700">
                    Try Again
                  </Button>
                  <Button variant="outline" onClick={onBack}>
                    Go Back
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                onClick={onBack}
                className="text-gray-300 hover:text-white hover:bg-white/10"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </Button>
            </div>
            <h1 className="text-4xl font-bold text-white">Browse Courses</h1>
            <p className="text-xl text-gray-300">
              Explore our interactive learning content
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {['all', 'text', 'video', 'quiz'].map((filterType) => (
            <Button
              key={filterType}
              variant={filter === filterType ? "default" : "outline"}
              onClick={() => setFilter(filterType)}
              className={`${
                filter === filterType
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'border-white/20 text-gray-300 hover:bg-white/10'
              }`}
            >
              {filterType === 'all' ? '📚 All Content' : 
               filterType === 'text' ? '📄 Reading' :
               filterType === 'video' ? '🎥 Videos' : '📝 Quizzes'}
            </Button>
          ))}
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4 opacity-50">📚</div>
              <h3 className="text-xl font-semibold text-gray-200 mb-3">No Courses Available</h3>
              <p className="text-gray-400 mb-6">
                {filter === 'all' 
                  ? 'No courses have been created yet.' 
                  : `No ${filter} content available.`}
              </p>
              <Button 
                onClick={() => setFilter('all')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                View All Content
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const typeInfo = getContentTypeInfo(course.type);
              return (
                <Card 
                  key={course.id} 
                  className="bg-white/5 backdrop-blur-sm border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group"
                  onClick={() => handleCourseSelect(course)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`${typeInfo.color} text-white rounded-lg p-2 shadow-lg`}>
                          <span className="text-xl">{typeInfo.icon}</span>
                        </div>
                        <Badge variant="outline" className="bg-white/10 text-gray-300 border-white/20">
                          {typeInfo.label}
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-xl text-white group-hover:text-blue-200 transition-colors">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      {course.description || 'No description available'}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <Separator className="mb-4 bg-white/10" />
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Created: {new Date(course.createdAt).toLocaleDateString()}
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-blue-600 hover:bg-blue-700 group-hover:scale-105 transition-transform"
                      >
                        Start Learning
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Stats */}
        {filteredCourses.length > 0 && (
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-center space-x-8 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">{filteredCourses.length}</div>
                  <div className="text-sm text-gray-400">
                    {filter === 'all' ? 'Total Courses' : `${filter} Content`}
                  </div>
                </div>
                <Separator orientation="vertical" className="h-12 bg-white/10" />
                <div>
                  <div className="text-2xl font-bold text-white">
                    {courses.filter(c => c.type === 'video').length}
                  </div>
                  <div className="text-sm text-gray-400">Videos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {courses.filter(c => c.type === 'quiz').length}
                  </div>
                  <div className="text-sm text-gray-400">Quizzes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {courses.filter(c => c.type === 'text').length}
                  </div>
                  <div className="text-sm text-gray-400">Articles</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default CoursesPage;
