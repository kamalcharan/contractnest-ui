// src/components/SessionConflictNotification.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, X, LogIn, LogOut } from 'lucide-react';
import { useSessionConflict } from '../hooks/useSessionConflict';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const SessionConflictNotification: React.FC = () => {
  const { hasSessionConflict, clearSessionConflict } = useSessionConflict();
  const { logout, user } = useAuth();
  const { isDarkMode, currentTheme } = useTheme();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  useEffect(() => {
    if (hasSessionConflict && !isProcessing) {
      setIsVisible(true);
    } else if (!hasSessionConflict) {
      setIsVisible(false);
    }
  }, [hasSessionConflict, isProcessing]);

  if (!isVisible) return null;

  const handleTakeOver = async () => {
    setIsProcessing(true);
    
    // Force this session to be active
    const sessionId = sessionStorage.getItem('session_id');
    if (sessionId && user) {
      // Clear any existing session
      localStorage.setItem(`active_session_${user.id}`, sessionId);
      
      // Broadcast takeover to other tabs
      if (window.BroadcastChannel) {
        const channel = new BroadcastChannel('session_conflict');
        channel.postMessage({ 
          userId: user.id, 
          sessionId,
          action: 'takeover' 
        });
        channel.close();
      }
      
      // Clear the conflict state
      clearSessionConflict();
      setIsVisible(false);
      setIsProcessing(false);
      
      // Reload to ensure clean state
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  const handleLogout = async () => {
    setIsProcessing(true);
    
    // Broadcast logout to other tabs
    if (window.BroadcastChannel && user) {
      const channel = new BroadcastChannel('session_conflict');
      channel.postMessage({ 
        userId: user.id,
        action: 'logout' 
      });
      channel.close();
    }
    
    // Clear the active session
    if (user) {
      localStorage.removeItem(`active_session_${user.id}`);
    }
    
    await logout();
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Don't clear the conflict, just hide the notification
  };

  return (
    <div 
      className="fixed top-4 right-4 max-w-md w-full border rounded-lg shadow-xl z-50 animate-in slide-in-from-right transition-colors"
      style={{
        backgroundColor: colors.utility.secondaryBackground,
        borderColor: colors.utility.secondaryText + '20'
      }}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AlertTriangle 
              className="h-6 w-6" 
              style={{ color: colors.semantic.warning }}
            />
          </div>
          <div className="ml-3 flex-1">
            <h3 
              className="text-sm font-medium transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              Active Session Detected
            </h3>
            <p 
              className="mt-1 text-sm transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              Your account is currently active in another browser or device.
            </p>
            
            <div className="mt-4 flex flex-col space-y-2">
              <button
                onClick={handleTakeOver}
                disabled={isProcessing}
                className="flex items-center justify-center px-3 py-2 text-white rounded-md disabled:opacity-50 transition-all duration-200 hover:opacity-90"
                style={{
                  background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
                }}
              >
                <LogIn className="h-4 w-4 mr-2" />
                {isProcessing ? 'Processing...' : 'Use This Session'}
              </button>
              
              <button
                onClick={handleLogout}
                disabled={isProcessing}
                className="flex items-center justify-center px-3 py-2 border rounded-md disabled:opacity-50 transition-colors hover:opacity-80"
                style={{
                  borderColor: colors.utility.secondaryText + '40',
                  backgroundColor: colors.utility.secondaryText + '05',
                  color: colors.utility.primaryText
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.utility.secondaryText + '10';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.utility.secondaryText + '05';
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                {isProcessing ? 'Logging out...' : 'Logout'}
              </button>
            </div>
            
            <p 
              className="mt-3 text-xs transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              If you didn't initiate the other session, please logout and change your password immediately.
            </p>
          </div>
          
          <button
            onClick={handleDismiss}
            disabled={isProcessing}
            className="ml-3 flex-shrink-0 disabled:opacity-50 transition-colors hover:opacity-80"
            style={{ color: colors.utility.secondaryText }}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionConflictNotification;