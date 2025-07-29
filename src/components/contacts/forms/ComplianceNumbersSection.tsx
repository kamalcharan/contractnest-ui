// src/components/contacts/forms/ComplianceNumbersSection.tsx - Card-Based Version
import React, { useState } from 'react';
import { Plus, Shield, Trash2, Edit2, Copy, ExternalLink, CheckCircle, AlertTriangle } from 'lucide-react';

// Types
interface ComplianceNumber {
  id?: string;
  type: 'gst' | 'pan' | 'cin' | 'tax_id' | 'vat' | 'other';
  number: string;
  issuing_authority?: string;
  valid_from?: string;
  valid_to?: string;
  is_verified: boolean;
  notes?: string;
}

interface ComplianceNumbersSectionProps {
  value: ComplianceNumber[];
  onChange: (complianceNumbers: ComplianceNumber[]) => void;
  disabled?: boolean;
  contactType?: 'individual' | 'corporate';
}

const ComplianceNumbersSection: React.FC<ComplianceNumbersSectionProps> = ({
  value,
  onChange,
  disabled = false,
  contactType = 'corporate'
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Don't render if individual contact
  if (contactType === 'individual') {
    return null;
  }

  // Compliance type options with descriptions
  const complianceTypes = [
    {
      value: 'gst',
      label: 'GST Number',
      desc: 'Goods and Services Tax identification',
      pattern: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      placeholder: '27AAAAA0000A1Z5'
    },
    {
      value: 'pan',
      label: 'PAN Number',
      desc: 'Permanent Account Number',
      pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
      placeholder: 'AAAAA0000A'
    },
    {
      value: 'cin',
      label: 'CIN Number',
      desc: 'Corporate Identification Number',
      pattern: /^[LUu][0-9]{5}[A-Za-z]{2}[0-9]{4}[A-Za-z]{3}[0-9]{6}$/,
      placeholder: 'L17110MH1973PLC019786'
    },
    {
      value: 'tax_id',
      label: 'Tax ID',
      desc: 'General tax identification number',
      placeholder: 'Tax identification number'
    },
    {
      value: 'vat',
      label: 'VAT Number',
      desc: 'Value Added Tax number',
      placeholder: 'VAT registration number'
    },
    {
      value: 'other',
      label: 'Other',
      desc: 'Other compliance or registration number',
      placeholder: 'Enter compliance number'
    }
  ];

  // Add new compliance number
  const addComplianceNumber = (newCompliance: Omit<ComplianceNumber, 'id'>) => {
    if (disabled) return;
    
    const complianceWithId: ComplianceNumber = {
      ...newCompliance,
      id: `temp_${Date.now()}`
    };

    onChange([...value, complianceWithId]);
    setIsAddModalOpen(false);
  };

  // Remove compliance number
  const removeComplianceNumber = (index: number) => {
    if (disabled) return;
    onChange(value.filter((_, i) => i !== index));
  };

  // Update compliance number
  const updateComplianceNumber = (index: number, updates: Partial<ComplianceNumber>) => {
    if (disabled) return;
    
    const newCompliance = [...value];
    newCompliance[index] = { ...newCompliance[index], ...updates };
    onChange(newCompliance);
  };

  // Validate compliance number format
  const validateNumber = (type: string, number: string): boolean => {
    const complianceType = complianceTypes.find(ct => ct.value === type);
    if (!complianceType?.pattern || !number) return true;
    return complianceType.pattern.test(number);
  };

  // Copy compliance number to clipboard
  const copyNumber = (number: string) => {
    navigator.clipboard.writeText(number);
  };

  // Get government verification URL
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

  // Get compliance type info
  const getComplianceTypeInfo = (type: string) => {
    return complianceTypes.find(ct => ct.value === type) || complianceTypes[0];
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Compliance Numbers</h2>
          <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full dark:bg-blue-900/20 dark:text-blue-400">
            Corporate Only
          </div>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          disabled={disabled}
          className="flex items-center px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add
        </button>
      </div>
      
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md dark:bg-blue-900/20 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-400">
          <Shield className="inline h-4 w-4 mr-1" />
          Add tax, registration, and other compliance numbers for this corporate entity.
        </p>
      </div>
      
      {/* Compliance Number Cards */}
      {value.length === 0 ? (
        <div className="text-center p-8 border-2 border-dashed border-border rounded-lg">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground mb-4">No compliance numbers added yet</p>
          <p className="text-sm text-muted-foreground mb-4">
            Add GST, PAN, CIN, or other regulatory identification numbers
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            disabled={disabled}
            className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Compliance Number
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {value.map((compliance, index) => {
            const typeInfo = getComplianceTypeInfo(compliance.type);
            const isValidFormat = validateNumber(compliance.type, compliance.number);
            const verificationUrl = getVerificationUrl(compliance.type, compliance.number);
            
            return (
              <div 
                key={compliance.id || index} 
                className="relative p-4 rounded-lg border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all"
              >
                {/* Verified Badge */}
                {compliance.is_verified && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full dark:bg-green-900/20 dark:text-green-400">
                    <CheckCircle className="h-3 w-3" />
                    Verified
                  </div>
                )}

                {/* Compliance Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">
                        {typeInfo.label}
                      </span>
                      <span className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-full">
                        {compliance.type.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {typeInfo.desc}
                    </p>
                  </div>
                </div>

                {/* Compliance Content */}
                <div className="mb-4">
                  <p className="text-sm font-mono font-medium text-foreground mb-1 break-all">
                    {compliance.number}
                  </p>
                  
                  {/* Validation Status */}
                  <div className="flex items-center gap-2 mb-2">
                    {compliance.number && (
                      isValidFormat ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="h-3 w-3" />
                          <span className="text-xs">Valid format</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-red-600">
                          <AlertTriangle className="h-3 w-3" />
                          <span className="text-xs">Invalid format</span>
                        </div>
                      )
                    )}
                  </div>

                  {compliance.issuing_authority && (
                    <p className="text-xs text-muted-foreground mb-1">
                      <strong>Authority:</strong> {compliance.issuing_authority}
                    </p>
                  )}

                  {(compliance.valid_from || compliance.valid_to) && (
                    <p className="text-xs text-muted-foreground mb-1">
                      <strong>Valid:</strong> 
                      {compliance.valid_from && ` From ${compliance.valid_from}`}
                      {compliance.valid_to && ` To ${compliance.valid_to}`}
                    </p>
                  )}
                  
                  {compliance.notes && (
                    <p className="text-xs text-muted-foreground mt-2 p-2 bg-muted/50 rounded">
                      💡 {compliance.notes}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyNumber(compliance.number)}
                      className="p-1.5 rounded-md hover:bg-muted transition-colors"
                      title="Copy number"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                    {verificationUrl && (
                      <button
                        onClick={() => window.open(verificationUrl, '_blank')}
                        className="p-1.5 rounded-md hover:bg-muted transition-colors"
                        title="Verify online"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                  
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditingIndex(index)}
                      disabled={disabled}
                      className="p-1.5 rounded-md hover:bg-muted transition-colors disabled:opacity-50"
                      title="Edit compliance number"
                    >
                      <Edit2 className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => removeComplianceNumber(index)}
                      disabled={disabled}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                      title="Remove compliance number"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary Information */}
      {value.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md dark:bg-blue-900/20 dark:border-blue-800">
          <div className="text-sm text-blue-800 dark:text-blue-400">
            <strong>{value.length}</strong> compliance number{value.length !== 1 ? 's' : ''} added
            {value.filter(c => c.is_verified).length > 0 && (
              <>
                {' '} • <strong>{value.filter(c => c.is_verified).length}</strong> verified
              </>
            )}
            {value.filter(c => c.valid_to && new Date(c.valid_to) < new Date()).length > 0 && (
              <>
                {' '} • <strong className="text-red-600">{value.filter(c => c.valid_to && new Date(c.valid_to) < new Date()).length}</strong> expired
              </>
            )}
          </div>
        </div>
      )}

      {/* Add Compliance Number Modal */}
      {isAddModalOpen && (
        <AddComplianceModal
          onAdd={addComplianceNumber}
          onClose={() => setIsAddModalOpen(false)}
          complianceTypes={complianceTypes}
        />
      )}

      {/* Edit Compliance Number Modal */}
      {editingIndex !== null && (
        <EditComplianceModal
          compliance={value[editingIndex]}
          onSave={(updates) => {
            updateComplianceNumber(editingIndex, updates);
            setEditingIndex(null);
          }}
          onClose={() => setEditingIndex(null)}
          complianceTypes={complianceTypes}
        />
      )}
    </div>
  );
};

// Add Compliance Modal Component
interface AddComplianceModalProps {
  onAdd: (compliance: Omit<ComplianceNumber, 'id'>) => void;
  onClose: () => void;
  complianceTypes: any[];
}

const AddComplianceModal: React.FC<AddComplianceModalProps> = ({ onAdd, onClose, complianceTypes }) => {
  const [complianceData, setComplianceData] = useState({
    type: 'gst' as ComplianceNumber['type'],
    number: '',
    issuing_authority: '',
    valid_from: '',
    valid_to: '',
    is_verified: false,
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complianceData.number.trim()) return;

    onAdd(complianceData);
  };

  const currentType = complianceTypes.find(ct => ct.value === complianceData.type);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-2xl h-[90vh] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Add Compliance Number</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-md transition-colors"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              {/* Compliance Type */}
              <div>
                <label className="block text-sm font-medium mb-2">Compliance Type</label>
                <select
                  value={complianceData.type}
                  onChange={(e) => setComplianceData(prev => ({ ...prev, type: e.target.value as ComplianceNumber['type'] }))}
                  className="w-full p-2 border border-border rounded-md bg-background"
                >
                  {complianceTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {currentType && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {currentType.desc}
                  </p>
                )}
              </div>

              {/* Number */}
              <div>
                <label className="block text-sm font-medium mb-2">Number *</label>
                <input
                  type="text"
                  value={complianceData.number}
                  onChange={(e) => setComplianceData(prev => ({ ...prev, number: e.target.value.toUpperCase() }))}
                  placeholder={currentType?.placeholder || 'Enter number'}
                  className="w-full p-2 border border-border rounded-md bg-background font-mono"
                  required
                />
              </div>

              {/* Issuing Authority */}
              <div>
                <label className="block text-sm font-medium mb-2">Issuing Authority</label>
                <input
                  type="text"
                  value={complianceData.issuing_authority}
                  onChange={(e) => setComplianceData(prev => ({ ...prev, issuing_authority: e.target.value }))}
                  placeholder="e.g., Income Tax Department"
                  className="w-full p-2 border border-border rounded-md bg-background"
                />
              </div>

              {/* Validity Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Valid From</label>
                  <input
                    type="date"
                    value={complianceData.valid_from}
                    onChange={(e) => setComplianceData(prev => ({ ...prev, valid_from: e.target.value }))}
                    className="w-full p-2 border border-border rounded-md bg-background"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Valid To</label>
                  <input
                    type="date"
                    value={complianceData.valid_to}
                    onChange={(e) => setComplianceData(prev => ({ ...prev, valid_to: e.target.value }))}
                    className="w-full p-2 border border-border rounded-md bg-background"
                  />
                </div>
              </div>

              {/* Verified */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_verified"
                  checked={complianceData.is_verified}
                  onChange={(e) => setComplianceData(prev => ({ ...prev, is_verified: e.target.checked }))}
                  className="mr-2"
                />
                <label htmlFor="is_verified" className="text-sm">Mark as verified</label>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
                <input
                  type="text"
                  value={complianceData.notes}
                  onChange={(e) => setComplianceData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any notes about this compliance number..."
                  className="w-full p-2 border border-border rounded-md bg-background"
                />
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-border flex-shrink-0">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-primary rounded-md hover:bg-muted transition-colors text-primary"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Add Number
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Edit Compliance Modal (similar structure)
interface EditComplianceModalProps {
  compliance: ComplianceNumber;
  onSave: (updates: Partial<ComplianceNumber>) => void;
  onClose: () => void;
  complianceTypes: any[];
}

const EditComplianceModal: React.FC<EditComplianceModalProps> = ({ compliance, onSave, onClose, complianceTypes }) => {
  const [complianceData, setComplianceData] = useState({
    type: compliance.type,
    number: compliance.number,
    issuing_authority: compliance.issuing_authority || '',
    valid_from: compliance.valid_from || '',
    valid_to: compliance.valid_to || '',
    is_verified: compliance.is_verified,
    notes: compliance.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complianceData.number.trim()) return;

    onSave(complianceData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-2xl h-[90vh] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Edit Compliance Number</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-md transition-colors"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6">
            {/* Similar form structure as Add Modal */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Compliance Type</label>
                <select
                  value={complianceData.type}
                  onChange={(e) => setComplianceData(prev => ({ ...prev, type: e.target.value as ComplianceNumber['type'] }))}
                  className="w-full p-2 border border-border rounded-md bg-background"
                >
                  {complianceTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Number *</label>
                <input
                  type="text"
                  value={complianceData.number}
                  onChange={(e) => setComplianceData(prev => ({ ...prev, number: e.target.value.toUpperCase() }))}
                  className="w-full p-2 border border-border rounded-md bg-background font-mono"
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="edit_is_verified"
                  checked={complianceData.is_verified}
                  onChange={(e) => setComplianceData(prev => ({ ...prev, is_verified: e.target.checked }))}
                  className="mr-2"
                />
                <label htmlFor="edit_is_verified" className="text-sm">Mark as verified</label>
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-border flex-shrink-0">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-primary rounded-md hover:bg-muted transition-colors text-primary"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceNumbersSection;