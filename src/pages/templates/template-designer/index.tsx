// src/pages/templates/template-designer/index.tsx
import React from 'react';

const TemplateDesignerPage: React.FC = () => {
  return (
    <div className="p-8 min-h-screen bg-background">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4 text-foreground">Template Designer</h1>
        <p className="text-muted-foreground mb-8">Create and customize your own contract templates</p>
        <div className="bg-card border border-border rounded-lg p-12">
          <div className="text-6xl mb-4">🔧</div>
          <h2 className="text-xl font-semibold mb-2 text-foreground">Coming Soon</h2>
          <p className="text-muted-foreground">
            The template designer with drag-and-drop block builder will be available soon.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TemplateDesignerPage;