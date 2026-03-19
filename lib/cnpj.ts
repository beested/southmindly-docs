export function getCnpjDigits(value: string) {
  return value.replace(/\D/g, '').slice(0, 14);
}

export function formatCnpj(value: string) {
  const digits = getCnpjDigits(value);

  if (!digits) return '';
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 8) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  }
  if (digits.length <= 12) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(
      5,
      8,
    )}/${digits.slice(8)}`;
  }

  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(
    5,
    8,
  )}/${digits.slice(8, 12)}-${digits.slice(12, 14)}`;
}

export function getCnpjCursorPosition(
  formattedValue: string,
  digitsBeforeCursor: number,
) {
  if (digitsBeforeCursor <= 0) return 0;

  let digitsCount = 0;
  for (let index = 0; index < formattedValue.length; index += 1) {
    if (/\d/.test(formattedValue[index] ?? '')) {
      digitsCount += 1;
    }

    if (digitsCount >= digitsBeforeCursor) {
      return index + 1;
    }
  }

  return formattedValue.length;
}
