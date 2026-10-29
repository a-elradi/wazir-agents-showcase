# DHAWWAQ — Cross-Store Consistency & UX

A weekly watchdog making sure sibling storefronts (different country/currency, same brand) actually agree with each other, and that the experience reads well.

## Day-to-day tasks

- Compares every storefront against its siblings: products & availability, product content, collections, static pages, policies, homepage and menu.
- Runs a separate UX-focused review of the storefront experience itself.
- Report-only — findings go to the team for manual action.

## Connects to

Shopify Admin GraphQL API across every storefront, an AI model for content comparison, a reporting channel.

## Excerpt — diffing sibling stores, not just checking one

```js
const stores = ['kw', 'bh', 'us'];
const snapshots = await Promise.all(stores.map(fetchStorefrontSnapshot));
const baseline = snapshots[0];

const mismatches = [];
for (const field of ['products', 'collections', 'policies', 'homepage']) {
  for (let i = 1; i < snapshots.length; i++) {
    const diff = diffField(baseline[field], snapshots[i][field]);
    if (diff.length) mismatches.push({ store: stores[i], field, diff });
  }
}
return { mismatches }; // report only — nothing here writes anything
```
