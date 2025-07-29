// src/pages/auth/LoginPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../utils/supabase'; 
// Import analytics
import { analyticsService, AUTH_EVENTS, UI_EVENTS } from '../../services/analytics';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { login, isAuthenticated, isLoading, error, clearError } = useAuth();
  const { isDarkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Ref to prevent duplicate Google login attempts
  const googleLoginInProgress = useRef(false);

  // Check if Google OAuth is enabled
  const isGoogleAuthEnabled = import.meta.env.VITE_ENABLE_GOOGLE_AUTH !== 'false';

  // Track page view when component mounts
  useEffect(() => {
    analyticsService.trackEvent(AUTH_EVENTS.LOGIN, {
      source: document.referrer || 'direct',
      page_name: 'login'
    });
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Check for message from navigate state (e.g., after registration)
  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      toast.success(location.state.message, {
        duration: 2000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: '#10B981',
          color: '#FFF',
          fontSize: '16px',
          minWidth: '300px'
        },
      });
      // Clear the state to prevent showing the message again on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  // Show error toast when error is present
  useEffect(() => {
    if (error) {
      toast.error(error, {
        duration: 2000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: '#EF4444',
          color: '#FFF',
          fontSize: '16px',
          minWidth: '300px'
        },
      });
    }
  }, [error]);

  // Clear any errors when form changes
  useEffect(() => {
    if (error) clearError();
  }, [email, password, clearError, error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Track login attempt
    analyticsService.trackEvent(AUTH_EVENTS.LOGIN, {
      method: 'email',
      source: 'login_form'
    });
    
    try {
      await login(email, password, false); // Remember me removed - always false
      // Track successful login
      analyticsService.trackEvent(AUTH_EVENTS.LOGIN_SUCCESS, {
        method: 'email'
      });
      // The redirect will happen automatically from the isAuthenticated useEffect
    } catch (err) {
      // Track login failure
      analyticsService.trackEvent(AUTH_EVENTS.LOGIN_FAILURE, {
        method: 'email',
        error_type: 'authentication_error',
        error_message: error || 'Unknown error'
      });
      // Don't do anything here - error will be handled by auth context and shown via useEffect
    }
  };

  const handleGoogleLogin = async () => {
    // Prevent duplicate clicks
    if (googleLoginInProgress.current || isGoogleLoading) {
      return;
    }
    
    googleLoginInProgress.current = true;
    setIsGoogleLoading(true);
    
    // Track Google login attempt
    analyticsService.trackEvent(AUTH_EVENTS.LOGIN, {
      method: 'google',
      source: 'login_form'
    });
    
    try {
      // Store remember me preference before OAuth redirect (always false now)
      localStorage.setItem('remember_me', 'false');
      
      // Use Supabase's built-in OAuth
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/google-callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      if (error) throw error;
      
      // Supabase will handle the redirect automatically
      // No need to do anything else here
      
    } catch (error: any) {
      // Track Google login failure
      analyticsService.trackEvent(AUTH_EVENTS.LOGIN_FAILURE, {
        method: 'google',
        error_type: 'oauth_error',
        error_message: error.message
      });
      
      toast.error(error.message || 'Failed to initiate Google login', {
        duration: 3000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: '#EF4444',
          color: '#FFF',
          fontSize: '16px',
          minWidth: '300px'
        },
      });
      
      googleLoginInProgress.current = false;
      setIsGoogleLoading(false);
    }
    // Note: We don't set isGoogleLoading to false in success case because 
    // the page will redirect and we want to keep the loading state
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    
    // Track password visibility toggle
    analyticsService.trackEvent(UI_EVENTS.MENU_CLICK, {
      menu_item: 'password_toggle',
      action: showPassword ? 'hide' : 'show'
    });
  };

  // Track forgot password click
  const handleForgotPasswordClick = () => {
    analyticsService.trackEvent(AUTH_EVENTS.PASSWORD_RESET_REQUEST, {
      source: 'login_page'
    });
    navigate('/forgot-password');
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-200 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'
    }`}>
      {/* Background Pattern */}
      <div className={`absolute inset-0 opacity-5 ${
        isDarkMode ? 'opacity-10' : 'opacity-5'
      }`} style={{
        backgroundImage: `
          linear-gradient(${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px),
          linear-gradient(90deg, ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px'
      }}></div>
      
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">
        
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:block space-y-8">
          {/* Logo & Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className={`text-3xl font-bold transition-colors ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>ContractNest</h1>
                <p className={`text-sm transition-colors ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>Contract Management Made Simple</p>
              </div>
            </div>
          </div>

          {/* Value Proposition */}
          <div className="space-y-6">
            <h2 className={`text-2xl font-semibold transition-colors ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Welcome back to your contract hub
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className={`font-medium transition-colors ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Track All Contracts</h3>
                  <p className={`text-sm transition-colors ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>Centralized dashboard for all your service contracts</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className={`font-medium transition-colors ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Never Miss Renewals</h3>
                  <p className={`text-sm transition-colors ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>Smart notifications for upcoming deadlines</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className={`font-medium transition-colors ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Team Collaboration</h3>
                  <p className={`text-sm transition-colors ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>Work together seamlessly with your team</p>
                </div>
              </div>
            </div>

            {/* Free Contracts Banner */}
            <div className={`rounded-lg p-4 border transition-colors ${
              isDarkMode 
                ? 'bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-700' 
                : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
            }`}>
              <div className={`flex items-center space-x-2 transition-colors ${
                isDarkMode ? 'text-green-400' : 'text-green-700'
              }`}>
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">Your first 3 contracts are free!</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className={`text-2xl font-bold transition-colors ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>ContractNest</h1>
            </div>
            <p className={`text-sm transition-colors ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>Contract Management Made Simple</p>
          </div>

          {/* Login Card */}
          <div className={`backdrop-blur-xl border rounded-2xl shadow-xl p-8 transition-colors ${
            isDarkMode 
              ? 'bg-gray-800/70 border-gray-700/20' 
              : 'bg-white/70 border-white/20'
          }`}>
            <div className="text-center mb-8">
              <h2 className={`text-2xl font-bold mb-2 transition-colors ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Welcome Back</h2>
              <p className={`transition-colors ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Sign in to manage your contracts</p>
            </div>

            {/* Success Message */}
            {message && (
              <div className="mb-6 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                <p className="text-green-600 dark:text-green-400 text-sm">{message}</p>
              </div>
            )}

            <div onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className={`block text-sm font-medium mb-2 transition-colors ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-400'
                  }`} />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      isDarkMode 
                        ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                        : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
                    }`}
                    placeholder="Enter your email"
                    disabled={isLoading || isGoogleLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className={`block text-sm font-medium mb-2 transition-colors ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Password
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-400'
                  }`} />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      isDarkMode 
                        ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                        : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
                    }`}
                    placeholder="Enter your password"
                    disabled={isLoading || isGoogleLoading}
                  />
                  <button
                    type="button"
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors ${
                      isDarkMode 
                        ? 'text-gray-400 hover:text-gray-200' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                    onClick={togglePasswordVisibility}
                    disabled={isLoading || isGoogleLoading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={handleForgotPasswordClick}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isLoading || isGoogleLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Divider - Only show if Google OAuth is enabled */}
            {isGoogleAuthEnabled && (
              <div className="my-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className={`w-full border-t transition-colors ${
                      isDarkMode ? 'border-gray-600' : 'border-gray-300'
                    }`}></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className={`px-2 transition-colors ${
                      isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'
                    }`}>Or continue with</span>
                  </div>
                </div>
              </div>
            )}

            {/* Google Sign-in Button - Only show if Google OAuth is enabled */}
            {isGoogleAuthEnabled && (
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading || isLoading}
                className={`w-full flex items-center justify-center px-4 py-3 border rounded-lg shadow-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${
                  isDarkMode
                    ? 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {isGoogleLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                    Connecting to Google...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Sign in with Google
                  </>
                )}
              </button>
            )}

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className={`text-sm transition-colors ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  onClick={() => analyticsService.trackEvent(AUTH_EVENTS.SIGNUP_START, { source: 'login_page' })}
                >
                  Start your free trial
                </Link>
              </p>
            </div>
          </div>

          {/* Security Note */}
          <div className="mt-6 text-center">
            <p className={`text-xs flex items-center justify-center space-x-1 transition-colors ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <Shield className="w-3 h-3" />
              <span>Your data is secured with enterprise-grade encryption</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;