// src/hooks/useTemplateDesigner.ts
import { useState, useCallback, useRef, useEffect } from 'react';
import { Node, Edge, Connection, NodeChange, EdgeChange, addEdge, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import { useNavigate } from 'react-router-dom';

// Types
export interface TemplateData {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'draft' | 'published' | 'archived' | 'locked';
  visibility: 'private' | 'organization' | 'public';
  version: string;
  tags: string[];
  permissions: {
    canEdit: boolean;
    canShare: boolean;
    canDelete: boolean;
    canPublish: boolean;
  };
  embedding: {
    enabled: boolean;
    allowedDomains: string[];
    requireAuth: boolean;
  };
  usage: {
    totalUses: number;
    activeContracts: number;
    lastUsed: Date | null;
  };
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface HistoryState {
  nodes: Node[];
  edges: Edge[];
  timestamp: Date;
}

export const useTemplateDesigner = (templateId?: string) => {
  const navigate = useNavigate();
  const historyRef = useRef<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Initial nodes and edges
  const initialNodes: Node[] = templateId ? [] : [
    {
      id: '1',
      type: 'dynamicNode',
      position: { x: 250, y: 50 },
      data: {
        blockType: 'header',
        label: 'Contract Header',
        variant: 'standard',
        fields: []
      }
    }
  ];

  // State
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Template metadata
  const [template, setTemplate] = useState<TemplateData>({
    id: templateId || 'new',
    name: 'New Template',
    description: '',
    category: 'contracts',
    status: 'draft',
    visibility: 'private',
    version: '1.0.0',
    tags: [],
    permissions: {
      canEdit: true,
      canShare: true,
      canDelete: true,
      canPublish: true
    },
    embedding: {
      enabled: false,
      allowedDomains: [],
      requireAuth: false
    },
    usage: {
      totalUses: 0,
      activeContracts: 0,
      lastUsed: null
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'Current User'
  });

  // Load template data if editing
  useEffect(() => {
    if (templateId && templateId !== 'new') {
      loadTemplate(templateId);
    }
  }, [templateId]);

  // Load template from API
  const loadTemplate = async (id: string) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await api.getTemplate(id);
      
      // Mock data for now
      const mockTemplate: TemplateData = {
        ...template,
        id,
        name: 'Service Agreement Template',
        description: 'Standard service agreement for consulting services',
        status: 'published',
        visibility: 'organization',
        tags: ['consulting', 'services', 'standard'],
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-02-20')
      };

      const mockNodes: Node[] = [
        {
          id: '1',
          type: 'dynamicNode',
          position: { x: 250, y: 50 },
          data: {
            blockType: 'header',
            label: 'Contract Header',
            variant: 'standard',
            fields: []
          }
        },
        {
          id: '2',
          type: 'dynamicNode',
          position: { x: 250, y: 200 },
          data: {
            blockType: 'section',
            label: 'Terms & Conditions',
            variant: 'standard',
            fields: []
          }
        }
      ];

      const mockEdges: Edge[] = [
        {
          id: 'e1-2',
          source: '1',
          target: '2',
          type: 'smoothstep'
        }
      ];

      setTemplate(mockTemplate);
      setNodes(mockNodes);
      setEdges(mockEdges);
      
      // Initialize history
      addToHistory(mockNodes, mockEdges);
    } catch (err) {
      setError('Failed to load template');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // History management
  const addToHistory = useCallback((newNodes: Node[], newEdges: Edge[]) => {
    const newState: HistoryState = {
      nodes: [...newNodes],
      edges: [...newEdges],
      timestamp: new Date()
    };

    // Remove any states after current index
    const newHistory = historyRef.current.slice(0, historyIndex + 1);
    newHistory.push(newState);
    
    // Limit history to 50 states
    if (newHistory.length > 50) {
      newHistory.shift();
    }
    
    historyRef.current = newHistory;
    setHistoryIndex(newHistory.length - 1);
  }, [historyIndex]);

  // Node handlers
  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => {
      const updated = applyNodeChanges(changes, nds);
      setIsDirty(true);
      return updated;
    });
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => {
      const updated = applyEdgeChanges(changes, eds);
      setIsDirty(true);
      return updated;
    });
  }, []);

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => {
      const updated = addEdge(connection, eds);
      setIsDirty(true);
      addToHistory(nodes, updated);
      return updated;
    });
  }, [nodes, addToHistory]);

  // Node/Edge selection
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setSelectedEdge(null);
  }, []);

  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge);
    setSelectedNode(null);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
  }, []);

  // Node operations
  const addNode = useCallback((nodeData: any) => {
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: 'dynamicNode',
      position: { x: 250, y: nodes.length * 150 + 50 },
      data: nodeData
    };

    setNodes((nds) => {
      const updated = [...nds, newNode];
      addToHistory(updated, edges);
      setIsDirty(true);
      return updated;
    });
  }, [nodes, edges, addToHistory]);

  const updateNode = useCallback((nodeId: string, updates: any) => {
    setNodes((nds) => {
      const updated = nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...updates } } : node
      );
      setIsDirty(true);
      return updated;
    });
  }, []);

  const deleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => {
      const updated = nds.filter((node) => node.id !== nodeId);
      setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
      addToHistory(updated, edges);
      setIsDirty(true);
      return updated;
    });
  }, [edges, addToHistory]);

  // Edge operations
  const updateEdge = useCallback((edgeId: string, updates: any) => {
    setEdges((eds) => {
      const updated = eds.map((edge) =>
        edge.id === edgeId ? { ...edge, ...updates } : edge
      );
      setIsDirty(true);
      return updated;
    });
  }, []);

  const deleteEdge = useCallback((edgeId: string) => {
    setEdges((eds) => {
      const updated = eds.filter((edge) => edge.id !== edgeId);
      addToHistory(nodes, updated);
      setIsDirty(true);
      return updated;
    });
  }, [nodes, addToHistory]);

  // Template operations
  const updateTemplate = useCallback((updates: Partial<TemplateData>) => {
    setTemplate((prev) => ({ ...prev, ...updates }));
    setIsDirty(true);
  }, []);

  // Save template
  const saveTemplate = useCallback(async () => {
    setIsSaving(true);
    try {
      // TODO: Replace with actual API call
      // await api.saveTemplate(template.id, { template, nodes, edges });
      
      console.log('Saving template:', { template, nodes, edges });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsDirty(false);
      setTemplate(prev => ({ ...prev, updatedAt: new Date() }));
      
      return true;
    } catch (err) {
      setError('Failed to save template');
      console.error(err);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [template, nodes, edges]);

  // Undo/Redo
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < historyRef.current.length - 1;

  const undo = useCallback(() => {
    if (canUndo) {
      const newIndex = historyIndex - 1;
      const state = historyRef.current[newIndex];
      setNodes(state.nodes);
      setEdges(state.edges);
      setHistoryIndex(newIndex);
      setIsDirty(true);
    }
  }, [historyIndex, canUndo]);

  const redo = useCallback(() => {
    if (canRedo) {
      const newIndex = historyIndex + 1;
      const state = historyRef.current[newIndex];
      setNodes(state.nodes);
      setEdges(state.edges);
      setHistoryIndex(newIndex);
      setIsDirty(true);
    }
  }, [historyIndex, canRedo]);

  // Export functions
  const exportTemplate = useCallback(() => {
    const data = {
      template,
      nodes,
      edges,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name.toLowerCase().replace(/\s+/g, '-')}-template.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [template, nodes, edges]);

  // Import template
  const importTemplate = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.template && data.nodes && data.edges) {
          setTemplate(data.template);
          setNodes(data.nodes);
          setEdges(data.edges);
          addToHistory(data.nodes, data.edges);
          setIsDirty(true);
        }
      } catch (err) {
        setError('Failed to import template');
        console.error(err);
      }
    };
    reader.readAsText(file);
  }, [addToHistory]);

  return {
    // State
    nodes,
    edges,
    selectedNode,
    selectedEdge,
    template,
    isDirty,
    isLoading,
    isSaving,
    error,
    
    // Handlers
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeClick,
    onEdgeClick,
    onPaneClick,
    
    // Operations
    addNode,
    updateNode,
    deleteNode,
    updateEdge,
    deleteEdge,
    updateTemplate,
    saveTemplate,
    
    // History
    undo,
    redo,
    canUndo,
    canRedo,
    
    // Import/Export
    exportTemplate,
    importTemplate,
    
    // Selection
    setSelectedNode,
    setSelectedEdge,
    
    // Navigation
    navigate
  };
};