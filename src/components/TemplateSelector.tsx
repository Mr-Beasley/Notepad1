import React from 'react';
import { Template } from '../types';

interface TemplateSelectorProps {
  templates: Template[];
  onSelectTemplate: (template: Template) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ templates, onSelectTemplate }) => {
  return (
    <div className="mt-4">
      <h3 className="font-semibold mb-2">Templates</h3>
      <div className="flex flex-wrap gap-2">
        {templates.map(template => (
          <button
            key={template.id}
            onClick={() => onSelectTemplate(template)}
            className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm"
          >
            {template.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;