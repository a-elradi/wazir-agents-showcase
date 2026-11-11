# WASEL — Personal Sales Follow-up

Writes and sends personal, per-customer follow-up emails — signed by that customer's own account manager, not a generic marketing voice — for abandoned checkouts, saved bags, loyalty-balance reminders and refill nudges. It also keeps the repeat-buyer and VIP list for every store.

## Day-to-day tasks

- Finds abandoned checkouts and saved bags across every storefront on a schedule and opens a follow-up journey for each one.
- Separately plans loyalty-balance, loyalty-expiry and refill-reminder emails for every customer (except an explicit opt-out list).
- Writes each email with the model in the voice of that customer's own sticky account manager, generates a one-time personal discount code for it, and sends it when its journey is due.
- Keeps the repeat-buyer and VIP list per store (lifetime orders and spend, read from the store's own customer segments), so the support bots and the WhatsApp manager treat those customers accordingly.
- Reports results every couple of hours and files a daily report: emails sent, journeys waiting, codes issued, orders attributed back to a sent email.

## Connects to

An AI model for personalized email copy, Shopify Admin API (per-customer discount codes, customer segments), a loyalty-platform connector for balance/expiry facts, a journeys data table with due-date gating, a shared results sheet for the team.

## Excerpt — one journey per reason, gated by due time

```js
const due = await queryRows(journeysTable, { status: 'pending', dueAt: { lte: now() } });
for (const journey of due) {
  if (await isUnsubscribed(journey.customerId)) { await markSkipped(journey); continue; }

  const manager = await getStickyAccountManager(journey.customerId); // same name, every channel
  const copy = await writeFollowUpEmail({ journey, signedBy: manager });
  const code = await issuePersonalDiscountCode(journey.customerId, { percent: 10, category: 'beauty_fragrance' });

  await sendEmail(journey.customerEmail, copy, { discountCode: code });
  await markSent(journey);
  await logToTeamSheet({ customer: journey.customerId, manager, code });
}
```
