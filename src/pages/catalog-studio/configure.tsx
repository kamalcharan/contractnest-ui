// src/pages/catalog-studio/configure.tsx
import React, { useState } from 'react';
import { Plus, Download } from 'lucide-react';
import { Block, WizardMode } from './types';
import { BLOCK_CATEGORIES, getBlocksByCategory, getCategoryById } from './data';
import { CategoryPanel, BlockGrid, BlockWizard } from './components';

const CatalogStudioConfigurePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('service');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [wizardMode, setWizardMode] = useState<WizardMode>('create');
  const [wizardBlockType, setWizardBlockType] = useState<string>('service');
  const [editingBlock, setEditingBlock] = useState<Block | null>(null);

  const currentCategory = getCategoryById(selectedCategory) || BLOCK_CATEGORIES[0];
  const categoryBlocks = getBlocksByCategory(selectedCategory);

  const openWizard = (mode: WizardMode, blockType?: string, block?: Block) => {
    setWizardMode(mode);
    setWizardBlockType(blockType || selectedCategory);
    setEditingBlock(block || null);
    setIsWizardOpen(true);
  };

  const closeWizard = () => { setIsWizardOpen(false); setEditingBlock(null); };
  const handleSaveBlock = (blockData: Partial<Block>) => { console.log('Saving block:', blockData); closeWizard(); };
  const handleBlockClick = (block: Block) => { openWizard('edit', block.categoryId, block); };
  const handleAddBlock = () => { openWizard('create', selectedCategory); };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Block Library</h1>
          <p className="text-sm text-gray-500">Build reusable blocks → Assemble into templates → Create contracts</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"><Download className="w-4 h-4" />Import</button>
          <button onClick={() => openWizard('create')} className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 flex items-center gap-2"><Plus className="w-4 h-4" />New Block</button>
        </div>
      </div>
      <div className="flex-1 flex overflow-hidden">
        <CategoryPanel categories={BLOCK_CATEGORIES} selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
        <BlockGrid blocks={categoryBlocks} category={currentCategory} searchQuery={searchQuery} onSearchChange={setSearchQuery} onBlockClick={handleBlockClick} onAddBlock={handleAddBlock} />
      </div>
      <BlockWizard isOpen={isWizardOpen} mode={wizardMode} blockType={wizardBlockType} editingBlock={editingBlock} onClose={closeWizard} onSave={handleSaveBlock} onBlockTypeChange={setWizardBlockType} />
    </div>
  );
};

export default CatalogStudioConfigurePage;
