# TAJER — Sales Pulse & Profitability

"Merchant" — keeps a running read on sales performance and feeds the one shared profitability view the team's revenue-facing agents all read from.

## Day-to-day tasks

- Pulls sales performance across every storefront on a schedule.
- Feeds the same numbers (selling price, cost of goods, payment fees, shipping cost, discount, ad cost, returns) into one shared view, rather than letting each revenue-facing agent compute its own and risk disagreeing.
- Carries a bounded promotion authority: a cart reminder or restock notice is automatic; a 5-10% discount needs to stay inside pre-approved rules; anything bigger, or any price change, needs a human.

## Tools & tech

Shopify Analytics / Admin GraphQL API, a shared profitability data model, a reporting channel for the team.

## Excerpt — a promotion decision stays inside its own lane

```js
// A simplified authority check before any discount is actually applied
function authorityFor(action) {
  if (['recommendation', 'restock_notice', 'cart_reminder'].includes(action.type)) return 'auto';
  if (action.type === 'discount' && action.percent <= 10 && action.withinApprovedCampaign) return 'auto';
  return 'needs_human'; // >10%, VIP exception, mass campaign, any price change
}

const decision = authorityFor(proposedAction);
if (decision === 'needs_human') {
  await raiseForApproval(proposedAction); // never executes itself
} else {
  await execute(proposedAction);
}
```
