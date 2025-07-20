// src/components/template-designer/properties/EdgeProperties.tsx

import React, { useState, useEffect } from 'react';
import { Edge, Node } from 'reactflow';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ArrowRight, Trash2, AlertCircle } from 'lucide-react';
import Alert from '@/components/ui/Alert';

interface EdgePropertiesProps {
  edge: Edge;
  sourceNode?: Node;
  targetNode?: Node;
  onUpdate?: (data: any) => void;
}

const EdgeProperties: React.FC<EdgePropertiesProps> = ({ 
  edge, 
  sourceNode, 
  targetNode, 
  onUpdate 
}) => {
  const [formData, setFormData] = useState({
    animated: edge.animated || false,
    type: edge.type || 'smoothstep',
    label: edge.label || '',
    dataMapping: edge.data?.dataMapping || {},
  });

  useEffect(() => {
    setFormData({
      animated: edge.animated || false,
      type: edge.type || 'smoothstep',
      label: edge.label || '',
      dataMapping: edge.data?.dataMapping || {},
    });
  }, [edge]);

  const handleChange = (field: string, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onUpdate?.(newData);
  };

  return (
    <div className="space-y-4">
      {/* Connection Info */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Connection</h4>
        <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
          <div className="flex-1">
            <Badge variant="outline" className="text-xs">
              {sourceNode?.data.label || 'Unknown'}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">
              {sourceNode?.data.blockType}
            </p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <div className="flex-1 text-right">
            <Badge variant="outline" className="text-xs">
              {targetNode?.data.label || 'Unknown'}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">
              {targetNode?.data.blockType}
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Edge Properties */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="edgeType">Connection Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => handleChange('type', value)}
          >
            <SelectTrigger id="edgeType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="straight">Straight</SelectItem>
              <SelectItem value="smoothstep">Smooth Step</SelectItem>
              <SelectItem value="step">Step</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="animated">Animated Flow</Label>
          <Switch
            id="animated"
            checked={formData.animated}
            onCheckedChange={(checked) => handleChange('animated', checked)}
          />
        </div>
      </div>

      <Separator />

      {/* Data Flow */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium">Data Flow</h4>
        
        {sourceNode?.data.blockType === 'contact' && targetNode?.data.blockType === 'service' && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Contact data will be passed to the service block
            </AlertDescription>
          </Alert>
        )}

        {sourceNode?.data.blockType === 'service' && targetNode?.data.blockType === 'billing' && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Service amount and schedule will be used for billing calculations
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label className="text-xs">Data Mapping</Label>
          <div className="space-y-1 p-3 bg-muted rounded-md">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Contact ID</span>
              <ArrowRight className="h-3 w-3" />
              <span className="text-muted-foreground">Service Contact</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Service Amount</span>
              <ArrowRight className="h-3 w-3" />
              <span className="text-muted-foreground">Billing Base</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-4">
        <Button
          variant="destructive"
          size="sm"
          className="w-full"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Connection
        </Button>
      </div>
    </div>
  );
};

export default EdgeProperties;