// src/components/contacts/form-sections/NotesSection.tsx
import React, { useState } from 'react';
import { FileText, AlertCircle, Hash } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { VALIDATION_RULES } from '@/utils/constants/contacts';
import { cn } from '@/lib/utils';

interface NotesSectionProps {
  notes: string;
  onChange: (notes: string) => void;
  maxLength?: number;
  placeholder?: string;
  showCharacterCount?: boolean;
  showMarkdownHint?: boolean;
  error?: string;
}

const NotesSection: React.FC<NotesSectionProps> = ({
  notes,
  onChange,
  maxLength = VALIDATION_RULES.NOTES_MAX_LENGTH,
  placeholder = 'Add any additional notes about this contact...',
  showCharacterCount = true,
  showMarkdownHint = true,
  error
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  // Calculate character count
  const characterCount = notes.length;
  const remainingCharacters = maxLength - characterCount;
  const isNearLimit = remainingCharacters < 50;
  const isOverLimit = remainingCharacters < 0;

  // Common keywords that might be auto-tagged
  const suggestedTags = React.useMemo(() => {
    const keywords = ['vip', 'important', 'follow-up', 'urgent', 'partner', 'lead'];
    return keywords.filter(keyword => 
      notes.toLowerCase().includes(keyword)
    );
  }, [notes]);

  return (
    <div className="space-y-2">
      {/* Label with icons */}
      <div className="flex items-center justify-between">
        <Label htmlFor="notes" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Notes
        </Label>
        
        {showMarkdownHint && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-xs text-muted-foreground cursor-help">
                  Markdown supported
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-xs space-y-1">
                  <p>**bold** *italic* `code`</p>
                  <p>- bullet points</p>
                  <p>[link](url)</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* Textarea */}
      <div className="relative">
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => {
            if (e.target.value.length <= maxLength || !maxLength) {
              onChange(e.target.value);
            }
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          rows={6}
          className={cn(
            "resize-none transition-all",
            isFocused && "ring-2 ring-primary/20",
            error && "border-destructive",
            isOverLimit && "border-destructive"
          )}
        />
        
        {/* Character count badge */}
        {showCharacterCount && (
          <div className="absolute bottom-2 right-2">
            <Badge 
              variant={isOverLimit ? "destructive" : isNearLimit ? "secondary" : "outline"}
              className="text-xs"
            >
              {characterCount}/{maxLength}
            </Badge>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-3 w-3" />
          <span>{error}</span>
        </div>
      )}

      {/* Character limit warning */}
      {isNearLimit && !isOverLimit && (
        <p className="text-xs text-muted-foreground">
          {remainingCharacters} characters remaining
        </p>
      )}

      {/* Suggested tags based on content */}
      {suggestedTags.length > 0 && (
        <div className="flex items-center gap-2 pt-2">
          <Hash className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Suggested tags:</span>
          <div className="flex gap-1">
            {suggestedTags.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Help text */}
      <p className="text-sm text-muted-foreground">
        Internal notes are only visible to your team. Use them to track important information, 
        follow-up reminders, or special instructions about this contact.
      </p>
    </div>
  );
};

export default NotesSection;