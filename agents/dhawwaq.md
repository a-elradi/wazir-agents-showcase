# DHAWWAQ — Cross-Store Consistency & UX

The watchdog making sure sibling storefronts (different country/currency, same brand) actually agree with each other, that nothing is listed twice, and that the experience reads well.

## Day-to-day tasks

- Weekly: compares every storefront against its siblings — products & availability, product content, collections, static pages, policies, homepage and menu.
- Daily: finds the same product live twice in one store and lists the pairs in the team sheet.
- Runs a separate UX-focused review of the storefront experience itself.
- Report-only — the one write it offers is a "make it a draft" button in the team app that a human presses for a duplicate, with undo.

## Connects to

Shopify Admin GraphQL API across every storefront, an AI model for content comparison, a reporting channel, the team app (duplicates list, make-draft / undo).

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
