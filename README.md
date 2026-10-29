<p align="center">
  <img src="media/wazir-showcase.gif" alt="WAZIR - while you sleep, your AI team is already working" width="860" />
</p>

<h1 align="center">WAZIR Agent Department</h1>

<p align="center">
  <strong>One supervisor. Eleven specialists. Zero idle hands.</strong><br />
  A 12-agent AI operations team built on <a href="https://n8n.io">n8n</a>, running a three-store fashion retailer day and night.
</p>

<p align="center">
  <a href="https://a-elradi.github.io/wazir-agents-showcase/"><img alt="Live site" src="https://img.shields.io/badge/live_site-a--elradi.github.io-800000?style=for-the-badge" /></a>
  <a href="public/media/wazir-showcase.mp4"><img alt="The film" src="https://img.shields.io/badge/the_film-54_s_·_1080p-111111?style=for-the-badge" /></a>
  <img alt="Agents" src="https://img.shields.io/badge/agents-12-B8963E?style=for-the-badge" />
  <img alt="Workflows" src="https://img.shields.io/badge/live_workflows-81-800000?style=for-the-badge" />
</p>

---

> Deployed for one of the biggest online shopping companies in the Middle East: **GLAM MODA** — Kuwait · Bahrain · USA.

**[Open the showcase site →](https://a-elradi.github.io/wazir-agents-showcase/)** — the film, an interactive org chart, a dossier for every agent (tasks, tools, the real code pattern), and a working model of the kill switch you can press yourself.

## What WAZIR is

WAZIR (وزير, "the minister") is the only agent the owner talks to. It routes a request to whichever specialist it needs, merges their findings, reports back, and holds the team's kill switch. The eleven specialists each own one lane — product scouting, SEO, technical and UX audits, ad management, refunds, support memory, AI-quality review, sales pulse, personal sales follow-up — and never step outside it.

Everything runs on n8n, thinks with Claude, and reads and writes through Shopify (three stores), Telegram, WhatsApp, Instagram, Outlook, Google Ads, Meta Ads and Google Sheets — behind one governance table and one audit trail.

## The team

| # | Agent | Arabic | Role | Core tools |
|---|---|---|---|---|
| — | [WAZIR](agents/wazir.md) | وزير | Supervisor / CEO interface | n8n, Telegram, governance data table, Shopify Admin GraphQL × 3 |
| 01 | [NASEEJ](agents/naseej.md) | نسيج | System health & audit trail | Shopify API, Meta / Microsoft Graph, Telegram |
| 02 | [HAFEZ](agents/hafez.md) | حافظ | Support knowledge base | Claude, n8n Data Table, Telegram |
| 03 | [AMEEN](agents/ameen.md) | أمين | Refunds | Google Sheets queue, idempotent webhook, Shopify |
| 04 | [MIZAN](agents/mizan.md) | ميزان | AI quality & ratings | Claude, ratings table, approval workflow |
| 05 | [RAED](agents/raed.md) | رائد | Product scouting & catalog import | Claude, Shopify `productSet`, headless browser |
| 06 | [KASHEF](agents/kashef.md) | كاشف | SEO & content | Claude, Shopify Admin API, self-calling batch runner |
| 07 | [FAHES](agents/fahes.md) | فاحص | Technical / blackbox audit | HTTP crawler, link graph |
| 08 | [DHAWWAQ](agents/dhawwaq.md) | ذواق | Cross-store consistency & UX | Shopify Admin API × 3, diff engine |
| 09 | [TAJER](agents/tajer.md) | تاجر | Sales pulse / profitability | Shopify Analytics API |
| 10 | [RASID](agents/rasid.md) | راصد | Google & Meta Ads | Google Ads API, Meta Ads API, Claude |
| 11 | [WASEL](agents/wasel.md) | واصل | Personal sales follow-up emails | Claude, Shopify discount codes, loyalty connector |

Each page has the agent's brief, its day-to-day tasks, the tools it's built with, and a short, real (sanitized) code excerpt showing the technique — not just a description.

## Four rules every agent follows

1. **Governance first** — every write-capable agent sits behind a Read / Recommend / Execute tier, and one kill switch (`/pause` · `/resume` · `/status`) cuts every agent's write access at once.
2. **One audit trail** — `timestamp → agent → trigger → data used → decision → action → approval → result`, the same line from every agent, every time.
3. **No AI self-teaching** — anything an agent learns (a support answer, a house lesson, an SEO fix) is stored as *suggested* and only becomes fact after a human approves it.
4. **One data layer, not eight** — sales, cost, margin and ad spend come from one shared source, so every agent optimises for profitable revenue, not its own top line.

The kill switch is three lines long:

```js
// Code node, start of every write-capable workflow
const state = $('Read Governance State').first().json;
if (state.systemPaused === 'true') {
  return [{ json: { skipped: true, reason: 'system paused via /pause' } }];
}
```

## This repo

```
agents/          one Markdown brief per agent (what the site's dossiers are built from)
src/             the showcase site - Vite + React + Framer Motion, no UI framework
public/media/    the film (MP4) and its poster
media/           the GIF at the top of this page
.github/         GitHub Pages deploy on every push to main
```

Run it locally:

```bash
npm install
npm run dev
```

The film was produced in [Remotion](https://www.remotion.dev) with an original, procedurally synthesized soundtrack — every cut lands on the beat grid, the same way every agent lands on the audit trail.

## Related

- The companion private repo, `wazir-agent-department`, holds the operational detail: real workflow and table IDs, the governance docs, the ops dashboard.
- Real agent names, real code patterns, sanitized: no IDs, keys or customer data live here.
