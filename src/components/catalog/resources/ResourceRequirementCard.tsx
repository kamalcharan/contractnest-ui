// src/components/catalog/resources/ResourceRequirementCard.tsx
// 🎨 Beautiful card component for displaying selected resource requirements

import React, { useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { Edit3, Trash2, User, Phone, Mail, Tag, Clock, AlertCircle } from 'lucide-react';
import { useResource } from '../../../hooks/queries/useResourceQueries';
// Service catalog resource requirement type
interface ServiceResourceRequirement {
  id: string;
  resourceId: string;
  quantity: number;
  isOptional: boolean;
  skillRequirements?: string[];
}

interface ResourceRequirementCardProps {
  requirement: ServiceResourceRequirement;
  onEdit: () => void;
  onRemove: () => void;
  isReadOnly?: boolean;
  showAnimations?: boolean;
}

const ResourceRequirementCard: React.FC<ResourceRequirementCardProps> = ({
  requirement,
  onEdit,
  onRemove,
  isReadOnly = false,
  showAnimations = true
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  
  const { data: resource, isLoading, isError } = useResource(requirement.resourceId);
  const [isHovered, setIsHovered] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  // Handle loading state
  if (isLoading) {
    return (
      <div
        className="border rounded-lg p-4 animate-pulse"
        style={{
          backgroundColor: colors.utility.primaryBackground,
          borderColor: colors.utility.secondaryText + '20'
        }}
      >
        <div className="flex items-start gap-3">
          <div 
            className="w-10 h-10 rounded-lg"
            style={{ backgroundColor: colors.utility.secondaryText + '20' }}
          />
          <div className="flex-1 space-y-2">
            <div 
              className="h-4 rounded"
              style={{ backgroundColor: colors.utility.secondaryText + '20' }}
            />
            <div 
              className="h-3 rounded w-3/4"
              style={{ backgroundColor: colors.utility.secondaryText + '10' }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (isError || !resource) {
    return (
      <div
        className="border-2 border-dashed rounded-lg p-4"
        style={{
          backgroundColor: colors.semantic.error + '05',
          borderColor: colors.semantic.error + '40'
        }}
      >
        <div className="flex items-center gap-3">
          <AlertCircle 
            className="w-5 h-5 flex-shrink-0"
            style={{ color: colors.semantic.error }}
          />
          <div>
            <p 
              className="text-sm font-medium"
              style={{ color: colors.semantic.error }}
            >
              Resource not found
            </p>
            <p 
              className="text-xs"
              style={{ color: colors.utility.secondaryText }}
            >
              Resource ID: {requirement.resourceId}
            </p>
          </div>
          {!isReadOnly && (
            <button
              onClick={onRemove}
              className="ml-auto p-1 rounded"
              style={{ 
                backgroundColor: colors.semantic.error + '20',
                color: colors.semantic.error
              }}
              title="Remove invalid requirement"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Helper functions
  const getRequirementTypeConfig = (isOptional: boolean) => {
    if (isOptional) {
      return {
        color: colors.semantic.warning,
        backgroundColor: colors.semantic.warning + '15',
        label: 'Optional',
        icon: '🟡'
      };
    } else {
      return {
        color: colors.semantic.error,
        backgroundColor: colors.semantic.error + '15',
        label: 'Required',
        icon: '🔴'
      };
    }
  };

  const handleRemove = () => {
    if (showAnimations) {
      setIsRemoving(true);
      setTimeout(() => {
        onRemove();
      }, 200);
    } else {
      onRemove();
    }
  };

  const requirementConfig = getRequirementTypeConfig(requirement.isOptional);

  return (
    <div
      className={`group border rounded-lg p-4 transition-all duration-200 ${
        isRemoving ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
      } ${showAnimations ? 'hover:shadow-md hover:-translate-y-0.5' : ''}`}
      style={{
        backgroundColor: colors.utility.primaryBackground,
        borderColor: isHovered ? colors.brand.primary + '40' : colors.utility.secondaryText + '20'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Resource Avatar */}
          <div 
            className={`w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all duration-200 ${
              showAnimations && isHovered ? 'scale-105 rotate-2' : ''
            }`}
            style={{
              backgroundColor: resource.hexcolor + '20' || `${colors.brand.primary}20`,
              color: resource.hexcolor || colors.brand.primary
            }}
          >
            {resource.display_name.charAt(0).toUpperCase()}
          </div>
          
          {/* Resource Information */}
          <div className="flex-1 min-w-0">
            {/* Header Row */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h4 
                  className="font-semibold text-sm truncate transition-colors"
                  style={{ color: colors.utility.primaryText }}
                >
                  {resource.display_name}
                </h4>
                <p 
                  className="text-xs truncate transition-colors"
                  style={{ color: colors.utility.secondaryText }}
                >
                  {resource.name}
                </p>
              </div>
              
              {/* Requirement Type Badge */}
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1 ${
                  showAnimations && isHovered ? 'scale-105' : ''
                }`}
                style={{
                  backgroundColor: requirementConfig.backgroundColor,
                  color: requirementConfig.color
                }}
              >
                <span>{requirementConfig.icon}</span>
                <span>{requirementConfig.label}</span>
              </div>
            </div>
            
            {/* Description */}
            {resource.description && (
              <p 
                className="text-xs leading-relaxed mb-2 transition-colors"
                style={{ color: colors.utility.secondaryText }}
              >
                {resource.description}
              </p>
            )}
            
            {/* Skill Requirements */}
            {requirement.skillRequirements && requirement.skillRequirements.length > 0 && (
              <div 
                className="p-2 rounded-md mb-2"
                style={{ backgroundColor: colors.utility.secondaryText + '08' }}
              >
                <p 
                  className="text-xs font-medium mb-1"
                  style={{ color: colors.utility.primaryText }}
                >
                  Required Skills:
                </p>
                <div className="flex flex-wrap gap-1">
                  {requirement.skillRequirements.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-0.5 rounded text-xs"
                      style={{
                        backgroundColor: colors.semantic.info + '20',
                        color: colors.semantic.info
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Tags */}
            {resource.tags && resource.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {resource.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-all duration-200 hover:scale-105"
                    style={{
                      backgroundColor: colors.utility.secondaryText + '10',
                      color: colors.utility.secondaryText
                    }}
                  >
                    <Tag className="w-2 h-2" />
                    {tag}
                  </span>
                ))}
                {resource.tags.length > 3 && (
                  <span
                    className="px-2 py-0.5 rounded-full text-xs"
                    style={{
                      backgroundColor: colors.utility.secondaryText + '15',
                      color: colors.utility.secondaryText
                    }}
                  >
                    +{resource.tags.length - 3} more
                  </span>
                )}
              </div>
            )}
            
            {/* Contact Information (for team staff) */}
            {resource.contact && (
              <div 
                className="p-2 rounded-md"
                style={{ backgroundColor: colors.semantic.info + '08' }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <User className="w-3 h-3" style={{ color: colors.semantic.info }} />
                  <span 
                    className="text-xs font-medium"
                    style={{ color: colors.utility.primaryText }}
                  >
                    {resource.contact.first_name} {resource.contact.last_name}
                  </span>
                </div>
                {resource.contact.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3 h-3" style={{ color: colors.utility.secondaryText }} />
                    <span 
                      className="text-xs"
                      style={{ color: colors.utility.secondaryText }}
                    >
                      {resource.contact.email}
                    </span>
                  </div>
                )}
              </div>
            )}
            
            {/* Quantity (if more than 1) */}
            {requirement.quantity && requirement.quantity > 1 && (
              <div className="flex items-center gap-1 mt-2">
                <Clock className="w-3 h-3" style={{ color: colors.semantic.warning }} />
                <span 
                  className="text-xs font-medium"
                  style={{ color: colors.semantic.warning }}
                >
                  Quantity: {requirement.quantity}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        {!isReadOnly && (
          <div className={`flex flex-col gap-1 ml-3 transition-all duration-200 ${
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
          }`}>
            <button
              onClick={onEdit}
              className="p-2 rounded-md transition-all duration-200 hover:scale-110 active:scale-95"
              style={{ 
                backgroundColor: colors.utility.secondaryText + '10',
                color: colors.utility.secondaryText
              }}
              title="Edit requirement"
            >
              <Edit3 className="w-3 h-3" />
            </button>
            <button
              onClick={handleRemove}
              className="p-2 rounded-md transition-all duration-200 hover:scale-110 active:scale-95"
              style={{ 
                backgroundColor: colors.semantic.error + '10',
                color: colors.semantic.error
              }}
              title="Remove requirement"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
      
      {/* Hover Effect Overlay */}
      {showAnimations && isHovered && (
        <div 
          className="absolute inset-0 rounded-lg pointer-events-none transition-opacity duration-200"
          style={{
            background: `linear-gradient(135deg, ${colors.brand.primary}03, ${colors.brand.secondary}03)`,
            opacity: isHovered ? 1 : 0
          }}
        />
      )}
    </div>
  );
};

export default ResourceRequirementCard;