'use client';

import { useState } from 'react';

import { accentBorderStyle, accentTextSoftStyle, accentTextStyle } from './shared';

export function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
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
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="sm-textarea-scrollbar w-full bg-[#191C25] border border-[#1E2130] rounded-lg px-3.5 py-2.5 text-[#E8EAF0] text-sm font-sans outline-none resize-y transition-colors duration-200 placeholder:text-[#6B7280] placeholder:opacity-55 hover:border-[#252A3A]"
        style={focused ? accentBorderStyle : undefined}
      />
    </div>
  );
}
