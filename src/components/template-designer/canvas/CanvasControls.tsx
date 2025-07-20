// src/components/template-designer/canvas/CanvasControls.tsx
import React from 'react';
import { useReactFlow, useViewport } from 'reactflow';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Grid3X3, 
  Lock, 
  Unlock,
  Eye,
  EyeOff,
  Layers,
  Navigation
} from 'lucide-react';

interface CanvasControlsProps {
  showGrid: boolean;
  onToggleGrid: () => void;
  showMinimap: boolean;
  onToggleMinimap: () => void;
  isLocked: boolean;
  onToggleLock: () => void;
}

export const CanvasControls: React.FC<CanvasControlsProps> = ({
  showGrid,
  onToggleGrid,
  showMinimap,
  onToggleMinimap,
  isLocked,
  onToggleLock
}) => {
  const { zoomIn, zoomOut, fitView, getZoom, setViewport } = useReactFlow();
  const viewport = useViewport();
  const [currentZoom, setCurrentZoom] = React.useState(100);

  React.useEffect(() => {
    const zoom = getZoom();
    setCurrentZoom(Math.round(zoom * 100));
  }, [getZoom]);

  const handleZoomIn = () => {
    zoomIn();
    setTimeout(() => {
      setCurrentZoom(Math.round(getZoom() * 100));
    }, 50);
  };

  const handleZoomOut = () => {
    zoomOut();
    setTimeout(() => {
      setCurrentZoom(Math.round(getZoom() * 100));
    }, 50);
  };

  const handleFitView = () => {
    fitView({ padding: 0.2, duration: 200 });
    setTimeout(() => {
      setCurrentZoom(Math.round(getZoom() * 100));
    }, 250);
  };

  const handleZoomChange = (value: string) => {
    const zoom = parseInt(value) / 100;
    setViewport({ x: viewport.x, y: viewport.y, zoom }, { duration: 200 });
    setCurrentZoom(parseInt(value));
  };

  return (
    <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg border border-gray-200 p-2">
      <div className="flex items-center gap-1">
        {/* Zoom Controls */}
        <button
          onClick={handleZoomOut}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4 text-gray-600" />
        </button>
        
        <div className="px-2 min-w-[80px] text-center">
          <select
            value={currentZoom}
            onChange={(e) => handleZoomChange(e.target.value)}
            className="text-sm text-gray-600 bg-transparent focus:outline-none cursor-pointer"
          >
            <option value="25">25%</option>
            <option value="50">50%</option>
            <option value="75">75%</option>
            <option value="100">100%</option>
            <option value="125">125%</option>
            <option value="150">150%</option>
            <option value="200">200%</option>
          </select>
        </div>
        
        <button
          onClick={handleZoomIn}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4 text-gray-600" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Fit View */}
        <button
          onClick={handleFitView}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Fit to View"
        >
          <Maximize2 className="w-4 h-4 text-gray-600" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Grid Toggle */}
        <button
          onClick={onToggleGrid}
          className={`p-2 hover:bg-gray-100 rounded transition-colors ${
            showGrid ? 'bg-blue-50' : ''
          }`}
          title="Toggle Grid"
        >
          <Grid3X3 className={`w-4 h-4 ${showGrid ? 'text-blue-600' : 'text-gray-600'}`} />
        </button>

        {/* Minimap Toggle */}
        <button
          onClick={onToggleMinimap}
          className={`p-2 hover:bg-gray-100 rounded transition-colors ${
            showMinimap ? 'bg-blue-50' : ''
          }`}
          title="Toggle Minimap"
        >
          <Navigation className={`w-4 h-4 ${showMinimap ? 'text-blue-600' : 'text-gray-600'}`} />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Lock/Unlock Canvas */}
        <button
          onClick={onToggleLock}
          className={`p-2 hover:bg-gray-100 rounded transition-colors ${
            isLocked ? 'bg-red-50' : ''
          }`}
          title={isLocked ? 'Unlock Canvas' : 'Lock Canvas'}
        >
          {isLocked ? (
            <Lock className="w-4 h-4 text-red-600" />
          ) : (
            <Unlock className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </div>

      {/* Canvas Stats */}
      <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500 flex items-center gap-3">
        <div className="flex items-center gap-1">
          <Layers className="w-3 h-3" />
          <span>12 blocks</span>
        </div>
        <div className="flex items-center gap-1">
          <span>8 connections</span>
        </div>
      </div>
    </div>
  );
};

// Additional control for viewport info
export const ViewportInfo: React.FC = () => {
  const { getViewport } = useReactFlow();
  const [viewport, setViewport] = React.useState({ x: 0, y: 0, zoom: 1 });

  React.useEffect(() => {
    const interval = setInterval(() => {
      setViewport(getViewport());
    }, 100);
    return () => clearInterval(interval);
  }, [getViewport]);

  return (
    <div className="absolute top-4 left-4 bg-black/75 text-white text-xs px-3 py-2 rounded-md font-mono">
      <div>X: {viewport.x.toFixed(0)}</div>
      <div>Y: {viewport.y.toFixed(0)}</div>
      <div>Zoom: {(viewport.zoom * 100).toFixed(0)}%</div>
    </div>
  );
};