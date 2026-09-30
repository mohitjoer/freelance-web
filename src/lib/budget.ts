export interface BudgetLike {
  budget?: number | null;
  budgetType?: 'fixed' | 'hourly' | null;
  budgetMax?: number | null;
}

// Module-scope so it is created once, not per render.
const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

/** Renders a job budget as "$800 fixed" or "$25–$40/hr". */
export function formatBudget(job: BudgetLike): string {
  const { budget, budgetType, budgetMax } = job;
  if (typeof budget !== 'number') return 'Budget on request';

  if (budgetType === 'hourly') {
    const max = typeof budgetMax === 'number' && budgetMax > budget ? usd.format(budgetMax) : null;
    return max ? `${usd.format(budget)}–${max}/hr` : `${usd.format(budget)}+/hr`;
  }
  return `${usd.format(budget)} fixed`;
}

/** The bare number, for sort keys and filter comparisons. */
export function budgetCeiling(job: BudgetLike): number {
  const { budget, budgetMax } = job;
  if (typeof budget !== 'number') return 0;
  if (typeof budgetMax === 'number' && budgetMax > budget) return budgetMax;
  return budget;
}
