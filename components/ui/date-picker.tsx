"use client"

import * as React from "react"
import { format, isValid, parse } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DatePickerProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

const parseInputDate = (value: string) => {
  if (!value) return undefined
  const parsed = parse(value, "dd/MM/yyyy", new Date())
  return isValid(parsed) ? parsed : undefined
}

function DatePicker({
  value,
  onChange,
  placeholder = "Selecione a data",
  className,
}: DatePickerProps) {
  const selectedDate = React.useMemo(() => parseInputDate(value), [value])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal bg-[#191C25] border-[#1E2130] text-[#E8EAF0] h-[48px] text-sm rounded-lg px-3.5 hover:bg-[#191C25] hover:text-[#E8EAF0]",
            !selectedDate && "text-[#6B7280]",
            className
          )}
        >
          <CalendarIcon className="mr-2.5 size-[18px]" />
          {selectedDate ? format(selectedDate, "dd/MM/yyyy") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[340px] p-2 bg-[#191C25] border-[#1E2130] text-[#E8EAF0]"
        align="start"
      >
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => onChange(date ? format(date, "dd/MM/yyyy") : "")}
          locale={ptBR}
          className="p-2"
          classNames={{
            month: "flex flex-col gap-3",
            month_caption:
              "flex items-center justify-between w-full pt-1 px-1 gap-3",
            caption_label: "text-base font-semibold text-[#E8EAF0]",
            nav: "flex items-center gap-1.5 ml-auto",
            button_previous:
              "size-8 bg-[#0D0F14] border border-[#1E2130] text-[#9CA3AF] hover:bg-[#13161D] hover:text-[#E8EAF0]",
            button_next:
              "size-8 bg-[#0D0F14] border border-[#1E2130] text-[#9CA3AF] hover:bg-[#13161D] hover:text-[#E8EAF0]",
            weekday:
              "text-[#6B7280] rounded-md w-10 font-medium text-[11px] uppercase tracking-[0.06em]",
            day: "p-0",
            day_button:
              "size-10 p-0 text-sm font-medium text-[#E8EAF0] hover:bg-[#13161D] hover:text-[#E8EAF0] rounded-md",
            today: "bg-[#13161D] text-[#E8EAF0]",
            selected:
              "bg-[#4F7EFF] text-white hover:bg-[#4F7EFF] hover:text-white focus:bg-[#4F7EFF] focus:text-white",
            outside: "text-[#6B7280] opacity-40",
            disabled: "text-[#6B7280] opacity-30",
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

export { DatePicker }
