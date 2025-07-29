// src/components/contacts/view/cards/ImportantNotesCard.tsx
import React, { useState } from 'react';
import { StickyNote, Tag, Edit, Plus, X } from 'lucide-react';

interface ImportantNotesCardProps {
  contact: any;
}

export const ImportantNotesCard: React.FC<ImportantNotesCardProps> = ({ contact }) => {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [notes, setNotes] = useState(contact.notes || '');
  const [tags, setTags] = useState(contact.tags || []);
  const [newTag, setNewTag] = useState('');

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag: string) => tag !== tagToRemove));
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-6">
      <h3 className="text-lg font-semibold mb-4">Important Information</h3>
      
      <div className="space-y-6">
        {/* Notes Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <StickyNote className="h-4 w-4 text-muted-foreground" />
              <h4 className="font-medium">Notes</h4>
            </div>
            <button
              onClick={() => setIsEditingNotes(!isEditingNotes)}
              className="p-1.5 rounded-md hover:bg-muted transition-colors"
              title="Edit notes"
            >
              <Edit className="h-3 w-3" />
            </button>
          </div>
          
          {isEditingNotes ? (
            <div className="space-y-2">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add important notes about this contact..."
                rows={4}
                className="w-full p-3 border border-border rounded-md bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    // Here you would save the notes
                    setIsEditingNotes(false);
                  }}
                  className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setNotes(contact.notes || '');
                    setIsEditingNotes(false);
                  }}
                  className="px-3 py-1.5 border border-border rounded-md text-sm hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-muted/30 rounded-md">
              {notes ? (
                <p className="text-sm text-foreground leading-relaxed">
                  {notes}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No notes added yet. Click edit to add important information about this contact.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Tags Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <h4 className="font-medium">Tags</h4>
            </div>
            <button
              onClick={() => setIsEditingTags(!isEditingTags)}
              className="p-1.5 rounded-md hover:bg-muted transition-colors"
              title="Edit tags"
            >
              <Edit className="h-3 w-3" />
            </button>
          </div>
          
          <div className="space-y-3">
            {/* Existing Tags */}
            <div className="flex flex-wrap gap-2">
              {tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                >
                  {tag}
                  {isEditingTags && (
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </span>
              ))}
              
              {tags.length === 0 && (
                <span className="text-sm text-muted-foreground italic">
                  No tags added yet.
                </span>
              )}
            </div>
            
            {/* Add New Tag */}
            {isEditingTags && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  placeholder="Add tag..."
                  className="flex-1 px-3 py-1.5 border border-border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  onClick={addTag}
                  className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors"
                >
                  Add
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Last Updated */}
        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Last updated: {new Date(contact.updated_at).toLocaleDateString()} at {new Date(contact.updated_at).toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImportantNotesCard;