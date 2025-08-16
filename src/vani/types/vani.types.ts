// contractnest-ui/src/vani/types/vani.types.ts

// Re-export types from fakeData for consistency
export type {
  Job,
  Template,
  Channel,
  AnalyticsData
} from '../utils/fakeData';

// Component-specific types
export interface VaNiListProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'jobs' | 'templates' | 'channels' | 'analytics';
  spacing?: 'compact' | 'normal' | 'loose';
}

export interface VaNiListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
  disabled?: boolean;
  clickable?: boolean;
  variant?: 'default' | 'card' | 'compact';
}

export interface VaNiListHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}

export interface VaNiStatusBadgeProps {
  status: JobStatus | ChannelStatus | DeliveryStatus;
  variant?: 'job' | 'channel' | 'delivery';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export interface VaNiMetricCardProps {
  metric: MetricData;
  className?: string;
  variant?: 'default' | 'highlight' | 'compact';
  onClick?: () => void;
  loading?: boolean;
}

// Status types
export type JobStatus = 'pending' | 'staged' | 'executing' | 'completed' | 'failed' | 'cancelled';
export type ChannelStatus = 'active' | 'inactive' | 'error' | 'configuring';
export type DeliveryStatus = 'sent' | 'delivered' | 'failed' | 'pending';

// Data structure types
export interface TrendData {
  direction: 'up' | 'down' | 'flat';
  percentage: number;
  period?: string;
}

export interface MetricData {
  value: string | number;
  label: string;
  trend?: TrendData;
  cost?: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

// Form and filter types
export interface JobFilters {
  status?: JobStatus;
  type?: 'manual' | 'automated' | 'informational';
  channels?: ('sms' | 'email' | 'whatsapp' | 'push' | 'widget')[];
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
}

export interface TemplateFilters {
  category?: 'marketing' | 'transactional' | 'notification' | 'reminder';
  channels?: ('sms' | 'email' | 'whatsapp' | 'push' | 'widget')[];
  isActive?: boolean;
  search?: string;
}

export interface ChannelFilters {
  status?: ChannelStatus;
  type?: ('sms' | 'email' | 'whatsapp' | 'push' | 'widget')[];
  provider?: string;
}

// Job creation wizard types
export interface JobBasics {
  type: 'manual' | 'automated' | 'informational';
  name: string;
  description?: string;
  priority: number;
}

export interface JobRecipient {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  preferences?: {
    channel?: 'sms' | 'email' | 'whatsapp' | 'push' | 'widget';
    timezone?: string;
    language?: string;
  };
}

export interface JobContent {
  channels: ('sms' | 'email' | 'whatsapp' | 'push' | 'widget')[];
  templateId?: string;
  useAiGeneration?: boolean;
  customContent?: {
    [channel: string]: string;
  };
  variables?: {
    [key: string]: string | number;
  };
}

export interface JobScheduling {
  type: 'immediate' | 'delayed' | 'recurring';
  executeAt?: string; // ISO date string for delayed
  cronExpression?: string; // for recurring
  timezone?: string;
  stagingHours?: number; // preparation time in hours
}

export interface JobCreationData extends JobBasics {
  recipients: JobRecipient[];
  content: JobContent;
  scheduling: JobScheduling;
  options?: {
    fallbackChannels?: boolean;
    retryFailures?: boolean;
    trackDelivery?: boolean;
  };
}

// API response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  success: boolean;
  message?: string;
}

// Dashboard widget types
export interface DashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'list' | 'table';
  title: string;
  description?: string;
  data: any;
  loading?: boolean;
  error?: string;
  refreshable?: boolean;
  lastUpdated?: string;
}

// Navigation and route types
export interface VaNiRoute {
  path: string;
  component: React.ComponentType;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  hidden?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
  active?: boolean;
}

// State management types
export interface VaNiState {
  // Jobs state
  jobs: {
    list: Job[];
    current: Job | null;
    filters: JobFilters;
    loading: boolean;
    error: string | null;
  };
  
  // Templates state
  templates: {
    list: Template[];
    current: Template | null;
    filters: TemplateFilters;
    loading: boolean;
    error: string | null;
  };
  
  // Channels state
  channels: {
    list: Channel[];
    current: Channel | null;
    filters: ChannelFilters;
    loading: boolean;
    error: string | null;
  };
  
  // Analytics state
  analytics: {
    data: AnalyticsData | null;
    loading: boolean;
    error: string | null;
    dateRange: {
      start: string;
      end: string;
    };
  };
  
  // UI state
  ui: {
    currentPage: string;
    breadcrumbs: BreadcrumbItem[];
    sidebarCollapsed: boolean;
    notifications: Notification[];
  };
}

// Notification types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionable?: boolean;
  action?: {
    label: string;
    handler: () => void;
  };
}

// Error types
export interface VaNiError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

// Export utility types
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Hook return types
export interface UseVaNiDataReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseJobActionsReturn {
  createJob: (jobData: JobCreationData) => Promise<Job>;
  updateJob: (id: string, updates: Partial<Job>) => Promise<Job>;
  deleteJob: (id: string) => Promise<void>;
  duplicateJob: (id: string) => Promise<Job>;
  cancelJob: (id: string) => Promise<Job>;
  retryJob: (id: string) => Promise<Job>;
  loading: boolean;
  error: string | null;
}

// Component prop types for complex components
export interface JobsListTableProps {
  jobs: Job[];
  loading?: boolean;
  onJobClick?: (job: Job) => void;
  onJobAction?: (action: string, job: Job) => void;
  selectedJobs?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  filters?: JobFilters;
  onFiltersChange?: (filters: JobFilters) => void;
}

export interface JobWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (jobData: JobCreationData) => Promise<void>;
  initialData?: Partial<JobCreationData>;
  loading?: boolean;
}

export interface TemplateEditorProps {
  template?: Template;
  onSave: (template: Partial<Template>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export interface ChannelConfigProps {
  channel: Channel;
  onSave: (channel: Partial<Channel>) => Promise<void>;
  onTest: (channel: Channel) => Promise<boolean>;
  loading?: boolean;
}

// Utility constants
export const JOB_STATUSES: JobStatus[] = ['pending', 'staged', 'executing', 'completed', 'failed', 'cancelled'];
export const CHANNEL_TYPES = ['sms', 'email', 'whatsapp', 'push', 'widget'] as const;
export const TEMPLATE_CATEGORIES = ['marketing', 'transactional', 'notification', 'reminder'] as const;
export const JOB_TYPES = ['manual', 'automated', 'informational'] as const;

export type ChannelType = typeof CHANNEL_TYPES[number];
export type TemplateCategory = typeof TEMPLATE_CATEGORIES[number];
export type JobType = typeof JOB_TYPES[number];