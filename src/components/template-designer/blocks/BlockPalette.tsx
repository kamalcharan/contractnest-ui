//src/components/template-designer/blocks/BlockPalette.tsx

import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronRight, Loader2, Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { templateBlocksData } from '@/utils/fakejson/templateBlocks';
import BlockCategory from './BlockCategory';
import BlockRequestModal from './BlockRequestModal';

const BlockPalette: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [loading] = useState(false);

  // Get categories from fake data
  const categories = useMemo(() => templateBlocksData.categories, []);

  // Filter blocks based on search
  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categories;

    return categories.map(category => ({
      ...category,
      blocks: category.blocks.filter(block => {
        const searchLower = searchTerm.toLowerCase();
        return (
          block.name.toLowerCase().includes(searchLower) ||
          block.description.toLowerCase().includes(searchLower) ||
          block.variants.some(variant =>
            variant.name.toLowerCase().includes(searchLower) ||
            variant.description.toLowerCase().includes(searchLower)
          )
        );
      })
    })).filter(category => category.blocks.length > 0);
  }, [categories, searchTerm]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  if (loading) {
    return (
      <Card className="h-full border-0 rounded-none">
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="h-full border-0 rounded-none">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-3">
            <CardTitle className="text-lg">Blocks</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowRequestModal(true)}
              className="h-8"
            >
              <Plus className="h-4 w-4 mr-1" />
              Request
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search blocks..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="px-2 pb-2 overflow-auto">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No blocks found</p>
              {searchTerm && (
                <p className="text-xs mt-1">Try adjusting your search</p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredCategories.map(category => (
                <BlockCategory
                  key={category.id}
                  category={category}
                  isExpanded={expandedCategories.includes(category.id)}
                  onToggle={() => toggleCategory(category.id)}
                  searchTerm={searchTerm}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {showRequestModal && (
        <BlockRequestModal
          isOpen={showRequestModal}
          onClose={() => setShowRequestModal(false)}
          onSubmit={(data) => {
            console.log('Block request:', data);
            // TODO: Send request to API
            setShowRequestModal(false);
          }}
        />
      )}
    </>
  );
};

export default BlockPalette;