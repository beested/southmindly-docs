'use client';

import * as React from 'react';

import { Input } from '@/components/ui/inputs/input';

type AddressInputProps = Omit<
  React.ComponentProps<'input'>,
  'onChange' | 'type' | 'value'
> & {
  value?: string;
  onChange: (value: string) => void;
};

function normalizeAddress(value: string) {
  return value.replace(/\s+/g, ' ').trimStart();
}

function AddressInput({
  value = '',
  onChange,
  autoComplete = 'street-address',
  ...props
}: AddressInputProps) {
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    onChange(normalizeAddress(event.target.value));
  }

  return (
    <Input
      {...props}
      type="text"
      autoComplete={autoComplete}
      value={value}
      onChange={handleChange}
    />
  );
}

export { AddressInput };
