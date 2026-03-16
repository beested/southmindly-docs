'use client';

import { useState } from 'react';

import { accentBorderStyle, accentTextSoftStyle, accentTextStyle } from './shared';

export function ToggleField({
  label,
  checked,
  onCheckedChange,
  checkedLabel = 'Ativo',
  uncheckedLabel = 'Inativo',
}: {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  checkedLabel?: string;
  uncheckedLabel?: string;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="mb-4">
      <label
        className="block text-[10px] font-mono tracking-[0.12em] uppercase mb-1.5 transition-colors duration-200"
        style={focused ? accentTextStyle : accentTextSoftStyle}
      >
        {label}
      </label>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onCheckedChange(!checked)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="flex h-[48px] w-full items-center justify-between rounded-lg border border-[#1E2130] bg-[#191C25] px-3.5 text-sm font-medium text-[#E8EAF0] outline-none transition-all duration-200 hover:border-[#252A3A]"
        style={
          checked
            ? {
                ...accentBorderStyle,
                backgroundColor: 'rgba(124, 58, 237, 0.14)',
                ...(focused
                  ? { boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.22)' }
                  : {}),
              }
            : focused
              ? { boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.22)' }
              : undefined
        }
      >
        <span>{checked ? checkedLabel : uncheckedLabel}</span>
        <span
          className="flex h-6 w-10 items-center rounded-full border border-[#252A3A] bg-[#0D0F14] px-1 transition-colors duration-200"
          style={
            checked
              ? {
                  borderColor: 'rgba(124, 58, 237, 0.55)',
                  backgroundColor: 'rgba(124, 58, 237, 0.22)',
                }
              : undefined
          }
        >
          <span
            className={`h-4 w-4 rounded-full transition-all duration-200 ${
              checked ? 'translate-x-4' : 'translate-x-0 bg-[#6B7280]'
            }`}
            style={checked ? { backgroundColor: '#7C3AED' } : undefined}
          />
        </span>
      </button>
    </div>
  );
}
