# FAHES — Technical / Blackbox Audit

A daily outside-in health check of the storefront itself — not the business data, the actual pages a visitor loads.

## Day-to-day tasks

- Confirms core pages are reachable.
- Crawls the homepage's internal links and flags anything broken.
- Confirms analytics/tracking scripts are actually present and firing (pixel, analytics tag manager, etc).
- Report-only — it never touches anything itself; findings go to the team.

## Connects to

A plain HTTP crawler, a link-graph check, a free page-reader for anything that needs rendered content, a reporting channel.

## Excerpt — a bounded crawl, not an open-ended one

```js
// Breadth-first, capped, so a misbehaving page can't make this run forever
const MAX_LINKS = 200;
const seen = new Set([homepageUrl]);
const queue = [homepageUrl];
const broken = [];

while (queue.length && seen.size < MAX_LINKS) {
  const url = queue.shift();
  const res = await fetchWithTimeout(url, 8000);
  if (!res.ok) { broken.push({ url, status: res.status }); continue; }
  for (const link of extractInternalLinks(res.body, homepageUrl)) {
    if (!seen.has(link)) { seen.add(link); queue.push(link); }
  }
}
return { checked: seen.size, broken };
```
