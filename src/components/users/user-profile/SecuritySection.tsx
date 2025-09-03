// src/components/users/user-profile/SecuritySection.tsx
import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Shield, Key, AlertCircle } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/utils/supabase';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface SecuritySectionProps {
 profile: any;
 onChangePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
 updating: boolean;
}

const SecuritySection: React.FC<SecuritySectionProps> = ({
 profile,
 onChangePassword, // We'll ignore this and use Supabase directly
 updating
}) => {
 const { isDarkMode, currentTheme } = useTheme();
 const { hasGoogleAuth, user } = useAuth();
 const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

 // Check if Google OAuth is enabled
 const isGoogleAuthEnabled = import.meta.env.VITE_GOOGLE_AUTH_ENABLED !== 'false';

 const [showChangePassword, setShowChangePassword] = useState(false);
 const [passwordData, setPasswordData] = useState({
   currentPassword: '',
   newPassword: '',
   confirmPassword: ''
 });
 const [showPasswords, setShowPasswords] = useState({
   current: false,
   new: false,
   confirm: false
 });
 const [errors, setErrors] = useState<any>({});
 const [isUpdating, setIsUpdating] = useState(false);

 const handlePasswordChange = (field: string, value: string) => {
   setPasswordData(prev => ({ ...prev, [field]: value }));
   setErrors((prev: any) => ({ ...prev, [field]: '' }));
 };

 const handleSubmit = async () => {
   const newErrors: any = {};

   if (!passwordData.currentPassword) {
     newErrors.currentPassword = 'Current password is required';
   }

   if (!passwordData.newPassword) {
     newErrors.newPassword = 'New password is required';
   } else if (passwordData.newPassword.length < 6) {
     newErrors.newPassword = 'Password must be at least 6 characters';
   }

   if (passwordData.newPassword !== passwordData.confirmPassword) {
     newErrors.confirmPassword = 'Passwords do not match';
   }

   if (passwordData.currentPassword === passwordData.newPassword) {
     newErrors.newPassword = 'New password must be different from current password';
   }

   setErrors(newErrors);
   if (Object.keys(newErrors).length > 0) return;

   setIsUpdating(true);

   try {
     // First, verify the current password by attempting to sign in
     const { error: signInError } = await supabase.auth.signInWithPassword({
       email: user?.email || profile?.email,
       password: passwordData.currentPassword
     });

     if (signInError) {
       setErrors({ currentPassword: 'Current password is incorrect' });
       setIsUpdating(false);
       return;
     }

     // If current password is correct, update to new password
     const { error: updateError } = await supabase.auth.updateUser({
       password: passwordData.newPassword
     });

     if (updateError) {
       toast.error(updateError.message || 'Failed to update password');
       setIsUpdating(false);
       return;
     }

     // Success
     toast.success('Password changed successfully');
     setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
     setShowChangePassword(false);
     setErrors({});
   } catch (error: any) {
     console.error('Password update error:', error);
     toast.error('An error occurred while updating password');
   } finally {
     setIsUpdating(false);
   }
 };

 // Build auth methods array based on what's available
 const authMethods = [
   { 
     type: 'password', 
     label: 'Password', 
     enabled: true,
     icon: Key 
   },
   ...(isGoogleAuthEnabled ? [{
     type: 'google', 
     label: 'Google OAuth', 
     enabled: hasGoogleAuth,
     icon: Shield 
   }] : [])
 ];

 // Check if user has password-based auth
 const hasPasswordAuth = user?.app_metadata?.provider === 'email' || !user?.app_metadata?.provider;
 const isOAuthOnlyUser = user?.app_metadata?.provider === 'google' && !hasPasswordAuth;

 return (
   <div 
     className="border rounded-lg p-6"
     style={{
       backgroundColor: colors.utility.secondaryBackground,
       borderColor: colors.utility.primaryText + '20'
     }}
   >
     <div className="flex items-center mb-6">
       <Lock className="mr-3" style={{ color: colors.brand.primary }} />
       <h2 className="text-xl font-semibold" style={{ color: colors.utility.primaryText }}>
         Security Settings
       </h2>
     </div>

     <div className="space-y-6">
       {/* Authentication Methods */}
       <div>
         <h3 className="text-lg font-medium mb-3" style={{ color: colors.utility.primaryText }}>
           Authentication Methods
         </h3>
         <div className="space-y-2">
           {authMethods.map((method) => {
             const Icon = method.icon;
             return (
               <div 
                 key={method.type}
                 className="flex items-center justify-between p-3 rounded-lg border"
                 style={{
                   backgroundColor: colors.utility.primaryBackground,
                   borderColor: colors.utility.primaryText + '20'
                 }}
               >
                 <div className="flex items-center">
                   <Icon className="mr-3 h-5 w-5" style={{ color: colors.utility.secondaryText }} />
                   <span style={{ color: colors.utility.primaryText }}>{method.label}</span>
                 </div>
                 <span 
                   className={cn(
                     "px-2 py-1 text-xs rounded-full font-medium"
                   )}
                   style={{
                     backgroundColor: method.enabled ? colors.semantic.success + '20' : colors.utility.primaryText + '10',
                     color: method.enabled ? colors.semantic.success : colors.utility.secondaryText
                   }}
                 >
                   {method.enabled ? 'Enabled' : 'Disabled'}
                 </span>
               </div>
             );
           })}
         </div>
       </div>

       {/* Password Section - Only show for users with password auth */}
       {!isOAuthOnlyUser && (
         <div>
           <div className="flex items-center justify-between mb-3">
             <h3 className="text-lg font-medium" style={{ color: colors.utility.primaryText }}>
               Password
             </h3>
             {!showChangePassword && (
               <button
                 onClick={() => setShowChangePassword(true)}
                 className="px-4 py-2 rounded-md font-medium transition-colors"
                 style={{
                   backgroundColor: colors.brand.primary,
                   color: '#ffffff'
                 }}
               >
                 Change Password
               </button>
             )}
           </div>

           {showChangePassword && (
             <div className="space-y-4 p-4 rounded-lg border"
               style={{
                 backgroundColor: colors.utility.primaryBackground,
                 borderColor: colors.utility.primaryText + '20'
               }}
             >
               {/* Current Password */}
               <div>
                 <label className="block text-sm font-medium mb-1" style={{ color: colors.utility.secondaryText }}>
                   Current Password
                 </label>
                 <div className="relative">
                   <input
                     type={showPasswords.current ? 'text' : 'password'}
                     value={passwordData.currentPassword}
                     onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                     className={cn(
                       "w-full px-3 py-2 pr-10 border rounded-md",
                       errors.currentPassword && "border-red-500"
                     )}
                     style={{
                       backgroundColor: colors.utility.secondaryBackground,
                       borderColor: errors.currentPassword ? colors.semantic.error : colors.utility.primaryText + '20',
                       color: colors.utility.primaryText
                     }}
                   />
                   <button
                     type="button"
                     onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                     className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
                   >
                     {showPasswords.current ? (
                       <EyeOff className="h-4 w-4" style={{ color: colors.utility.secondaryText }} />
                     ) : (
                       <Eye className="h-4 w-4" style={{ color: colors.utility.secondaryText }} />
                     )}
                   </button>
                 </div>
                 {errors.currentPassword && (
                   <p className="text-xs mt-1" style={{ color: colors.semantic.error }}>
                     {errors.currentPassword}
                   </p>
                 )}
               </div>

               {/* New Password */}
               <div>
                 <label className="block text-sm font-medium mb-1" style={{ color: colors.utility.secondaryText }}>
                   New Password
                 </label>
                 <div className="relative">
                   <input
                     type={showPasswords.new ? 'text' : 'password'}
                     value={passwordData.newPassword}
                     onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                     className={cn(
                       "w-full px-3 py-2 pr-10 border rounded-md",
                       errors.newPassword && "border-red-500"
                     )}
                     style={{
                       backgroundColor: colors.utility.secondaryBackground,
                       borderColor: errors.newPassword ? colors.semantic.error : colors.utility.primaryText + '20',
                       color: colors.utility.primaryText
                     }}
                   />
                   <button
                     type="button"
                     onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                     className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
                   >
                     {showPasswords.new ? (
                       <EyeOff className="h-4 w-4" style={{ color: colors.utility.secondaryText }} />
                     ) : (
                       <Eye className="h-4 w-4" style={{ color: colors.utility.secondaryText }} />
                     )}
                   </button>
                 </div>
                 {errors.newPassword && (
                   <p className="text-xs mt-1" style={{ color: colors.semantic.error }}>
                     {errors.newPassword}
                   </p>
                 )}
                 <p className="text-xs mt-1" style={{ color: colors.utility.secondaryText }}>
                   Password must be at least 6 characters long
                 </p>
               </div>

               {/* Confirm Password */}
               <div>
                 <label className="block text-sm font-medium mb-1" style={{ color: colors.utility.secondaryText }}>
                   Confirm New Password
                 </label>
                 <div className="relative">
                   <input
                     type={showPasswords.confirm ? 'text' : 'password'}
                     value={passwordData.confirmPassword}
                     onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                     className={cn(
                       "w-full px-3 py-2 pr-10 border rounded-md",
                       errors.confirmPassword && "border-red-500"
                     )}
                     style={{
                       backgroundColor: colors.utility.secondaryBackground,
                       borderColor: errors.confirmPassword ? colors.semantic.error : colors.utility.primaryText + '20',
                       color: colors.utility.primaryText
                     }}
                   />
                   <button
                     type="button"
                     onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                     className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
                   >
                     {showPasswords.confirm ? (
                       <EyeOff className="h-4 w-4" style={{ color: colors.utility.secondaryText }} />
                     ) : (
                       <Eye className="h-4 w-4" style={{ color: colors.utility.secondaryText }} />
                     )}
                   </button>
                 </div>
                 {errors.confirmPassword && (
                   <p className="text-xs mt-1" style={{ color: colors.semantic.error }}>
                     {errors.confirmPassword}
                   </p>
                 )}
               </div>

               {/* Action Buttons */}
               <div className="flex justify-end gap-2 pt-2">
                 <button
                   onClick={() => {
                     setShowChangePassword(false);
                     setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                     setErrors({});
                   }}
                   className="px-4 py-2 rounded-md font-medium border transition-colors"
                   style={{
                     borderColor: colors.utility.primaryText + '30',
                     color: colors.utility.primaryText,
                     backgroundColor: 'transparent'
                   }}
                 >
                   Cancel
                 </button>
                 <button
                   onClick={handleSubmit}
                   disabled={isUpdating}
                   className={cn(
                     "px-4 py-2 rounded-md font-medium transition-colors",
                     isUpdating && "opacity-50 cursor-not-allowed"
                   )}
                   style={{
                     backgroundColor: colors.brand.primary,
                     color: '#ffffff'
                   }}
                 >
                   {isUpdating ? 'Updating...' : 'Update Password'}
                 </button>
               </div>
             </div>
           )}
         </div>
       )}

       {/* OAuth-only user notice */}
       {isOAuthOnlyUser && (
         <div 
           className="p-4 rounded-lg border"
           style={{
             backgroundColor: colors.utility.primaryBackground,
             borderColor: colors.utility.primaryText + '20'
           }}
         >
           <p className="text-sm" style={{ color: colors.utility.secondaryText }}>
             You signed up using Google OAuth. To set a password for your account, 
             please use the "Forgot Password" option on the login page to receive 
             a password reset email.
           </p>
         </div>
       )}

       {/* Security Notice */}
       <div 
         className="flex items-start p-4 rounded-lg border"
         style={{
           backgroundColor: colors.semantic.warning + '10' || '#fef3c7',
           borderColor: colors.semantic.warning + '50' || '#fbbf24'
         }}
       >
         <AlertCircle 
           className="mr-3 mt-0.5 flex-shrink-0" 
           size={20}
           style={{ color: colors.semantic.warning || '#f59e0b' }}
         />
         <div>
           <p className="text-sm font-medium mb-1" style={{ color: colors.utility.primaryText }}>
             Security Recommendations
           </p>
           <ul className="text-xs space-y-1" style={{ color: colors.utility.secondaryText }}>
             <li>• Use a unique password that you don't use elsewhere</li>
             <li>• Enable two-factor authentication when available</li>
             <li>• Change your password regularly</li>
             <li>• Never share your password with anyone</li>
           </ul>
         </div>
       </div>
     </div>
   </div>
 );
};

export default SecuritySection;