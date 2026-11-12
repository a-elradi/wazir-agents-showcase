<p align="center">
  <img src="media/wazir-showcase.gif" alt="WAZIR - while you sleep, your AI team is already working" width="860" />
</p>

<h1 align="center">WAZIR Agent Department</h1>

<p align="center">
  <strong>One supervisor. Sixteen specialists. Zero idle hands.</strong><br />
  A 17-agent AI operations team running a three-store fashion retailer day and night.
</p>

<p align="center">
  <a href="https://a-elradi.github.io/wazir-agents-showcase/"><img alt="Live site" src="https://img.shields.io/badge/live_site-a--elradi.github.io-800000?style=for-the-badge" /></a>
  <a href="public/media/wazir-showcase.mp4"><img alt="The film" src="https://img.shields.io/badge/the_film-64_s_·_1080p-111111?style=for-the-badge" /></a>
  <img alt="Agents" src="https://img.shields.io/badge/agents-17-B8963E?style=for-the-badge" />
  <img alt="Automations" src="https://img.shields.io/badge/live_automations-82-800000?style=for-the-badge" />
</p>

---

> Deployed for one of the biggest online shopping companies in the Middle East: **GLAM MODA** — Kuwait · Bahrain · USA.

**[Open the showcase site →](https://a-elradi.github.io/wazir-agents-showcase/)** — the film, an interactive org chart, a dossier for every agent (tasks, integrations, the pattern that keeps it safe), and a working model of the kill switch you can press yourself.

## What WAZIR is

WAZIR (وزير, "the minister") is the only agent the owner talks to. It routes a request to whichever specialist it needs, merges their findings, reports back, and holds the team's kill switch. The sixteen specialists each own one lane — customer care on WhatsApp, Instagram and email, product scouting, purchasing, order tracking, invoices, SEO and AI-engine visibility, technical and UX audits, ad management, refunds, support memory, AI-quality review, personal sales follow-up, WhatsApp order updates and campaigns, brand design and social content — and never step outside it.

The front line is three customer-care bots — WhatsApp, Instagram and email — that answer every customer themselves, in the customer's language, as the same named account manager every time. Behind them the department does the rest: HAFEZ remembers, MIZAN reviews, AMEEN refunds, ATHAR watches every parcel, and WAZIR hands each bot the customer's manager, VIP tier and order history before it replies.

WAZIR is also the Head of Sales. Every agent files a daily report; every three days WAZIR chairs a sales meeting where each agent speaks in an expert role, a reality checker challenges the numbers, and WAZIR writes the plan. The CEO or the supervisor approves it in the team app — no approval, no new instructions — and only then does each agent get told what to do differently.

Everything runs on WAZIR's own orchestration engine, thinks with a frontier AI model, and reads and writes through the store (three storefronts), WhatsApp, Instagram, Telegram, email, Google Ads, Meta Ads, Google Sheets and Search Console — behind one governance table and one audit trail.

## The team

| # | Agent | Arabic | Role | Connects to |
|---|---|---|---|---|
| — | [WAZIR](agents/wazir.md) | وزير | Supervisor / Head of Sales | Telegram, governance table, store API × 3, team app |
| 01 | [NASEEJ](agents/naseej.md) | نسيج | System health & audit trail | Store API, Meta / Microsoft Graph, Telegram |
| 02 | [CS BOTS](agents/cs-bots.md) | خدمة | Customer-care bots: WhatsApp · Instagram · email | AI model, WhatsApp / Instagram / mailbox APIs, store API × 3, Telegram |
| 03 | [HAFEZ](agents/hafez.md) | حافظ | Support knowledge base | AI model, knowledge-base table, Telegram |
| 04 | [AMEEN](agents/ameen.md) | أمين | Refunds (two signatures) | Sheets queue, idempotent webhook, store API |
| 05 | [MIZAN](agents/mizan.md) | ميزان | AI quality & ratings | AI model, ratings table, approval workflow |
| 06 | [ATHAR](agents/athar.md) | أثر | Order tracking & delivery watch | Three mailboxes (read only), store API × 3, courier tracking pages, delivery-cases table |
| 07 | [RAED](agents/raed.md) | رائد | Product scouting & catalog import | AI model, store catalog API, headless browser |
| 08 | [KASHEF](agents/kashef.md) | كاشف | SEO, AI search & content | AI model, Search Console, Bing API, store API × 3 |
| 09 | [FAHES](agents/fahes.md) | فاحص | Technical / blackbox audit | HTTP crawler, link graph |
| 10 | [DHAWWAQ](agents/dhawwaq.md) | ذواق | Cross-store consistency, duplicates & UX | Store API × 3, diff engine |
| 11 | [RASID](agents/rasid.md) | راصد | Google & Meta Ads | Google Ads API, Meta Ads API, AI model |
| 12 | [WASEL](agents/wasel.md) | واصل | Personal sales follow-up emails, VIPs | AI model, store discount codes, loyalty connector |
| 13 | [BASHIR](agents/bashir.md) | بشير | WhatsApp manager: order updates & campaigns | WhatsApp Business API × 3, store API, delivery reports |
| 14 | [MUSHTARI](agents/mushtari.md) | مشتري | Purchasing search & stock check | Supplier-site search, headless browser, web search, AI model, store API × 3 |
| 15 | [DAFTAR](agents/daftar.md) | دفتر | Invoices & accounts export | AI model (structured output), three mailboxes, file store, Google Sheets |
| 16 | [RASSAM](agents/rassam.md) | رسام | Brand design & social content | AI image & video models, design library, Instagram publishing |

Each page has the agent's brief, its day-to-day tasks, what it connects to, and a short, sanitized excerpt showing the pattern that keeps it safe — not just a description.

## Four rules every agent follows

1. **Governance first** — every write-capable agent sits behind a Read / Recommend / Execute tier, and one kill switch (`/pause` · `/resume` · `/status`) cuts every agent's write access at once.
2. **One audit trail** — `timestamp → agent → trigger → data used → decision → action → approval → result`, the same line from every agent, every time.
3. **No AI self-teaching** — anything an agent learns (a support answer, a house lesson, an SEO fix) is stored as *suggested* and only becomes fact after a human approves it.
4. **One data layer, not eight** — sales, cost, margin and ad spend come from one shared source, so every agent optimises for profitable revenue, not its own top line.

The kill switch is three lines long:

```js
// First step of every write-capable automation
const state = await governance.state();
if (state.systemPaused) {
  return { skipped: true, reason: 'system paused via /pause' };
}
```

## Want WAZIR running your store?

The same team can be deployed for another retailer — your catalog, your channels, your rules, your kill switch. **[Get in touch →](https://github.com/a-elradi)**

## This repo

```
agents/          one brief per agent (what the site's dossiers are built from)
src/             the showcase site
public/media/    the film (MP4) and its poster
media/           the GIF at the top of this page
.github/         deploys the site on every push to main
```

Run it locally:

```bash
npm install
npm run dev
```

The film was produced entirely in code with an original, procedurally synthesized soundtrack — every cut lands on the beat grid, the same way every agent lands on the audit trail.

## A note on what's here

Real agent names, real patterns, sanitized: no IDs, keys or customer data live in this repo, and the engine underneath stays ours. The operational detail lives in a private companion repo.
