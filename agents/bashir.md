# BASHIR — WhatsApp Manager

Runs the whole WhatsApp operation for the stores, on three sending numbers: order updates the moment the store changes an order, a thank-you three days after delivery, abandoned-checkout and abandoned-cart cards, and one marketing campaign per customer per month. The team only picks templates and switches cards on.

## Day-to-day tasks

- Order confirmed, shipped (the moment a tracking number appears) and delivered cards, sent as soon as the order changes, at any hour; a thank-you 72 hours after delivery.
- Abandoned-checkout and abandoned-cart cards one day later, with the product's photo and link, inside daytime hours only.
- One campaign per customer per month, filled by priority: high spenders, repeat buyers, customers with no order for 30–60 days, fragrance and beauty lovers, then everyone else — sent in the evening window only. Leftovers are dropped at month end, never carried over.
- Reward-balance and refill nudges on WhatsApp, kept in sync with WASEL's emails: same code, same amount, same product, same evening.
- One 10 % code per store per month, created at month start and deleted before the next month begins.
- Before every new month: cleans the lists (blocked, never delivered, not on WhatsApp, opted out), keeps the numbers the platform merely held back, and retries those.
- Reads every delivery report per number (delivered / read / failed) and pauses itself on mass refusals or a billing problem.

## Connects to

WhatsApp Business API on three marketing numbers (separate from the support bot's number), Shopify Admin GraphQL (orders, tracking, customer segments), the platform's delivery-report webhooks, campaign and month-contact data tables, the team app (template picker, card switches, counts and results).

## Excerpt — one campaign per person per month, no exceptions

```js
// Monthly groups run by priority; a person reached once this month is skipped everywhere else.
const reached = await monthContacts(store, month); // Set of customer ids
for (const group of ['high_spenders', 'repeat_buyers', 'lapsed_30_60', 'beauty_lovers', 'everyone_else']) {
  for (const p of await audience(store, group)) {
    if (reached.has(p.id) || !p.whatsappOk || stopList.has(p.phone)) continue;
    await queue({ store, campaign: group, to: p, code: monthlyCode(store, month), window: '18:00-22:00' });
    reached.add(p.id);
  }
}
// Order updates ignore the monthly cap - and go first on every number.
```

Every send and every delivery report is written to the audit trail, so the team can see per number how many messages were delivered, read, or refused.
