'use client';

import { useState } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import {
  accentSoftBackgroundStyle,
  accentTextSoftStyle,
  accentTextStyle,
  accentRingStyle,
  type SelectOption,
} from './shared';

export function MultiSelectField<TValue extends string>({
  label,
  values,
  onChange,
  options,
  placeholder = 'Selecione...',
}: {
  label: string;
  values: TValue[];
  onChange: (values: TValue[]) => void;
  options: SelectOption<TValue>[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const active = open;
  const selectedOptions = options.filter((option) =>
    values.includes(option.value),
  );

  const toggleValue = (value: TValue) => {
    if (values.includes(value)) {
      onChange(values.filter((item) => item !== value));
      return;
    }

    onChange([...values, value]);
  };

  return (
    <div className="mb-4">
      <label
        className="block text-[10px] font-mono tracking-[0.12em] uppercase mb-1.5 transition-colors duration-200"
        style={active ? accentTextStyle : accentTextSoftStyle}
      >
        {label}
      </label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex min-h-[48px] w-full items-center justify-between gap-3 rounded-lg border border-[#1E2130] bg-[#191C25] px-3.5 py-2.5 text-left text-sm text-[#E8EAF0] outline-none transition-all duration-200 hover:border-[#252A3A]"
            style={active ? accentRingStyle : undefined}
          >
            <div className="flex min-w-0 flex-1 flex-wrap gap-2">
              {selectedOptions.length > 0 ? (
                selectedOptions.map((option) => (
                  <span
                    key={option.value}
                    className="inline-flex max-w-full items-center gap-1 rounded-md bg-[#0D0F1488] px-2 py-1 text-[12px] font-medium text-[#E8EAF0]"
                  >
                    <span className="truncate">{option.label}</span>
                  </span>
                ))
              ) : (
                <span className="text-[#6B7280]">{placeholder}</span>
              )}
            </div>
            <ChevronDown className="size-4 shrink-0 text-[#6B7280]" />
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className="w-[var(--radix-popover-trigger-width)] rounded-xl border-[#1E2130] bg-[#13161D] p-2 text-[#E8EAF0] shadow-[0_24px_64px_rgba(0,0,0,0.45)]"
        >
          <div className="max-h-64 overflow-y-auto">
            {options.map((option) => {
              const selected = values.includes(option.value);

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggleValue(option.value)}
                  className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-[13px] transition-colors duration-150 ${
                    selected
                      ? 'text-[#E8EAF0]'
                      : 'text-[#E8EAF0] hover:bg-[#1E2130]'
                  }`}
                  style={selected ? accentSoftBackgroundStyle : undefined}
                >
                  <span className="min-w-0 flex-1 truncate">{option.label}</span>
                  {selected ? (
                    <Check className="size-4 shrink-0" style={accentTextStyle} />
                  ) : null}
                </button>
              );
            })}
          </div>

          {selectedOptions.length > 0 ? (
            <div className="mt-2 border-t border-[#1E2130] pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onChange([])}
                className="h-8 w-full justify-center rounded-lg border border-[#252A3A] bg-transparent px-3 text-[12px] text-[#9CA3AF] hover:border-[#F87171] hover:bg-[#F8717110] hover:text-[#F87171]"
              >
                <X className="size-3.5" />
                Limpar seleção
              </Button>
            </div>
          ) : null}
        </PopoverContent>
      </Popover>
    </div>
  );
}
