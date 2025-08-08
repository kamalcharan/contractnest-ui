// src/components/storage/CategoryCard.tsx
import React from 'react';
import { ChevronRight, File, FileText, Image, User, FileVideo } from 'lucide-react';
import { formatFileSize } from '@/utils/constants/storageConstants';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { isDarkMode, currentTheme } = useTheme();
  
  // Get theme colors
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  
  // Get the icon component based on category ID or icon string
  const getIcon = () => {
    switch (category.id) {
      case 'contact_photos':
        return <User className="w-6 h-6" style={{ color: colors.brand.primary }} />;
      case 'contract_media':
        return <FileText className="w-6 h-6" style={{ color: colors.semantic.warning }} />;
      case 'service_images':
        return <Image className="w-6 h-6" style={{ color: colors.semantic.success }} />;
      case 'documents':
        return <File className="w-6 h-6" style={{ color: colors.brand.tertiary }} />;
      default:
        return <File className="w-6 h-6" style={{ color: colors.utility.secondaryText }} />;
    }
  };
  
  return (
    <div 
      className="border rounded-lg p-5 cursor-pointer transition-all duration-200 hover:shadow-sm"
      style={{
        backgroundColor: colors.utility.secondaryBackground,
        borderColor: `${colors.utility.primaryText}20`
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = colors.brand.primary;
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = `${colors.utility.primaryText}20`;
        e.currentTarget.style.transform = 'translateY(0)';
      }}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          style={{ backgroundColor: `${colors.brand.primary}10` }}
        >
          {getIcon()}
        </div>
        <ChevronRight 
          className="w-5 h-5 transition-colors"
          style={{ color: colors.utility.secondaryText }}
        />
      </div>
      
      <h3 
        className="font-medium text-lg mb-1 transition-colors"
        style={{ color: colors.utility.primaryText }}
      >
        {category.name}
      </h3>
      
      <div className="flex flex-col space-y-1 mt-3">
        <div className="flex justify-between text-sm">
          <span 
            className="transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            Files
          </span>
          <span 
            className="transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            {fileCount}
          </span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span 
            className="transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            Size
          </span>
          <span 
            className="transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            {formatFileSize(totalSize)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;