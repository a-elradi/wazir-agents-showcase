# RASID — Ad Platform Management

"Observer" — watches ad spend earn its keep, with trust earned in stages rather than given up front, since it's the agent with the most direct financial execution risk.

## Day-to-day tasks

- Ongoing performance monitoring across ad platforms.
- An on-demand, LLM-written advisor report, cross-checked line by line against real storefront order data rather than trusting the ad platform's own attribution.
- A live chat interface the team can ask ad questions of, for any date range, with its own query path for custom ranges.
- Historical pulls to seed a full-account performance review.

## Tools & tech

Ad-platform reporting APIs (search + social), Shopify Admin GraphQL API for cross-checking real conversions, an LLM for report writing and the chat interface.

## Excerpt — staged autonomy instead of day-one trust

```js
function stageFor(agent) {
  if (agent.daysLive < 30) return 'read_only';           // recommends only
  if (agent.stage1ApprovalRate > 0.9) return 'bounded';   // ±10%, hard daily cap
  return 'controlled_autonomy';                           // earned, not default
}

const stage = stageFor(rasidState);
if (stage === 'read_only') {
  await proposeChange(change); // a human approves every single one
} else if (stage === 'bounded') {
  if (Math.abs(change.percentDelta) > 10 || wouldExceedDailyCap(change)) {
    await proposeChange(change);
  } else {
    await applyChange(change);
  }
} else {
  await applyChange(change); // only after Stage 1-2 track record proved reliable
}
```
