// Updated InvitationRegisterPage.tsx with proper Step 1 and Step 2 for existing users

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Building, ArrowLeft, CheckCircle, X, UserCheck, User } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { API_ENDPOINTS } from '../../services/serviceURLs';
import { useAuth } from '@/context/AuthContext';

interface InvitationData {
  id: string;
  email?: string;
  mobile_number?: string;
  tenant: {
    id: string;
    name: string;
    workspace_code: string;
  };
  user_exists: boolean;
  user_id?: string; // Add this field for existing users
}

interface ExistingUserData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  user_code: string;
}

const InvitationRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user: currentUser } = useAuth(); // Get current logged-in user if any
  
  // Get invitation codes from URL
  const userCode = searchParams.get('code');
  const secretCode = searchParams.get('secret');
  
  // State
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [existingUser, setExistingUser] = useState<ExistingUserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState<'preview' | 'form'>('preview');
  
  // Form data for new users
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    mobileNumber: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validate invitation on mount
  useEffect(() => {
    validateInvitation();
  }, [userCode, secretCode]);

  const validateInvitation = async () => {
    if (!userCode || !secretCode) {
      toast.error('Invalid invitation link');
      navigate('/login');
      return;
    }

    try {
      const response = await api.post(API_ENDPOINTS.USERS.INVITATIONS.VALIDATE, {
        user_code: userCode,
        secret_code: secretCode
      });
      
      if (!response.data.valid) {
        throw new Error(response.data.error || 'Invalid invitation');
      }
      
      const inviteData = response.data.invitation;
      setInvitation(inviteData);
      
      // If user exists, fetch their details
      if (inviteData.user_exists && inviteData.email) {
        // Check if user is already logged in
        if (currentUser && currentUser.email === inviteData.email) {
          setExistingUser({
            id: currentUser.id,
            email: currentUser.email,
            first_name: currentUser.first_name || '',
            last_name: currentUser.last_name || '',
            user_code: currentUser.user_code || ''
          });
          // Skip to form step for logged-in users
          setCurrentStep('form');
        } else {
          // For existing users not logged in, we'll get their info after they log in
          setExistingUser({
            id: '',
            email: inviteData.email,
            first_name: '',
            last_name: '',
            user_code: ''
          });
        }
      } else {
        // Pre-fill data for new users
        if (inviteData.email) {
          setFormData(prev => ({ ...prev, email: inviteData.email }));
        }
        if (inviteData.mobile_number) {
          setFormData(prev => ({ ...prev, mobileNumber: inviteData.mobile_number }));
        }
      }
      
    } catch (error: any) {
      console.error('Invitation validation error:', error);
      toast.error(error.response?.data?.error || error.message || 'Invalid invitation');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateNewUserForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    // Email validation (if not pre-filled)
    if (!invitation?.email && !formData.email) {
      newErrors.email = 'Email is required';
    } else if (!invitation?.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNewUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateNewUserForm() || !invitation) return;
    
    setSubmitting(true);
    
    try {
      // Register the user with invitation
      const registerData = {
        email: invitation.email || formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        mobileNumber: invitation.mobile_number || formData.mobileNumber || undefined,
        userCode: userCode,
        secretCode: secretCode
      };
      
      const { data: authData } = await api.post(API_ENDPOINTS.AUTH.REGISTER_WITH_INVITATION, registerData);
      
      if (authData.access_token) {
        // Store auth data
        localStorage.setItem('auth_token', authData.access_token);
        if (authData.refresh_token) {
          localStorage.setItem('refresh_token', authData.refresh_token);
        }
        
        // Store user data
        if (authData.user) {
          localStorage.setItem('user_id', authData.user_id || authData.user.id);
          localStorage.setItem('user_data', JSON.stringify(authData.user));
        }
        
        // Store tenant info
        if (authData.tenant) {
          localStorage.setItem('tenant_id', authData.tenant.id);
          localStorage.setItem('current_tenant', JSON.stringify(authData.tenant));
        }
        
        toast.success(`Welcome to ${authData.tenant?.name || invitation.tenant.name}!`);
        
        // Navigate to dashboard
        navigate('/dashboard');
      } else {
        throw new Error('No authentication token received');
      }
      
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to create account';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleExistingUserAccept = async () => {
    if (!invitation) return;
    
    setSubmitting(true);
    
    try {
      // Get the user ID from the invitation validation response
      // Since user exists, the backend should provide the user_id
      const userIdFromInvitation = invitation.user_id || existingUser?.id;
      
      if (!userIdFromInvitation) {
        // If we don't have user_id, we need to get it from the backend
        // This is a fallback - ideally the invitation validation should return it
        console.error('User ID not available in invitation data');
        toast.error('Unable to process invitation. Please try again.');
        return;
      }
      
      // Accept the invitation (NO AUTH REQUIRED - using anon key)
      const acceptResponse = await api.post(API_ENDPOINTS.USERS.INVITATIONS.ACCEPT, {
        user_code: userCode,
        secret_code: secretCode,
        user_id: userIdFromInvitation
      });
      
      toast.success(`Successfully accepted invitation to ${invitation.tenant.name}!`, {
        duration: 3000,
        icon: '🎉'
      });
      
      // Redirect to login page after successful acceptance
      setTimeout(() => {
        navigate('/login', {
          state: {
            message: `You've been added to ${invitation.tenant.name}. Please login to access the workspace.`
          }
        });
      }, 1500);
      
    } catch (error: any) {
      console.error('Failed to accept invitation:', error);
      toast.error(error.response?.data?.error || 'Failed to accept invitation');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDecline = () => {
    if (confirm('Are you sure you want to decline this invitation? This action cannot be undone.')) {
      toast('Invitation declined', {
        icon: 'ℹ️',
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: '#6B7280',
          color: '#FFF',
        },
      });
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!invitation) {
    return null;
  }

  // Step 1: Preview/Confirmation step
  if (currentStep === 'preview') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 py-6 px-4">
        <div className="w-full max-w-lg">
          {/* Back button */}
          <button
            onClick={() => navigate('/login')}
            className="mb-3 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </button>

          <div className="bg-card rounded-xl shadow-xl border border-border overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-6 text-white">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
                  <Building className="h-7 w-7" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Workspace Invitation</h1>
                  <p className="text-white/90">You've been invited to join a workspace</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Invitation details */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">You're invited to join:</p>
                    <h2 className="text-2xl font-bold">{invitation.tenant.name}</h2>
                    <p className="text-sm text-muted-foreground">Workspace Code: {invitation.tenant.workspace_code}</p>
                  </div>
                </div>

                {(invitation.email || invitation.mobile_number) && (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">
                      Invitation sent to: <span className="font-medium text-foreground">
                        {invitation.email || invitation.mobile_number}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Message based on user existence */}
              <div className="bg-primary/10 rounded-lg p-4">
                {invitation.user_exists ? (
                  <p className="text-sm">
                    You already have an account. Click below to accept the invitation and join this workspace.
                  </p>
                ) : (
                  <p className="text-sm">
                    You'll need to create an account to join this workspace.
                  </p>
                )}
              </div>

              {/* Action buttons */}
              <div className="space-y-3">
                {invitation.user_exists ? (
                  <button
                    onClick={() => setCurrentStep('form')}
                    className="w-full py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 
                             transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Accept
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentStep('form')}
                    className="w-full py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 
                             transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Account & Join
                  </button>
                )}

                <button
                  onClick={handleDecline}
                  className="w-full py-3 border border-border text-muted-foreground rounded-md 
                           hover:bg-muted transition-colors font-medium"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Form step
  if (invitation.user_exists) {
    // Existing user - simplified UI (NO LOGIN REQUIRED)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 py-6 px-4">
        <div className="w-full max-w-lg">
          {/* Back button */}
          <button
            onClick={() => setCurrentStep('preview')}
            className="mb-3 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="bg-card rounded-xl shadow-xl border border-border overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-4 text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
                  <Building className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Join {invitation.tenant.name}</h1>
                  <p className="text-white/90 text-sm">Your account is ready to join the workspace</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* User exists message */}
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Account Found</h3>
                    <p className="text-sm text-muted-foreground">{invitation.email || invitation.mobile_number}</p>
                  </div>
                </div>
              </div>

              {/* Info message */}
              <div className="bg-primary/10 rounded-lg p-4">
                <div className="flex gap-3">
                  <UserCheck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Your account already exists!</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      No need to create a new account. Simply accept the invitation to join the <span className="font-medium">{invitation.tenant.name}</span> workspace.
                    </p>
                  </div>
                </div>
              </div>

              {/* What happens next */}
              <div className="space-y-2">
                <p className="text-sm font-medium">What happens next?</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                    <span>The invitation will be accepted</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                    <span>You'll be added to the {invitation.tenant.name} workspace</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                    <span>You'll be redirected to login to access the workspace</span>
                  </li>
                </ul>
              </div>

              {/* Action buttons */}
              <div className="space-y-2">
                <button
                  onClick={handleExistingUserAccept}
                  disabled={submitting}
                  className="w-full py-2.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 
                           transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Accepting Invitation...' : 'Accept & Join Workspace'}
                </button>

                <button
                  onClick={handleDecline}
                  disabled={submitting}
                  className="w-full py-2.5 border border-border text-muted-foreground rounded-md 
                           hover:bg-muted transition-colors font-medium disabled:opacity-50 
                           disabled:cursor-not-allowed"
                >
                  Decline Invitation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // New user registration form (existing form code remains the same)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 py-6 px-4">
      <div className="w-full max-w-6xl">
        {/* Back button */}
        <button
          onClick={() => setCurrentStep('preview')}
          className="mb-3 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="bg-card rounded-xl shadow-xl border border-border overflow-hidden">
          {/* Compact header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-3 text-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
                <Building className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Join {invitation.tenant.name}</h1>
                <p className="text-white/90 text-xs">Create your account to accept the invitation</p>
              </div>
            </div>
          </div>

          {/* Form with three column layout */}
          <form onSubmit={handleNewUserSubmit} className="p-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* First column - Personal Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Personal Information</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      First Name <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                        errors.firstName ? 'border-destructive' : 'border-border'
                      }`}
                      placeholder="John"
                    />
                    {errors.firstName && (
                      <p className="text-xs text-destructive mt-0.5">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Last Name <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                        errors.lastName ? 'border-destructive' : 'border-border'
                      }`}
                      placeholder="Doe"
                    />
                    {errors.lastName && (
                      <p className="text-xs text-destructive mt-0.5">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email Address <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={invitation.email || formData.email}
                    onChange={handleChange}
                    readOnly={!!invitation.email}
                    className={`w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      invitation.email ? 'bg-muted cursor-not-allowed' : ''
                    } ${errors.email ? 'border-destructive' : 'border-border'}`}
                    placeholder="john.doe@example.com"
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive mt-0.5">{errors.email}</p>
                  )}
                </div>

                {(invitation.mobile_number || !invitation.email) && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={invitation.mobile_number || formData.mobileNumber}
                      onChange={handleChange}
                      readOnly={!!invitation.mobile_number}
                      className={`w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                        invitation.mobile_number ? 'bg-muted cursor-not-allowed' : ''
                      } border-border`}
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                )}
              </div>

              {/* Second column - Security */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Security</h3>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Password <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-3 py-1.5 pr-10 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                        errors.password ? 'border-destructive' : 'border-border'
                      }`}
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-destructive mt-0.5">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Confirm Password <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full px-3 py-1.5 pr-10 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                        errors.confirmPassword ? 'border-destructive' : 'border-border'
                      }`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-destructive mt-0.5">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Password requirements */}
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Password must:</p>
                  <ul className="list-disc list-inside space-y-0.5 ml-2">
                    <li>Be at least 6 characters long</li>
                    <li>Match the confirmation password</li>
                  </ul>
                </div>
              </div>

              {/* Third column - Info and Actions */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Invitation Details</h3>
                
                {/* Info box */}
                <div className="bg-primary/10 rounded-lg p-3">
                  <div className="flex gap-2">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <p className="font-medium mb-1">What happens next?</p>
                      <p className="text-muted-foreground leading-relaxed">
                        After creating your account, you'll automatically join{' '}
                        <span className="font-medium">{invitation.tenant.name}</span> workspace
                        and have access to all shared resources.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Expiration notice */}
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
                  <p className="text-xs text-orange-700 dark:text-orange-400 leading-relaxed">
                    This invitation will expire in 48 hours. If you have any questions, 
                    please contact the workspace administrator.
                  </p>
                </div>

                {/* Action buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 
                             transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Creating Account...' : 'Accept & Join Workspace'}
                  </button>

                  <button
                    type="button"
                    onClick={handleDecline}
                    disabled={submitting}
                    className="w-full py-2 border border-border text-muted-foreground rounded-md 
                             hover:bg-muted transition-colors font-medium text-sm disabled:opacity-50 
                             disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <X size={16} />
                    Decline Invitation
                  </button>
                </div>

                {/* Login link */}
                <p className="text-center text-xs text-muted-foreground pt-2">
                  Already have an account?{' '}
                  <Link 
                    to={`/login?invitation=${userCode}&secret=${secretCode}`}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign in instead
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InvitationRegisterPage;