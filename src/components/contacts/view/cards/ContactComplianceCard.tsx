// src/components/contacts/view/cards/ContactComplianceCard.tsx - Full Production Version
import React, { useState } from 'react';
import { 
  Shield, 
  Copy, 
  ExternalLink, 
  CheckCircle, 
  AlertTriangle, 
  Edit,
  Check,
  Calendar,
  Building,
  CreditCard,
  FileText,
  Globe,
  Hash,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { canPerformOperation } from '@/utils/constants/contacts';

interface ComplianceNumber {
  id: string;
  type_value: string;
  type_label: string;
  number: string;
  issuing_authority?: string;
  valid_from?: string;
  valid_to?: string;
  is_verified: boolean;
  hexcolor?: string;
  notes?: string;
}

interface ContactComplianceCardProps {
  contact: {
    id: string;
    type: 'individual' | 'corporate';
    status: 'active' | 'inactive' | 'archived';
    compliance_numbers: ComplianceNumber[];
  };
  onEdit?: () => void;
  className?: string;
}

const ContactComplianceCard: React.FC<ContactComplianceCardProps> = ({ 
  contact, 
  onEdit,
  className = '' 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  // Get compliance type icon
  const getComplianceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'gst':
      case 'vat':
        return CreditCard;
      case 'pan':
      case 'tax_id':
        return FileText;
      case 'cin':
      case 'company_registration':
        return Building;
      case 'ein':
      case 'tin':
        return Hash;
      case 'registration':
        return Shield;
      default:
        return FileText;
    }
  };

  // Get verification URL for online verification
  const getVerificationUrl = (type: string, number: string): string | null => {
    switch (type.toLowerCase()) {
      case 'gst':
        return `https://services.gst.gov.in/services/searchtp?gstin=${number}`;
      case 'pan':
        return `https://www.incometax.gov.in/iec/foportal/help/individual/return-filing-help/verify-pan`;
      case 'cin':
        return `https://www.mca.gov.in/mcafoportal/companyLLPMasterData.html`;
      case 'ein':
        return `https://www.irs.gov/businesses/small-businesses-self-employed/employer-id-numbers`;
      default:
        return null;
    }
  };

  // Check if compliance number is expired
  const isExpired = (validTo?: string): boolean => {
    if (!validTo) return false;
    return new Date(validTo) < new Date();
  };

  // Check if compliance number is expiring soon (within 30 days)
  const isExpiringSoon = (validTo?: string): boolean => {
    if (!validTo) return false;
    const expiryDate = new Date(validTo);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expiryDate <= thirtyDaysFromNow && expiryDate >= new Date();
  };

  // Copy compliance number to clipboard
  const copyNumber = async (number: string, complianceId: string) => {
    try {
      await navigator.clipboard.writeText(number);
      setCopiedNumber(complianceId);
      
      toast({
        title: "Copied!",
        description: "Compliance number copied to clipboard",
        duration: 2000
      });

      // Reset copied state after 2 seconds
      setTimeout(() => setCopiedNumber(null), 2000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to copy",
        description: "Could not copy compliance number"
      });
    }
  };

  // Format date for display
  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  // Get status badge for compliance number
  const getStatusBadge = (compliance: ComplianceNumber) => {
    if (isExpired(compliance.valid_to)) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
          <AlertCircle className="h-3 w-3" />
          Expired
        </span>
      );
    }
    
    if (isExpiringSoon(compliance.valid_to)) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-yellow-50 text-yellow-700 border border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800">
          <AlertTriangle className="h-3 w-3" />
          Expiring Soon
        </span>
      );
    }
    
    if (compliance.is_verified) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
          <CheckCircle className="h-3 w-3" />
          Verified
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-gray-50 text-gray-700 border border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800">
        <Shield className="h-3 w-3" />
        Unverified
      </span>
    );
  };

  // Handle edit action
  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    } else {
      navigate(`/contacts/${contact.id}/edit`);
    }
  };

  // Check if edit is allowed
  const canEdit = canPerformOperation(contact.status, 'edit');

  // Sort compliance numbers: verified first, then by type
  const sortedCompliance = [...contact.compliance_numbers].sort((a, b) => {
    if (a.is_verified && !b.is_verified) return -1;
    if (!a.is_verified && b.is_verified) return 1;
    return a.type_label.localeCompare(b.type_label);
  });

  // Don't show card for individual contacts unless they have compliance numbers
  if (contact.type === 'individual' && sortedCompliance.length === 0) {
    return null;
  }

  return (
    <div className={`bg-card rounded-lg shadow-sm border border-border p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-foreground">Compliance Numbers</h3>
        {canEdit && (
          <button
            onClick={handleEdit}
            className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            title="Edit compliance numbers"
          >
            <Edit className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {/* Compliance Numbers List */}
      {sortedCompliance.length === 0 ? (
        // Empty state
        <div className="text-center py-8">
          <Shield className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-2">
            {contact.type === 'corporate' 
              ? 'No compliance numbers added' 
              : 'No compliance numbers required'
            }
          </p>
          {canEdit && contact.type === 'corporate' && (
            <button
              onClick={handleEdit}
              className="text-xs text-primary hover:underline"
            >
              Add compliance number
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedCompliance.map((compliance) => {
            const IconComponent = getComplianceIcon(compliance.type_value);
            const verificationUrl = getVerificationUrl(compliance.type_value, compliance.number);
            const isCopied = copiedNumber === compliance.id;
            const isExpiredNumber = isExpired(compliance.valid_to);
            const isExpiringSoonNumber = isExpiringSoon(compliance.valid_to);
            
            return (
              <div 
                key={compliance.id} 
                className={`p-3 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors group ${
                  isExpiredNumber ? 'border-l-4 border-red-500' : 
                  isExpiringSoonNumber ? 'border-l-4 border-yellow-500' : ''
                }`}
              >
                {/* Header with type and status */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div 
                      className="p-1.5 rounded-md text-white"
                      style={{ 
                        backgroundColor: compliance.hexcolor || '#6b7280' 
                      }}
                    >
                      <IconComponent className="h-4 w-4" />
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-foreground">
                          {compliance.type_label}
                        </span>
                        {getStatusBadge(compliance)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Copy button */}
                    <button
                      onClick={() => copyNumber(compliance.number, compliance.id)}
                      className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      title="Copy number"
                    >
                      {isCopied ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                    
                    {/* Verification button */}
                    {verificationUrl && (
                      <button
                        onClick={() => window.open(verificationUrl, '_blank')}
                        className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                        title="Verify online"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Compliance Number */}
                <div className="mb-3">
                  <code className="text-sm font-mono font-bold text-foreground bg-muted/50 px-2 py-1 rounded border break-all">
                    {compliance.number}
                  </code>
                </div>
                
                {/* Details */}
                <div className="space-y-2 text-xs text-muted-foreground">
                  {/* Issuing Authority */}
                  {compliance.issuing_authority && (
                    <div className="flex items-center gap-2">
                      <Building className="h-3 w-3 flex-shrink-0" />
                      <span><strong>Authority:</strong> {compliance.issuing_authority}</span>
                    </div>
                  )}
                  
                  {/* Valid From/To */}
                  {(compliance.valid_from || compliance.valid_to) && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 flex-shrink-0" />
                      <span>
                        <strong>Valid:</strong> 
                        {compliance.valid_from && ` From ${formatDate(compliance.valid_from)}`}
                        {compliance.valid_to && ` To ${formatDate(compliance.valid_to)}`}
                      </span>
                    </div>
                  )}
                  
                  {/* Expiry Warning */}
                  {isExpiredNumber && (
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                      <AlertCircle className="h-3 w-3 flex-shrink-0" />
                      <span><strong>This compliance number has expired</strong></span>
                    </div>
                  )}
                  
                  {isExpiringSoonNumber && (
                    <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                      <AlertTriangle className="h-3 w-3 flex-shrink-0" />
                      <span><strong>Expires in {Math.ceil((new Date(compliance.valid_to!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days</strong></span>
                    </div>
                  )}
                </div>
                
                {/* Notes */}
                {compliance.notes && (
                  <div className="mt-3 p-2 bg-muted/50 rounded text-xs text-muted-foreground">
                    <div className="flex items-start gap-1">
                      <span>📋</span>
                      <span>{compliance.notes}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      
      {/* Footer with add compliance option */}
      {canEdit && sortedCompliance.length > 0 && contact.type === 'corporate' && (
        <div className="mt-4 pt-3 border-t border-border">
          <button
            onClick={handleEdit}
            className="text-xs text-primary hover:underline"
          >
            + Add another compliance number
          </button>
        </div>
      )}
      
      {/* Compliance statistics */}
      {sortedCompliance.length > 1 && (
        <div className="mt-4 pt-3 border-t border-border">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>{sortedCompliance.length} compliance numbers</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-600" />
              {sortedCompliance.filter(c => c.is_verified).length} verified
            </span>
            {sortedCompliance.some(c => isExpired(c.valid_to)) && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1 text-red-600">
                  <AlertCircle className="h-3 w-3" />
                  {sortedCompliance.filter(c => isExpired(c.valid_to)).length} expired
                </span>
              </>
            )}
            {sortedCompliance.some(c => isExpiringSoon(c.valid_to)) && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1 text-yellow-600">
                  <AlertTriangle className="h-3 w-3" />
                  {sortedCompliance.filter(c => isExpiringSoon(c.valid_to)).length} expiring soon
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactComplianceCard;