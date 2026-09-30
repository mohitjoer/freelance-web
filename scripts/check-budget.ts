import assert from "node:assert";
import { formatBudget, budgetCeiling } from "../src/lib/budget";

// formatBudget: fixed, hourly open-ended, hourly range, and missing data.
assert.equal(formatBudget({ budget: 800, budgetType: 'fixed' }), '$800 fixed');
assert.equal(formatBudget({ budget: 1200 }), '$1,200 fixed', 'default is fixed');
assert.equal(formatBudget({ budget: 25, budgetType: 'hourly' }), '$25+/hr');
assert.equal(formatBudget({ budget: 25, budgetMax: 40, budgetType: 'hourly' }), '$25–$40/hr');
assert.equal(formatBudget({ budget: 40, budgetMax: 25, budgetType: 'hourly' }), '$40+/hr', 'max <= min is ignored');
assert.equal(formatBudget({ budget: null }), 'Budget on request');
assert.equal(formatBudget({}), 'Budget on request');

// budgetCeiling: hourly range filters on the top of the range.
assert.equal(budgetCeiling({ budget: 25, budgetMax: 40, budgetType: 'hourly' }), 40);
assert.equal(budgetCeiling({ budget: 800, budgetType: 'fixed' }), 800);
assert.equal(budgetCeiling({}), 0);

console.log('budget.ts self-check: all assertions passed');
