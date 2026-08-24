"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
}

export default function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
  autoComplete,
  required,
  minLength,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-12 px-4 pr-12 rounded-xl border border-hairline bg-background text-base text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition"
        placeholder={placeholder}
        required={required}
        minLength={minLength}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-ink transition-colors cursor-pointer"
      >
        {visible ? (
          <EyeOff className="w-5 h-5" aria-hidden="true" />
        ) : (
          <Eye className="w-5 h-5" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
