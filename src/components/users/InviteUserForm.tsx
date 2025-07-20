// src/components/users/InviteUserForm.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Mail, 
  Phone, 
  User, 
  Send,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { CreateInvitationData } from '@/hooks/useInvitations';
import { cn } from '@/lib/utils';

// Form validation schema - simplified
const inviteSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  mobile_number: z.string().regex(/^[+]?[\d\s-()]+$/, 'Invalid mobile number').optional(),
  role_id: z.string().uuid().optional(),
  custom_message: z.string().max(500, 'Message too long').optional()
}).refine(
  (data) => data.email || data.mobile_number,
  {
    message: "Either email or mobile number is required",
    path: ["email"]
  }
);

type InviteFormData = z.infer<typeof inviteSchema>;

interface InviteUserFormProps {
  onSubmit: (data: CreateInvitationData) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
  availableRoles?: Array<{ id: string; name: string; description?: string }>;
}

const InviteUserForm: React.FC<InviteUserFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
  availableRoles = []
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      custom_message: 'Welcome to our team! We\'re excited to have you join us. Please click the link below to accept your invitation and set up your account.'
    }
  });
  
  // Watch email and mobile to show/hide fields
  const email = watch('email');
  const mobile = watch('mobile_number');
  
  // Handle form submission
  const onFormSubmit = async (data: InviteFormData) => {
    try {
      // Only include the fields that have values
      const invitationData: CreateInvitationData = {
        invitation_method: data.email ? 'email' : 'sms'
      };
      
      if (data.email) {
        invitationData.email = data.email;
      }
      if (data.mobile_number) {
        invitationData.mobile_number = data.mobile_number;
      }
      if (data.role_id) {
        invitationData.role_id = data.role_id;
      }
      if (data.custom_message) {
        invitationData.custom_message = data.custom_message;
      }
      
      await onSubmit(invitationData);
    } catch (error) {
      // Error handling is done in the parent component
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      {/* Contact Information */}
      <div>
        <p className="text-sm text-muted-foreground mb-3">
          Enter email or mobile number. Invitation will be sent automatically.
        </p>
        
        {/* Email Input */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              {...register('email')}
              type="email"
              id="email"
              placeholder="john.doe@example.com"
              className={cn(
                "w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50",
                errors.email ? "border-destructive" : "border-border"
              )}
              disabled={isSubmitting}
            />
          </div>
          {errors.email && (
            <div className="mt-1 flex items-center text-sm text-destructive">
              <AlertCircle size={14} className="mr-1" />
              {errors.email.message}
            </div>
          )}
        </div>
        
        {/* OR Divider */}
        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">or</span>
          </div>
        </div>
        
        {/* Mobile Number Input */}
        <div>
          <label htmlFor="mobile_number" className="block text-sm font-medium mb-2">
            Mobile number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              {...register('mobile_number')}
              type="tel"
              id="mobile_number"
              placeholder="+91 98765 43210"
              className={cn(
                "w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50",
                errors.mobile_number ? "border-destructive" : "border-border"
              )}
              disabled={isSubmitting}
            />
          </div>
          {errors.mobile_number && (
            <div className="mt-1 flex items-center text-sm text-destructive">
              <AlertCircle size={14} className="mr-1" />
              {errors.mobile_number.message}
            </div>
          )}
        </div>
      </div>
      
      {/* Role Selection */}
      {availableRoles.length > 0 && (
        <div>
          <label htmlFor="role_id" className="block text-sm font-medium mb-2">
            Assign role (optional)
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <select
              {...register('role_id')}
              id="role_id"
              className="w-full pl-10 pr-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
              disabled={isSubmitting}
            >
              <option value="">Select a role</option>
              {availableRoles.map(role => (
                <option key={role.id} value={role.id}>
                  {role.name}
                  {role.description && ` - ${role.description}`}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
      
      {/* Custom Message */}
      <div>
        <label htmlFor="custom_message" className="block text-sm font-medium mb-2">
          Personal message (optional)
        </label>
        <textarea
          {...register('custom_message')}
          id="custom_message"
          rows={3}
          placeholder="Add a personal welcome message..."
          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          disabled={isSubmitting}
        />
        {errors.custom_message && (
          <div className="mt-1 flex items-center text-sm text-destructive">
            <AlertCircle size={14} className="mr-1" />
            {errors.custom_message.message}
          </div>
        )}
      </div>
      
      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-muted transition-colors"
          >
            Cancel
          </button>
        )}
        
        <button
          type="submit"
          disabled={isSubmitting || (!email && !mobile)}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center",
            "bg-primary text-primary-foreground hover:bg-primary/90",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send size={16} className="mr-2" />
              Send Invitation
            </>
          )}
        </button>
      </div>
      
      {/* Info Message */}
      <div className="mt-3 p-2.5 bg-muted/50 rounded-md">
        <p className="text-xs text-muted-foreground">
          Invitation will be sent via all configured channels. Expires in <strong>48 hours</strong>.
        </p>
      </div>
    </form>
  );
};

export default InviteUserForm;