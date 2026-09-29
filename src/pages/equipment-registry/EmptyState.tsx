// src/pages/equipment-registry/EmptyState.tsx
// Empty state for Equipment/Facility Registry — context-aware based on selected sub_category

import React from 'react';
import { ArrowRight, Building2, Check, ClipboardCheck, Package, Plus, Wrench } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { getSubCategoryConfig } from '@/constants/subCategoryConfig';
import '../contracts/hub/requests-empty-state.css';

interface EquipmentEmptyStateProps {
  selectedSubCategory: string | null;
  onAddEquipment: () => void;
  registryMode?: 'equipment' | 'entity';
  perspective: 'revenue' | 'expense';
}

const EquipmentEmptyState: React.FC<EquipmentEmptyStateProps> = ({
  selectedSubCategory,
  onAddEquipment,
  registryMode = 'equipment',
  perspective,
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  const config = getSubCategoryConfig(selectedSubCategory);
  const EmptyIcon = config?.icon || Package;
  const iconColor = config?.color || colors.utility.secondaryText;

  const isFacility = registryMode === 'entity';
  const isRevenue = perspective === 'revenue';
  const item = isFacility ? 'facility' : 'equipment';
  const owner = isRevenue ? "a client's" : 'your own';
  const styles = { '--rq-ink': colors.utility.primaryText, '--rq-muted': colors.utility.secondaryText, '--rq-brand': colors.brand.primary, '--rq-bg': colors.utility.secondaryBackground, '--rq-line': colors.utility.primaryText + '20' } as React.CSSProperties;
  if (selectedSubCategory) return <section className="rq-state rq-recovery" style={styles} role="status">
    <span className="rq-symbol"><EmptyIcon size={27} aria-hidden="true" /></span>
    <h2>No {isRevenue ? 'client' : 'own'} {isFacility ? 'facilities' : 'equipment'} in {selectedSubCategory}</h2>
    <p>Add {owner} {item} here, or choose another category to see what is already registered.</p>
    <button className="rq-action rq-primary" type="button" onClick={onAddEquipment}><Plus size={16} aria-hidden="true" /> Add {isRevenue ? 'client' : 'my'} {item}</button>
  </section>;

  const rows = isRevenue
    ? [[isFacility ? Building2 : Package, `Client ${isFacility ? 'facilities' : 'equipment'}`, 'Record the real items you maintain'], [Wrench, 'Contract coverage', 'Connect the item to agreed work'], [ClipboardCheck, 'Service history', 'Follow visits and evidence in context']]
    : [[isFacility ? Building2 : Package, `My ${isFacility ? 'facilities' : 'equipment'}`, 'Keep a record of what you own or operate'], [Wrench, 'Maintenance needs', 'See what work is due'], [ClipboardCheck, 'Operational history', 'Keep past service and evidence together']];
  return <section className="rq-state" style={styles} aria-label={`Getting started with ${isRevenue ? 'client' : 'own'} ${isFacility ? 'facilities' : 'equipment'}`}>
    <div className="rq-hero">
      <div className="rq-copy">
        <span className="rq-eyebrow">{isRevenue ? 'REVENUE · CLIENT ITEMS' : 'EXPENSE · YOUR OWN ITEMS'}</span>
        <h2>{isRevenue ? <>Know every {item} <em>you maintain.</em></> : <>Keep your {item} <em>in view.</em></>}</h2>
        <p>{isRevenue
          ? `Register a client's ${item} to keep its identity, owner, contract coverage and service history together.`
          : `Register your own ${item} to keep its details and maintenance history in one place. No client owner is needed.`}</p>
        <button className="rq-action rq-primary" type="button" onClick={onAddEquipment}>Add {isRevenue ? 'client' : 'my'} {item} <ArrowRight size={16} aria-hidden="true" /></button>
        <div className="rq-reassurance"><Check size={15} aria-hidden="true" />Start with a real item. Nothing is added until you save it.</div>
      </div>
      <div className="rq-preview" aria-label={`Illustration of a ${isRevenue ? 'client' : 'self-owned'} ${item}, not a saved record`}>
        <div className="rq-document">
          <div className="rq-doc-top"><span className="rq-symbol"><EmptyIcon size={25} aria-hidden="true" style={{ color: iconColor }} /></span><span className="rq-example-badge">ILLUSTRATION</span></div>
          <h3>{isRevenue ? 'A client item you care for' : 'An item your business uses'}</h3><p>One record. Clear ownership and follow-up.</p>
          {rows.map(([Icon, title, detail]) => { const RowIcon = Icon as typeof Package; return <div className="rq-doc-row" key={String(title)}><RowIcon size={18} aria-hidden="true" /><div><strong>{String(title)}</strong><small>{String(detail)}</small></div></div>; })}
        </div>
        <small className="rq-example-note">Illustrative preview · no sample {item} is created</small>
      </div>
    </div>
    <div className="rq-steps">
      <article><span>01</span><div><h3>Record the real {item}</h3><p>{isRevenue ? 'Choose the client and identify the item you maintain.' : 'Identify the item your business owns or operates.'}</p></div></article>
      <article><span>02</span><div><h3>Connect the work</h3><p>{isRevenue ? 'Link agreed coverage when the item is part of a client contract.' : 'Add the relevant maintenance or expense contract when needed.'}</p></div></article>
      <article><span>03</span><div><h3>Stay on top of service</h3><p>Keep upcoming work and completed evidence connected to the item.</p></div></article>
    </div>
  </section>;
};

export default EquipmentEmptyState;
