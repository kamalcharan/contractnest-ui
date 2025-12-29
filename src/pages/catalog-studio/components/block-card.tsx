// src/pages/catalog-studio/components/block-card.tsx
import React from 'react';
import { Block, BlockCategory } from '../types';

interface BlockCardProps {
  block: Block;
  category: BlockCategory;
  onClick: () => void;
}

const formatCurrency = (amount: number, currency: string = 'INR') => {
  const symbols: Record<string, string> = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };
  return `${symbols[currency] || currency}${amount.toLocaleString()}`;
};

const BlockCard: React.FC<BlockCardProps> = ({ block, category, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all"
    >
      <div className="p-4 flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
          style={{ backgroundColor: category.bgColor }}
        >
          {block.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm text-gray-900">{block.name}</div>
          <div className="text-xs text-gray-500 line-clamp-2">{block.description}</div>
        </div>
      </div>
      <div className="px-4 pb-3">
        <div className="flex flex-wrap gap-3 mb-2 text-xs text-gray-500">
          {block.price && (
            <span className="flex items-center gap-1">
              <span>💰</span>
              <strong className="text-gray-900">{formatCurrency(block.price, block.currency)}</strong>
            </span>
          )}
          {block.duration && (
            <span className="flex items-center gap-1">
              <span>⏱️</span>
              <strong className="text-gray-900">{block.duration}</strong> {block.durationUnit}
            </span>
          )}
          {block.meta?.stock !== undefined && (
            <span className="flex items-center gap-1">
              <span>📦</span>
              <strong className="text-gray-900">{block.meta.stock}</strong> stock
            </span>
          )}
          {block.meta?.payments && (
            <span className="flex items-center gap-1">
              <span>🔄</span>
              <strong className="text-gray-900">{block.meta.payments}</strong> payments
            </span>
          )}
          {block.meta?.items && (
            <span className="flex items-center gap-1">
              <span>📋</span>
              <strong className="text-gray-900">{block.meta.items}</strong> items
            </span>
          )}
          {block.meta?.duration && (
            <span className="flex items-center gap-1">
              <span>⏱️</span>
              <strong className="text-gray-900">{block.meta.duration}</strong>
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-1">
          {block.evidenceTags?.map((tag, i) => (
            <span key={i} className="text-[10px] px-2 py-0.5 bg-green-50 text-green-700 rounded">
              📷 {tag}
            </span>
          ))}
          {block.tags.map((tag, i) => (
            <span key={i} className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
              {tag}
            </span>
          ))}
          {block.meta?.sku && (
            <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
              SKU: {block.meta.sku}
            </span>
          )}
        </div>
      </div>
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-[10px] text-gray-500">
        {block.usage.templates > 0 && `${block.usage.templates} templates`}
        {block.usage.templates > 0 && block.usage.contracts > 0 && ' • '}
        {block.usage.contracts > 0 && `${block.usage.contracts} contracts`}
        {block.usage.templates === 0 && block.usage.contracts === 0 && 'Not used yet'}
      </div>
    </div>
  );
};

export default BlockCard;
