# KASHEF — SEO & Content

"Discoverer" — finds what search is missing across the whole catalog, drafts the fix, and (once approved) can apply it at scale.

## Day-to-day tasks

- Scans the entire catalog for missing or weak SEO titles, meta descriptions and image alt text.
- Drafts a replacement for each flagged product with the model, showing a clear before/after.
- Applies an approved fix straight to the live product on request.
- Can run a background "fix everything" pass that works through the whole flagged list in small batches, calling itself until the list is empty — with start/stop/resume control and live progress.
- Logs every fix, automatic or manual, to a shared sheet the team can audit.

## Connects to

An AI model for SEO copywriting, Shopify Admin GraphQL API (product metafields), a progress-tracking data table for the long-running batch runner, a dashboard with Start/Stop/Resume controls.

## Excerpt — a stoppable background batch runner

```js
// "Fix All": works 15 products per store per round, checks a stop flag
// between rounds, and calls itself until the queue is empty
const ROUND_SIZE = 15;
const progress = await readProgressRow(runId);
if (progress.stopRequested) return { stopped: true };

const batch = await getNextUnfixed(storeId, ROUND_SIZE);
for (const product of batch) await fixOneProduct(product);

await updateProgressRow(runId, { fixedSoFar: progress.fixedSoFar + batch.length });

if (batch.length === ROUND_SIZE) {
  await callSelf({ runId, storeId }); // more to do — next round
} else {
  await markRunComplete(runId);
}
```
