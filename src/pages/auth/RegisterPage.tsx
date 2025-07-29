// src/pages/auth/RegisterPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Eye, EyeOff, User, Mail, Building, Shield, Check, Star, Gift, Users, Clock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../utils/supabase'; 
// Import analytics
import { analyticsService, AUTH_EVENTS, UI_EVENTS } from '../../services/analytics';

const RegisterPage: React.FC = () => {
  // Check if Google OAuth is enabled - MOVED TO TOP
  const isGoogleAuthEnabled = import.meta.env.VITE_ENABLE_GOOGLE_AUTH !== 'false';
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    workspaceName: ''
  });
  
  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  
  // Auth context
  const { register, isAuthenticated, isLoading, error, clearError } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  
  // Ref to prevent duplicate Google signup attempts
  const googleSignupInProgress = useRef(false);

  // Track page view when component mounts
  useEffect(() => {
    analyticsService.trackEvent(AUTH_EVENTS.SIGNUP_START, {
      source: document.referrer || 'direct',
      page_name: 'register'
    });
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Clear auth errors when form changes
  useEffect(() => {
    if (error) clearError();
  }, [formData, clearError, error]);

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

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Convert workspace name to lowercase if that field is changed
    const newValue = name === 'workspaceName' ? value.toLowerCase() : value;
    
    setFormData({ ...formData, [name]: newValue });
    
    // Clear field-specific error when changed
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // Handle Google Sign-up
  const handleGoogleSignup = async () => {
    // Only proceed if Google auth is enabled
    if (!isGoogleAuthEnabled) {
      return;
    }

    // Prevent duplicate clicks
    if (googleSignupInProgress.current || isGoogleLoading) {
      return;
    }
    
    googleSignupInProgress.current = true;
    setIsGoogleLoading(true);
    
    // Track Google signup attempt
    analyticsService.trackEvent(AUTH_EVENTS.SIGNUP_START, {
      method: 'google',
      source: 'register_form'
    });
    
    try {
      // Store remember me preference as false for new users
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
      // The callback page will determine if it's a new user and handle accordingly
      
    } catch (error: any) {
      // Track Google signup failure
      analyticsService.trackEvent(AUTH_EVENTS.SIGNUP_FAILURE, {
        method: 'google',
        error_type: 'oauth_error',
        error_message: error.message
      });
      
      toast.error(error.message || 'Failed to initiate Google sign-up', {
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
      
      googleSignupInProgress.current = false;
      setIsGoogleLoading(false);
    }
    // Note: We don't set isGoogleLoading to false in success case because 
    // the page will redirect and we want to keep the loading state
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    
    // Track password visibility toggle
    analyticsService.trackEvent(UI_EVENTS.MENU_CLICK, {
      menu_item: 'password_toggle',
      action: showPassword ? 'hide' : 'show'
    });
  };

  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
    
    // Track confirm password visibility toggle
    analyticsService.trackEvent(UI_EVENTS.MENU_CLICK, {
      menu_item: 'confirm_password_toggle',
      action: showConfirmPassword ? 'hide' : 'show'
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Name fields
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    
    // Workspace name
    if (!formData.workspaceName) {
      newErrors.workspaceName = 'Workspace name is required';
    } else if (!/^[a-z0-9\-_]+$/.test(formData.workspaceName)) {
      newErrors.workspaceName = 'Workspace name can only contain lowercase letters, numbers, hyphens, and underscores';
    }
    
    setErrors(newErrors);

    // Track validation errors if there are any
    if (Object.keys(newErrors).length > 0) {
      analyticsService.trackEvent(AUTH_EVENTS.SIGNUP_STEP, {
        step_name: 'validation',
        success: false,
        error_fields: Object.keys(newErrors).join(',')
      });
    }
    
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Track registration attempt
    analyticsService.trackEvent(AUTH_EVENTS.SIGNUP_STEP, {
      step_name: 'submission',
      success: true
    });
    
    // Register the user
    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        workspaceName: formData.workspaceName
      });
      
      // Track successful registration
      analyticsService.trackEvent(AUTH_EVENTS.SIGNUP_SUCCESS, {
        workspace_name: formData.workspaceName
      });
      
      // Success toast will be shown by AuthContext
    } catch (err) {
      // Track registration failure
      analyticsService.trackEvent(AUTH_EVENTS.SIGNUP_FAILURE, {
        error_type: 'registration_error',
        error_message: error || 'Unknown error'
      });
      // Error is handled by auth context
    }
  };

  return (
    <div className={`min-h-screen flex transition-colors duration-200 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'
    }`}>
      {/* Background Pattern */}
      <div className={`absolute inset-0 transition-opacity ${
        isDarkMode ? 'opacity-10' : 'opacity-5'
      }`} style={{
        backgroundImage: `
          linear-gradient(${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px),
          linear-gradient(90deg, ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px'
      }}></div>

      {/* Left Side - Value Proposition (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 relative z-10">
        <div className="max-w-md">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 mb-8">
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

          {/* Main Headline */}
          <h2 className={`text-4xl font-bold mb-6 transition-colors ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Start Managing Contracts Like a Pro
          </h2>

          <p className={`text-xl mb-8 transition-colors ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Join thousands of businesses who trust ContractNest to streamline their contract management.
          </p>

          {/* Free Trial Banner */}
          <div className={`rounded-2xl p-6 mb-8 border-2 transition-colors ${
            isDarkMode 
              ? 'bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-400' 
              : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-400'
          }`}>
            <div className="flex items-center space-x-3 mb-4">
              <Gift className={`w-8 h-8 transition-colors ${
                isDarkMode ? 'text-green-400' : 'text-green-600'
              }`} />
              <div>
                <h3 className={`text-lg font-bold transition-colors ${
                  isDarkMode ? 'text-green-400' : 'text-green-700'
                }`}>Start Free Today!</h3>
                <p className={`text-sm transition-colors ${
                  isDarkMode ? 'text-green-300' : 'text-green-600'
                }`}>Your first 3 contracts are completely free</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className={`flex items-center space-x-2 text-sm transition-colors ${
                isDarkMode ? 'text-green-300' : 'text-green-600'
              }`}>
                <Check className="w-4 h-4" />
                <span>No credit card required</span>
              </div>
              <div className={`flex items-center space-x-2 text-sm transition-colors ${
                isDarkMode ? 'text-green-300' : 'text-green-600'
              }`}>
                <Check className="w-4 h-4" />
                <span>Full feature access</span>
              </div>
              <div className={`flex items-center space-x-2 text-sm transition-colors ${
                isDarkMode ? 'text-green-300' : 'text-green-600'
              }`}>
                <Check className="w-4 h-4" />
                <span>Setup in under 5 minutes</span>
              </div>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mt-1">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className={`font-semibold transition-colors ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Enterprise Security</h3>
                <p className={`text-sm transition-colors ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>Bank-level encryption and SOC 2 compliance</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mt-1">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className={`font-semibold transition-colors ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Team Collaboration</h3>
                <p className={`text-sm transition-colors ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>Invite unlimited team members to work together</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mt-1">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className={`font-semibold transition-colors ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Smart Reminders</h3>
                <p className={`text-sm transition-colors ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>Never miss a renewal or important deadline again</p>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className={`mt-8 p-4 rounded-lg border transition-colors ${
            isDarkMode 
              ? 'bg-gray-800/50 border-gray-700' 
              : 'bg-white/50 border-gray-200'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
              ))}
              <span className={`text-sm font-medium transition-colors ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>5.0 from 500+ users</span>
            </div>
            <p className={`text-sm transition-colors ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              "ContractNest transformed how we manage our vendor contracts. Setup was incredibly easy!"
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className={`text-2xl font-bold transition-colors ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>ContractNest</h1>
            </div>
            
            {/* Mobile Free Trial Banner */}
            <div className={`rounded-lg p-4 mb-6 border transition-colors ${
              isDarkMode 
                ? 'bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-700' 
                : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
            }`}>
              <div className={`flex items-center justify-center space-x-2 transition-colors ${
                isDarkMode ? 'text-green-400' : 'text-green-700'
              }`}>
                <Gift className="w-5 h-5" />
                <span className="text-sm font-medium">Your first 3 contracts are free!</span>
              </div>
            </div>
          </div>

          {/* Registration Card */}
          <div className={`backdrop-blur-xl border rounded-2xl shadow-xl p-8 transition-colors ${
            isDarkMode 
              ? 'bg-gray-800/70 border-gray-700/20' 
              : 'bg-white/70 border-white/20'
          }`}>
            <div className="text-center mb-8">
              <h2 className={`text-2xl font-bold mb-2 transition-colors ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Create Your Account</h2>
              <p className={`transition-colors ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Start managing contracts in minutes</p>
            </div>

            {/* Google Sign-up Button - Only show if Google OAuth is enabled */}
            {isGoogleAuthEnabled && (
              <div className="mb-6">
                <button
                  type="button"
                  onClick={handleGoogleSignup}
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
                      Sign up with Google
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Divider - Only show if Google OAuth is enabled */}
            {isGoogleAuthEnabled && (
              <div className="mb-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className={`w-full border-t transition-colors ${
                      isDarkMode ? 'border-gray-600' : 'border-gray-300'
                    }`}></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className={`px-2 transition-colors ${
                      isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'
                    }`}>Or sign up with email</span>
                  </div>
                </div>
              </div>
            )}

            <div onSubmit={handleSubmit} className="space-y-4">
              {/* Name fields in two columns */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className={`block text-sm font-medium mb-2 transition-colors ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    First Name
                  </label>
                  <div className="relative">
                    <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-400'
                    }`} />
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      required
                      className={`w-full pl-9 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        isDarkMode 
                          ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                          : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
                      } ${errors.firstName ? 'border-red-500' : ''}`}
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      disabled={isLoading || isGoogleLoading}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.firstName}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="lastName" className={`block text-sm font-medium mb-2 transition-colors ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Last Name
                  </label>
                  <div className="relative">
                    <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-400'
                    }`} />
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      required
                      className={`w-full pl-9 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        isDarkMode 
                          ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                          : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
                      } ${errors.lastName ? 'border-red-500' : ''}`}
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      disabled={isLoading || isGoogleLoading}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.lastName}</p>
                  )}
                </div>
              </div>
              
              {/* Email */}
              <div>
                <label htmlFor="email" className={`block text-sm font-medium mb-2 transition-colors ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-400'
                  }`} />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={`w-full pl-9 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      isDarkMode 
                        ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                        : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
                    } ${errors.email ? 'border-red-500' : ''}`}
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    disabled={isLoading || isGoogleLoading}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                )}
              </div>
              
              {/* Workspace Name */}
              <div>
                <label htmlFor="workspaceName" className={`block text-sm font-medium mb-2 transition-colors ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Workspace Name
                </label>
                <div className="relative">
                  <Building className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-400'
                  }`} />
                  <input
                    id="workspaceName"
                    name="workspaceName"
                    type="text"
                    required
                    className={`w-full pl-9 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      isDarkMode 
                        ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                        : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
                    } ${errors.workspaceName ? 'border-red-500' : ''}`}
                    placeholder="my-company"
                    value={formData.workspaceName}
                    onChange={handleChange}
                    disabled={isLoading || isGoogleLoading}
                  />
                </div>
                {errors.workspaceName && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.workspaceName}</p>
                )}
                <p className={`mt-1 text-xs transition-colors ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Use only letters, numbers, hyphens, and underscores (3-50 characters)
                </p>
              </div>
              
              {/* Password fields in two columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className={`block text-sm font-medium mb-2 transition-colors ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      className={`w-full pl-3 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        isDarkMode 
                          ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                          : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
                      } ${errors.password ? 'border-red-500' : ''}`}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create password"
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
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className={`block text-sm font-medium mb-2 transition-colors ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      className={`w-full pl-3 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        isDarkMode 
                          ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                          : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
                      } ${errors.confirmPassword ? 'border-red-500' : ''}`}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm password"
                      disabled={isLoading || isGoogleLoading}
                    />
                    <button
                      type="button"
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors ${
                        isDarkMode 
                          ? 'text-gray-400 hover:text-gray-200' 
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                      onClick={toggleConfirmPasswordVisibility}
                      disabled={isLoading || isGoogleLoading}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Create Account Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isLoading || isGoogleLoading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Start Free Trial</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {/* Terms and Sign In Link */}
            <div className="mt-6 space-y-4">
              <div className="text-center">
                <p className={`text-xs transition-colors ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  By signing up, you agree to our{' '}
                  <Link 
                    to="/terms" 
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    onClick={() => analyticsService.trackEvent(UI_EVENTS.MENU_CLICK, { menu_item: 'terms_link' })}
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link 
                    to="/privacy" 
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    onClick={() => analyticsService.trackEvent(UI_EVENTS.MENU_CLICK, { menu_item: 'privacy_link' })}
                  >
                    Privacy Policy
                  </Link>
                </p>
              </div>
              
              <div className="text-center">
                <p className={`text-sm transition-colors ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    onClick={() => analyticsService.trackEvent(AUTH_EVENTS.LOGIN, { source: 'register_page' })}
                  >
                    Sign in instead
                  </Link>
                </p>
              </div>
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

export default RegisterPage;