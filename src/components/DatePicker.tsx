"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function DatePicker() {
  const { navigate } = useStore();
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const onSelect = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    // Format as YYYY-MM-DD
    const iso = date.toISOString().slice(0, 10);
    setOpen(false);
    navigate({ type: "date-archive", date: iso });
  };

  // Disable future dates (can't browse articles that don't exist yet)
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="hidden md:inline-flex items-center gap-2 px-3 h-9 rounded-md border border-border hover:bg-muted transition-colors text-sm text-ink-secondary"
          aria-label="Browse by date"
        >
          <CalendarIcon className="h-4 w-4" />
          <span className="text-xs">Date</span>
          {selectedDate && (
            <span className="text-xs font-medium text-foreground hidden lg:inline">
              {selectedDate.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
              })}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0"
        align="end"
        sideOffset={8}
      >
        <div className="p-3 border-b border-border">
          <p className="font-ui text-xs font-semibold uppercase tracking-wider text-ink-tertiary">
            Browse articles by date
          </p>
        </div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onSelect}
          disabled={[{ after: today }]}
          initialFocus
        />
        <div className="p-2 border-t border-border flex items-center justify-between">
          <button
            onClick={() => {
              setSelectedDate(undefined);
              setOpen(false);
            }}
            className="px-2 py-1 rounded text-xs text-ink-tertiary hover:bg-muted transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => onSelect(today)}
            className="px-3 py-1 rounded text-xs font-semibold bg-brand hover:bg-brand-dark text-white transition-colors inline-flex items-center gap-1"
          >
            Today
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
