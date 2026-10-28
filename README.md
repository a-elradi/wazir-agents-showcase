# WAZIR Agent Team — Public Brief

A 12-agent AI team (1 supervisor + 11 specialists) running day-to-day e-commerce operations on [n8n](https://n8n.io): product scouting, SEO, technical/UX audits, ad management, refunds, support-knowledge-base curation, AI-quality review, and personalized sales follow-up — all under one governance layer with a global kill switch and a full audit trail.

> Deployed for one of the biggest online shopping companies in the Middle East: **GLAM MODA**.

This repo is the public brief: what each agent does, the kind of tasks it runs day to day, and the tools/tech it's built on — with short, real (sanitized) code excerpts showing the actual techniques, not just a description. For the full governance model (permission tiers, approval matrix, build sequence), see the companion [wazir-agent-department](https://github.com/a-elradi/wazir-agent-department) repo.

## The team

| Agent | Role | Core tools |
|---|---|---|
| [WAZIR](agents/wazir.md) | Supervisor / CEO interface | n8n Data Tables, Telegram, Shopify Admin API |
| [NASEEJ](agents/naseej.md) | System health & audit trail | Shopify API, Meta/Microsoft Graph, Telegram |
| [HAFEZ](agents/hafez.md) | Support knowledge base | Gemini, n8n Data Table, Telegram |
| [RAED](agents/raed.md) | Product scouting & catalog import | Gemini/Claude, Shopify `productSet`, headless browser |
| [KASHEF](agents/kashef.md) | SEO & content | Claude, Shopify Admin API, self-calling batch runner |
| [TAJER](agents/tajer.md) | Sales pulse / profitability | Shopify Analytics API |
| [RASID](agents/rasid.md) | Ad platform management | Google Ads API, Meta Ads API, Claude |
| [FAHES](agents/fahes.md) | Technical/blackbox audit | HTTP crawler, link graph |
| [DHAWWAQ](agents/dhawwaq.md) | Cross-store consistency & UX | Shopify Admin API (×3 stores), diff engine |
| [AMEEN](agents/ameen.md) | Refunds | Google Sheets, idempotent webhook |
| [MIZAN](agents/mizan.md) | AI quality & ratings | Claude, n8n Data Table, approval workflow |
| [WASEL](agents/wasel.md) | Personal sales follow-up emails | Claude, Shopify discount API, loyalty connector |

## Shared architecture patterns across the team

- **Governance first**: every write-capable agent sits behind a Read / Recommend / Execute permission tier, and a supervisor-level kill switch (`/pause` · `/resume` · `/status`) disables every agent's write access instantly.
- **One audit trail**: every agent action is logged the same way — `timestamp → agent → trigger → data used → decision → action → approval status → result` — so any action is traceable end to end.
- **No AI self-teaching**: anything an agent "learns" (a support answer, a house lesson, an SEO fix) is stored as *suggested* and only becomes *approved* fact after a human reviews it.
- **One data layer, not eight**: sales, cost, margin and ad-spend numbers are read from one shared source rather than each agent computing its own, so decisions optimize for profitable revenue rather than top-line numbers.

See each agent's page for its specific tasks, tools, and a short code excerpt.
