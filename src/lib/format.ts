// Module-scope so the formatter is built once, not per render. Fixed locale +
// UTC timezone so SSR and client render identically.
const day = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

const monthYear = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

/** "Mar 4, 2026" — for table rows and metadata lines. */
export function formatDay(value: string | Date): string {
  return day.format(new Date(value));
}

/** "March 2026" — for tenure lines, where the day is noise. */
export function formatMonthYear(value: string | Date): string {
  return monthYear.format(new Date(value));
}

/**
 * Hostname of a user-entered URL, for display. Falls back to the raw string,
 * because company sites come from a free-text form and are frequently not a
 * parseable URL at all. Never throws.
 */
export function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "") || url;
  } catch {
    return url;
  }
}
