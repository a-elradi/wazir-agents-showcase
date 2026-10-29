# RAED — Product Scouting & Catalog Import

"Pioneer" — the sole owner of competitor-pricing intelligence and new-product discovery, plus the day-to-day hygiene of every product it (or the team) adds.

## Day-to-day tasks

- Scans source retailers' best-seller / trending / new-in pages every morning, extracts structured product data with the model, converts pricing, checks it against the live catalog, and posts one daily shortlist.
- Separately reads dozens of press outlets (magazines, blogs, newsletters) for products being called "new," "best-selling" or "viral," counts mentions, and flags the ones not yet in the catalog.
- Turns a chosen pick into a full draft product — every photo at full size, every size/colour variant, the source's own description, vendor and category — in one action.
- Can bulk-import every product on a whole category page in one go, batching itself in small groups overnight so it never runs out of memory.
- Runs a daily pass over every draft it created: fixes safe issues automatically, lists anything it can't fix for a human, never deletes anything.
- For sources that block server-side scraping, reads the page through a real browser on a dedicated machine instead of giving up.

## Connects to

An AI model for product extraction/translation, a free web-reader for plain page fetches (no paid scraping credits), Shopify's `productSet` GraphQL mutation for multi-variant drafts, a headless-browser relay for blocked sources, a dedicated product-team-facing view with its own login.

## Excerpt — self-batching to survive a big import

```js
// "Bulk Import From Page" calls itself in small groups instead of
// looping over hundreds of products in one execution
const BATCH_SIZE = 3;
const thisBatch = input.productUrls.slice(0, BATCH_SIZE);
const remaining = input.productUrls.slice(BATCH_SIZE);

for (const url of thisBatch) await importOneProduct(url);

if (remaining.length) {
  await callSelf({ productUrls: remaining }); // same automation, next batch
}
return { importedThisRun: thisBatch.length, remaining: remaining.length };
```
