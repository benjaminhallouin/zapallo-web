/**
 * SegmentedControl component - a group of buttons for selecting between options
 */

import React from 'react';

interface SegmentedControlOption {
  value: string;
  label: string;
}

interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

export function SegmentedControl({ options, value, onChange, label, className = '' }: SegmentedControlProps) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1 shadow-sm">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`
              px-4 py-2 text-sm font-medium rounded-md transition-all
              ${
                value === option.value
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
