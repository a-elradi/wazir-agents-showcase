# HAFEZ — Support Knowledge Base

"Keeper" — remembers every answer the team has ever given a customer, so the support bots don't have to ask twice. Never self-teaching: nothing becomes fact until a human approves it.

## Day-to-day tasks

- Watches every human reply sent to a customer (through a handoff relay or the dashboard) and asks an LLM whether it's a reusable policy answer or a one-off.
- Deduplicates against existing knowledge-base entries before proposing a new one.
- Stores new candidates as *Suggested* — only an *Approved* entry is ever read back into a bot's prompt as a fact.
- Sends a nightly digest of questions the bots couldn't answer; the team replies with the answer number and it's queued for review.
- Posts a weekly digest: knowledge-base size, entries waiting for approval, negative-sentiment share.

## Tools & tech

An LLM for reusability classification, a dedicated knowledge-base data table (question/answer/state), Telegram (the capture + digest loop), injected into the support bots' system prompt as a `[TEAM ANSWERS]` block at reply time.

## Excerpt — classify, dedupe, queue (never auto-publish)

```js
// Simplified: HAFEZ never writes an entry straight to "approved"
const verdict = await askLLM(`Is this a reusable store policy answer, or a one-off?
Customer asked: ${customerMessage}
Human replied: ${humanReply}
Answer yes/no and, if yes, a clean generalized Q&A pair.`);

if (!verdict.reusable) return [{ json: { logged: true, reusable: false } }];

const existing = await findSimilarEntry(verdict.question, knowledgeBaseTable);
if (existing) return [{ json: { deduped: true, matchedId: existing.id } }];

await insertRow(knowledgeBaseTable, {
  question: verdict.question,
  answer: verdict.answer,
  state: 'suggested', // a human flips this to 'approved' on the dashboard
});
```
