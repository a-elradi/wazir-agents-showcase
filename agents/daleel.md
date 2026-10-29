# DALEEL — Search & AI-Engine Visibility

Owns how the stores get found — by Google, Bing and the AI answer engines (classic SEO, answer-engine and generative-engine optimisation). Fixes what it can on its own, logs every change as before / after / why, and stays out of lanes that already have an owner: it skips products KASHEF has already fixed and never touches ads.

## Day-to-day tasks

- Daily search pass over every product added since the last run: title, description, the real brand in the brand field, structured data.
- Reads Search Console and Bing data for quick wins: pages that almost rank, pages losing clicks, 404s that need a redirect.
- Technical layer across the three storefronts: hreflang between sibling stores, sitemaps, schema, same-day URL submission so new pages are indexed quickly.
- Weekly AI-visibility test: asks the major answer engines about the store's categories in English and Arabic, and tracks whether and how the store gets named.
- Publishes buying guides written from real customer questions — at most two a week, every fact checked against the store's own policies.
- Seasonal pages prepared six to eight weeks ahead; content that is losing traffic is refreshed, not left to decay.

## Connects to

An AI model, Google Search Console API, Bing URL Submission API, Shopify Admin GraphQL on all three storefronts, and the team's shared log sheet (one tab, one row per change).

## Excerpt — changes on its own, never silently

```js
// DALEEL may fix a product by itself - but every fix leaves a paper trail.
const product = await getProduct(storeId, productId);
if (await alreadyFixedBy('KASHEF', product.id)) {
  return { skipped: true, reason: 'KASHEF owns this one' };
}

const fix = await proposeSearchFix(product); // title, description, brand, schema
await applySearchFix(storeId, product.id, fix);

await logToTeamSheet('daleel', {
  type: 'product SEO',
  before: pick(product, ['seoTitle', 'seoDescription', 'vendor']),
  after: fix,
  why: fix.rationale, // one sentence a human can audit later
});
```

Theme-level changes are made on a duplicated theme first so they can be rolled back; the main website's theme is off-limits by the owner's rule.
