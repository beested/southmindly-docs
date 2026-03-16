export type SelectOption<TValue extends string = string> = {
  value: TValue;
  label: string;
};

export const accentTextStyle = { color: '#7C3AED' } as const;
export const accentTextSoftStyle = { color: '#6B7280' } as const;
export const accentBorderStyle = { borderColor: '#7C3AED' } as const;
export const accentRingStyle = {
  borderColor: '#7C3AED',
  boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.22)',
} as const;
export const accentSoftBackgroundStyle = {
  backgroundColor: 'rgba(124, 58, 237, 0.22)',
} as const;
