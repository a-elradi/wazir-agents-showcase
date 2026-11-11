# WAZIR — Supervisor / Head of Sales

The orchestrator and, since November, the Head of Sales. Routes a request to whichever specialist(s) it needs, merges their findings, carries the sales target, and holds the team's kill switch. Never overrides a restriction placed on another agent.

## Day-to-day tasks

- Chairs a sales meeting every three days: every agent speaks in an expert role (email strategist, paid-media auditor, trend researcher, creative strategist…), a reality checker challenges the numbers, and WAZIR writes the plan with an executive summary for the CEO.
- The plan is approved by the CEO or the supervisor in the team app only — no answer means the previous plan stays, nothing is ever auto-approved — and only then does WAZIR give each agent its new instruction.
- Reads every agent's daily report, and answers natural-language questions from the team by calling the right specialist's own chat tool (an ads question goes straight to RASID).
- Runs the `/pause` / `/resume` / `/status` kill switch from a Telegram command group.
- Looks up a customer's sticky account manager, VIP tier and order history for the support bots before they reply, so the same customer always talks to "the same person."
- Holds a customer's chosen items for 24h (private checkout) when they hesitate, cleans up expired holds, and reports real AI spend from the model provider's own cost API on demand.

## Connects to

WAZIR's orchestration engine (schedules, triggers, retries), Telegram Bot API (ops commands), a shared governance data table (system state / audit log / agent registry / agent instructions), Shopify Admin GraphQL API across multiple storefronts, the model provider's cost API (spend reporting), the team app — one page per role, where plans are approved and every agent's report is read.

## Excerpt — the kill switch read

Every write-capable agent checks the same governance table before doing anything, so one row flip pauses the whole team:

```js
// First step of every write-capable automation
const state = await governance.state();
if (state.systemPaused) {
  return { skipped: true, reason: 'system paused via /pause' };
}
```

`/resume` requires a second, explicit confirmation step before any agent's writes are allowed again — a single `/resume` typo can't silently re-enable mass actions.

The same shape guards the sales plan: an approved plan writes each agent's instruction row; a plan nobody approved writes nothing, and the hard rules (refunds only for damaged or wrong items, honest urgency only, discount limits, no budget changes, no price changes) win over any instruction.
