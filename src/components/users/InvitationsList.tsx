// src/components/users/InvitationsList.tsx
import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  Mail, 
  Phone, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  Eye,
  Copy,
  MoreVertical,
  AlertCircle,
  User
} from 'lucide-react';
import { Invitation } from '@/hooks/useInvitations';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface InvitationsListProps {
  invitations: Invitation[];
  onResend: (invitationId: string) => Promise<boolean>;
  onCancel: (invitationId: string) => Promise<boolean>;
  onViewDetails?: (invitation: Invitation) => void;
  isLoading?: boolean;
}

const InvitationsList: React.FC<InvitationsListProps> = ({
  invitations,
  onResend,
  onCancel,
  onViewDetails,
  isLoading = false
}) => {
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  
  // Get status badge
  const getStatusBadge = (invitation: Invitation) => {
    const statusConfig = {
      pending: { icon: Clock, color: 'text-yellow-600 bg-yellow-50', label: 'Pending' },
      sent: { icon: Mail, color: 'text-blue-600 bg-blue-50', label: 'Sent' },
      resent: { icon: RefreshCw, color: 'text-purple-600 bg-purple-50', label: 'Resent' },
      accepted: { icon: CheckCircle, color: 'text-green-600 bg-green-50', label: 'Accepted' },
      expired: { icon: XCircle, color: 'text-red-600 bg-red-50', label: 'Expired' },
      cancelled: { icon: XCircle, color: 'text-gray-600 bg-gray-50', label: 'Cancelled' }
    };
    
    const config = statusConfig[invitation.status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        config.color
      )}>
        <Icon size={14} className="mr-1" />
        {config.label}
      </span>
    );
  };
  
  // Get method icon
  const getMethodIcon = (method: string) => {
    const icons = {
      email: Mail,
      sms: Phone,
      whatsapp: MessageSquare
    };
    return icons[method as keyof typeof icons] || Mail;
  };
  
  // Copy invitation link
  const copyInvitationLink = (invitation: Invitation) => {
    if (invitation.invitation_link) {
      navigator.clipboard.writeText(invitation.invitation_link);
      toast.success('Invitation link copied!', { duration: 2000 });
    }
  };
  
  // Handle resend
  const handleResend = async (invitationId: string) => {
    setProcessingIds(prev => new Set(prev).add(invitationId));
    try {
      await onResend(invitationId);
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(invitationId);
        return newSet;
      });
      setOpenMenuId(null);
    }
  };
  
  // Handle cancel
  const handleCancel = async (invitationId: string) => {
    if (!confirm('Are you sure you want to cancel this invitation?')) return;
    
    setProcessingIds(prev => new Set(prev).add(invitationId));
    try {
      await onCancel(invitationId);
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(invitationId);
        return newSet;
      });
      setOpenMenuId(null);
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-48"></div>
                  <div className="h-3 bg-muted rounded w-32"></div>
                </div>
                <div className="h-8 bg-muted rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (invitations.length === 0) {
    return (
      <div className="text-center py-12 bg-card border border-border rounded-lg">
        <User size={48} className="mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No invitations found</h3>
        <p className="text-muted-foreground">
          Start inviting users to join your workspace
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {invitations.map((invitation) => {
        const MethodIcon = getMethodIcon(invitation.invitation_method);
        const isProcessing = processingIds.has(invitation.id);
        const canResend = ['pending', 'sent', 'resent'].includes(invitation.status);
        const canCancel = ['pending', 'sent', 'resent'].includes(invitation.status);
        
        return (
          <div 
            key={invitation.id} 
            className={cn(
              "bg-card border-2 border-primary/20 rounded-lg p-4 transition-all",
              isProcessing && "opacity-60"
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-start space-x-3">
                  <div className={cn(
                    "p-2 rounded-full",
                    invitation.status === 'accepted' ? "bg-green-100" : "bg-muted"
                  )}>
                    <MethodIcon size={20} className={
                      invitation.status === 'accepted' ? "text-green-600" : "text-muted-foreground"
                    } />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">
                        {invitation.email || invitation.mobile_number || 'Unknown'}
                      </h4>
                      {getStatusBadge(invitation)}
                    </div>
                    
                    <div className="mt-1 space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Invited by {invitation.invited_by_user?.first_name} {invitation.invited_by_user?.last_name}
                        {' • '}
                        {formatDistanceToNow(new Date(invitation.created_at), { addSuffix: true })}
                      </p>
                      
                      {invitation.resent_count > 0 && (
                        <p className="text-sm text-muted-foreground">
                          Resent {invitation.resent_count} time{invitation.resent_count > 1 ? 's' : ''}
                          {invitation.last_resent_at && (
                            <> • Last resent {formatDistanceToNow(new Date(invitation.last_resent_at), { addSuffix: true })}</>
                          )}
                        </p>
                      )}
                      
                      {invitation.accepted_at && invitation.accepted_user && (
                        <p className="text-sm text-green-600">
                          Accepted by {invitation.accepted_user.first_name} {invitation.accepted_user.last_name}
                          {' • '}
                          {formatDistanceToNow(new Date(invitation.accepted_at), { addSuffix: true })}
                        </p>
                      )}
                      
                      {invitation.is_expired && (
                        <div className="flex items-center text-sm text-destructive">
                          <AlertCircle size={14} className="mr-1" />
                          Invitation expired
                        </div>
                      )}
                      
                      {invitation.time_remaining && !invitation.is_expired && canResend && (
                        <p className="text-sm text-muted-foreground">
                          {invitation.time_remaining}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="relative">
                <button
                  onClick={() => setOpenMenuId(openMenuId === invitation.id ? null : invitation.id)}
                  disabled={isProcessing}
                  className="p-2 hover:bg-muted rounded-md transition-colors"
                >
                  <MoreVertical size={16} />
                </button>
                
                {openMenuId === invitation.id && (
                  <div className="absolute right-0 mt-1 w-48 bg-popover border border-border rounded-md shadow-lg z-10">
                    <div className="py-1">
                      {onViewDetails && (
                        <button
                          onClick={() => {
                            onViewDetails(invitation);
                            setOpenMenuId(null);
                          }}
                          className="w-full px-4 py-2 text-sm text-left hover:bg-muted flex items-center"
                        >
                          <Eye size={14} className="mr-2" />
                          View Details
                        </button>
                      )}
                      
                      {invitation.invitation_link && (
                        <button
                          onClick={() => copyInvitationLink(invitation)}
                          className="w-full px-4 py-2 text-sm text-left hover:bg-muted flex items-center"
                        >
                          <Copy size={14} className="mr-2" />
                          Copy Link
                        </button>
                      )}
                      
                      {canResend && (
                        <button
                          onClick={() => handleResend(invitation.id)}
                          disabled={isProcessing}
                          className="w-full px-4 py-2 text-sm text-left hover:bg-muted flex items-center"
                        >
                          <RefreshCw size={14} className="mr-2" />
                          Resend
                        </button>
                      )}
                      
                      {canCancel && (
                        <button
                          onClick={() => handleCancel(invitation.id)}
                          disabled={isProcessing}
                          className="w-full px-4 py-2 text-sm text-left hover:bg-muted flex items-center text-destructive"
                        >
                          <XCircle size={14} className="mr-2" />
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default InvitationsList;