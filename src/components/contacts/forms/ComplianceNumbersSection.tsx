// src/components/contacts/forms/ComplianceNumbersSection.tsx - MasterData Integrated
import React, { useState } from 'react';
import { Plus, Shield, Trash2, Edit2, Copy, ExternalLink, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useToast } from '@/components/ui/use-toast';
import { captureException } from '@/utils/sentry';
import { analyticsService } from '@/services/analytics.service';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';
import { useMasterDataOptions } from '@/hooks/useMasterData';
import { 
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  VALIDATION_RULES
} from '@/utils/constants/contacts';

// Types matching your backend API structure
interface ComplianceNumber {
  id?: string;
  type_value: string; // MasterData SubCatName
  type_label?: string; // MasterData DisplayName
  number: string;
  issuing_authority?: string;
  valid_from?: string;
  valid_to?: string;
  is_verified: boolean;
  notes?: string;
  hexcolor?: string; // From MasterData
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
  const { isDarkMode } = useTheme();
  const { toast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  // Load compliance types from MasterData
  const { 
    options: complianceTypes, 
    loading: isLoadingTypes, 
    error: loadError,
    refetch: refetchTypes 
  } = useMasterDataOptions('Compliance Numbers', {
    valueField: 'SubCatName',
    labelField: 'DisplayName',
    includeInactive: false,
    sortBy: 'Sequence_no',
    sortOrder: 'asc'
  });

  // Track analytics
  React.useEffect(() => {
    if (value.length > 0 && contactType === 'corporate') {
      analyticsService.trackPageView(
        'contacts/compliance-numbers',
        `Compliance Numbers: ${value.length}`
      );
    }
  }, [value.length, contactType]);

  // Don't render if individual contact
  if (contactType === 'individual') {
    return null;
  }

  // Add new compliance number
  const addComplianceNumber = (newCompliance: Omit<ComplianceNumber, 'id'>) => {
    if (disabled) return;
    
    const complianceWithId: ComplianceNumber = {
      ...newCompliance,
      id: `temp_${Date.now()}`
    };

    onChange([...value, complianceWithId]);
    setIsAddModalOpen(false);
    
    toast({
      title: "Success",
      description: `${newCompliance.type_label} added successfully`
    });
  };

  // Remove compliance number
  const removeComplianceNumber = (index: number) => {
    if (disabled) return;
    onChange(value.filter((_, i) => i !== index));
    setShowDeleteDialog(false);
    setDeleteIndex(null);
    
    toast({
      title: "Success",
      description: "Compliance number removed"
    });
  };

  // Update compliance number
  const updateComplianceNumber = (index: number, updates: Partial<ComplianceNumber>) => {
    if (disabled) return;
    
    const newCompliance = [...value];
    newCompliance[index] = { ...newCompliance[index], ...updates };
    onChange(newCompliance);
  };

  // Validate compliance number format based on MasterData patterns
  const validateNumber = (typeValue: string, number: string): boolean => {
    const complianceType = complianceTypes.find(ct => ct.value === typeValue);
    if (!complianceType || !number) return true;
    
    // Check if MasterData has validation pattern in tags or description
    const pattern = complianceType.tags?.[0]; // Assuming pattern is stored in tags
    if (pattern) {
      try {
        const regex = new RegExp(pattern);
        return regex.test(number);
      } catch {
        return true; // If pattern is invalid, skip validation
      }
    }
    
    return true;
  };

  // Copy compliance number to clipboard
  const copyNumber = async (number: string) => {
    try {
      await navigator.clipboard.writeText(number);
      toast({
        title: "Copied",
        description: "Compliance number copied to clipboard"
      });
    } catch (error) {
      captureException(error, {
        tags: { component: 'ComplianceNumbersSection', action: 'copyNumber' }
      });
    }
  };

  // Get government verification URL (could be stored in MasterData tool_tip)
  const getVerificationUrl = (typeValue: string): string | null => {
    const complianceType = complianceTypes.find(ct => ct.value === typeValue);
    return complianceType?.tool_tip || null; // Assuming URL is stored in tool_tip
  };

  // Get compliance type info
  const getComplianceTypeInfo = (typeValue: string) => {
    return complianceTypes.find(ct => ct.value === typeValue);
  };

  // Get expiry status
  const getExpiryStatus = (validTo?: string) => {
    if (!validTo) return null;
    
    const expiryDate = new Date(validTo);
    const today = new Date();
    const diffDays = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    if (diffDays < 0) return { status: 'expired', message: 'Expired', colorClass: 'text-destructive' };
    if (diffDays <= 30) return { status: 'expiring', message: `Expires in ${diffDays} days`, colorClass: 'text-warning' };
    return { status: 'valid', message: 'Valid', colorClass: 'text-success' };
  };

  const handleDeleteClick = (index: number) => {
    setDeleteIndex(index);
    setShowDeleteDialog(true);
  };

  // Handle load error
  if (loadError) {
    captureException(loadError, {
      tags: { component: 'ComplianceNumbersSection', action: 'loadComplianceTypes' },
      extra: { error: loadError.message }
    });
  }

  return (
    <div className="rounded-lg shadow-sm border p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-foreground">Compliance Numbers</h2>
          <div className="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary">
            Corporate Only
          </div>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          disabled={disabled || isLoadingTypes}
          className="flex items-center px-3 py-2 rounded-md hover:bg-primary/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground bg-primary"
        >
          {isLoadingTypes ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          Add
        </button>
      </div>
      
      <div className="mb-4 p-3 rounded-md border bg-primary/10 border-primary/20">
        <p className="text-sm text-primary">
          <Shield className="inline h-4 w-4 mr-1" />
          Add tax, registration, and other compliance numbers for this corporate entity.
        </p>
      </div>
      
      {/* Loading State */}
      {isLoadingTypes && value.length === 0 && (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Error State */}
      {loadError && !isLoadingTypes && (
        <div className="text-center p-8 border-2 border-dashed rounded-lg border-destructive/50">
          <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-destructive" />
          <p className="mb-4 text-muted-foreground">Failed to load compliance types</p>
          <button
            onClick={() => refetchTypes()}
            className="text-primary hover:underline"
          >
            Try again
          </button>
        </div>
      )}
      
      {/* Compliance Number Cards */}
      {!isLoadingTypes && !loadError && value.length === 0 ? (
        <div className="text-center p-8 border-2 border-dashed rounded-lg border-border">
          <Shield className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
          <p className="mb-4 text-muted-foreground">No compliance numbers added yet</p>
          <p className="text-sm mb-4 text-muted-foreground">
            Add GST, PAN, CIN, or other regulatory identification numbers
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            disabled={disabled}
            className="flex items-center px-4 py-2 rounded-md hover:bg-primary/90 transition-colors mx-auto disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground bg-primary"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Compliance Number
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {value.map((compliance, index) => {
            const typeInfo = getComplianceTypeInfo(compliance.type_value);
            const isValidFormat = validateNumber(compliance.type_value, compliance.number);
            const verificationUrl = getVerificationUrl(compliance.type_value);
            const expiryStatus = getExpiryStatus(compliance.valid_to);
            const displayColor = compliance.hexcolor || typeInfo?.color || '#6b7280';
            
            return (
              <div 
                key={compliance.id || index} 
                className="relative p-4 rounded-lg border hover:shadow-md transition-all bg-card border-border"
              >
                {/* Verified Badge */}
                {compliance.is_verified && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-600 dark:text-green-400">
                    <CheckCircle className="h-3 w-3" />
                    Verified
                  </div>
                )}

                {/* Compliance Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div 
                    className="p-2 rounded-lg"
                    style={{ 
                      backgroundColor: `${displayColor}20`,
                      color: displayColor 
                    }}
                  >
                    <Shield className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-foreground">
                        {compliance.type_label || typeInfo?.label || compliance.type_value}
                      </span>
                      <span 
                        className="text-xs px-2 py-1 rounded-full"
                        style={{ 
                          backgroundColor: `${displayColor}15`,
                          color: displayColor
                        }}
                      >
                        {compliance.type_value.toUpperCase()}
                      </span>
                    </div>
                    {typeInfo?.description && (
                      <p className="text-xs text-muted-foreground">
                        {typeInfo.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Compliance Content */}
                <div className="mb-4">
                  <p className="text-sm font-mono font-medium mb-1 break-all text-foreground">
                    {compliance.number}
                  </p>
                  
                  {/* Validation & Expiry Status */}
                  <div className="flex items-center gap-2 mb-2">
                    {compliance.number && !isValidFormat && (
                      <div className="flex items-center gap-1 text-destructive">
                        <AlertTriangle className="h-3 w-3" />
                        <span className="text-xs">Invalid format</span>
                      </div>
                    )}
                    
                    {expiryStatus && (
                      <div className={`flex items-center gap-1 ${expiryStatus.colorClass}`}>
                        <span className="text-xs">{expiryStatus.message}</span>
                      </div>
                    )}
                  </div>

                  {compliance.issuing_authority && (
                    <p className="text-xs mb-1 text-muted-foreground">
                      <strong>Authority:</strong> {compliance.issuing_authority}
                    </p>
                  )}

                  {(compliance.valid_from || compliance.valid_to) && (
                    <p className="text-xs mb-1 text-muted-foreground">
                      <strong>Valid:</strong> 
                      {compliance.valid_from && ` From ${new Date(compliance.valid_from).toLocaleDateString()}`}
                      {compliance.valid_to && ` To ${new Date(compliance.valid_to).toLocaleDateString()}`}
                    </p>
                  )}
                  
                  {compliance.notes && (
                    <p className="text-xs mt-2 p-2 rounded bg-muted text-muted-foreground">
                      💡 {compliance.notes}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyNumber(compliance.number)}
                      className="p-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground"
                      title="Copy number"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                    {verificationUrl && (
                      <button
                        onClick={() => window.open(verificationUrl, '_blank')}
                        className="p-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground"
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
                      className="p-1.5 rounded-md hover:bg-accent transition-colors disabled:opacity-50 text-muted-foreground"
                      title="Edit compliance number"
                    >
                      <Edit2 className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(index)}
                      disabled={disabled}
                      className="p-1.5 rounded-md hover:bg-accent transition-colors disabled:opacity-50 text-destructive"
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
        <div className="mt-4 p-3 rounded-md border bg-primary/10 border-primary/20">
          <div className="text-sm text-primary">
            <strong>{value.length}</strong> compliance number{value.length !== 1 ? 's' : ''} added
            {value.filter(c => c.is_verified).length > 0 && (
              <span>
                {' '} • <strong>{value.filter(c => c.is_verified).length}</strong> verified
              </span>
            )}
            {value.filter(c => c.valid_to && new Date(c.valid_to) < new Date()).length > 0 && (
              <span className="text-red-600 dark:text-red-400">
                {' '} • <strong>{value.filter(c => c.valid_to && new Date(c.valid_to) < new Date()).length}</strong> expired
              </span>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setDeleteIndex(null);
        }}
        onConfirm={() => {
          if (deleteIndex !== null) {
            removeComplianceNumber(deleteIndex);
          }
        }}
        title="Remove Compliance Number"
        description="Are you sure you want to remove this compliance number?"
        confirmText="Remove"
        type="danger"
        icon={<Trash2 className="h-6 w-6" />}
      />

      {/* Add Compliance Number Modal */}
      {isAddModalOpen && (
        <AddComplianceModal
          onAdd={addComplianceNumber}
          onClose={() => setIsAddModalOpen(false)}
          complianceTypes={complianceTypes}
          isLoadingTypes={isLoadingTypes}
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
          isLoadingTypes={isLoadingTypes}
        />
      )}
    </div>
  );
};

// Add Compliance Modal Component - MasterData Integrated
interface AddComplianceModalProps {
  onAdd: (compliance: Omit<ComplianceNumber, 'id'>) => void;
  onClose: () => void;
  complianceTypes: any[];
  isLoadingTypes: boolean;
}

const AddComplianceModal: React.FC<AddComplianceModalProps> = ({ 
  onAdd, 
  onClose, 
  complianceTypes,
  isLoadingTypes 
}) => {
  const { isDarkMode } = useTheme();
  const { toast } = useToast();
  const [complianceData, setComplianceData] = useState({
    type_value: '',
    type_label: '',
    number: '',
    issuing_authority: '',
    valid_from: '',
    valid_to: '',
    is_verified: false,
    notes: '',
    hexcolor: ''
  });
  const [validationError, setValidationError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complianceData.type_value) {
      setValidationError('Please select a compliance type');
      return;
    }
    if (!complianceData.number.trim()) {
      setValidationError(ERROR_MESSAGES.REQUIRED_FIELD);
      return;
    }

    onAdd(complianceData);
  };

  const currentType = complianceTypes.find(ct => ct.value === complianceData.type_value);

  const handleTypeChange = (newType: string) => {
    const typeInfo = complianceTypes.find(ct => ct.value === newType);
    setComplianceData(prev => ({ 
      ...prev, 
      type_value: newType,
      type_label: typeInfo?.label || newType,
      hexcolor: typeInfo?.color || '',
      number: '' // Clear number when type changes
    }));
    setValidationError('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden bg-card">
        <div className="p-6 flex-shrink-0 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Add Compliance Number</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-accent rounded-md transition-colors text-muted-foreground"
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
                <label className="block text-sm font-medium mb-2 text-foreground">Compliance Type *</label>
                {isLoadingTypes ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <select
                    value={complianceData.type_value}
                    onChange={(e) => handleTypeChange(e.target.value)}
                    className="w-full p-2 border rounded-md bg-background border-input text-foreground"
                    required
                  >
                    <option value="">Select a type</option>
                    {complianceTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                )}
                {currentType?.description && (
                  <p className="text-xs mt-1 text-muted-foreground">
                    {currentType.description}
                  </p>
                )}
              </div>

              {/* Number */}
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Number *</label>
                <input
                  type="text"
                  value={complianceData.number}
                  onChange={(e) => {
                    setComplianceData(prev => ({ ...prev, number: e.target.value.toUpperCase() }));
                    setValidationError('');
                  }}
                  placeholder="Enter compliance number"
                  className={`w-full p-2 border rounded-md font-mono bg-background text-foreground ${
                    validationError ? 'border-destructive' : 'border-input'
                  }`}
                  required
                />
                {validationError && (
                  <p className="text-xs mt-1 text-destructive">{validationError}</p>
                )}
              </div>

              {/* Issuing Authority */}
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Issuing Authority</label>
                <input
                  type="text"
                  value={complianceData.issuing_authority}
                  onChange={(e) => setComplianceData(prev => ({ ...prev, issuing_authority: e.target.value }))}
                  placeholder="e.g., Income Tax Department, MCA"
                  className="w-full p-2 border rounded-md bg-background border-input text-foreground"
                />
              </div>

              {/* Validity Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Valid From</label>
                  <input
                    type="date"
                    value={complianceData.valid_from}
                    onChange={(e) => setComplianceData(prev => ({ ...prev, valid_from: e.target.value }))}
                    className="w-full p-2 border rounded-md bg-background border-input text-foreground"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Valid To</label>
                  <input
                    type="date"
                    value={complianceData.valid_to}
                    onChange={(e) => setComplianceData(prev => ({ ...prev, valid_to: e.target.value }))}
                    className="w-full p-2 border rounded-md bg-background border-input text-foreground"
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
                  className="mr-2 accent-primary"
                />
                <label htmlFor="is_verified" className="text-sm text-foreground">Mark as verified</label>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Notes (Optional)</label>
                <textarea
                  value={complianceData.notes}
                  onChange={(e) => setComplianceData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any notes about this compliance number..."
                  rows={3}
                  className="w-full p-2 border rounded-md bg-background border-input text-foreground resize-none"
                />
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 flex-shrink-0 border-t border-border">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-md hover:bg-accent transition-colors border-input text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isLoadingTypes}
              className="flex-1 px-4 py-2 rounded-md hover:bg-primary/90 transition-colors text-primary-foreground bg-primary disabled:opacity-50"
            >
              Add Number
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Edit Compliance Modal - MasterData Integrated
interface EditComplianceModalProps {
  compliance: ComplianceNumber;
  onSave: (updates: Partial<ComplianceNumber>) => void;
  onClose: () => void;
  complianceTypes: any[];
  isLoadingTypes: boolean;
}

const EditComplianceModal: React.FC<EditComplianceModalProps> = ({ 
  compliance, 
  onSave, 
  onClose, 
  complianceTypes,
  isLoadingTypes 
}) => {
  const [complianceData, setComplianceData] = useState({
    type_value: compliance.type_value,
    type_label: compliance.type_label || '',
    number: compliance.number,
    issuing_authority: compliance.issuing_authority || '',
    valid_from: compliance.valid_from || '',
    valid_to: compliance.valid_to || '',
    is_verified: compliance.is_verified,
    notes: compliance.notes || '',
    hexcolor: compliance.hexcolor || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complianceData.number.trim()) return;

    onSave(complianceData);
  };

  const handleTypeChange = (newType: string) => {
    const typeInfo = complianceTypes.find(ct => ct.value === newType);
    setComplianceData(prev => ({ 
      ...prev, 
      type_value: newType,
      type_label: typeInfo?.label || newType,
      hexcolor: typeInfo?.color || ''
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden bg-card">
        <div className="p-6 flex-shrink-0 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Edit Compliance Number</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-accent rounded-md transition-colors text-muted-foreground"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Compliance Type</label>
                {isLoadingTypes ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <select
                    value={complianceData.type_value}
                    onChange={(e) => handleTypeChange(e.target.value)}
                    className="w-full p-2 border rounded-md bg-background border-input text-foreground"
                  >
                    {complianceTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Number *</label>
                <input
                  type="text"
                  value={complianceData.number}
                  onChange={(e) => setComplianceData(prev => ({ ...prev, number: e.target.value.toUpperCase() }))}
                  className="w-full p-2 border rounded-md font-mono bg-background border-input text-foreground"
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="edit_is_verified"
                  checked={complianceData.is_verified}
                  onChange={(e) => setComplianceData(prev => ({ ...prev, is_verified: e.target.checked }))}
                  className="mr-2 accent-primary"
                />
                <label htmlFor="edit_is_verified" className="text-sm text-foreground">Mark as verified</label>
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 flex-shrink-0 border-t border-border">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-md hover:bg-accent transition-colors border-input text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isLoadingTypes}
              className="flex-1 px-4 py-2 rounded-md hover:bg-primary/90 transition-colors text-primary-foreground bg-primary disabled:opacity-50"
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