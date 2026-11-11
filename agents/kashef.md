# KASHEF — SEO, AI Search & Content

"Discoverer" — owns how the stores get found: by Google, by Bing, and by the AI answer engines (classic SEO plus answer-engine and generative-engine optimisation). It fixes products, collections and country links on its own, writes the store blog, logs every change as before / after / why, and never touches ads.

## Day-to-day tasks

- Daily search pass over every product added since the last run: title, description, image alt text, the real brand in the brand field, structured data.
- Weekly AI-visibility test: asks the AI answer engines about the store's categories in English and Arabic, then rewrites the matching collections' titles and descriptions so the store gets named next time — the same collection is not touched again for three weeks.
- Technical layer across the three storefronts: country links (hreflang) between sibling stores, collection SEO, a weekly read of Search Console and Bing data for pages that almost rank or are losing clicks.
- Two blog articles a week, planned from each store's best sellers and real customer questions, published to the store blogs.
- A "fix one product now" button in the team app for the products team, in an SEO-only mode that leaves brand and tags alone.
- Every change goes to one shared sheet as before / after / why; failed writes keep the old values and are retried by the next run.

## Connects to

An AI model (a cheaper one for bulk product work, a stronger one for articles and the AI test), Google Search Console API, Bing URL Submission API, Shopify Admin GraphQL on all three storefronts, the team's shared log sheet, the team app.

## Excerpt — changes on its own, never silently

```js
// KASHEF may fix a product by itself - but every fix leaves a paper trail.
const product = await getProduct(storeId, productId);
if (await fixedRecently(product.id, { days: 21 })) {
  return { skipped: true, reason: 'touched this month' };
}

const fix = await proposeSearchFix(product); // title, description, brand, alt text, schema
await applySearchFix(storeId, product.id, fix);

await logToTeamSheet('kashef', {
  type: 'product SEO',
  before: pick(product, ['seoTitle', 'seoDescription', 'vendor']),
  after: fix,
  why: fix.rationale, // one sentence a human can audit later
});
```

Theme-level changes are made on a duplicated theme first so they can be rolled back; the main website's theme is off-limits by the owner's rule.
