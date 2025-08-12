/**
 * Authentication Component - Main wrapper for login/register forms
 * Beautiful design with Shadcn UI components and modern styling
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import LoginForm from '@/components/forms/LoginForm';
import RegisterForm from '@/components/forms/RegisterForm';

// Enhanced logger for authentication component
const authLogger = {
  info: (message, data = null) => {
    console.log(`🔐 [AUTH_COMPONENT] ${message}`, data ? { data } : '');
  },
  success: (message, data = null) => {
    console.log(`✅ [AUTH_COMPONENT] ${message}`, data ? { data } : '');
  },
  user: (message, data = null) => {
    console.log(`👤 [AUTH_COMPONENT] ${message}`, data ? { data } : '');
  }
};

// Authentication modes
const AUTH_MODES = {
  LOGIN: 'login',
  REGISTER: 'register'
};

// Authentication component
export function Authentication({ onAuthSuccess }) {
  const [authMode, setAuthMode] = useState(AUTH_MODES.LOGIN);

  authLogger.info('Authentication component rendered', { authMode });

  // Handle successful authentication
  const handleAuthSuccess = (user) => {
    authLogger.success('Authentication successful', { 
      user: user?.username,
      userId: user?.id,
      authMode 
    });
    
    if (onAuthSuccess) {
      onAuthSuccess(user);
    }
  };

  // Switch to login mode
  const switchToLogin = () => {
    authLogger.user('Switching to login mode');
    setAuthMode(AUTH_MODES.LOGIN);
  };

  // Switch to register mode
  const switchToRegister = () => {
    authLogger.user('Switching to register mode');
    setAuthMode(AUTH_MODES.REGISTER);
  };

  const isLoginMode = authMode === AUTH_MODES.LOGIN;

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-[radial-gradient(100%_50%_at_50%_0%,rgba(0,163,255,0.13)_0,rgba(0,163,255,0)_50%,rgba(0,163,255,0)_100%)]"></div>
      <div className="w-full max-w-md space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-6">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-4 shadow-lg">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>

          {/* Title and Description */}
          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-white tracking-tight">
              EduTrack Pro
            </h1>
            <p className="text-lg text-gray-400 font-medium">
              Interactive Learning Platform
            </p>
            
            {/* Feature Badges */}
            <div className="flex justify-center gap-2 flex-wrap">
              <Badge variant="secondary" className="text-xs px-3 py-1 bg-blue-500 text-white">
                📊 Clickstream Analytics
              </Badge>
              <Badge variant="outline" className="text-xs px-3 py-1 bg-purple-500 text-white">
                🎯 Personalized Learning
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Authentication Card */}
        <Card className="shadow-xl border-0 bg-white/5 backdrop-blur-sm">
          <CardHeader className="space-y-4 pb-6">
            {/* Mode Switcher */}
            <div className="flex justify-center">
              <div className="inline-flex rounded-lg bg-gray-100/5 p-1 shadow-inner">
                <Button
                  variant={isLoginMode ? "default" : "ghost"}
                  size="sm"
                  onClick={switchToLogin}
                  className="rounded-md px-6 py-2 text-sm font-medium transition-all data-[state=active]:bg-white/10 data-[state=active]:shadow-sm text-white"
                >
                  Sign In
                </Button>
                <Button
                  variant={!isLoginMode ? "default" : "ghost"}
                  size="sm"
                  onClick={switchToRegister}
                  className="rounded-md px-6 py-2 text-sm font-medium transition-all data-[state=active]:bg-white/10 data-[state=active]:shadow-sm text-white"
                >
                  Create Account
                </Button>
              </div>
            </div>

            {/* Dynamic Content */}
            <div className="text-center space-y-2">
              <CardTitle className="text-2xl font-semibold text-white">
                {isLoginMode ? "Welcome back!" : "Get started today"}
              </CardTitle>
              <CardDescription className="text-base text-gray-400">
                {isLoginMode 
                  ? "Sign in to continue your learning journey" 
                  : "Create your account and unlock personalized learning"
                }
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 px-6 pb-6">
            {/* Authentication Forms */}
            {isLoginMode ? (
              <LoginForm
                onSuccess={handleAuthSuccess}
                onSwitchToRegister={switchToRegister}
              />
            ) : (
              <RegisterForm
                onSuccess={handleAuthSuccess}
                onSwitchToLogin={switchToLogin}
              />
            )}
            
            <Separator className="my-6 bg-white/10" />
            
            {/* Features Preview */}
            <div className="space-y-4">
              <p className="text-sm font-semibold text-center text-gray-400">
                What you'll get:
              </p>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center space-x-3 text-sm text-gray-400 bg-green-500/10 rounded-lg p-3">
                  <div className="bg-green-500 text-white rounded-full p-1 flex-shrink-0">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-medium">Interactive content with videos, quizzes & text</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-400 bg-blue-500/10 rounded-lg p-3">
                  <div className="bg-blue-500 text-white rounded-full p-1 flex-shrink-0">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-medium">Real-time progress tracking & analytics</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-400 bg-purple-500/10 rounded-lg p-3">
                  <div className="bg-purple-500 text-white rounded-full p-1 flex-shrink-0">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-medium">Personalized learning recommendations</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center space-y-4">
          <p className="text-sm text-gray-500">
            By continuing, you agree to our{' '}
            <button className="text-blue-600 hover:text-blue-700 underline font-medium">Terms of Service</button>
            {' '}and{' '}
            <button className="text-blue-600 hover:text-blue-700 underline font-medium">Privacy Policy</button>
          </p>
          
          {/* Development Info */}
          {process.env.NODE_ENV === 'development' && (
            <Card className="bg-amber-500/10 border-amber-200/20">
              <CardContent className="pt-4">
                <div className="text-xs text-amber-400 space-y-2">
                  <p className="font-semibold flex items-center justify-center gap-1">
                    🛠️ Development Mode
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-left bg-amber-100/5 rounded p-2">
                    <div className="font-medium">Mode:</div>
                    <div>{authMode}</div>
                    <div className="font-medium">API:</div>
                    <div className="text-green-600">Online ✅</div>
                    <div className="font-medium">DB:</div>
                    <div>Local JSON</div>
                    <div className="font-medium">Env:</div>
                    <div>{process.env.NODE_ENV}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default Authentication;
