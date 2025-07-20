// src/components/contacts/form-sections/SourceTagsSection.tsx
import React, { useState } from 'react';
import { X, Hash, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SourceTagsSectionProps {
  source: string;
  tags: string[];
  availableSources: Array<{ id: string; name: string }>;
  availableTags: Array<{ id: string; name: string; color: string }>;
  onSourceChange: (source: string) => void;
  onTagsChange: (tags: string[]) => void;
}

const SourceTagsSection: React.FC<SourceTagsSectionProps> = ({
  source,
  tags,
  availableSources,
  availableTags,
  onSourceChange,
  onTagsChange
}) => {
  const [tagSearchOpen, setTagSearchOpen] = useState(false);
  const [tagSearchValue, setTagSearchValue] = useState('');

  // Add tag
  const handleAddTag = (tagId: string) => {
    if (!tags.includes(tagId)) {
      onTagsChange([...tags, tagId]);
    }
    setTagSearchValue('');
  };

  // Remove tag
  const handleRemoveTag = (tagId: string) => {
    onTagsChange(tags.filter(id => id !== tagId));
  };

  // Get tag details
  const getTagDetails = (tagId: string) => {
    return availableTags.find(t => t.id === tagId);
  };

  // Get source name
  const getSourceName = (sourceId: string) => {
    return availableSources.find(s => s.id === sourceId)?.name || sourceId;
  };

  return (
    <div className="space-y-6">
      {/* Source Selection */}
      <div className="space-y-2">
        <Label htmlFor="source" className="flex items-center gap-2">
          <Info className="h-4 w-4" />
          Contact Source
        </Label>
        <Select value={source} onValueChange={onSourceChange}>
          <SelectTrigger id="source">
            <SelectValue placeholder="Select source" />
          </SelectTrigger>
          <SelectContent>
            {availableSources.map(src => (
              <SelectItem key={src.id} value={src.id}>
                {src.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          How did this contact come to your system?
        </p>
      </div>

      {/* Tags Selection */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Hash className="h-4 w-4" />
          Tags
        </Label>
        
        {/* Selected Tags */}
        <div className="flex flex-wrap gap-2 min-h-[40px] p-3 border rounded-md bg-background">
          {tags.length === 0 ? (
            <span className="text-sm text-muted-foreground">No tags selected</span>
          ) : (
            tags.map(tagId => {
              const tag = getTagDetails(tagId);
              if (!tag) return null;
              
              return (
                <Badge
                  key={tagId}
                  variant="secondary"
                  style={{
                    backgroundColor: `${tag.color}20`,
                    color: tag.color,
                    borderColor: tag.color
                  }}
                  className="border"
                >
                  {tag.name}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tagId)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })
          )}
        </div>

        {/* Tag Search/Select */}
        <Popover open={tagSearchOpen} onOpenChange={setTagSearchOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              role="combobox"
              aria-expanded={tagSearchOpen}
              className="w-full justify-start"
            >
              <Hash className="h-4 w-4 mr-2" />
              Add tags...
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput
                placeholder="Search tags..."
                value={tagSearchValue}
                onValueChange={setTagSearchValue}
              />
              <CommandEmpty>No tags found.</CommandEmpty>
              <CommandGroup>
                {availableTags
                  .filter(tag => !tags.includes(tag.id))
                  .map(tag => (
                    <CommandItem
                      key={tag.id}
                      value={tag.name}
                      onSelect={() => {
                        handleAddTag(tag.id);
                        setTagSearchOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: tag.color }}
                        />
                        {tag.name}
                      </div>
                    </CommandItem>
                  ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        
        <p className="text-sm text-muted-foreground">
          Add tags to categorize and filter contacts
        </p>
      </div>
    </div>
  );
};

export default SourceTagsSection;