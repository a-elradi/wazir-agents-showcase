# NASEEJ — System Health & Audit Trail

"Fabric" — holds every automation together. Owns the audit trail every other agent writes to.

## Day-to-day tasks

- Daily sweep for stuck orders across every storefront (unfulfilled past 48h, "in progress" past 72h).
- Checks every channel's auth token is still alive (social, messaging, email) before the support bots need it.
- Confirms the kill switch state is consistent across the fleet.
- Reports a daily system-health summary to the ops channel and logs it.

## Tools & tech

Shopify Admin GraphQL API, Meta Graph API, Microsoft Graph API, a messaging-platform Business API, a shared Telegram ops channel, a Health Log data table.

## Excerpt — paging a big read instead of loading it all

An early version of this agent tried to load a full product catalog into one in-memory step and took the whole automation platform down with it. The fix is now a standing rule for the whole team: never load more than a bounded page at a time.

```js
// Code node — WRONG: loads everything, can exceed node memory
// const all = await fetchEntireCatalog();

// Right: HTTP Request node paginates, Code node only reshapes one page
const PAGE_SIZE = 250;
let cursor = $json.cursor || null;
const page = await fetchCatalogPage({ first: PAGE_SIZE, after: cursor });
return [{ json: { items: page.items, nextCursor: page.pageInfo.endCursor, hasMore: page.pageInfo.hasNextPage } }];
```

Any loop that might run long also respects the automation platform's own execution-time ceiling for a single step, batching work across HTTP calls rather than one long-running script.
