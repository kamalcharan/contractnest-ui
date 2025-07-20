    // src/components/template-designer/shared/ViewToggle.tsx
import React from 'react';
import {
  Grid3X3,
  List,
  LayoutGrid,
  Kanban,
  Calendar,
  Table2,
  Layers,
  Eye,
  Code,
  FileText,
  Smartphone,
  Monitor,
  PanelLeftClose,
  PanelRightClose,
  Maximize2,
  Minimize2
} from 'lucide-react';

// View Toggle for different list/grid views
interface ViewToggleProps {
  view: 'grid' | 'list' | 'kanban' | 'calendar' | 'table';
  onChange: (view: 'grid' | 'list' | 'kanban' | 'calendar' | 'table') => void;
  availableViews?: Array<'grid' | 'list' | 'kanban' | 'calendar' | 'table'>;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({
  view,
  onChange,
  availableViews = ['grid', 'list'],
  size = 'md',
  className = ''
}) => {
  const views = [
    { id: 'grid' as const, icon: Grid3X3, label: 'Grid View' },
    { id: 'list' as const, icon: List, label: 'List View' },
    { id: 'kanban' as const, icon: Kanban, label: 'Kanban View' },
    { id: 'calendar' as const, icon: Calendar, label: 'Calendar View' },
    { id: 'table' as const, icon: Table2, label: 'Table View' }
  ].filter(v => availableViews.includes(v.id));

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5'
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className={`flex items-center bg-gray-100 rounded-lg p-1 ${className}`}>
      {views.map((viewOption) => (
        <button
          key={viewOption.id}
          onClick={() => onChange(viewOption.id)}
          className={`${sizeClasses[size]} rounded transition-all ${
            view === viewOption.id
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          title={viewOption.label}
        >
          <viewOption.icon className={iconSizes[size]} />
        </button>
      ))}
    </div>
  );
};

// Mode Toggle for design/preview/code views
interface ModeToggleProps {
  mode: 'design' | 'preview' | 'code' | 'contract';
  onChange: (mode: 'design' | 'preview' | 'code' | 'contract') => void;
  availableModes?: Array<'design' | 'preview' | 'code' | 'contract'>;
  variant?: 'default' | 'pills' | 'tabs';
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  className?: string;
}

export const ModeToggle: React.FC<ModeToggleProps> = ({
  mode,
  onChange,
  availableModes = ['design', 'preview', 'code'],
  variant = 'default',
  size = 'md',
  showLabels = true,
  className = ''
}) => {
  const modes = [
    { id: 'design' as const, icon: Layers, label: 'Design' },
    { id: 'preview' as const, icon: Eye, label: 'Preview' },
    { id: 'code' as const, icon: Code, label: 'Code' },
    { id: 'contract' as const, icon: FileText, label: 'Contract' }
  ].filter(m => availableModes.includes(m.id));

  const sizeClasses = {
    sm: showLabels ? 'px-3 py-1.5 text-sm' : 'p-1.5',
    md: showLabels ? 'px-4 py-2 text-sm' : 'p-2',
    lg: showLabels ? 'px-5 py-2.5' : 'p-2.5'
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  if (variant === 'tabs') {
    return (
      <div className={`flex items-center border-b border-gray-200 ${className}`}>
        {modes.map((modeOption) => (
          <button
            key={modeOption.id}
            onClick={() => onChange(modeOption.id)}
            className={`${sizeClasses[size]} border-b-2 transition-all ${
              mode === modeOption.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <modeOption.icon className={iconSizes[size]} />
              {showLabels && <span className="font-medium">{modeOption.label}</span>}
            </div>
          </button>
        ))}
      </div>
    );
  }

  if (variant === 'pills') {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {modes.map((modeOption) => (
          <button
            key={modeOption.id}
            onClick={() => onChange(modeOption.id)}
            className={`${sizeClasses[size]} rounded-full transition-all ${
              mode === modeOption.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <modeOption.icon className={iconSizes[size]} />
              {showLabels && <span className="font-medium">{modeOption.label}</span>}
            </div>
          </button>
        ))}
      </div>
    );
  }

  // Default variant
  return (
    <div className={`flex items-center bg-gray-100 rounded-lg p-1 ${className}`}>
      {modes.map((modeOption) => (
        <button
          key={modeOption.id}
          onClick={() => onChange(modeOption.id)}
          className={`${sizeClasses[size]} rounded transition-all ${
            mode === modeOption.id
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <modeOption.icon className={iconSizes[size]} />
            {showLabels && <span className="font-medium">{modeOption.label}</span>}
          </div>
        </button>
      ))}
    </div>
  );
};

// Device Toggle for responsive preview
interface DeviceToggleProps {
  device: 'mobile' | 'tablet' | 'desktop';
  onChange: (device: 'mobile' | 'tablet' | 'desktop') => void;
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const DeviceToggle: React.FC<DeviceToggleProps> = ({
  device,
  onChange,
  showLabels = false,
  size = 'md',
  className = ''
}) => {
  const devices = [
    { id: 'mobile' as const, icon: Smartphone, label: 'Mobile' },
    { id: 'tablet' as const, icon: LayoutGrid, label: 'Tablet' },
    { id: 'desktop' as const, icon: Monitor, label: 'Desktop' }
  ];

  const sizeClasses = {
    sm: showLabels ? 'px-3 py-1.5 text-sm' : 'p-1.5',
    md: showLabels ? 'px-4 py-2 text-sm' : 'p-2',
    lg: showLabels ? 'px-5 py-2.5' : 'p-2.5'
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className={`flex items-center bg-gray-100 rounded-lg p-1 ${className}`}>
      {devices.map((deviceOption) => (
        <button
          key={deviceOption.id}
          onClick={() => onChange(deviceOption.id)}
          className={`${sizeClasses[size]} rounded transition-all ${
            device === deviceOption.id
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          title={deviceOption.label}
        >
          <div className="flex items-center gap-2">
            <deviceOption.icon className={iconSizes[size]} />
            {showLabels && <span className="font-medium">{deviceOption.label}</span>}
          </div>
        </button>
      ))}
    </div>
  );
};

// Panel Toggle for showing/hiding panels
interface PanelToggleProps {
  leftPanel: boolean;
  rightPanel: boolean;
  onToggleLeft: () => void;
  onToggleRight: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PanelToggle: React.FC<PanelToggleProps> = ({
  leftPanel,
  rightPanel,
  onToggleLeft,
  onToggleRight,
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5'
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <button
        onClick={onToggleLeft}
        className={`${sizeClasses[size]} rounded hover:bg-gray-100 transition-colors ${
          leftPanel ? 'text-blue-600' : 'text-gray-400'
        }`}
        title={leftPanel ? 'Hide left panel' : 'Show left panel'}
      >
        <PanelLeftClose className={iconSizes[size]} />
      </button>
      <button
        onClick={onToggleRight}
        className={`${sizeClasses[size]} rounded hover:bg-gray-100 transition-colors ${
          rightPanel ? 'text-blue-600' : 'text-gray-400'
        }`}
        title={rightPanel ? 'Hide right panel' : 'Show right panel'}
      >
        <PanelRightClose className={iconSizes[size]} />
      </button>
    </div>
  );
};

// Zoom Toggle for canvas zoom controls
interface ZoomToggleProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  zoom: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ZoomToggle: React.FC<ZoomToggleProps> = ({
  isFullscreen,
  onToggleFullscreen,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  zoom,
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2'
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <button
        onClick={onZoomOut}
        className={`${sizeClasses[size]} rounded hover:bg-gray-100 transition-colors text-gray-600`}
        title="Zoom out"
      >
        -
      </button>
      <button
        onClick={onZoomReset}
        className={`${sizeClasses[size]} rounded hover:bg-gray-100 transition-colors min-w-[60px] text-center font-medium`}
        title="Reset zoom"
      >
        {Math.round(zoom)}%
      </button>
      <button
        onClick={onZoomIn}
        className={`${sizeClasses[size]} rounded hover:bg-gray-100 transition-colors text-gray-600`}
        title="Zoom in"
      >
        +
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1" />
      <button
        onClick={onToggleFullscreen}
        className={`${sizeClasses[size]} rounded hover:bg-gray-100 transition-colors text-gray-600`}
        title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      >
        {isFullscreen ? (
          <Minimize2 className={iconSizes[size]} />
        ) : (
          <Maximize2 className={iconSizes[size]} />
        )}
      </button>
    </div>
  );
};

export default ViewToggle;