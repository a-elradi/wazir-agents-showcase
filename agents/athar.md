# ATHAR — Order Tracking & Delivery Watch

"Trace" — follows every order from the supplier to the customer's door. Reads the shipping emails of three mailboxes, links tracking numbers to purchases, watches every shipped order, and opens a case the moment a parcel is late or stuck — with the one sentence the support bots may say about it.

## Day-to-day tasks

- Every 30 minutes reads the new shipping emails in the operations, shop and accounts mailboxes — shops, the forwarding warehouse, the couriers — and an AI model reads each one once: stage, carrier, tracking numbers, the shop's order number, the store orders it belongs to, a one-line summary.
- Links each shipment to the buyer's purchase (by the shop's order reference) and to the store orders, so the care page shows an order's whole journey: shop → forwarder → courier → customer.
- Every 2 hours checks every order shipped in the last 45 days against the store's own tracking steps; a shipment with no new step for two days is looked up on the courier's tracking page, at most twice a day.
- Opens a case when a parcel is 15 days late, has had no step for 4 days, carries a courier problem (held, customs, returned to shipper), or has no tracking number 3 days after shipping; closes the case by itself on delivery.
- Writes one approved English sentence per case into a table the support bots read before every reply — the bots say exactly that, with no date, refund, discount, warehouse or courier name, and record when the customer asked.
- Marks a case urgent the moment the customer asks about it, so the care team sees it first. Team only: never names a supplier or a forwarder to a customer.

## Connects to

The mailbox API on three mailboxes (read only; successful runs keep no copies), Shopify Admin GraphQL on all three stores (fulfilments and tracking steps), courier tracking pages through a headless browser, an AI model (one read per email, one per tracking page), the delivery-cases table shared with the support bots, the team app's Care page and the supervisor's delivery watch.

## Excerpt — a case is a rule, not a feeling

```js
// When does a shipment become a case the team must act on?
function caseFor(s, now) {
  if (s.delivered) return null;
  if (!s.tracking && days(now, s.shippedAt) > 3) return { kind: 'no_tracking' };
  if (/held|customs|returned to shipper|exception/i.test(s.lastStep)) return { kind: 'carrier_problem' };
  if (days(now, s.lastStepAt) > 4) return { kind: 'stuck' };
  if (days(now, s.shippedAt) > 15) return { kind: 'late' };
  return null;
}
// Every open case carries one sentence the support bots may say - written once, in English,
// with no dates, refunds or courier names. The bot repeats it word for word, nothing more.
```

The bots cannot invent a delivery promise: if there is no case row, they have nothing to say beyond the tracking card.
