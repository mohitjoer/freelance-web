import * as React from "react"
import { forwardRef } from "react"
import { cn } from "@/lib/utils"

const field =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs " +
  "placeholder:text-muted-foreground/70 transition-[color,box-shadow] " +
  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40 " +
  "focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 " +
  "aria-invalid:border-destructive aria-invalid:ring-destructive/25"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return <input type={type} data-slot="input" className={cn(field, className)} {...props} />
}

const Textarea = forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  function Textarea({ className, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        data-slot="textarea"
        className={cn(field, "min-h-24 resize-y leading-relaxed", className)}
        {...props}
      />
    )
  }
)

function Select({ className, ...props }: React.ComponentProps<"select">) {
  return <select data-slot="select" className={cn(field, "pr-8", className)} {...props} />
}

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn("text-sm font-medium text-foreground", className)}
      {...props}
    />
  )
}

/** Label above, control, optional hint/error below. Standard `gap-2` block. */
function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  )
}

export { Input, Textarea, Select, Label, Field }
