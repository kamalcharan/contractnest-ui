// src/components/template-designer/canvas/TemplateCanvas.tsx
import React, { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Connection,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  NodeTypes,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';

import { nodeTypes } from '../nodes/nodeTypes';
import { DynamicNode } from '../nodes/DynamicNode';
import { useDroppable } from '@dnd-kit/core';

interface TemplateCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: Connection) => void;
  onNodeClick?: (event: React.MouseEvent, node: Node) => void;
  onEdgeClick?: (event: React.MouseEvent, edge: Edge) => void;
  onPaneClick?: () => void;
  isLocked?: boolean;
  showGrid?: boolean;
  showMinimap?: boolean;
  selectedNode?: Node | null;
  selectedEdge?: Edge | null;
}

// Initial nodes for empty canvas
const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

// Custom styles for the canvas
const proOptions = { hideAttribution: true };

const defaultEdgeOptions = {
  style: { strokeWidth: 2, stroke: '#b1b1b7' },
  type: 'smoothstep',
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
    color: '#b1b1b7',
  },
  animated: false,
};

// Custom connection line style
const connectionLineStyle = {
  strokeWidth: 2,
  stroke: '#b1b1b7',
  strokeDasharray: '5 5',
};

export const TemplateCanvas: React.FC<TemplateCanvasProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onEdgeClick,
  onPaneClick,
  isLocked = false,
  showGrid = true,
  showMinimap = false,
  selectedNode,
  selectedEdge,
}) => {
  // Droppable setup for drag and drop
  const { setNodeRef } = useDroppable({
    id: 'template-canvas',
  });

  // Handle drop events
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      // Check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      // Parse the dropped data
      const nodeData = JSON.parse(type);
      
      const newNode: Node = {
        id: `${nodeData.type}-${Date.now()}`,
        type: 'dynamicNode',
        position,
        data: {
          label: nodeData.label,
          blockType: nodeData.type,
          variant: nodeData.variant || 'standard',
          fields: nodeData.fields || [],
        },
      };

      // Add the new node
      onNodesChange([{ type: 'add', item: newNode }]);
    },
    [onNodesChange]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Custom node styles based on selection
  const getNodeStyle = (node: Node) => {
    if (selectedNode && selectedNode.id === node.id) {
      return {
        ...node.style,
        boxShadow: '0 0 0 2px #3b82f6',
      };
    }
    return node.style;
  };

  // Custom edge styles based on selection
  const getEdgeStyle = (edge: Edge) => {
    if (selectedEdge && selectedEdge.id === edge.id) {
      return {
        ...edge.style,
        stroke: '#3b82f6',
        strokeWidth: 3,
      };
    }
    return edge.style;
  };

  // Process nodes and edges with custom styles
  const styledNodes = nodes.map(node => ({
    ...node,
    style: getNodeStyle(node),
  }));

  const styledEdges = edges.map(edge => ({
    ...edge,
    style: getEdgeStyle(edge),
  }));

  return (
    <div
      ref={setNodeRef}
      className="w-full h-full relative"
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <ReactFlow
        nodes={styledNodes}
        edges={styledEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionLineStyle={connectionLineStyle}
        proOptions={proOptions}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        nodesDraggable={!isLocked}
        nodesConnectable={!isLocked}
        elementsSelectable={!isLocked}
        panOnDrag={!isLocked}
        zoomOnScroll={!isLocked}
        preventScrolling={!isLocked}
      >
        {/* Grid Background */}
        {showGrid && (
          <Background
            variant={BackgroundVariant.Dots}
            gap={16}
            size={1}
            color="#e5e7eb"
          />
        )}

        {/* Minimap */}
        {showMinimap && (
          <MiniMap
            nodeColor={(node) => {
              switch (node.data?.blockType) {
                case 'header':
                  return '#3b82f6';
                case 'section':
                  return '#10b981';
                case 'paragraph':
                  return '#6b7280';
                case 'list':
                  return '#8b5cf6';
                case 'table':
                  return '#f59e0b';
                case 'signature':
                  return '#ef4444';
                default:
                  return '#94a3b8';
              }
            }}
            nodeStrokeWidth={3}
            pannable
            zoomable
            className="bg-gray-50"
          />
        )}
      </ReactFlow>

      {/* Connection line preview */}
      {connectionLineStyle && (
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-50">
          <path
            d={connectionLineStyle.path}
            fill="none"
            stroke="#b1b1b7"
            strokeWidth={2}
            strokeDasharray="5 5"
          />
        </svg>
      )}
    </div>
  );
};

export default TemplateCanvas;