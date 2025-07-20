// src/pages/settings/templates.tsx
import React from 'react';
import { useRouter } from 'next/router';

// This page acts as a redirect to the main templates page
// It matches the menu structure where Template Designer is under Settings
export default function SettingsTemplatesPage() {
  const router = useRouter();

  React.useEffect(() => {
    // Redirect to the main templates page
    router.replace('/templates');
  }, [router]);

  // Show a loading state while redirecting
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to Template Designer...</p>
      </div>
    </div>
  );
}