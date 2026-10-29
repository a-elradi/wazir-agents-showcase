# WAZIR — Supervisor / CEO Interface

The orchestrator. Routes a request to whichever specialist(s) it needs, merges their findings, and holds the team's kill switch. Never overrides a restriction placed on another agent.

## Day-to-day tasks

- Answers natural-language questions from the team by calling the right specialist's own chat tool (e.g. routes an ads question straight to RASID).
- Runs the `/pause` / `/resume` / `/status` kill switch from a Telegram command group.
- Looks up a customer's sticky account manager, VIP tier and order history for the support bots before they reply, so the same customer always talks to "the same person."
- Holds a customer's chosen items for 24h (private checkout) when they hesitate, and cleans up expired holds.
- Reports real AI spend from the model provider's own cost API, on demand.

## Connects to

WAZIR's orchestration engine (schedules, triggers, retries), Telegram Bot API (ops commands), a shared governance data table (system state / audit log / agent registry), Shopify Admin GraphQL API across multiple storefronts, the model provider's cost API (spend reporting), a management dashboard that talks to the engine through typed tool calls rather than hardcoded webhooks.

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
