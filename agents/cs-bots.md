# CS BOTS — Customer-Care Bots (WhatsApp · Instagram · Email)

"Service" — the front line. Three AI bots answer every customer on WhatsApp, Instagram and email themselves, in the customer's own language, as the same named account manager every time. They look up orders across the three stores, send product and tracking cards, ask the team when they do not know, and escalate exactly one thing: a damaged or wrong item.

## Day-to-day tasks

- Answers every message on WhatsApp (the support number), Instagram (four accounts) and email, around the clock, in the language of the customer's last message — Arabic or English, detected per message, so no style rule can override it.
- Greets as the customer's own account manager, the same name on every channel every time; WAZIR hands over the manager, the VIP tier and the order history before the reply is written.
- Looks the order up across all three stores and answers with product and tracking cards rather than prose.
- When it does not know, it tells the customer it is checking, posts the question to the team's Telegram group, and passes the team's reply on itself, in the manager's own voice — the bot never leaves the conversation. HAFEZ keeps the answer as a suggestion for next time.
- Reads, before every reply: ATHAR's exact sentence for a late parcel, WAZIR's standing instruction, the house lessons MIZAN proposed and a human approved, and the answers HAFEZ keeps.
- Escalates one thing only — a damaged or wrong item — to AMEEN; everything else it resolves itself. Offers rating buttons when the conversation ends; MIZAN reviews every chat the next morning.
- A 21:00 digest lists the questions nobody could answer that day and reminds the team of its open questions.

## Connects to

An AI model, the WhatsApp Business API (the support number), the Instagram messaging API (four accounts), the mailbox API, Shopify Admin GraphQL on all three stores (orders, tracking, products, discount codes), Telegram (ask-the-team, alerts, the digest), and the shared tables the other care agents write to: team answers, house lessons, delivery cases, ratings.

## Excerpt — five layers, one reply, and the hard rules win

```js
// What a bot reads before every reply - top wins, and every layer was approved by a human.
const prompt = joinBlocks(
  deliveryCase && caseBlock(deliveryCase),  // ATHAR: one exact sentence, no dates, no promises
  supervisorInstruction,                     // WAZIR's standing instruction (often empty)
  houseLessons({ state: 'approved' }),       // MIZAN proposed it, a human approved it
  teamAnswers(customer.question),            // HAFEZ: what the team already answered once
  basePrompt({ manager: customer.accountManager, language: detectLanguage(message.text) }),
);
// The hard rules live in basePrompt and outrank every layer above it:
// refunds only for a damaged or wrong item, and never a promise the store cannot keep.
```

Nothing in the prompt is self-taught: an instruction reaches a bot only through an approved plan, an approved lesson, or an answer a human wrote.
