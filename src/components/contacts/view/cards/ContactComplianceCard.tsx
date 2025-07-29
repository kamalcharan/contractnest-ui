// src/components/contacts/view/cards/ContactComplianceCard.tsx
import React from 'react';
import { Shield, Copy, ExternalLink, CheckCircle, AlertTriangle } from 'lucide-react';

interface ContactComplianceCardProps {
  contact: any;
}

export const ContactComplianceCard: React.FC<ContactComplianceCardProps> = ({ contact }) => {
  const copyNumber = (number: string) => {
    navigator.clipboard.writeText(number);
  };

  const getVerificationUrl = (type: string, number: string): string | null => {
    switch (type) {
      case 'gst':
        return `https://services.gst.gov.in/services/searchtp?gstin=${number}`;
      case 'pan':
        return `https://www.incometax.gov.in/iec/foportal/help/individual/return-filing-help/verify-pan`;
      case 'cin':
        return `https://www.mca.gov.in/mcafoportal/companyLLPMasterData.html`;
      default:
        return null;
    }
  };

  if (contact.compliance_numbers.length === 0) {
    return null;
  }

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-4">
      <h3 className="text-base font-semibold mb-4">Compliance Numbers</h3>
      
      <div className="space-y-3">
        {contact.compliance_numbers.map((compliance: any, index: number) => {
          const verificationUrl = getVerificationUrl(compliance.type, compliance.number);
          
          return (
            <div key={compliance.id || index} className="p-3 rounded-md bg-muted/30">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {compliance.type.toUpperCase()}
                  </span>
                  {compliance.is_verified && (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="h-3 w-3" />
                      <span className="text-xs">Verified</span>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-1">
                  <button
                    onClick={() => copyNumber(compliance.number)}
                    className="p-1 rounded hover:bg-muted transition-colors"
                    title="Copy number"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                  {verificationUrl && (
                    <button
                      onClick={() => window.open(verificationUrl, '_blank')}
                      className="p-1 rounded hover:bg-muted transition-colors"
                      title="Verify online"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
              
              <p className="text-sm font-mono font-medium text-foreground break-all">
                {compliance.number}
              </p>
              
              {compliance.issuing_authority && (
                <p className="text-xs text-muted-foreground mt-1">
                  <strong>Authority:</strong> {compliance.issuing_authority}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default ContactComplianceCard;