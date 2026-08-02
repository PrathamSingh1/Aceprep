"use client";

import { useEffect, useRef, useState } from "react";
import { IconChevronDown } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface Option {
  label: string;
  value: string;
}

interface DropDownProps {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
}

export function DropDown({ label, value, options, onChange }: DropDownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected =
    options.find((o) => o.value === value)?.label ?? `All ${label}s`;

  return (
    <div className="relative w-52 font-manrope" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-[80%] items-center justify-between rounded-lg border border-neutral-200 dark:border-neutral-900 bg-background px-4 py-2 text-xs cursor-pointer"
      >
        <span>{selected}</span>

        <IconChevronDown
          size={16}
          className={cn(
            "transition-transform duration-150",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-[80%] overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-900 bg-background shadow-xl">
          <button
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-xs hover:bg-neutral-100 dark:hover:bg-neutral-900"
          >
            All {label}s
          </button>

          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={cn(
                "w-full px-4 py-2 text-left text-xs transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-900",
                value === option.value && "bg-neutral-100 dark:bg-neutral-900",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
