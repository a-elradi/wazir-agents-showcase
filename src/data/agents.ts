import {
  BrainCircuit,
  Bug,
  Crown,
  Eye,
  HandCoins,
  MailCheck,
  Radar,
  Scale,
  SearchCheck,
  ShieldCheck,
  Telescope,
  Workflow,
  type LucideIcon,
} from "lucide-react";

export type Agent = {
  key: string;
  ar: string;
  role: string;
  meaning: string;
  group: "System" | "Customer care" | "Growth" | "Ads" | "Sales" | "Supervisor";
  Icon: LucideIcon;
  brief: string;
  tasks: string[];
  tools: string[];
  codeTitle: string;
  code: string;
};

export const WAZIR: Agent = {
  key: "WAZIR",
  ar: "وزير",
  role: "Supervisor · CEO interface",
  meaning: "the minister, trusted overseer",
  group: "Supervisor",
  Icon: Crown,
  brief:
    "The orchestrator. Routes a request to whichever specialist it needs, merges their findings, and holds the team's kill switch. Never overrides a restriction placed on another agent.",
  tasks: [
    "Answers the team's questions by calling the right specialist's own chat tool",
    "Runs /pause · /resume · /status from a Telegram command group",
    "Hands the support bots a customer's sticky account manager, VIP tier and order history",
    "Holds a hesitant customer's items for 24 h and cleans up expired holds",
    "Reports real AI spend from the model provider's own cost API",
  ],
  tools: ["n8n", "Telegram Bot API", "Governance data table", "Shopify Admin GraphQL × 3", "Anthropic Admin API", "MCP-driven dashboard"],
  codeTitle: "The kill-switch read, at the top of every write-capable workflow",
  code: `// Code node, start of every write-capable workflow
const state = $('Read Governance State').first().json;
if (state.systemPaused === 'true') {
  return [{ json: { skipped: true, reason: 'system paused via /pause' } }];
}
// /resume needs a second, explicit confirmation before writes come back.`,
};

export const TEAM: Agent[] = [
  {
    key: "NASEEJ",
    ar: "نسيج",
    role: "Automation & system health",
    meaning: "the fabric, holds every automation together",
    group: "System",
    Icon: Workflow,
    brief: "Holds every automation together and owns the audit trail every other agent writes to.",
    tasks: [
      "Daily sweep for stuck orders across every storefront (unfulfilled > 48 h, in progress > 72 h)",
      "Checks every channel token is alive before the support bots need it",
      "Confirms the kill-switch state is consistent across the fleet",
      "Posts a daily system-health summary and logs it",
    ],
    tools: ["Shopify Admin GraphQL", "Meta Graph API", "Microsoft Graph API", "WhatsApp Business API", "Telegram", "Health Log table"],
    codeTitle: "Paging a big read instead of loading it all",
    code: `// WRONG: loads everything, can exceed node memory
// const all = await fetchEntireCatalog();

// Right: HTTP Request node paginates, Code node only reshapes one page
const PAGE_SIZE = 250;
const cursor = $json.cursor || null;
const page = await fetchCatalogPage({ first: PAGE_SIZE, after: cursor });
return [{ json: {
  items: page.items,
  nextCursor: page.pageInfo.endCursor,
  hasMore: page.pageInfo.hasNextPage,
} }];`,
  },
  {
    key: "HAFEZ",
    ar: "حافظ",
    role: "Support memory",
    meaning: "the keeper, remembers every answer",
    group: "Customer care",
    Icon: BrainCircuit,
    brief: "Remembers every answer the team has ever given a customer. Never self-teaching: nothing becomes fact until a human approves it.",
    tasks: [
      "Watches every human reply to a customer and asks an LLM: reusable policy, or one-off?",
      "Deduplicates against the knowledge base before proposing a new entry",
      "Stores candidates as Suggested — only Approved entries reach a bot's prompt",
      "Nightly digest of questions the bots could not answer; the team replies with the answer",
    ],
    tools: ["Claude", "Knowledge-base data table", "Telegram", "[TEAM ANSWERS] prompt block"],
    codeTitle: "Classify, dedupe, queue — never auto-publish",
    code: `const verdict = await askLLM(\`Is this a reusable store policy answer, or a one-off?
Customer asked: \${customerMessage}
Human replied: \${humanReply}\`);

if (!verdict.reusable) return [{ json: { logged: true, reusable: false } }];

const existing = await findSimilarEntry(verdict.question, knowledgeBaseTable);
if (existing) return [{ json: { deduped: true, matchedId: existing.id } }];

await insertRow(knowledgeBaseTable, {
  question: verdict.question,
  answer: verdict.answer,
  state: 'suggested', // a human flips this to 'approved'
});`,
  },
  {
    key: "AMEEN",
    ar: "أمين",
    role: "Refunds",
    meaning: "the trustworthy one, guards every refund",
    group: "Customer care",
    Icon: ShieldCheck,
    brief: "The only escalation path the support bots are allowed to use — and only for one specific case.",
    tasks: [
      "Receives a refund request only when the bot has established the item arrived damaged or wrong",
      "Logs it to a human-reviewed queue, idempotently — never filed twice",
      "Carries out the human decision: approve, reject, or manual adjustment",
    ],
    tools: ["Google Sheets queue", "Shopify Admin API", "Telegram red alert", "Dashboard approve / reject"],
    codeTitle: "Idempotent by construction",
    code: `// Calling this twice for the same order/reason is a no-op.
const idempotencyKey = \`\${orderId}:\${reasonCode}\`;
const existing = await findByKey(refundQueueTable, idempotencyKey);
if (existing) return [{ json: { ok: true, alreadyQueued: true, id: existing.id } }];

const row = await insertRow(refundQueueTable, {
  idempotencyKey,
  orderId,
  reasonCode, // only ever 'damaged' or 'wrong_item'
  status: 'pending_review',
  flaggedAt: new Date().toISOString(),
});
await alertOpsChannel('Refund request queued - decide within the SLA window');
return [{ json: { ok: true, id: row.id } }];`,
  },
  {
    key: "MIZAN",
    ar: "ميزان",
    role: "Customer ratings & AI quality",
    meaning: "the scale, weighs every conversation",
    group: "Customer care",
    Icon: Scale,
    brief: "The nightly reviewer of the support bots' own conversations, and the engine behind the weekly \"what should we teach the bots\" cycle.",
    tasks: [
      "Reviews the day's support conversations for quality",
      "Ties every customer rating back to the conversation that earned it",
      "Proposes weekly house lessons — a human approves, edits, rejects or retires each one",
    ],
    tools: ["Claude", "Ratings table", "House-lessons table (approval state machine)", "Dashboard review UI"],
    codeTitle: "Lessons are proposed, never self-installed",
    code: `// Weekly proposal run - writes nothing a bot can read yet
for (const c of await findRecurringIssues(lastWeeksConversations)) {
  await insertRow(houseLessonsTable, {
    rule: c.proposedRule,
    evidence: c.exampleConversationIds,
    status: 'proposed', // only 'approved' rows reach a prompt
  });
}

// What a support bot actually reads at reply time:
const lessons = await queryRows(houseLessonsTable, { status: 'approved' });
const promptBlock = lessons.length
  ? '[HOUSE LESSONS]\\n' + lessons.map((l, i) => \`\${i + 1}. \${l.rule}\`).join('\\n')
  : '';`,
  },
  {
    key: "RAED",
    ar: "رائد",
    role: "Market intelligence",
    meaning: "the pioneer, scouts new territory",
    group: "Growth",
    Icon: Telescope,
    brief: "Sole owner of competitor intelligence and new-product discovery, plus the daily hygiene of every product it adds.",
    tasks: [
      "Scans 150 shops' best-seller and new-in pages every morning and posts one shortlist",
      "Reads dozens of press outlets for products called new, best-selling or viral",
      "Turns a pick into a full draft — every photo, every variant — in one action",
      "Bulk-imports a whole category page, batching itself in threes overnight",
      "Daily pass over its own drafts: safe fixes applied, the rest listed, nothing deleted",
    ],
    tools: ["Claude", "Free web reader (no paid credits)", "Shopify productSet", "Headless-browser relay", "Product-team view with login"],
    codeTitle: "Self-batching to survive a big import",
    code: `// "Bulk Import From Page" calls itself in small groups
const BATCH_SIZE = 3;
const thisBatch = $json.productUrls.slice(0, BATCH_SIZE);
const remaining = $json.productUrls.slice(BATCH_SIZE);

for (const url of thisBatch) await importOneProduct(url);

if (remaining.length) {
  await callSelf({ productUrls: remaining }); // same workflow, next batch
}
return [{ json: { importedThisRun: thisBatch.length, remaining: remaining.length } }];`,
  },
  {
    key: "KASHEF",
    ar: "كاشف",
    role: "SEO & content",
    meaning: "the discoverer, finds what search is missing",
    group: "Growth",
    Icon: SearchCheck,
    brief: "Finds what search is missing across the whole catalog, drafts the fix, and — once approved — applies it at scale.",
    tasks: [
      "Scans every product in 3 stores for weak titles, meta descriptions and alt text",
      "Drafts a replacement with a clear before / after",
      "Fix-all background runner works the backlog in small rounds with Stop / Resume",
      "Every fix logged to a sheet the team can audit",
    ],
    tools: ["Claude", "Shopify Admin GraphQL (metafields)", "Progress data table", "Dashboard Start / Stop / Resume"],
    codeTitle: "A stoppable background batch runner",
    code: `const ROUND_SIZE = 15;
const progress = await readProgressRow(runId);
if (progress.stopRequested) return [{ json: { stopped: true } }];

const batch = await getNextUnfixed(storeId, ROUND_SIZE);
for (const product of batch) await fixOneProduct(product);
await updateProgressRow(runId, { fixedSoFar: progress.fixedSoFar + batch.length });

if (batch.length === ROUND_SIZE) {
  await callSelf({ runId, storeId }); // more to do - next round
} else {
  await markRunComplete(runId);
}`,
  },
  {
    key: "FAHES",
    ar: "فاحص",
    role: "Technical QA",
    meaning: "the examiner, tests every page and link",
    group: "Growth",
    Icon: Bug,
    brief: "A daily outside-in check of the storefront itself — the actual pages a visitor loads, not the business data.",
    tasks: [
      "Confirms core pages are reachable",
      "Crawls the homepage's internal links and flags anything broken",
      "Confirms pixels and tag managers are present and firing",
      "Report-only — it never touches anything itself",
    ],
    tools: ["HTTP crawler", "Link graph", "Free page reader", "Telegram"],
    codeTitle: "A bounded crawl, not an open-ended one",
    code: `const MAX_LINKS = 200;
const seen = new Set([homepageUrl]);
const queue = [homepageUrl];
const broken = [];

while (queue.length && seen.size < MAX_LINKS) {
  const url = queue.shift();
  const res = await fetchWithTimeout(url, 8000);
  if (!res.ok) { broken.push({ url, status: res.status }); continue; }
  for (const link of extractInternalLinks(res.body, homepageUrl)) {
    if (!seen.has(link)) { seen.add(link); queue.push(link); }
  }
}
return [{ json: { checked: seen.size, broken } }];`,
  },
  {
    key: "DHAWWAQ",
    ar: "ذواق",
    role: "Shopping experience",
    meaning: "the connoisseur, judges how the store feels",
    group: "Growth",
    Icon: Eye,
    brief: "A weekly watchdog making sure sibling storefronts actually agree with each other, and that the experience reads well.",
    tasks: [
      "Compares every storefront against its siblings: products, content, collections, policies, menus",
      "Runs a separate UX review of the storefront experience",
      "Report-only — findings go to the team",
    ],
    tools: ["Shopify Admin GraphQL × 3", "Claude", "Telegram"],
    codeTitle: "Diffing sibling stores, not just checking one",
    code: `const stores = ['kw', 'bh', 'us'];
const snapshots = await Promise.all(stores.map(fetchStorefrontSnapshot));
const baseline = snapshots[0];

const mismatches = [];
for (const field of ['products', 'collections', 'policies', 'homepage']) {
  for (let i = 1; i < snapshots.length; i++) {
    const diff = diffField(baseline[field], snapshots[i][field]);
    if (diff.length) mismatches.push({ store: stores[i], field, diff });
  }
}
return [{ json: { mismatches } }]; // report only`,
  },
  {
    key: "TAJER",
    ar: "تاجر",
    role: "Sales & retention",
    meaning: "the merchant, drives the deal",
    group: "Sales",
    Icon: HandCoins,
    brief: "Keeps a running read on sales and feeds the one shared profitability view every revenue-facing agent reads from.",
    tasks: [
      "Pulls sales performance across every storefront on a schedule",
      "Feeds price, cost of goods, fees, shipping, discount, ad cost and returns into one view — not eight",
      "Carries a bounded promotion authority: reminders automatic, 5–10 % inside rules, anything bigger needs a human",
    ],
    tools: ["Shopify Analytics / Admin GraphQL", "Shared profitability model", "Telegram"],
    codeTitle: "A promotion decision stays inside its own lane",
    code: `function authorityFor(action) {
  if (['recommendation', 'restock_notice', 'cart_reminder'].includes(action.type)) return 'auto';
  if (action.type === 'discount' && action.percent <= 10 && action.withinApprovedCampaign) return 'auto';
  return 'needs_human'; // >10%, VIP exception, mass campaign, any price change
}

if (authorityFor(proposedAction) === 'needs_human') {
  await raiseForApproval(proposedAction); // never executes itself
} else {
  await execute(proposedAction);
}`,
  },
  {
    key: "RASID",
    ar: "راصد",
    role: "Google & Meta Ads",
    meaning: "the observer, watches spend earn",
    group: "Ads",
    Icon: Radar,
    brief: "Watches ad spend earn its keep — with trust earned in stages, since it carries the most direct financial risk.",
    tasks: [
      "Ongoing performance monitoring across Google Ads and Meta Ads",
      "On-demand advisor report, cross-checked line by line against real storefront orders",
      "A live chat the team can ask ad questions of, for any date range",
    ],
    tools: ["Google Ads API", "Meta Ads API", "Shopify Admin GraphQL", "Claude"],
    codeTitle: "Staged autonomy instead of day-one trust",
    code: `function stageFor(agent) {
  if (agent.daysLive < 30) return 'read_only';          // recommends only
  if (agent.stage1ApprovalRate > 0.9) return 'bounded';  // +-10%, hard daily cap
  return 'controlled_autonomy';                          // earned, not default
}

const stage = stageFor(rasidState);
if (stage === 'read_only') {
  await proposeChange(change);
} else if (stage === 'bounded') {
  if (Math.abs(change.percentDelta) > 10 || wouldExceedDailyCap(change)) await proposeChange(change);
  else await applyChange(change);
} else {
  await applyChange(change);
}`,
  },
  {
    key: "WASEL",
    ar: "واصل",
    role: "Personal sales follow-up",
    meaning: "the one who reaches, follows up in person",
    group: "Sales",
    Icon: MailCheck,
    brief: "Writes personal, per-customer follow-up emails — signed by that customer's own account manager, not a marketing voice.",
    tasks: [
      "Finds abandoned checkouts and saved bags across every storefront and opens a journey for each",
      "Plans loyalty-balance, expiry and refill reminders for every customer except opt-outs",
      "Writes each email in the account manager's voice with a one-time personal code",
      "Reports every couple of hours: sent, waiting, codes issued, orders attributed",
    ],
    tools: ["Claude", "Shopify discount codes", "Loyalty connector", "Journeys data table", "Team results sheet"],
    codeTitle: "One journey per reason, gated by due time",
    code: `const due = await queryRows(journeysTable, { status: 'pending', dueAt: { lte: now() } });
for (const journey of due) {
  if (await isUnsubscribed(journey.customerId)) { await markSkipped(journey); continue; }

  const manager = await getStickyAccountManager(journey.customerId); // same name, every channel
  const copy = await writeFollowUpEmail({ journey, signedBy: manager });
  const code = await issuePersonalDiscountCode(journey.customerId, { percent: 10 });

  await sendEmail(journey.customerEmail, copy, { discountCode: code });
  await markSent(journey);
  await logToTeamSheet({ customer: journey.customerId, manager, code });
}`,
  },
];

export const ALL = [WAZIR, ...TEAM];

export const REPO = "https://github.com/a-elradi/wazir-agents-showcase";
export const agentDoc = (key: string) => `${REPO}/blob/main/agents/${key.toLowerCase()}.md`;

// The cold-open log from the film, reused by the hero terminal and the ticker.
export const LOG = [
  "06:00:02  NASEEJ   health check · 81 workflows ............. OK",
  "06:00:05  NASEEJ   AI health check · backup AI ready ....... OK",
  "06:00:09  FAHES    kw.glam-moda.com · links & pages ......... 200",
  "06:00:30  AMEEN    2 refund requests · damaged items",
  "06:00:41  MIZAN    312 chats reviewed · AI score 4.6 / 5",
  "06:01:40  RAED     150 shops + 36 press sources scanned",
  "06:02:11  KASHEF   drafting SEO title · Rhode Bubble Bag",
  "06:02:48  WASEL    38 follow-up emails · signed by account managers",
  "06:03:05  TAJER    14-day pulse · VIP customers updated",
  "06:04:30  RASID    ads advisor report ready",
  "06:05:12  WAZIR    daily brief ready",
];
