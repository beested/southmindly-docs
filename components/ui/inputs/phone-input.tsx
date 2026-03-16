'use client'

import * as React from "react"

import { Input } from "@/components/ui/inputs/input"
import { formatPhoneNumber, getPhoneCursorPosition, getPhoneDigits } from "@/lib/phone"

type PhoneInputProps = Omit<
  React.ComponentProps<"input">,
  "onChange" | "type" | "inputMode" | "value"
> & {
  value?: string
  onChange: (value: string) => void
  onDigitsChange?: (digits: string) => void
}

function PhoneInput({
  value = "",
  onChange,
  onDigitsChange,
  autoComplete = "tel-national",
  ...props
}: PhoneInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const formattedValue = formatPhoneNumber(value)

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const rawValue = event.target.value
    const cursorPosition = event.target.selectionStart ?? rawValue.length
    const digitsBeforeCursor = getPhoneDigits(rawValue.slice(0, cursorPosition)).length
    const nextValue = formatPhoneNumber(rawValue)
    const nextDigits = getPhoneDigits(nextValue)

    onChange(nextValue)
    onDigitsChange?.(nextDigits)

    requestAnimationFrame(() => {
      const input = inputRef.current

      if (!input) {
        return
      }

      const nextCursorPosition = getPhoneCursorPosition(nextValue, digitsBeforeCursor)
      input.setSelectionRange(nextCursorPosition, nextCursorPosition)
    })
  }

  return (
    <Input
      {...props}
      ref={inputRef}
      type="tel"
      inputMode="numeric"
      autoComplete={autoComplete}
      value={formattedValue}
      onChange={handleChange}
    />
  )
}

export { PhoneInput }
