// src/pages/public/test.tsx
import React from 'react';

const TestPage = () => {
  console.log("Test page rendering");
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Test Page</h1>
      <p>If you can see this, the public route is working correctly.</p>
    </div>
  );
};

export default TestPage;