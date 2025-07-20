// src/components/template-designer/blocks/BlockRequestModal.tsx

import React, { useState } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface BlockRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BlockRequestData) => void;
}

interface BlockRequestData {
  requestType: string;
  description: string;
  useCase: string;
  industry: string;
}

const BlockRequestModal: React.FC<BlockRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState<BlockRequestData>({
    requestType: '',
    description: '',
    useCase: '',
    industry: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.requestType || !formData.description) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      setFormData({
        requestType: '',
        description: '',
        useCase: '',
        industry: ''
      });
    } catch (error) {
      console.error('Error submitting request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%]">
        <div className="bg-card border border-border rounded-lg shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-semibold">Request New Block</h2>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="p-2 hover:bg-muted rounded-md transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="requestType">Block Type <span className="text-destructive">*</span></Label>
                <Select
                  value={formData.requestType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, requestType: value }))}
                >
                  <SelectTrigger id="requestType" className="mt-1">
                    <SelectValue placeholder="Select block type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contact">Contact Block Variant</SelectItem>
                    <SelectItem value="service">Service Block Variant</SelectItem>
                    <SelectItem value="financial">Financial Block Variant</SelectItem>
                    <SelectItem value="clause">Clause Block Variant</SelectItem>
                    <SelectItem value="new">Completely New Block</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the block functionality you need..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-1 min-h-[100px]"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Be specific about fields, rules, and behavior
                </p>
              </div>

              <div>
                <Label htmlFor="useCase">Use Case</Label>
                <Textarea
                  id="useCase"
                  placeholder="How will this block be used in your contracts?"
                  value={formData.useCase}
                  onChange={(e) => setFormData(prev => ({ ...prev, useCase: e.target.value }))}
                  className="mt-1 min-h-[80px]"
                />
              </div>

              <div>
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  placeholder="e.g., Healthcare, Manufacturing, IT Services"
                  value={formData.industry}
                  onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !formData.requestType || !formData.description}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Request
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default BlockRequestModal;