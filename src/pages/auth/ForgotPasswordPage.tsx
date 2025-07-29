// src/pages/auth/ForgotPasswordPage.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Mail, ArrowLeft, Shield, Check, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../utils/supabase';
import { analyticsService, AUTH_EVENTS } from '../../services/analytics';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userAuthType, setUserAuthType] = useState<'email' | 'google' | 'both' | 'unknown'>('unknown');
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);
  
  const { resetPassword, isAuthenticated, error, clearError } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Track page view
  useEffect(() => {
    analyticsService.trackEvent(AUTH_EVENTS.PASSWORD_RESET_REQUEST, {
      source: 'forgot_password_page',
      page_view: true
    });
  }, []);

  // Clear errors when email changes
  useEffect(() => {
    if (error) clearError();
  }, [email, clearError, error]);

  // Check user's authentication methods when email changes
  useEffect(() => {
    const checkAuthMethods = async () => {
      if (!email || !email.includes('@')) {
        setUserAuthType('unknown');
        return;
      }

      setIsCheckingAuth(true);
      try {
        // Check if this email exists and what auth methods it has
        const { data, error } = await supabase
          .from('t_user_auth_methods')
          .select('auth_type, is_primary')
          .eq('auth_identifier', email.toLowerCase())
          .eq('is_deleted', false);

        if (error) {
          console.error('Error checking auth methods:', error);
          setUserAuthType('unknown');
          return;
        }

        if (!data || data.length === 0) {
          setUserAuthType('unknown'); // Email not found, but we won't tell the user
          return;
        }

        const authTypes = data.map(d => d.auth_type);
        const hasEmail = authTypes.includes('email');
        const hasGoogle = authTypes.includes('google');

        if (hasEmail && hasGoogle) {
          setUserAuthType('both');
        } else if (hasGoogle) {
          setUserAuthType('google');
        } else if (hasEmail) {
          setUserAuthType('email');
        } else {
          setUserAuthType('unknown');
        }
      } catch (error) {
        console.error('Error checking auth methods:', error);
        setUserAuthType('unknown');
      } finally {
        setIsCheckingAuth(false);
      }
    };

    // Debounce the check
    const timeoutId = setTimeout(checkAuthMethods, 500);
    return () => clearTimeout(timeoutId);
  }, [email]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Email is required', {
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
      return;
    }

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address', {
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
      return;
    }

    setIsLoading(true);

    try {
      // Track reset attempt
      analyticsService.trackEvent(AUTH_EVENTS.PASSWORD_RESET_REQUEST, {
        source: 'forgot_password_form',
        user_auth_type: userAuthType
      });

      // Always call resetPassword (for security - Option A approach)
      // This will always show success message regardless of whether email exists
      await resetPassword(email.toLowerCase());
      
      setIsSubmitted(true);

      // Track successful submission
      analyticsService.trackEvent(AUTH_EVENTS.PASSWORD_RESET_REQUEST, {
        source: 'forgot_password_form',
        success: true
      });

    } catch (err: any) {
      // Track failed submission
      analyticsService.trackEvent(AUTH_EVENTS.PASSWORD_RESET_REQUEST, {
        source: 'forgot_password_form',
        success: false,
        error: err.message
      });

      console.error('Password reset error:', err);
      // Error handling is done by AuthContext and displayed via toast
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    analyticsService.trackEvent(AUTH_EVENTS.LOGIN, {
      source: 'forgot_password_back_button'
    });
    navigate('/login');
  };

  const renderAuthTypeMessage = () => {
    if (isCheckingAuth) {
      return (
        <div className={`flex items-center space-x-2 text-sm ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Checking account...</span>
        </div>
      );
    }

    if (userAuthType === 'google') {
      return (
        <div className={`p-3 rounded-lg border ${
          isDarkMode 
            ? 'bg-blue-900/20 border-blue-700 text-blue-300' 
            : 'bg-blue-50 border-blue-200 text-blue-700'
        }`}>
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium">This account uses Google authentication</p>
              <p className="mt-1">Please use "Sign in with Google" on the login page instead.</p>
            </div>
          </div>
        </div>
      );
    }

    if (userAuthType === 'both') {
      return (
        <div className={`p-3 rounded-lg border ${
          isDarkMode 
            ? 'bg-green-900/20 border-green-700 text-green-300' 
            : 'bg-green-50 border-green-200 text-green-700'
        }`}>
          <div className="flex items-start space-x-2">
            <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium">Password reset available</p>
              <p className="mt-1">You can also sign in with Google if preferred.</p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  if (isSubmitted) {
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

        <div className="w-full max-w-md relative z-10">
          {/* Success Card */}
          <div className={`backdrop-blur-xl border rounded-2xl shadow-xl p-8 transition-colors ${
            isDarkMode 
              ? 'bg-gray-800/70 border-gray-700/20' 
              : 'bg-white/70 border-white/20'
          }`}>
            {/* Logo */}
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h1 className={`text-2xl font-bold transition-colors ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>ContractNest</h1>
            </div>

            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                isDarkMode ? 'bg-green-900/30' : 'bg-green-100'
              }`}>
                <Check className={`w-10 h-10 ${
                  isDarkMode ? 'text-green-400' : 'text-green-600'
                }`} />
              </div>
            </div>

            <div className="text-center space-y-4">
              <h2 className={`text-2xl font-bold transition-colors ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Check Your Email
              </h2>
              
              <p className={`transition-colors ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                If an account exists with <strong>{email}</strong>, you'll receive password reset instructions shortly.
              </p>

              <div className={`p-4 rounded-lg border ${
                isDarkMode 
                  ? 'bg-blue-900/20 border-blue-700' 
                  : 'bg-blue-50 border-blue-200'
              }`}>
                <p className={`text-sm ${
                  isDarkMode ? 'text-blue-300' : 'text-blue-700'
                }`}>
                  <strong>Didn't receive the email?</strong>
                </p>
                <ul className={`text-sm mt-2 space-y-1 ${
                  isDarkMode ? 'text-blue-300' : 'text-blue-700'
                }`}>
                  <li>• Check your spam/junk folder</li>
                  <li>• Make sure the email address is correct</li>
                  <li>• Wait a few minutes for delivery</li>
                </ul>
              </div>

              <div className="pt-4 space-y-3">
                <button
                  onClick={handleBackToLogin}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Sign In</span>
                </button>

                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail('');
                    setUserAuthType('unknown');
                  }}
                  className={`w-full py-2 px-4 border rounded-lg font-medium transition-colors ${
                    isDarkMode
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Try Different Email
                </button>
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
    );
  }

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
        
        {/* Left Side - Branding & Support Info */}
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

          {/* Support Message */}
          <div className="space-y-6">
            <h2 className={`text-2xl font-semibold transition-colors ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Don't worry, we've got you covered
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mt-0.5">
                  <Mail className="w-3 h-3 text-blue-600" />
                </div>
                <div>
                  <h3 className={`font-medium transition-colors ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Quick & Secure</h3>
                  <p className={`text-sm transition-colors ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>Reset your password in just a few clicks</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mt-0.5">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
                <div>
                  <h3 className={`font-medium transition-colors ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Email Verification</h3>
                  <p className={`text-sm transition-colors ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>We'll send instructions to your registered email</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mt-0.5">
                  <Shield className="w-3 h-3 text-purple-600" />
                </div>
                <div>
                  <h3 className={`font-medium transition-colors ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Secure Process</h3>
                  <p className={`text-sm transition-colors ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>Your account security is our top priority</p>
                </div>
              </div>
            </div>

            {/* Help Note */}
            <div className={`rounded-lg p-4 border transition-colors ${
              isDarkMode 
                ? 'bg-gray-800/50 border-gray-700' 
                : 'bg-white/50 border-gray-200'
            }`}>
              <p className={`text-sm transition-colors ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <strong>Need help?</strong> If you're having trouble accessing your account, 
                you can contact our support team for assistance.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Reset Form */}
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
          </div>

          {/* Reset Form Card */}
          <div className={`backdrop-blur-xl border rounded-2xl shadow-xl p-8 transition-colors ${
            isDarkMode 
              ? 'bg-gray-800/70 border-gray-700/20' 
              : 'bg-white/70 border-white/20'
          }`}>
            <div className="text-center mb-8">
              <h2 className={`text-2xl font-bold mb-2 transition-colors ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Reset Your Password</h2>
              <p className={`transition-colors ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Enter your email address and we'll send you a link to reset your password
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                    placeholder="Enter your email address"
                    disabled={isLoading}
                  />
                </div>
                
                {/* Auth type message */}
                {email && validateEmail(email) && (
                  <div className="mt-3">
                    {renderAuthTypeMessage()}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || userAuthType === 'google'}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Sending Reset Link...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    <span>Send Reset Link</span>
                  </>
                )}
              </button>

              {/* Back to Login */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className={`inline-flex items-center space-x-2 text-sm font-medium transition-colors ${
                    isDarkMode 
                      ? 'text-gray-300 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Sign In</span>
                </button>
              </div>
            </form>
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

export default ForgotPasswordPage;