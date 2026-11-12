# MUSHTARI — Purchasing Search & Stock Check

"Buyer" — for every new order, searches each product across the whole supplier list (more than 190 shops in the Gulf and worldwide) plus the open web, reads price, stock and the exact shade or size on the real product page, and lists every shop cheapest first. The buyer decides and buys; MUSHTARI never pays. It also walks the catalogue against supplier stock, so items nobody can source stop being sold.

## Day-to-day tasks

- Every new order: each product is searched on every shop in the supplier list — the Gulf list and the international list — and with a web search on top, so a shop that is not on the list can still turn up.
- Opens the real product page: exact brand, product and variant; price and sale price as shown on the page; stock and whether add-to-cart is live. One verdict per shop — available, not available (with what was seen), uncertain, check by hand, or skipped with the reason — and every list shop appears, so the buyer never wonders whether one was missed.
- Lists everything cheapest first in one currency with live exchange rates and VAT notes for international shops; the buyer picks a shop and buys there. Instagram-only sellers are listed as "check by hand".
- "I bought it" can cover several orders from several stores in one purchase; the invoice comes by upload, "by email" (DAFTAR then finds it) or later.
- Stock check: walks the catalogue oldest-first, re-checks selling products every 3 days and the rest every 14, and lists what is sold out at every supplier, what is back, and what it could not find — with a link into each store's admin.
- Learns each shop's search address once, uses a shop's own search API when it has one, and reports every day which shops block it.
- Never buys, never pays, never changes a product.

## Connects to

Shopify Admin GraphQL on all three stores (new orders, the catalogue, stock), the shops' own search endpoints where they exist, a headless browser for the rest, a web-search tool for the open web, an AI model that judges whether a product page is the exact item and reads its price and stock, live exchange rates, and the team app's Purchasing page (shop list, "I'll buy here", "I bought it", invoice choice, the shops that block us).

## Excerpt — one product, every shop, a verdict the buyer can trust

```js
// Search every shop in the list, read the real page, never check out.
for (const shop of suppliers.orderedBy('hitRate')) {
  const page = await openSearch(shop, item.brand, item.title, item.variant);
  if (page.blocked) { verdicts.push({ shop, status: 'skipped', why: page.reason }); continue; }
  const read = await judgeProductPage(page, item); // exact variant? price? in stock? add-to-cart live?
  verdicts.push({
    shop, url: read.url, price: toUSD(read.price, read.currency),
    status: !read.exactMatch ? 'uncertain' : read.inStock ? 'available' : 'not_available',
  });
}
return verdicts.sort(cheapestFirst); // the buyer decides - MUSHTARI never pays
```

A product already searched in the last 72 hours is reused, not searched again, and a run that could reach fewer than ten shops gives no verdict at all rather than a wrong one.
