// src/components/contacts/forms/ContactTagsSection.tsx - MasterData Integrated
import React, { useState, useEffect } from 'react';
import { Plus, Tag, X, ChevronDown, Loader2 } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useToast } from '@/components/ui/use-toast';
import { captureException } from '@/utils/sentry';
import { analyticsService } from '@/services/analytics.service';
import { useMasterDataOptions } from '@/hooks/useMasterData';
import { 
  ERROR_MESSAGES,
  VALIDATION_RULES,
  MASTERDATA_QUERIES
} from '@/utils/constants/contacts';

// Types matching your API structure
interface ContactTag {
  id?: string;
  tag_value: string; // MasterData SubCatName
  tag_label: string; // MasterData DisplayName
  tag_color?: string; // MasterData hexcolor
}

interface ContactTagsSectionProps {
  value: ContactTag[];
  onChange: (tags: ContactTag[]) => void;
  disabled?: boolean;
  maxTags?: number;
}

const ContactTagsSection: React.FC<ContactTagsSectionProps> = ({
  value,
  onChange,
  disabled = false,
  maxTags = VALIDATION_RULES.TAG_MAX_COUNT
}) => {
  const { isDarkMode } = useTheme();
  const { toast } = useToast();
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [selectedTagValue, setSelectedTagValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Load tags from MasterData using the hook
  const { 
    options: tagOptions, 
    loading: isLoading, 
    error: loadError,
    refetch: refetchTags 
  } = useMasterDataOptions('Tags', {
    valueField: 'SubCatName',
    labelField: 'DisplayName',
    includeInactive: false,
    sortBy: 'Sequence_no',
    sortOrder: 'asc'
  });

  // Track analytics
  useEffect(() => {
    if (value.length > 0) {
      analyticsService.trackPageView(
        'contacts/tags',
        `Contact Tags: ${value.length}`
      );
    }
  }, [value.length]);

  // Filter tag options based on search and existing tags
  const filteredTagOptions = tagOptions.filter(option => {
    const matchesSearch = option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         option.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (option.description && option.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const notAlreadySelected = !value.some(tag => tag.tag_value === option.value);
    return matchesSearch && notAlreadySelected;
  });

  const addTag = (tagValue: string) => {
    if (!tagValue || disabled) return;
    
    const tagOption = tagOptions.find(opt => opt.value === tagValue);
    if (!tagOption) return;

    // Check if tag already exists
    if (value.some(tag => tag.tag_value === tagValue)) {
      toast({
        variant: "destructive",
        title: "Duplicate Tag",
        description: "This tag has already been added"
      });
      return;
    }

    // Check max tags limit
    if (value.length >= maxTags) {
      toast({
        variant: "destructive",
        title: "Maximum Tags Reached",
        description: ERROR_MESSAGES.MAX_TAGS_EXCEEDED
      });
      return;
    }

    const newTag: ContactTag = {
      id: `temp_${Date.now()}`,
      tag_value: tagOption.value,
      tag_label: tagOption.label,
      tag_color: tagOption.color || undefined
    };

    onChange([...value, newTag]);
    setSelectedTagValue('');
    setSearchTerm('');
    setIsAddingTag(false);
    setIsDropdownOpen(false);

    toast({
      title: "Tag Added",
      description: `"${tagOption.label}" tag has been added`
    });
  };

  const removeTag = (index: number) => {
    if (disabled) return;
    const removedTag = value[index];
    onChange(value.filter((_, i) => i !== index));
    
    toast({
      title: "Tag Removed",
      description: `"${removedTag.tag_label}" tag has been removed`
    });
  };

  const handleCancelAdd = () => {
    setIsAddingTag(false);
    setSelectedTagValue('');
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  // Handle load error
  if (loadError) {
    captureException(loadError, {
      tags: { component: 'ContactTagsSection', action: 'loadTags' },
      extra: { error: loadError.message }
    });
  }

  return (
    <div className="rounded-lg shadow-sm border p-4 bg-card border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-base font-semibold text-foreground">Tags</h3>
          {value.length > 0 && (
            <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
              {value.length}/{maxTags}
            </span>
          )}
        </div>
        {!isAddingTag && (
          <button
            type="button"
            onClick={() => setIsAddingTag(true)}
            disabled={disabled || isLoading || value.length >= maxTags}
            className="flex items-center px-3 py-2 text-sm border rounded-md hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-primary text-primary"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            Add Tag
          </button>
        )}
      </div>
      
      {/* Add Tag Section */}
      {isAddingTag && (
        <div className="mb-4 p-3 rounded-md bg-muted/50">
          <div className="space-y-3">
            {/* Custom Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                disabled={isLoading}
                className="w-full flex items-center justify-between px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors bg-background border-input text-foreground disabled:opacity-50"
              >
                <span>
                  {isLoading ? (
                    <span className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading tags...
                    </span>
                  ) : selectedTagValue ? (
                    tagOptions.find(opt => opt.value === selectedTagValue)?.label
                  ) : (
                    'Select a tag'
                  )}
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && !isLoading && (
                <div className="absolute top-full left-0 right-0 mt-1 border rounded-md shadow-lg z-10 max-h-60 overflow-y-auto bg-card border-border">
                  {/* Search Input */}
                  <div className="p-2 border-b border-border">
                    <input
                      type="text"
                      placeholder="Search tags..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-primary/20 bg-background border-input text-foreground"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  {/* Tag Options */}
                  <div className="max-h-48 overflow-y-auto">
                    {filteredTagOptions.length === 0 ? (
                      <div className="p-3 text-sm text-center text-muted-foreground">
                        {searchTerm ? 'No tags match your search' : 'No more tags available'}
                      </div>
                    ) : (
                      filteredTagOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setSelectedTagValue(option.value);
                            addTag(option.value);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-accent transition-colors text-left text-foreground"
                        >
                          {option.color && (
                            <div 
                              className="w-3 h-3 rounded-full flex-shrink-0" 
                              style={{ backgroundColor: option.color }}
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium">{option.label}</div>
                            {option.description && (
                              <div className="text-xs text-muted-foreground">
                                {option.description}
                              </div>
                            )}
                          </div>
                        </button>
                      ))
                    )}
                  </div>

                  {/* Refresh Option if Error */}
                  {loadError && (
                    <div className="p-2 border-t border-border">
                      <button
                        onClick={() => refetchTags()}
                        className="w-full text-sm text-primary hover:underline"
                      >
                        Failed to load tags. Click to retry.
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => selectedTagValue && addTag(selectedTagValue)}
                disabled={!selectedTagValue}
                className="px-3 py-2 text-sm rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground bg-primary"
              >
                Add Tag
              </button>
              <button 
                type="button"
                onClick={handleCancelAdd}
                className="px-3 py-2 text-sm border rounded-md hover:bg-accent transition-colors border-input text-foreground"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Current Tags */}
      <div className="space-y-3">
        {value.length === 0 ? (
          <div className="text-center p-4 text-sm text-muted-foreground">
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Loading available tags...
              </div>
            ) : (
              <>
                No tags added yet. Tags help categorize contacts for better organization.
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {value.map((tag, index) => (
              <div
                key={tag.id || index}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm border transition-colors border-border bg-card"
                style={{
                  borderColor: tag.tag_color || undefined,
                  backgroundColor: tag.tag_color ? `${tag.tag_color}20` : undefined
                }}
              >
                {tag.tag_color && (
                  <div 
                    className="w-2 h-2 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: tag.tag_color }}
                  />
                )}
                <span className="font-medium text-foreground">{tag.tag_label}</span>
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="ml-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5 transition-colors"
                    title="Remove tag"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Summary & Limits */}
      {value.length > 0 && (
        <div className="mt-3 pt-3 border-t text-xs border-border text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>{value.length} tag{value.length !== 1 ? 's' : ''} applied</span>
            {value.length >= maxTags && (
              <span className="text-warning">
                Maximum tags reached ({maxTags})
              </span>
            )}
          </div>
        </div>
      )}

      {/* Error State */}
      {loadError && !isLoading && (
        <div className="mt-3 p-3 rounded-md border bg-destructive/10 border-destructive/20">
          <p className="text-sm text-destructive">
            Failed to load available tags. 
            <button
              onClick={() => refetchTags()}
              className="ml-2 underline hover:no-underline"
            >
              Try again
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export default ContactTagsSection;