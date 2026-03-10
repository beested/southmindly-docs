'use client';

import { useState } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { SelectOption } from './types';

export function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="mb-4">
      <label
        className={`block text-[10px] font-mono tracking-[0.12em] uppercase mb-1.5 transition-colors duration-200 ${focused ? 'text-[#34D399]' : 'text-[#6B7280]'}`}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`w-full h-[48px] bg-[#191C25] border rounded-lg px-3.5 py-2.5 text-[#E8EAF0] text-sm font-sans outline-none transition-all duration-200 placeholder:text-[#6B7280] placeholder:opacity-55 hover:border-[#252A3A] ${focused ? 'border-[#34D399] ring-[3px] ring-[#34D39922]' : 'border-[#1E2130]'}`}
      />
    </div>
  );
}

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
        className={`block text-[10px] font-mono tracking-[0.12em] uppercase mb-1.5 transition-colors duration-200 ${focused ? 'text-[#34D399]' : 'text-[#6B7280]'}`}
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
        className={`sm-textarea-scrollbar w-full bg-[#191C25] border rounded-lg px-3.5 py-2.5 text-[#E8EAF0] text-sm font-sans outline-none resize-y transition-colors duration-200 placeholder:text-[#6B7280] placeholder:opacity-55 ${focused ? 'border-[#34D399]' : 'border-[#1E2130]'}`}
      />
    </div>
  );
}

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
        className={`block text-[10px] font-mono tracking-[0.12em] uppercase mb-1.5 transition-colors duration-200 ${active ? 'text-[#34D399]' : 'text-[#6B7280]'}`}
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
          className={`w-full h-[48px] justify-between bg-[#191C25] border-[#1E2130] text-[#E8EAF0] rounded-lg px-3.5 hover:bg-[#191C25] hover:text-[#E8EAF0] hover:border-[#252A3A] data-[placeholder]:text-[#6B7280] ${
            active ? 'border-[#34D399] ring-[3px] ring-[#34D39922]' : ''
          }`}
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
              className="text-[13px] font-sans text-[#E8EAF0] focus:bg-[#1E2130] focus:text-[#E8EAF0] data-[state=checked]:bg-[#34D39922] data-[state=checked]:text-[#E8EAF0]"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
