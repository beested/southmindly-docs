'use client';

import { useState, type CSSProperties, type ReactNode } from 'react';

import { accentRingStyle, accentTextSoftStyle, accentTextStyle } from './shared';

export function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  renderInput,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  renderInput?: (props: {
    type: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    className: string;
    style?: CSSProperties;
    onFocus: () => void;
    onBlur: () => void;
  }) => ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  const inputClassName =
    'w-full h-[48px] bg-[#191C25] border rounded-lg px-3.5 py-2.5 text-[#E8EAF0] text-sm font-sans outline-none transition-all duration-200 placeholder:text-[#6B7280] placeholder:opacity-55 hover:border-[#252A3A] border-[#1E2130]';

  return (
    <div className="mb-4">
      <label
        className="block text-[10px] font-mono tracking-[0.12em] uppercase mb-1.5 transition-colors duration-200"
        style={focused ? accentTextStyle : accentTextSoftStyle}
      >
        {label}
      </label>
      {renderInput ? (
        renderInput({
          type,
          value,
          onChange,
          placeholder,
          className: inputClassName,
          style: focused ? accentRingStyle : undefined,
          onFocus: () => setFocused(true),
          onBlur: () => setFocused(false),
        })
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={inputClassName}
          style={focused ? accentRingStyle : undefined}
        />
      )}
    </div>
  );
}
