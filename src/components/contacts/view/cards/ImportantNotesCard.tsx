// src/components/contacts/view/cards/ImportantNotesCard.tsx - Full Production Version
import React, { useState, useEffect } from 'react';
import { 
  StickyNote, 
  Tag, 
  Edit, 
  Plus, 
  X, 
  Save,
  AlertCircle,
  Check,
  Hash,
  Calendar,
  User,
  Clock,
  Loader2,
  FileText,
  Star,
  Archive
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { canPerformOperation, VALIDATION_RULES } from '@/utils/constants/contacts';

interface Tag {
  id: string;
  tag_value: string;
  tag_label: string;
  tag_color?: string;
}

interface ImportantNotesCardProps {
  contact: {
    id: string;
    status: 'active' | 'inactive' | 'archived';
    notes?: string;
    tags: Tag[];
    created_at: string;
    updated_at: string;
    created_by?: {
      id: string;
      name: string;
    };
  };
  onUpdate?: (updates: { notes?: string; tags?: Tag[] }) => Promise<void>;
  className?: string;
}

const ImportantNotesCard: React.FC<ImportantNotesCardProps> = ({ 
  contact, 
  onUpdate,
  className = '' 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State for notes editing
  const [isEditingNotes, setIsEditingNotes] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>(contact.notes || '');
  const [originalNotes, setOriginalNotes] = useState<string>(contact.notes || '');
  const [notesSaving, setNotesSaving] = useState<boolean>(false);
  
  // State for tags editing
  const [isEditingTags, setIsEditingTags] = useState<boolean>(false);
  const [tags, setTags] = useState<Tag[]>(contact.tags || []);
  const [originalTags, setOriginalTags] = useState<Tag[]>(contact.tags || []);
  const [newTagInput, setNewTagInput] = useState<string>('');
  const [tagsSaving, setTagsSaving] = useState<boolean>(false);
  
  // Update state when contact prop changes
  useEffect(() => {
    setNotes(contact.notes || '');
    setOriginalNotes(contact.notes || '');
    setTags(contact.tags || []);
    setOriginalTags(contact.tags || []);
  }, [contact.notes, contact.tags]);

  // Check if edits are allowed
  const canEdit = canPerformOperation(contact.status, 'edit');

  // Generate random colors for new tags
  const getRandomTagColor = (): string => {
    const colors = [
      '#3B82F6', // blue
      '#EF4444', // red
      '#10B981', // green
      '#F59E0B', // yellow
      '#8B5CF6', // purple
      '#EC4899', // pink
      '#06B6D4', // cyan
      '#84CC16', // lime
      '#F97316', // orange
      '#6366F1'  // indigo
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Save notes
  const saveNotes = async () => {
    if (!canEdit) return;
    
    // Validate notes length
    if (notes.length > VALIDATION_RULES.NOTES_MAX_LENGTH) {
      toast({
        variant: "destructive",
        title: "Notes too long",
        description: `Notes must be ${VALIDATION_RULES.NOTES_MAX_LENGTH} characters or less`
      });
      return;
    }

    try {
      setNotesSaving(true);
      
      if (onUpdate) {
        await onUpdate({ notes: notes.trim() });
      }
      
      setOriginalNotes(notes);
      setIsEditingNotes(false);
      
      toast({
        title: "Notes saved",
        description: "Contact notes have been updated successfully"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to save notes",
        description: "Could not update contact notes"
      });
    } finally {
      setNotesSaving(false);
    }
  };

  // Cancel notes editing
  const cancelNotesEdit = () => {
    setNotes(originalNotes);
    setIsEditingNotes(false);
  };

  // Add new tag
  const addTag = () => {
    if (!canEdit) return;
    
    const tagValue = newTagInput.trim();
    if (!tagValue) return;
    
    // Check for duplicates
    if (tags.some(tag => tag.tag_value.toLowerCase() === tagValue.toLowerCase())) {
      toast({
        variant: "destructive",
        title: "Duplicate tag",
        description: "This tag already exists"
      });
      return;
    }
    
    // Check tag limit
    if (tags.length >= VALIDATION_RULES.TAG_MAX_COUNT) {
      toast({
        variant: "destructive",
        title: "Too many tags",
        description: `Maximum ${VALIDATION_RULES.TAG_MAX_COUNT} tags allowed`
      });
      return;
    }
    
    const newTag: Tag = {
      id: `temp-${Date.now()}`, // Temporary ID
      tag_value: tagValue,
      tag_label: tagValue,
      tag_color: getRandomTagColor()
    };
    
    setTags([...tags, newTag]);
    setNewTagInput('');
  };

  // Remove tag
  const removeTag = (tagToRemove: Tag) => {
    if (!canEdit) return;
    setTags(tags.filter(tag => tag.id !== tagToRemove.id));
  };

  // Save tags
  const saveTags = async () => {
    if (!canEdit) return;
    
    try {
      setTagsSaving(true);
      
      if (onUpdate) {
        await onUpdate({ tags });
      }
      
      setOriginalTags(tags);
      setIsEditingTags(false);
      
      toast({
        title: "Tags saved",
        description: "Contact tags have been updated successfully"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to save tags",
        description: "Could not update contact tags"
      });
    } finally {
      setTagsSaving(false);
    }
  };

  // Cancel tags editing
  const cancelTagsEdit = () => {
    setTags(originalTags);
    setNewTagInput('');
    setIsEditingTags(false);
  };

  // Handle key press in tag input
  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Escape') {
      setNewTagInput('');
    }
  };

  // Handle key press in notes textarea
  const handleNotesKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      cancelNotesEdit();
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      saveNotes();
    }
  };

  // Check if there are unsaved changes
  const hasUnsavedNotes = notes !== originalNotes;
  const hasUnsavedTags = JSON.stringify(tags) !== JSON.stringify(originalTags);

  return (
    <div className={`bg-card rounded-lg shadow-sm border border-border p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-6 text-foreground">Important Information</h3>
      
      <div className="space-y-6">
        {/* Notes Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <StickyNote className="h-4 w-4 text-muted-foreground" />
              <h4 className="font-medium text-foreground">Notes</h4>
              {hasUnsavedNotes && (
                <span className="w-2 h-2 bg-yellow-500 rounded-full" title="Unsaved changes" />
              )}
            </div>
            {canEdit && !isEditingNotes && (
              <button
                onClick={() => setIsEditingNotes(true)}
                className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                title="Edit notes"
              >
                <Edit className="h-3 w-3" />
              </button>
            )}
          </div>
          
          {isEditingNotes ? (
            <div className="space-y-3">
              <div className="relative">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  onKeyDown={handleNotesKeyPress}
                  placeholder="Add important notes about this contact..."
                  rows={6}
                  maxLength={VALIDATION_RULES.NOTES_MAX_LENGTH}
                  className="w-full p-3 border border-border rounded-md bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground placeholder-muted-foreground"
                  disabled={notesSaving}
                />
                <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                  {notes.length}/{VALIDATION_RULES.NOTES_MAX_LENGTH}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={saveNotes}
                  disabled={notesSaving || !hasUnsavedNotes}
                  className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {notesSaving ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Save className="h-3 w-3" />
                  )}
                  {notesSaving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={cancelNotesEdit}
                  disabled={notesSaving}
                  className="px-3 py-1.5 border border-border rounded-md text-sm hover:bg-muted transition-colors disabled:opacity-50 text-foreground"
                >
                  Cancel
                </button>
                <div className="text-xs text-muted-foreground ml-auto">
                  <kbd className="px-1 py-0.5 rounded bg-muted text-xs">Ctrl+Enter</kbd> to save,{' '}
                  <kbd className="px-1 py-0.5 rounded bg-muted text-xs">Esc</kbd> to cancel
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-muted/30 rounded-md min-h-[100px] flex items-center">
              {notes ? (
                <div className="w-full">
                  <pre className="text-sm text-foreground leading-relaxed whitespace-pre-wrap font-sans">
                    {notes}
                  </pre>
                  <div className="mt-3 pt-2 border-t border-border/50 text-xs text-muted-foreground">
                    Last updated: {new Date(contact.updated_at).toLocaleString()}
                  </div>
                </div>
              ) : (
                <div className="w-full text-center">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground italic">
                    No notes added yet.
                    {canEdit && (
                      <button
                        onClick={() => setIsEditingNotes(true)}
                        className="ml-1 text-primary hover:underline"
                      >
                        Click to add important information about this contact.
                      </button>
                    )}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tags Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <h4 className="font-medium text-foreground">Tags</h4>
              <span className="text-xs text-muted-foreground">
                ({tags.length}/{VALIDATION_RULES.TAG_MAX_COUNT})
              </span>
              {hasUnsavedTags && (
                <span className="w-2 h-2 bg-yellow-500 rounded-full" title="Unsaved changes" />
              )}
            </div>
            {canEdit && !isEditingTags && (
              <button
                onClick={() => setIsEditingTags(true)}
                className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                title="Edit tags"
              >
                <Edit className="h-3 w-3" />
              </button>
            )}
          </div>
          
          <div className="space-y-3">
            {/* Existing Tags */}
            <div className="flex flex-wrap gap-2 min-h-[40px]">
              {tags.length > 0 ? (
                tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border transition-all hover:shadow-sm"
                    style={{
                      backgroundColor: tag.tag_color ? `${tag.tag_color}15` : 'hsl(var(--secondary))',
                      borderColor: tag.tag_color || 'hsl(var(--border))',
                      color: tag.tag_color || 'hsl(var(--secondary-foreground))'
                    }}
                  >
                    <Hash className="h-3 w-3" />
                    {tag.tag_label}
                    {isEditingTags && canEdit && (
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:bg-black/10 rounded-full p-0.5 transition-colors"
                        title="Remove tag"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </span>
                ))
              ) : (
                <div className="flex items-center justify-center w-full py-4 text-muted-foreground">
                  <div className="text-center">
                    <Tag className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">
                      No tags added yet.
                      {canEdit && (
                        <button
                          onClick={() => setIsEditingTags(true)}
                          className="ml-1 text-primary hover:underline"
                        >
                          Add some tags to organize this contact.
                        </button>
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Add New Tag */}
            {isEditingTags && canEdit && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      onKeyDown={handleTagKeyPress}
                      placeholder="Enter tag name..."
                      maxLength={20}
                      className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground placeholder-muted-foreground"
                      disabled={tagsSaving}
                    />
                    {newTagInput && (
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
                        {newTagInput.length}/20
                      </div>
                    )}
                  </div>
                  <button
                    onClick={addTag}
                    disabled={!newTagInput.trim() || tags.length >= VALIDATION_RULES.TAG_MAX_COUNT}
                    className="px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                {/* Save/Cancel buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={saveTags}
                    disabled={tagsSaving || !hasUnsavedTags}
                    className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {tagsSaving ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Save className="h-3 w-3" />
                    )}
                    {tagsSaving ? 'Saving...' : 'Save Tags'}
                  </button>
                  <button
                    onClick={cancelTagsEdit}
                    disabled={tagsSaving}
                    className="px-3 py-1.5 border border-border rounded-md text-sm hover:bg-muted transition-colors disabled:opacity-50 text-foreground"
                  >
                    Cancel
                  </button>
                  <div className="text-xs text-muted-foreground ml-auto">
                    <kbd className="px-1 py-0.5 rounded bg-muted text-xs">Enter</kbd> to add tag
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Metadata Section */}
        <div className="pt-4 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Created: {new Date(contact.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Updated: {new Date(contact.updated_at).toLocaleDateString()}</span>
            </div>
            {contact.created_by && (
              <div className="flex items-center gap-2 text-muted-foreground md:col-span-2">
                <User className="h-4 w-4" />
                <span>Created by: {contact.created_by.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Read-only notice for restricted contacts */}
        {!canEdit && (
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md border border-border">
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Contact is {contact.status}. Editing is restricted.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportantNotesCard;