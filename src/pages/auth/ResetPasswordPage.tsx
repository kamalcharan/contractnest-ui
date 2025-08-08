// src/pages/auth/ResetPasswordPage.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { Eye, EyeOff, Shield, Check, AlertCircle, Loader2, ArrowLeft, Key } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../utils/supabase';
import { analyticsService, AUTH_EVENTS } from '../../services/analytics';

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValidatingToken, setIsValidatingToken] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  
  const [searchParams] = useSearchParams();
  const { isDarkMode, currentTheme } = useTheme();
  const navigate = useNavigate();

  // Get theme colors
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  // Get token from URL
  const token = searchParams.get('token') || searchParams.get('access_token');
  const type = searchParams.get('type');

  // Track page view
  useEffect(() => {
    analyticsService.trackEvent(AUTH_EVENTS.PASSWORD_RESET_REQUEST, {
      source: 'reset_password_page',
      page_view: true,
      has_token: !!token
    });
  }, [token]);

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError('Invalid or missing reset token');
        setIsValidatingToken(false);
        return;
      }

      if (type !== 'recovery') {
        setError('Invalid reset link type');
        setIsValidatingToken(false);
        return;
      }

      try {
        // Verify the session with Supabase
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'recovery'
        });

        if (error) {
          console.error('Token validation error:', error.message);
          if (error.message.includes('expired')) {
            setError('This reset link has expired. Please request a new one.');
          } else if (error.message.includes('invalid')) {
            setError('This reset link is invalid. Please request a new one.');
          } else {
            setError('Unable to verify reset link. Please try again.');
          }
          setIsValidToken(false);
        } else {
          setIsValidToken(true);
          setError(null);
        }
      } catch (err: any) {
        console.error('Token validation error:', err);
        setError('Unable to verify reset link. Please try again.');
        setIsValidToken(false);
      } finally {
        setIsValidatingToken(false);
      }
    };

    validateToken();
  }, [token, type]);

  const validatePassword = (pwd: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!pwd) {
      errors.push('Password is required');
      return { valid: false, errors };
    }
    
    if (pwd.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/(?=.*[a-z])/.test(pwd)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/(?=.*[A-Z])/.test(pwd)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/(?=.*\d)/.test(pwd)) {
      errors.push('Password must contain at least one number');
    }

    return { valid: errors.length === 0, errors };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidToken) {
      toast.error('Invalid reset token. Please request a new password reset.', {
        duration: 4000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: colors.semantic.error,
          color: '#FFF',
          fontSize: '16px',
          minWidth: '300px'
        },
      });
      return;
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      toast.error(passwordValidation.errors[0], {
        duration: 4000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: colors.semantic.error,
          color: '#FFF',
          fontSize: '16px',
          minWidth: '300px'
        },
      });
      return;
    }
    
    // Check password confirmation
    if (password !== confirmPassword) {
      toast.error('Passwords do not match', {
        duration: 3000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: colors.semantic.error,
          color: '#FFF',
          fontSize: '16px',
          minWidth: '300px'
        },
      });
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Track reset attempt
      analyticsService.trackEvent(AUTH_EVENTS.PASSWORD_RESET_REQUEST, {
        source: 'reset_password_form',
        action: 'submit'
      });

      // Update password using Supabase
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        throw error;
      }

      // Track successful reset
      analyticsService.trackEvent(AUTH_EVENTS.PASSWORD_RESET_REQUEST, {
        source: 'reset_password_form',
        success: true
      });
      
      setIsSuccess(true);
      
      toast.success('Password reset successfully!', {
        duration: 3000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: colors.semantic.success,
          color: '#FFF',
          fontSize: '16px',
          minWidth: '300px'
        },
      });

    } catch (err: any) {
      console.error('Password reset error:', err.message);
      
      // Track failed reset
      analyticsService.trackEvent(AUTH_EVENTS.PASSWORD_RESET_REQUEST, {
        source: 'reset_password_form',
        success: false,
        error: err.message
      });

      let errorMessage = 'Failed to reset password. Please try again.';
      
      if (err.message.includes('session_not_found')) {
        errorMessage = 'Your session has expired. Please request a new password reset.';
      } else if (err.message.includes('invalid')) {
        errorMessage = 'Invalid reset token. Please request a new password reset.';
      }
      
      setError(errorMessage);
      toast.error(errorMessage, {
        duration: 4000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: colors.semantic.error,
          color: '#FFF',
          fontSize: '16px',
          minWidth: '300px'
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    analyticsService.trackEvent(AUTH_EVENTS.LOGIN, {
      source: 'reset_password_back_button'
    });
    navigate('/login');
  };

  const handleRequestNewReset = () => {
    analyticsService.trackEvent(AUTH_EVENTS.PASSWORD_RESET_REQUEST, {
      source: 'reset_password_new_request'
    });
    navigate('/forgot-password');
  };

  // Loading state while validating token
  if (isValidatingToken) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4 transition-colors duration-200"
        style={{
          background: isDarkMode 
            ? `linear-gradient(to bottom right, ${colors.utility.primaryBackground}, ${colors.utility.secondaryBackground}, ${colors.brand.primary}20)`
            : `linear-gradient(to bottom right, ${colors.utility.primaryBackground}, ${colors.utility.secondaryBackground}, ${colors.brand.primary}10)`
        }}
      >
        <div className="text-center">
          <Loader2 
            className="w-8 h-8 animate-spin mx-auto mb-4 transition-colors"
            style={{ color: colors.utility.primaryText }}
          />
          <p 
            className="text-lg transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            Verifying reset link...
          </p>
        </div>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4 transition-colors duration-200"
        style={{
          background: isDarkMode 
            ? `linear-gradient(to bottom right, ${colors.utility.primaryBackground}, ${colors.utility.secondaryBackground}, ${colors.brand.primary}20)`
            : `linear-gradient(to bottom right, ${colors.utility.primaryBackground}, ${colors.utility.secondaryBackground}, ${colors.brand.primary}10)`
        }}
      >
        {/* Background Pattern */}
        <div 
          className={`absolute inset-0 transition-opacity ${isDarkMode ? 'opacity-10' : 'opacity-5'}`} 
          style={{
            backgroundImage: `
              linear-gradient(${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px),
              linear-gradient(90deg, ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />

        <div className="w-full max-w-md relative z-10">
          {/* Success Card */}
          <div 
            className="backdrop-blur-xl border rounded-2xl shadow-xl p-8 transition-colors"
            style={{
              backgroundColor: `${colors.utility.secondaryBackground}70`,
              borderColor: `${colors.utility.primaryText}20`
            }}
          >
            {/* Logo */}
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                style={{
                  background: `linear-gradient(to bottom right, ${colors.brand.primary}, ${colors.brand.secondary})`
                }}
              >
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h1 
                className="text-2xl font-bold transition-colors"
                style={{ color: colors.utility.primaryText }}
              >
                ContractNest
              </h1>
            </div>

            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${colors.semantic.success}20` }}
              >
                <Check 
                  className="w-10 h-10"
                  style={{ color: colors.semantic.success }}
                />
              </div>
            </div>

            <div className="text-center space-y-4">
              <h2 
                className="text-2xl font-bold transition-colors"
                style={{ color: colors.utility.primaryText }}
              >
                Password Reset Successful!
              </h2>
              
              <p 
                className="transition-colors"
                style={{ color: colors.utility.secondaryText }}
              >
                Your password has been updated successfully. You can now sign in with your new password.
              </p>

              <div className="pt-6">
                <button
                  onClick={handleBackToLogin}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 hover:opacity-90"
                  style={{
                    background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`,
                    '--tw-ring-color': colors.brand.primary
                  } as React.CSSProperties}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Sign In Now</span>
                </button>
              </div>
            </div>
          </div>

          {/* Security Note */}
          <div className="mt-6 text-center">
            <p 
              className="text-xs flex items-center justify-center space-x-1 transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              <Shield className="w-3 h-3" />
              <span>Your data is secured with enterprise-grade encryption</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state (invalid token)
  if (!isValidToken || error) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4 transition-colors duration-200"
        style={{
          background: isDarkMode 
            ? `linear-gradient(to bottom right, ${colors.utility.primaryBackground}, ${colors.utility.secondaryBackground}, ${colors.brand.primary}20)`
            : `linear-gradient(to bottom right, ${colors.utility.primaryBackground}, ${colors.utility.secondaryBackground}, ${colors.brand.primary}10)`
        }}
      >
        {/* Background Pattern */}
        <div 
          className={`absolute inset-0 transition-opacity ${isDarkMode ? 'opacity-10' : 'opacity-5'}`} 
          style={{
            backgroundImage: `
              linear-gradient(${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px),
              linear-gradient(90deg, ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />

        <div className="w-full max-w-md relative z-10">
          {/* Error Card */}
          <div 
            className="backdrop-blur-xl border rounded-2xl shadow-xl p-8 transition-colors"
            style={{
              backgroundColor: `${colors.utility.secondaryBackground}70`,
              borderColor: `${colors.utility.primaryText}20`
            }}
          >
            {/* Logo */}
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                style={{
                  background: `linear-gradient(to bottom right, ${colors.brand.primary}, ${colors.brand.secondary})`
                }}
              >
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h1 
                className="text-2xl font-bold transition-colors"
                style={{ color: colors.utility.primaryText }}
              >
                ContractNest
              </h1>
            </div>

            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${colors.semantic.error}20` }}
              >
                <AlertCircle 
                  className="w-10 h-10"
                  style={{ color: colors.semantic.error }}
                />
              </div>
            </div>

            <div className="text-center space-y-4">
              <h2 
                className="text-2xl font-bold transition-colors"
                style={{ color: colors.utility.primaryText }}
              >
                Reset Link Issue
              </h2>
              
              <p 
                className="transition-colors"
                style={{ color: colors.utility.secondaryText }}
              >
                {error || 'This password reset link is invalid or has expired.'}
              </p>

              <div className="pt-6 space-y-3">
                <button
                  onClick={handleRequestNewReset}
                  className="w-full py-3 px-4 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 hover:opacity-90"
                  style={{
                    background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`,
                    '--tw-ring-color': colors.brand.primary
                  } as React.CSSProperties}
                >
                  Request New Reset Link
                </button>

                <button
                  onClick={handleBackToLogin}
                  className="w-full py-2 px-4 border rounded-lg font-medium transition-colors hover:opacity-80"
                  style={{
                    borderColor: colors.utility.secondaryText + '40',
                    color: colors.utility.primaryText,
                    backgroundColor: 'transparent'
                  }}
                >
                  Back to Sign In
                </button>
              </div>
            </div>
          </div>

          {/* Security Note */}
          <div className="mt-6 text-center">
            <p 
              className="text-xs flex items-center justify-center space-x-1 transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              <Shield className="w-3 h-3" />
              <span>Your data is secured with enterprise-grade encryption</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main reset form
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 transition-colors duration-200"
      style={{
        background: isDarkMode 
          ? `linear-gradient(to bottom right, ${colors.utility.primaryBackground}, ${colors.utility.secondaryBackground}, ${colors.brand.primary}20)`
          : `linear-gradient(to bottom right, ${colors.utility.primaryBackground}, ${colors.utility.secondaryBackground}, ${colors.brand.primary}10)`
      }}
    >
      {/* Background Pattern */}
      <div 
        className={`absolute inset-0 transition-opacity ${isDarkMode ? 'opacity-10' : 'opacity-5'}`} 
        style={{
          backgroundImage: `
            linear-gradient(${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px),
            linear-gradient(90deg, ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">
        
        {/* Left Side - Security Information */}
        <div className="hidden lg:block space-y-8">
          {/* Logo & Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Link to="/" className="flex items-center space-x-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                  style={{
                    background: `linear-gradient(to bottom right, ${colors.brand.primary}, ${colors.brand.secondary})`
                  }}
                >
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 
                    className="text-3xl font-bold transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  >
                    ContractNest
                  </h1>
                  <p 
                    className="text-sm transition-colors"
                    style={{ color: colors.utility.secondaryText }}
                  >
                    Contract Management Made Simple
                  </p>
                </div>
              </Link>
            </div>
          </div>

          {/* Security Message */}
          <div className="space-y-6">
            <h2 
              className="text-2xl font-semibold transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              Create a Strong Password
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center mt-0.5"
                  style={{ backgroundColor: `${colors.brand.primary}20` }}
                >
                  <Key 
                    className="w-3 h-3"
                    style={{ color: colors.brand.primary }}
                  />
                </div>
                <div>
                  <h3 
                    className="font-medium transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  >
                    Minimum 8 Characters
                  </h3>
                  <p 
                    className="text-sm transition-colors"
                    style={{ color: colors.utility.secondaryText }}
                  >
                    Use a combination of letters, numbers, and symbols
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center mt-0.5"
                  style={{ backgroundColor: `${colors.semantic.success}20` }}
                >
                  <Check 
                    className="w-3 h-3"
                    style={{ color: colors.semantic.success }}
                  />
                </div>
                <div>
                  <h3 
                    className="font-medium transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  >
                    Mix Upper & Lowercase
                  </h3>
                  <p 
                    className="text-sm transition-colors"
                    style={{ color: colors.utility.secondaryText }}
                  >
                    Include both uppercase and lowercase letters
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center mt-0.5"
                  style={{ backgroundColor: `${colors.brand.tertiary}20` }}
                >
                  <Shield 
                    className="w-3 h-3"
                    style={{ color: colors.brand.tertiary }}
                  />
                </div>
                <div>
                  <h3 
                    className="font-medium transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  >
                    Include Numbers
                  </h3>
                  <p 
                    className="text-sm transition-colors"
                    style={{ color: colors.utility.secondaryText }}
                  >
                    Add at least one number for extra security
                  </p>
                </div>
              </div>
            </div>

            {/* Security Note */}
            <div 
              className="rounded-lg p-4 border transition-colors"
              style={{
                backgroundColor: `${colors.utility.secondaryBackground}50`,
                borderColor: `${colors.utility.primaryText}20`
              }}
            >
              <p 
                className="text-sm transition-colors"
                style={{ color: colors.utility.secondaryText }}
              >
                <strong>Security Tip:</strong> Choose a password you haven't used before. 
                Consider using a password manager to generate and store strong passwords.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Reset Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="flex items-center justify-center space-x-3 mb-2">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                style={{
                  background: `linear-gradient(to bottom right, ${colors.brand.primary}, ${colors.brand.secondary})`
                }}
              >
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 
                className="text-2xl font-bold transition-colors"
                style={{ color: colors.utility.primaryText }}
              >
                ContractNest
              </h1>
            </Link>
          </div>

          {/* Reset Form Card */}
          <div 
            className="backdrop-blur-xl border rounded-2xl shadow-xl p-8 transition-colors"
            style={{
              backgroundColor: `${colors.utility.secondaryBackground}70`,
              borderColor: `${colors.utility.primaryText}20`
            }}
          >
            <div className="text-center mb-8">
              <h2 
                className="text-2xl font-bold mb-2 transition-colors"
                style={{ color: colors.utility.primaryText }}
              >
                Set New Password
              </h2>
              <p 
                className="transition-colors"
                style={{ color: colors.utility.secondaryText }}
              >
                Choose a strong password for your ContractNest account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password Field */}
              <div>
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium mb-2 transition-colors"
                  style={{ color: colors.utility.primaryText }}
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-3 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors"
                    style={{
                      borderColor: colors.utility.secondaryText + '40',
                      backgroundColor: colors.utility.secondaryBackground,
                      color: colors.utility.primaryText,
                      '--tw-ring-color': colors.brand.primary
                    } as React.CSSProperties}
                    placeholder="Enter your new password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors hover:opacity-80"
                    style={{ color: colors.utility.secondaryText }}
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label 
                  htmlFor="confirmPassword" 
                  className="block text-sm font-medium mb-2 transition-colors"
                  style={{ color: colors.utility.primaryText }}
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-3 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors"
                    style={{
                      borderColor: colors.utility.secondaryText + '40',
                      backgroundColor: colors.utility.secondaryBackground,
                      color: colors.utility.primaryText,
                      '--tw-ring-color': colors.brand.primary
                    } as React.CSSProperties}
                    placeholder="Confirm your new password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors hover:opacity-80"
                    style={{ color: colors.utility.secondaryText }}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <div 
                className="p-3 rounded-lg border text-sm transition-colors"
                style={{
                  backgroundColor: `${colors.brand.primary}10`,
                  borderColor: `${colors.brand.primary}40`,
                  color: colors.brand.primary
                }}
              >
                <p className="font-medium mb-2">Password requirements:</p>
                <ul className="space-y-1 text-xs">
                  <li className={`flex items-center space-x-2 ${
                    password.length >= 8 ? '' : ''
                  }`} style={{ color: password.length >= 8 ? colors.semantic.success : colors.utility.secondaryText }}>
                    <div 
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: password.length >= 8 ? colors.semantic.success : colors.utility.secondaryText }}
                    />
                    <span>At least 8 characters</span>
                  </li>
                  <li className="flex items-center space-x-2" style={{ color: /(?=.*[a-z])/.test(password) ? colors.semantic.success : colors.utility.secondaryText }}>
                    <div 
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: /(?=.*[a-z])/.test(password) ? colors.semantic.success : colors.utility.secondaryText }}
                    />
                    <span>One lowercase letter</span>
                  </li>
                  <li className="flex items-center space-x-2" style={{ color: /(?=.*[A-Z])/.test(password) ? colors.semantic.success : colors.utility.secondaryText }}>
                    <div 
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: /(?=.*[A-Z])/.test(password) ? colors.semantic.success : colors.utility.secondaryText }}
                    />
                    <span>One uppercase letter</span>
                  </li>
                  <li className="flex items-center space-x-2" style={{ color: /(?=.*\d)/.test(password) ? colors.semantic.success : colors.utility.secondaryText }}>
                    <div 
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: /(?=.*\d)/.test(password) ? colors.semantic.success : colors.utility.secondaryText }}
                    />
                    <span>One number</span>
                  </li>
                </ul>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !isValidToken}
                className="w-full py-3 px-4 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 hover:opacity-90"
                style={{
                  background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`,
                  '--tw-ring-color': colors.brand.primary
                } as React.CSSProperties}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4" />
                    <span>Update Password</span>
                  </>
                )}
              </button>

              {/* Back to Login */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="inline-flex items-center space-x-2 text-sm font-medium transition-colors hover:opacity-80"
                  style={{ color: colors.utility.secondaryText }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Sign In</span>
                </button>
              </div>
            </form>
          </div>

          {/* Security Note */}
          <div className="mt-6 text-center">
            <p 
              className="text-xs flex items-center justify-center space-x-1 transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              <Shield className="w-3 h-3" />
              <span>Your data is secured with enterprise-grade encryption</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;