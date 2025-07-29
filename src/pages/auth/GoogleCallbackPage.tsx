// src/pages/auth/GoogleCallbackPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../utils/supabase';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { analyticsService, AUTH_EVENTS } from '../../services/analytics';

const GoogleCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const { setGoogleAuthData, setAuthToken } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasProcessed, setHasProcessed] = useState(false);

  useEffect(() => {
    // Prevent multiple executions
    if (!hasProcessed) {
      handleGoogleCallback();
      setHasProcessed(true);
    }
  }, [hasProcessed]);

  const handleGoogleCallback = async () => {
    try {
      console.log('🔍 Starting Google OAuth callback handling');
      
      // Get URL parameters first to check for errors or cancellation
      const urlParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      
      // Check for explicit OAuth errors or cancellation
      const error = urlParams.get('error') || hashParams.get('error');
      const errorDescription = urlParams.get('error_description') || hashParams.get('error_description');
      
      console.log('🔍 URL Error:', error);
      console.log('🔍 Error Description:', errorDescription);
      
      // Handle OAuth cancellation or errors
      if (error) {
        console.log('❌ OAuth Error detected:', error);
        
        if (error === 'access_denied') {
          console.log('🚫 User cancelled OAuth flow');
          toast.error('Google sign-in was cancelled', {
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
        } else {
          console.log('💥 OAuth error:', errorDescription || error);
          toast.error(`Google sign-in failed: ${errorDescription || error}`, {
            duration: 4000,
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
        
        // Track the error
        analyticsService.trackEvent(AUTH_EVENTS.LOGIN_FAILURE, {
          method: 'google',
          error_type: 'oauth_cancelled',
          error_message: error
        });
        
        // CRITICAL: Clear any existing Supabase session on cancel
        try {
          await supabase.auth.signOut();
          console.log('🧹 Cleared Supabase session after cancel');
        } catch (signOutError) {
          console.error('⚠️ Error clearing session:', signOutError);
        }
        
        // Clear any stored auth data
        [localStorage, sessionStorage].forEach(storage => {
          storage.removeItem('auth_token');
          storage.removeItem('refresh_token');
          storage.removeItem('user_id');
          storage.removeItem('user_data');
          storage.removeItem('google_callback_processed');
        });
        
        // Clear API headers
        delete api.defaults.headers.common['Authorization'];
        
        console.log('🧹 Cleared all auth data after cancel');
        
        // Wait a moment to ensure cleanup is complete
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Redirect back to login
        navigate('/login', { replace: true });
        return;
      }

      // Check if we've already processed this callback to prevent race conditions
      const callbackProcessed = sessionStorage.getItem('google_callback_processed');
      if (callbackProcessed === 'true') {
        console.log('🔄 Callback already processed, redirecting...');
        navigate('/dashboard', { replace: true });
        return;
      }

      // Check if this is an unlock flow FIRST
      const isUnlockFlow = sessionStorage.getItem('is_unlock_flow') === 'true';
      const returnUrl = sessionStorage.getItem('unlock_return_url');
      
      console.log('🔍 Is unlock flow:', isUnlockFlow);
      
      // Step 1: Get tokens from URL or existing session
      let accessToken = hashParams.get('access_token');
      let refreshToken = hashParams.get('refresh_token');
      
      console.log('🔍 Tokens from URL - Access:', !!accessToken, 'Refresh:', !!refreshToken);
      
      // If no tokens in URL, check for existing session
      if (!accessToken) {
        console.log('🔍 No tokens in URL, checking existing session...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('❌ Session error:', sessionError.message);
          throw new Error('Failed to get authentication session');
        }
        
        if (session) {
          accessToken = session.access_token;
          refreshToken = session.refresh_token;
          console.log('✅ Found existing session');
        } else {
          console.error('❌ No session found');
          throw new Error('No authentication data found');
        }
      } else {
        console.log('✅ Setting session with tokens from URL');
        // Set the session with tokens from URL
        const { error: setSessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || ''
        });
        
        if (setSessionError) {
          console.error('❌ Error setting session:', setSessionError.message);
          throw new Error('Failed to establish session');
        }
      }
      
      // Step 2: Get session to ensure it's valid and get user data
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.error('❌ Failed to establish valid session');
        throw new Error('Failed to establish session');
      }

      console.log('✅ Valid session established for user:', session.user.id);

      // Step 3: Handle unlock flow if applicable
      if (isUnlockFlow) {
        console.log('🔓 Processing unlock flow...');
        
        // Verify it's the same user
        const lockedUserId = sessionStorage.getItem('user_id');
        if (lockedUserId && session.user.id !== lockedUserId) {
          console.error('❌ User mismatch in unlock flow');
          // Clear everything and force re-login
          sessionStorage.clear();
          throw new Error('Please sign in with the same account that was locked');
        }
        
        // Clear unlock flow flags
        sessionStorage.removeItem('is_unlock_flow');
        sessionStorage.removeItem('unlock_return_url');
        sessionStorage.removeItem('lock_state');
        sessionStorage.removeItem('lock_time');
        sessionStorage.removeItem('failed_unlock_attempts');
        sessionStorage.removeItem('unlock_blocked_until');
        
        // Update auth headers
        api.defaults.headers.common['Authorization'] = `Bearer ${session.access_token}`;
        
        // Broadcast unlock event
        if (window.BroadcastChannel) {
          const channel = new BroadcastChannel('lock_screen');
          channel.postMessage({ action: 'unlock' });
          channel.close();
        }
        
        console.log('✅ Unlock flow completed, redirecting to:', returnUrl || '/dashboard');
        // Navigate directly without re-processing auth
        window.location.href = returnUrl || '/dashboard';
        return; // Exit here for unlock flow
      }

      // Mark as processing immediately ONLY after we confirm it's not an error/cancel
      sessionStorage.setItem('google_callback_processed', 'true');

      // Step 4: Normal auth flow continues here
      const user = session.user;
      
      console.log('👤 Processing auth for user:', user.email);
      
      // Set auth token in API
      api.defaults.headers.common['Authorization'] = `Bearer ${session.access_token}`;
      
      // Store tokens
      const rememberMe = localStorage.getItem('remember_me') === 'true';
      const storage = rememberMe ? localStorage : sessionStorage;
      
      storage.setItem('auth_token', session.access_token);
      if (session.refresh_token) {
        storage.setItem('refresh_token', session.refresh_token);
      }
      storage.setItem('user_id', user.id);
      
      // Set auth token in context
      if (setAuthToken) {
        setAuthToken(session.access_token);
      }
      
      // Check/create user profile with better error handling
      let profile = null;
      let isNewUser = true;
      let hasIncompleteRegistration = false;
      
      console.log('🔍 Checking user profile...');
      
      // Use maybeSingle to avoid errors when profile doesn't exist
      const { data: existingProfile, error: profileError } = await supabase
        .from('t_user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (existingProfile) {
        profile = existingProfile;
        isNewUser = false;
        console.log('✅ Found existing profile');
        
        // Check if user has incomplete registration
        if (user.user_metadata?.registration_status === 'pending_workspace') {
          hasIncompleteRegistration = true;
          console.log('⚠️ User has incomplete registration');
        }
      } else if (!profileError || profileError.code === 'PGRST116') {
        // No profile exists - this is expected for new users
        isNewUser = true;
        console.log('🆕 New user detected, creating profile...');
        
        // Try to create profile using upsert to prevent duplicates
        const googleProfile = user.user_metadata || {};
        
        // Extract name from Google metadata
        let firstName = '';
        let lastName = '';
        
        if (googleProfile.full_name) {
          const nameParts = googleProfile.full_name.trim().split(/\s+/);
          firstName = nameParts[0] || '';
          lastName = nameParts.slice(1).join(' ') || '';
        }
        
        firstName = googleProfile.given_name || 
                   googleProfile.first_name || 
                   firstName || 
                   '';
                   
        lastName = googleProfile.family_name || 
                  googleProfile.last_name || 
                  lastName || 
                  '';
        
        if (!firstName && !lastName && googleProfile.name) {
          const nameParts = googleProfile.name.trim().split(/\s+/);
          firstName = nameParts[0] || '';
          lastName = nameParts.slice(1).join(' ') || '';
        }
        
        if (!firstName && user.email) {
          firstName = user.email.split('@')[0] || '';
        }
        
        // Generate unique user code
        const timestamp = Date.now().toString(36).slice(-2);
        const random = Math.random().toString(36).substring(2, 4);
        const firstPart = (firstName || 'USR').substring(0, 3).toUpperCase();
        const lastPart = (lastName || 'XXX').substring(0, 3).toUpperCase();
        const userCode = `${firstPart}${lastPart}${timestamp}${random}`.padEnd(8, '0');
        
        const { data: newProfile, error: createError } = await supabase
          .from('t_user_profiles')
          .upsert({
            user_id: user.id,
            email: user.email!,
            first_name: firstName,
            last_name: lastName,
            is_active: true,
            user_code: userCode
          }, {
            onConflict: 'user_id',
            ignoreDuplicates: false
          })
          .select()
          .single();

        if (newProfile) {
          profile = newProfile;
          console.log('✅ Profile created successfully');
        } else if (createError && !createError.message.includes('duplicate')) {
          console.error('⚠️ Profile creation failed:', createError.message);
        }
      }

      // Get user's tenants
      console.log('🔍 Fetching user tenants...');
      const { data: userTenants } = await supabase
        .from('t_user_tenants')
        .select(`
          id,
          tenant_id,
          is_default,
          status,
          t_tenants!inner (
            id,
            name,
            workspace_code,
            domain,
            status,
            is_admin,
            created_by,
            storage_setup_complete
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'active');

      const tenants = (userTenants || []).map(ut => ({
        id: ut.t_tenants.id,
        name: ut.t_tenants.name,
        workspace_code: ut.t_tenants.workspace_code,
        domain: ut.t_tenants.domain,
        status: ut.t_tenants.status,
        is_admin: ut.t_tenants.is_admin || false,
        storage_setup_complete: ut.t_tenants.storage_setup_complete || false,
        is_default: ut.is_default || false,
        is_owner: ut.t_tenants.created_by === user.id,
        user_is_profile_admin: profile?.is_admin || false,
        is_explicitly_assigned: true
      }));

      console.log('📊 Found', tenants.length, 'tenants for user');

      // Prepare user data with registration status
      const userData = {
        id: user.id,
        email: user.email!,
        first_name: profile?.first_name || '',
        last_name: profile?.last_name || '',
        user_code: profile?.user_code || '',
        is_admin: profile?.is_admin || false,
        user_metadata: {
          ...user.user_metadata,
          provider: 'google'
        },
        app_metadata: {
          ...user.app_metadata,
          provider: 'google'
        },
        registration_status: user.user_metadata?.registration_status || 'complete'
      };
      
      storage.setItem('user_data', JSON.stringify(userData));
      
      // Set auth data in context
      await setGoogleAuthData({
        user: userData,
        tenants,
        access_token: session.access_token,
        refresh_token: session.refresh_token || '',
        isNewUser: isNewUser || hasIncompleteRegistration
      });
      
      // Track event
      analyticsService.trackEvent(
        isNewUser ? AUTH_EVENTS.SIGNUP_SUCCESS : AUTH_EVENTS.LOGIN_SUCCESS, 
        { 
          method: 'google', 
          provider: 'google',
          has_incomplete_registration: hasIncompleteRegistration
        }
      );
      
      // Show appropriate success message
      if (hasIncompleteRegistration) {
        toast.success('Welcome back! Please complete your workspace setup.', {
          duration: 3000,
          style: {
            padding: '16px',
            borderRadius: '8px',
            background: '#10B981',
            color: '#FFF',
            fontSize: '16px',
            minWidth: '300px'
          },
        });
      } else if (isNewUser) {
        toast.success('Welcome! Please create your workspace.', {
          duration: 3000,
          style: {
            padding: '16px',
            borderRadius: '8px',
            background: '#10B981',
            color: '#FFF',
            fontSize: '16px',
            minWidth: '300px'
          },
        });
      } else {
        toast.success('Successfully signed in with Google!', {
          duration: 3000,
          style: {
            padding: '16px',
            borderRadius: '8px',
            background: '#10B981',
            color: '#FFF',
            fontSize: '16px',
            minWidth: '300px'
          },
        });
      }
      
      // Clear the processing flag before navigation
      sessionStorage.removeItem('google_callback_processed');
      
      // Navigate based on registration status and tenants
      if (hasIncompleteRegistration || (!tenants || tenants.length === 0)) {
        console.log('📍 Redirecting to workspace creation');
        navigate('/create-tenant', { 
          state: { 
            isNewUser: isNewUser || hasIncompleteRegistration,
            fromGoogleAuth: true,
            authToken: session.access_token,
            resumingRegistration: hasIncompleteRegistration
          },
          replace: true
        });
      } else {
        console.log('📍 Redirecting to dashboard');
        // For Google users with tenants, find appropriate tenant
        let targetTenant = null;
        
        // First priority: User's own workspace
        targetTenant = tenants.find(t => t.is_owner === true);
        
        // Second priority: Default workspace
        if (!targetTenant) {
          targetTenant = tenants.find(t => t.is_default === true);
        }
        
        // Third priority: First non-admin workspace
        if (!targetTenant && !userData.is_admin) {
          targetTenant = tenants.find(t => !t.is_admin);
        }
        
        // Last resort: First available workspace
        if (!targetTenant) {
          targetTenant = tenants[0];
        }
        
        if (targetTenant) {
          storage.setItem('tenant_id', targetTenant.id);
          storage.setItem('current_tenant', JSON.stringify(targetTenant));
          storage.setItem('is_admin', String(targetTenant.is_admin || false));
          api.defaults.headers.common['x-tenant-id'] = targetTenant.id;
        }
        
        navigate('/dashboard', { replace: true });
      }
      
    } catch (error: any) {
      console.error('❌ Google callback error:', error);
      
      // Clear the processing flag on error
      sessionStorage.removeItem('google_callback_processed');
      
      // CRITICAL: Clear any auth session on error to prevent auto-login
      try {
        await supabase.auth.signOut();
        console.log('🧹 Cleared Supabase session after error');
      } catch (signOutError) {
        console.error('⚠️ Error clearing session:', signOutError);
      }
      
      // Clear any stored auth data
      [localStorage, sessionStorage].forEach(storage => {
        storage.removeItem('auth_token');
        storage.removeItem('refresh_token');
        storage.removeItem('user_id');
        storage.removeItem('user_data');
      });
      
      // Clear API headers
      delete api.defaults.headers.common['Authorization'];
      
      analyticsService.trackEvent(AUTH_EVENTS.LOGIN_FAILURE, {
        method: 'google',
        error_type: 'callback_error',
        error_message: error.message
      });
      
      setError(error.message || 'Failed to complete Google authentication');
      
      toast.error(error.message || 'Failed to complete Google authentication', {
        duration: 4000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: '#EF4444',
          color: '#FFF',
          fontSize: '16px',
          minWidth: '300px'
        },
      });
      
      setTimeout(() => navigate('/login', { replace: true }), 3000);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex flex-col items-center">
            {isProcessing ? (
              <>
                <div className="w-16 h-16 mb-4">
                  <svg className="animate-spin h-16 w-16 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Completing Google Sign-in
                </h2>
                <p className="text-gray-600 text-center">
                  Please wait while we complete your authentication...
                </p>
              </>
            ) : error ? (
              <>
                <div className="w-16 h-16 mb-4 text-red-500">
                  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Authentication Failed
                </h2>
                <p className="text-gray-600 text-center mb-4">
                  {error}
                </p>
                <p className="text-sm text-gray-500 text-center">
                  Redirecting to login page...
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 mb-4 text-green-500">
                  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Success!
                </h2>
                <p className="text-gray-600 text-center">
                  Redirecting...
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleCallbackPage;