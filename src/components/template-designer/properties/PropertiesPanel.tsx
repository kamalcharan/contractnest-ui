// src/components/template-designer/properties/PropertiesPanel.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Node, Edge } from 'reactflow';
import NodeProperties from './NodeProperties';
import EdgeProperties from './EdgeProperties';
import TemplateProperties from './TemplateProperties';
import { FileText, GitBranch, Settings } from 'lucide-react';

interface PropertiesPanelProps {
  selectedNode?: Node | null;
  selectedEdge?: Edge | null;
  template?: any;
  nodes?: Node[];
  edges?: Edge[];
  onNodeUpdate?: (nodeId: string, data: any) => void;
  onEdgeUpdate?: (edgeId: string, data: any) => void;
  onTemplateUpdate?: (data: any) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedNode,
  selectedEdge,
  template,
  nodes = [],
  edges = [],
  onNodeUpdate,
  onEdgeUpdate,
  onTemplateUpdate,
}) => {
  // Determine which tab should be active
  const activeTab = selectedNode ? 'node' : selectedEdge ? 'edge' : 'template';

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Properties</h2>
      </div>

      <Tabs value={activeTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 px-4">
          <TabsTrigger value="node" disabled={!selectedNode}>
            <FileText className="w-4 h-4 mr-2" />
            Node
          </TabsTrigger>
          <TabsTrigger value="edge" disabled={!selectedEdge}>
            <GitBranch className="w-4 h-4 mr-2" />
            Edge
          </TabsTrigger>
          <TabsTrigger value="template">
            <Settings className="w-4 h-4 mr-2" />
            Template
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="node" className="mt-0">
            {selectedNode ? (
              <NodeProperties
                node={selectedNode}
                onUpdate={(data) => onNodeUpdate?.(selectedNode.id, data)}
              />
            ) : (
              <div className="p-4 text-center text-gray-500">
                Select a node to view its properties
              </div>
            )}
          </TabsContent>

          <TabsContent value="edge" className="mt-0">
            {selectedEdge ? (
              <EdgeProperties
                edge={selectedEdge}
                nodes={nodes}
                onUpdate={(data) => onEdgeUpdate?.(selectedEdge.id, data)}
              />
            ) : (
              <div className="p-4 text-center text-gray-500">
                Select a connection to view its properties
              </div>
            )}
          </TabsContent>

          <TabsContent value="template" className="mt-0">
            {template ? (
              <TemplateProperties
                template={{
                  ...template,
                  tags: template.tags || [],
                  permissions: template.permissions || {
                    canEdit: true,
                    canShare: true,
                    canDelete: true,
                    canPublish: true
                  },
                  embedding: template.embedding || {
                    enabled: false,
                    allowedDomains: [],
                    requireAuth: false
                  },
                  usage: template.usage || {
                    totalUses: 0,
                    activeContracts: 0,
                    lastUsed: null
                  }
                }}
                onUpdate={onTemplateUpdate}
              />
            ) : (
              <div className="p-4 text-center text-gray-500">
                No template data available
              </div>
            )}
          </TabsContent>
        </ScrollArea>
      </Tabs>

      {/* Summary stats */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
        <div className="flex justify-between items-center">
          <span>{nodes?.length || 0} nodes • {edges?.length || 0} connections</span>
          {template && (
            <span>{template.tags?.length || 0} tags</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;