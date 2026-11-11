# AMEEN — Refunds

The only escalation path the support bots are allowed to use at all — and only for one specific case. Every refund needs two human signatures.

## Day-to-day tasks

- Receives a refund request from a support bot, but only when the bot has already determined the item arrived damaged or wrong (never a missing item, never just a customer insisting — that's a hard rule enforced upstream in the bots themselves).
- Logs the request to a queue a human reviews, idempotently — the same request can't be filed twice.
- Two-step decision: customer care decides first, then the supervisor gives the final approve or reject. AMEEN refuses to act on a request that only carries one signature.
- Carries out the final decision: approve, reject, or a manual adjustment.

## Connects to

A shared sheet/queue for refund requests, Shopify Admin API for issuing the actual refund, an urgent-alert channel with a decision-window expectation, the team app (customer-care decision, supervisor's final decision).

## Excerpt — idempotent by construction

```js
// The webhook the support bots call. Calling it twice for the same
// order/reason is a no-op, not a duplicate refund request.
const idempotencyKey = `${orderId}:${reasonCode}`;
const existing = await findByKey(refundQueueTable, idempotencyKey);
if (existing) return { ok: true, alreadyQueued: true, id: existing.id };

const row = await insertRow(refundQueueTable, {
  idempotencyKey,
  orderId,
  reasonCode, // only ever 'damaged' or 'wrong_item' — enforced before this point
  status: 'pending_review', // -> 'care_decided' -> 'final' (two signatures, in that order)
  flaggedAt: new Date().toISOString(),
});
await alertOpsChannel(`Refund request queued — decide within the SLA window`);
return { ok: true, id: row.id };
```
