// src/components/ui/textarea.tsx
import React from 'react';
import * as Form from '@radix-ui/react-form';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
}

export function Textarea({ className = '', ...props }: TextareaProps) {
  return (
    <Form.Control asChild>
      <textarea
        className={`flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${className}`}
        {...props}
      />
    </Form.Control>
  );
}