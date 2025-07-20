// src/components/dashboard/QuickActions.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

interface QuickAction {
  title: string;
  icon: React.ElementType;
  href: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
  className?: string;
}

const QuickActions: React.FC<QuickActionsProps> = ({ actions, className = '' }) => {
  return (
    <div className={`bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow overflow-hidden ${className}`}>
      <div className="p-4 border-b border-border">
        <h3 className="font-medium">Quick Actions</h3>
      </div>
      
      <div className="p-4 grid gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          
          return (
            <Link
              key={index}
              to={action.href}
              className="flex items-center p-3 rounded-md bg-primary/5 border border-primary/10 hover:bg-primary/10 hover:border-primary/20 transition-all group"
            >
              <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center mr-3 group-hover:bg-primary/20 transition-colors">
                <Icon size={18} className="text-primary" />
              </div>
              <span className="font-medium text-sm">{action.title}</span>
            </Link>
          );
        })}
        
        <Link
          to="/contracts/templates"
          className="flex items-center p-3 rounded-md bg-muted/50 border border-dashed border-border hover:bg-muted transition-colors text-muted-foreground"
        >
          <div className="h-9 w-9 rounded-md bg-muted flex items-center justify-center mr-3">
            <PlusCircle size={18} />
          </div>
          <span className="font-medium text-sm">Manage Templates</span>
        </Link>
      </div>
    </div>
  );
};

export default QuickActions;