// src/components/storage/CategoryCard.tsx
import React from 'react';
import { ChevronRight, File, FileText, Image, User, FileVideo } from 'lucide-react';
import { formatFileSize } from '@/utils/constants/storageConstants';

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    description: string;
    icon: string;
  };
  fileCount: number;
  totalSize: number;
  onClick: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  fileCount,
  totalSize,
  onClick
}) => {
  // Get the icon component based on category ID or icon string
  const getIcon = () => {
    switch (category.id) {
      case 'contact_photos':
        return <User className="w-6 h-6 text-blue-500" />;
      case 'contract_media':
        return <FileText className="w-6 h-6 text-amber-500" />;
      case 'service_images':
        return <Image className="w-6 h-6 text-green-500" />;
      case 'documents':
        return <File className="w-6 h-6 text-purple-500" />;
      default:
        return <File className="w-6 h-6 text-muted-foreground" />;
    }
  };
  
  return (
    <div 
      className="bg-card border border-border rounded-lg p-5 cursor-pointer hover:border-primary hover:shadow-sm transition-all"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          {getIcon()}
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </div>
      
      <h3 className="font-medium text-lg mb-1">{category.name}</h3>
      
      <div className="flex flex-col space-y-1 mt-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Files</span>
          <span>{fileCount}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Size</span>
          <span>{formatFileSize(totalSize)}</span>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;