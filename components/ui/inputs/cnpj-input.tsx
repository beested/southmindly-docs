'use client';

import * as React from 'react';

import { Input } from '@/components/ui/inputs/input';
import { formatCnpj, getCnpjCursorPosition, getCnpjDigits } from '@/lib/cnpj';

type CnpjInputProps = Omit<
  React.ComponentProps<'input'>,
  'onChange' | 'type' | 'inputMode' | 'value'
> & {
  value?: string;
  onChange: (value: string) => void;
  onDigitsChange?: (digits: string) => void;
};

function CnpjInput({
  value = '',
  onChange,
  onDigitsChange,
  autoComplete = 'off',
  ...props
}: CnpjInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const formattedValue = formatCnpj(value);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const rawValue = event.target.value;
    const cursorPosition = event.target.selectionStart ?? rawValue.length;
    const digitsBeforeCursor = getCnpjDigits(
      rawValue.slice(0, cursorPosition),
    ).length;
    const nextValue = formatCnpj(rawValue);
    const nextDigits = getCnpjDigits(nextValue);

    onChange(nextValue);
    onDigitsChange?.(nextDigits);

    requestAnimationFrame(() => {
      const input = inputRef.current;

      if (!input) {
        return;
      }

      const nextCursorPosition = getCnpjCursorPosition(
        nextValue,
        digitsBeforeCursor,
      );
      input.setSelectionRange(nextCursorPosition, nextCursorPosition);
    });
  }

  return (
    <Input
      {...props}
      ref={inputRef}
      type="text"
      inputMode="numeric"
      autoComplete={autoComplete}
      value={formattedValue}
      onChange={handleChange}
    />
  );
}

export { CnpjInput };
