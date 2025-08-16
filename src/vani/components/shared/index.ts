// contractnest-ui/src/vani/components/shared/index.ts
export { VaNiList, VaNiListItem, VaNiListHeader } from './VaNiList';
export { VaNiStatusBadge } from './VaNiStatusBadge';
export { VaNiMetricCard } from './VaNiMetricCard';

// Export component prop types
export type {
  VaNiListProps,
  VaNiListItemProps, 
  VaNiListHeaderProps
} from './VaNiList';
export type { VaNiStatusBadgeProps } from './VaNiStatusBadge';
export type { VaNiMetricCardProps, MetricData, TrendData } from './VaNiMetricCard';

// Export new business event types
export type {
  BusinessEventStatus,
  ModuleHealthStatus,
  BusinessContext,
  BusinessMetrics
} from './VaNiStatusBadge';

// Business context interfaces for components
export interface BusinessContext {
  priority?: number;
  urgency?: 'low' | 'medium' | 'high' | 'critical';
  entityType?: string;
  moduleSource?: string;
  hasActions?: boolean;
  relatedCount?: number;
  actionable?: boolean;
}

export interface BusinessMetrics {
  total: number;
  pending?: number;
  completed?: number;
  failed?: number;
  inProgress?: number;
}

// Status type definitions
export type BusinessEventStatus = 'planned' | 'reminded' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
export type ModuleHealthStatus = 'healthy' | 'warning' | 'critical';
export type JobStatus = 'pending' | 'staged' | 'executing' | 'completed' | 'failed' | 'cancelled';
export type ChannelStatus = 'active' | 'inactive' | 'error' | 'configuring';
export type DeliveryStatus = 'sent' | 'delivered' | 'failed' | 'pending';