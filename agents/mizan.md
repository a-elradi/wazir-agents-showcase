# MIZAN — AI Quality & Ratings

The daily reviewer of the support bots' own conversations, and the engine behind the "what should we teach the bots" proposal cycle.

## Day-to-day tasks

- Reviews every day's support conversations for quality and tone.
- Ties customer-given ratings back to the specific conversation that earned them.
- Proposes new "house lessons" drawn from real conversations every day — a human approves, edits, rejects or retires each one before a bot ever sees it.

## Connects to

An AI model for conversation review, a ratings data table, a house-lessons data table with an approval state machine, a review page in the team app.

## Excerpt — lessons are proposed, never self-installed

```js
// Daily proposal run — writes nothing a bot can read yet
const candidates = await findRecurringIssues(yesterdaysConversations);
for (const c of candidates) {
  await insertRow(houseLessonsTable, {
    rule: c.proposedRule,
    evidence: c.exampleConversationIds,
    status: 'proposed', // only 'approved' rows get read into a bot's prompt
    priority: c.estimatedImpact,
  });
}

// What a support bot actually reads at reply time:
const lessons = await queryRows(houseLessonsTable, { status: 'approved' });
const promptBlock = lessons.length
  ? '[HOUSE LESSONS]\n' + lessons.map((l, i) => `${i + 1}. ${l.rule}`).join('\n')
  : '';
```
