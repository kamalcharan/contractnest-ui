// src/pages/catalog-studio/template.tsx
import React from 'react';
import { LayoutTemplate, Plus, ArrowRight } from 'lucide-react';

const CatalogStudioTemplatePage: React.FC = () => {
  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Template Builder</h1>
          <p className="text-sm text-gray-500">Combine blocks to create contract templates</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Template
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-lg text-center">
          <div className="w-20 h-20 mx-auto bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
            <LayoutTemplate className="w-10 h-10 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Template Builder Coming Soon</h2>
          <p className="text-gray-500 mb-8">
            Drag and drop blocks from your library to create reusable contract templates.
            Templates can be shared with your team and used to quickly create new contracts.
          </p>

          <div className="bg-white rounded-xl border border-gray-200 p-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-4">How it will work:</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 font-bold text-sm flex-shrink-0">
                  1
                </div>
                <div>
                  <div className="font-medium text-gray-900">Select Blocks</div>
                  <div className="text-sm text-gray-500">Choose service, billing, and clause blocks from your library</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 font-bold text-sm flex-shrink-0">
                  2
                </div>
                <div>
                  <div className="font-medium text-gray-900">Arrange & Configure</div>
                  <div className="text-sm text-gray-500">Drag blocks into sections and customize their settings</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 font-bold text-sm flex-shrink-0">
                  3
                </div>
                <div>
                  <div className="font-medium text-gray-900">Save & Use</div>
                  <div className="text-sm text-gray-500">Save the template and use it to create contracts instantly</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <a
              href="/catalog-studio/configure"
              className="inline-flex items-center gap-2 text-purple-600 font-medium hover:text-purple-700"
            >
              Start by creating blocks in Configure
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogStudioTemplatePage;
