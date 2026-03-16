export function getPhoneDigits(value: string) {
  return value.replace(/\D/g, "").slice(0, 11)
}

export function formatPhoneNumber(value: string) {
  const digits = getPhoneDigits(value)

  if (!digits) {
    return ""
  }

  if (digits.length <= 2) {
    return `(${digits}`
  }

  const areaCode = digits.slice(0, 2)
  const localNumber = digits.slice(2)

  if (!localNumber) {
    return `(${areaCode}`
  }

  const prefixLength = localNumber.startsWith("9") ? 5 : 4

  if (localNumber.length <= prefixLength) {
    return `(${areaCode}) ${localNumber}`
  }

  return `(${areaCode}) ${localNumber.slice(0, prefixLength)}-${localNumber.slice(prefixLength)}`
}

export function getPhoneCursorPosition(value: string, digitsBeforeCursor: number) {
  if (digitsBeforeCursor <= 0) {
    return 0
  }

  let digitCount = 0

  for (let index = 0; index < value.length; index += 1) {
    if (/\d/.test(value[index])) {
      digitCount += 1
    }

    if (digitCount === digitsBeforeCursor) {
      return index + 1
    }
  }

  return value.length
}
