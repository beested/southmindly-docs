'use client';

import { useState } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/inputs/select';

import {
  accentSoftBackgroundStyle,
  accentTextSoftStyle,
  accentTextStyle,
  accentRingStyle,
  type SelectOption,
} from './shared';

export function SelectField<TValue extends string>({
  label,
  value,
  onChange,
  options,
  placeholder = 'Selecione...',
}: {
  label: string;
  value: TValue;
  onChange: (v: TValue) => void;
  options: SelectOption<TValue>[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const active = open || focused;

  return (
    <div className="mb-4">
      <label
        className="block text-[10px] font-mono tracking-[0.12em] uppercase mb-1.5 transition-colors duration-200"
        style={active ? accentTextStyle : accentTextSoftStyle}
      >
        {label}
      </label>
      <Select
        value={value || undefined}
        onValueChange={(nextValue) => onChange(nextValue as TValue)}
        open={open}
        onOpenChange={setOpen}
      >
        <SelectTrigger
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full h-[48px] justify-between bg-[#191C25] border-[#1E2130] text-[#E8EAF0] rounded-lg px-3.5 hover:bg-[#191C25] hover:text-[#E8EAF0] hover:border-[#252A3A] data-[placeholder]:text-[#6B7280]"
          style={active ? accentRingStyle : undefined}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent
          position="popper"
          align="start"
          className="bg-[#13161D] border-[#1E2130] text-[#E8EAF0] rounded-xl shadow-[0_24px_64px_rgba(0,0,0,0.45)] overflow-hidden"
        >
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="text-[13px] font-sans text-[#E8EAF0] focus:bg-[#1E2130] focus:text-[#E8EAF0] data-[state=checked]:text-[#E8EAF0]"
              style={value === option.value ? accentSoftBackgroundStyle : undefined}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
