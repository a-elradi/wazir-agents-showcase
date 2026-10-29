# RASSAM — Brand Design & Social Content

The in-house designer. It learned the brand's own playbook from years of real campaign files — colours, type, logo placement, the rows-of-three feed system, one colour story per row — and designs posts, stories, carousels and short reels in that pattern. The real product is always kept pixel-perfect: AI builds the scene, it never redraws the product. Nothing is published until the owner approves it.

## Day-to-day tasks

- Designs feed posts, stories, carousels and short reels for each storefront's Instagram account, in the house style.
- Builds from the brand's own hi-res product photos and campaign imagery pulled from the storefront; AI makes the stage, the product pixels stay untouched.
- Follows the written brand playbook, and studies the reference accounts the brand admires so the art direction stays campaign-level, not generic.
- Reads reach and saves on every published post to learn what the audience responds to.
- Every draft is queued for the owner's approval; only approved designs reach the publishing step.
- Reels are cut to an in-house royalty-free music library, so there are never licensing surprises.

## Connects to

AI image and video models, a background-removal step, the brand design library (fonts, logos, playbook, past campaigns), the Instagram publishing and insights API, a video renderer, and the royalty-free music library.

## Excerpt — AI makes the scene, never the product

```js
// The product is the one thing AI may not touch.
const cutout = await removeBackground(product.heroPhoto);            // real pixels, kept as-is
const scene = await generateScene(brief.concept, { aspect: '4:5' }); // AI builds the stage
const composed = placeProduct(scene, cutout, {
  shadow: 'contact',
  relight: 'brightness-only', // light may change, the label may not
});

const post = brandFrame(composed, { logo: brand.logo, caption: brief.caption, font: PLAYBOOK.font });

await insertRow(designQueue, { account: brief.account, post, status: 'awaiting_approval' });
// Only 'approved' rows ever reach the publishing step.
```
