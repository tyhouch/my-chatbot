import React from 'react';

const ModelSelector = ({ model, onChange }) => {
  return (
    <select 
      value={model} 
      onChange={(e) => onChange(e.target.value)}
      className="p-2 border rounded-md text-sm"
    >
      <option value="gpt-4o">GPT-4o</option>
      <option value="gpt-4o-mini">GPT-4o Mini</option>
    </select>
  );
};

export default ModelSelector; 