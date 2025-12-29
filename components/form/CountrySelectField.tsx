/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import { Control, Controller, FieldError } from "react-hook-form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import countryList from "react-select-country-list";
import * as Flags from "country-flag-icons/react/3x2";

type Country = {
  label: string;
  value: string;
};

type CountrySelectProps = {
  name: string;
  label: string;
  control: Control<any>;
  error?: FieldError;
  required?: boolean;
};

/* ---------------- COUNTRY SELECT ---------------- */

const CountrySelect = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const [open, setOpen] = useState(false);

  const countries = useMemo<Country[]>(
    () => countryList().getData(),
    []
  );

  const selected = countries.find((c) => c.value === value);
  const SelectedFlag =
    selected && Flags[selected.value as keyof typeof Flags];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full select-trigger justify-between px-3"
        >
          {selected ? (
            <span className="flex items-center gap-2">
              {SelectedFlag && (
                <SelectedFlag className="h-4 w-6 rounded-sm" />
              )}
              <span>{selected.label}</span>
            </span>
          ) : (
            "Select country"
          )}
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="p-0 w-[--radix-popover-trigger-width]"
      >
        <Command>
          <CommandInput placeholder="Search country" className="h-9" />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {countries.map((country) => {
                const Flag =
                  Flags[country.value as keyof typeof Flags];

                return (
                  <CommandItem
                    key={country.value}
                    value={country.label}
                    onSelect={() => {
                      onChange(country.value);
                      setOpen(false);
                    }}
                  >
                    <span className="flex items-center gap-2">
                      {Flag && (
                        <Flag className="h-4 w-6 rounded-sm" />
                      )}
                      <span>{country.label}</span>
                    </span>

                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === country.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

/* ---------------- RHF FIELD ---------------- */

export const CountrySelectField = ({
  name,
  label,
  control,
  error,
  required = false,
}: CountrySelectProps) => {
  return (
    <div className="space-y-2 w-full">
      <Label className="text-sm font-medium">{label}</Label>

      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? `Please select ${label.toLowerCase()}` : false,
        }}
        render={({ field }) => (
          <CountrySelect
            value={field.value ?? ""}
            onChange={field.onChange}
          />
        )}
      />

      {error && (
        <p className="text-sm text-red-500">{error.message}</p>
      )}
    </div>
  );
};
