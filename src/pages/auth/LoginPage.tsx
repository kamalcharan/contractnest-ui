import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { API_ENDPOINTS } from '../../services/serviceURLs';
import { supabase } from '../../utils/supabase'; 
// Import analytics
import { analyticsService, AUTH_EVENTS, UI_EVENTS } from '../../services/analytics';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { login, isAuthenticated, isLoading, error, clearError } = useAuth();
  const { isDarkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Ref to prevent duplicate Google login attempts
  const googleLoginInProgress = useRef(false);

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
      await login(email, password, rememberMe);
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
      // Store remember me preference before OAuth redirect
      localStorage.setItem('remember_me', String(rememberMe));
      
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
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding and illustration */}
      <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center p-10 bg-gray-50">
        <div className="max-w-md">
          <img src="/assets/images/logo.png" alt="ContractNest" className="h-16 mb-10" />
          
          <div className="w-full">
            <img src="/assets/images/authentication.png" alt="Login illustration" className="w-full shadow-lg rounded-lg" />
          </div>
        </div>
      </div>
      
      {/* Right side - Login form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          {/* Mobile view logo */}
          <div className="md:hidden flex justify-center mb-8">
            <img src="/assets/images/logo.png" alt="ContractNest" className="h-16" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back!
          </h1>
          <p className="text-gray-600 text-center mb-10">
            Enter your credentials to access your account and manage your service contracts with ease.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                  disabled={isLoading || isGoogleLoading}
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
                    placeholder="Enter your password"
                    disabled={isLoading || isGoogleLoading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                    onClick={togglePasswordVisibility}
                    disabled={isLoading || isGoogleLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={isLoading || isGoogleLoading}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              
              <div className="text-sm">
                <Link 
                  to="/forgot-password" 
                  className="font-medium text-blue-500 hover:text-blue-600"
                  onClick={handleForgotPasswordClick}
                >
                  Forgot password?
                </Link>
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
            
            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            
            {/* Google Sign-in Button */}
            <div>
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading || isLoading}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isGoogleLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
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
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="font-medium text-blue-500 hover:text-blue-600"
                  onClick={() => analyticsService.trackEvent(AUTH_EVENTS.SIGNUP_START, { source: 'login_page' })}
                >
                  Create one
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;