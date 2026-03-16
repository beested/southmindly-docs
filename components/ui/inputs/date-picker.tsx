'use client';

import { format, isValid, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  accentColor?: string;
  popoverClassName?: string;
}

const parseInputDate = (value: string) => {
  if (!value) return undefined;
  const parsed = parse(value, 'dd/MM/yyyy', new Date());
  return isValid(parsed) ? parsed : undefined;
};

const withHexAlpha = (hex: string, alpha: string) => {
  const normalized = hex.trim();
  if (!/^#[0-9a-fA-F]{6}$/.test(normalized)) return '';
  return `${normalized}${alpha}`;
};

function DatePicker({
  value,
  onChange,
  placeholder = 'Selecione a data',
  className,
  accentColor = '#7C3AED',
  popoverClassName,
}: DatePickerProps) {
  const selectedDate = React.useMemo(() => parseInputDate(value), [value]);
  const accent22 = React.useMemo(
    () => withHexAlpha(accentColor, '22') || 'rgba(79,126,255,0.13)',
    [accentColor],
  );
  const accent44 = React.useMemo(
    () => withHexAlpha(accentColor, '44') || 'rgba(79,126,255,0.27)',
    [accentColor],
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            'w-full h-[48px] justify-start text-left font-normal bg-[#191C25] border-[#1E2130] text-[#E8EAF0] text-sm rounded-lg px-3.5 hover:bg-[#191C25] hover:text-[#E8EAF0] hover:border-[#252A3A] data-[state=open]:border-[color:var(--dp-accent-44)] data-[state=open]:shadow-[0_0_0_3px_var(--dp-accent-22)] focus-visible:border-[color:var(--dp-accent)] focus-visible:ring-0',
            !selectedDate && 'text-[#6B7280]',
            className,
          )}
          style={
            {
              '--dp-accent': accentColor,
              '--dp-accent-22': accent22,
              '--dp-accent-44': accent44,
            } as React.CSSProperties
          }
        >
          <CalendarIcon className="mr-2.5 size-[18px]" />
          {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          'w-[300px] p-2 bg-gradient-to-b from-[#151923] to-[#0D0F14] border-[#1E2130] text-[#E8EAF0] rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.55)] overflow-hidden',
          popoverClassName,
        )}
        align="start"
      >
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => onChange(date ? format(date, 'dd/MM/yyyy') : '')}
          locale={ptBR}
          className="p-0"
          classNames={{
            months: 'flex flex-col gap-3',
            month: 'flex flex-col gap-3',
            month_caption:
              'relative flex items-center justify-center w-full pt-1 px-1',
            caption_label:
              'text-[13px] font-semibold text-[#E8EAF0] tracking-[0.02em]',
            nav: 'contents',
            button_previous:
              'cursor-pointer absolute left-3 size-8 flex items-center justify-center rounded-lg bg-[#0D0F14] border border-[#1E2130] text-[#9CA3AF] hover:bg-[#191C25] hover:text-[#E8EAF0]',
            button_next:
              'cursor-pointer absolute right-3 size-8 flex items-center justify-center rounded-lg bg-[#0D0F14] border border-[#1E2130] text-[#9CA3AF] hover:bg-[#191C25] hover:text-[#E8EAF0]',
            weekday:
              'text-[#6B7280] rounded-md w-10 font-medium text-[11px] uppercase tracking-[0.06em]',
            day: 'p-0',
            day_button:
              'cursor-pointer size-10 p-0 text-[13px] font-medium text-[#E8EAF0] rounded-lg hover:bg-[#191C25] hover:text-[#E8EAF0] focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_var(--dp-accent-22)]',
            today:
              'bg-[#13161D] text-[#E8EAF0] shadow-[0_0_0_1px_#252A3A] rounded-lg',
            selected:
              'bg-[#252A3A] text-[#E8EAF0] shadow-[0_0_0_1px_#252A3A] rounded-lg',
            outside: 'text-[#6B7280] opacity-40',
            disabled: 'text-[#6B7280] opacity-30',
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export { DatePicker };
