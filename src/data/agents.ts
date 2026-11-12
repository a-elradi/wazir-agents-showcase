import {
  BrainCircuit,
  Bug,
  Crown,
  Eye,
  Headset,
  MailCheck,
  MessageCircleMore,
  PackageSearch,
  Palette,
  Radar,
  ReceiptText,
  Scale,
  SearchCheck,
  ShieldCheck,
  ShoppingCart,
  Telescope,
  Workflow,
  type LucideIcon,
} from "lucide-react";

export type Agent = {
  key: string;
  ar: string;
  role: string;
  meaning: string;
  group: "System" | "Customer care" | "Growth" | "Ads" | "Sales" | "Operations" | "Brand" | "Supervisor";
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
  role: "Supervisor · Head of Sales",
  meaning: "the minister, trusted overseer",
  group: "Supervisor",
  Icon: Crown,
  brief:
    "The orchestrator and the Head of Sales. Routes a request to whichever specialist it needs, merges their findings, carries the sales target, and holds the team's kill switch. Never overrides a restriction placed on another agent.",
  tasks: [
    "Chairs a sales meeting every 3 days: each agent speaks in an expert role, a reality checker pushes back, WAZIR writes the plan",
    "The plan is approved by the CEO or the supervisor in the team app before any agent gets a new instruction",
    "Reads every agent's daily report and answers the team's questions through each specialist's own chat",
    "Runs /pause · /resume · /status from a Telegram command group",
    "Hands the support bots a customer's sticky account manager, VIP tier and order history",
    "Holds a hesitant customer's items for 24 h, cleans up expired holds, reports real AI spend from the provider's cost API",
  ],
  tools: ["Orchestration engine", "Telegram Bot API", "Governance data table", "Shopify Admin GraphQL × 3", "Model-provider cost API", "Team app · one page per role"],
  codeTitle: "The kill-switch read, at the top of every write-capable automation",
  code: `// First step of every write-capable automation
const state = await governance.state();
if (state.systemPaused) {
  return { skipped: true, reason: 'system paused via /pause' };
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
    tools: ["Shopify Admin GraphQL", "Meta Graph API", "Microsoft Graph API", "WhatsApp Business API", "Telegram", "Health-log table"],
    codeTitle: "Paging a big read instead of loading it all",
    code: `// WRONG: loads everything, can exceed the step's memory
// const all = await fetchEntireCatalog();

// Right: one bounded page per step, the cursor carried forward
const PAGE_SIZE = 250;
const page = await fetchCatalogPage({ first: PAGE_SIZE, after: input.cursor ?? null });
return {
  items: page.items,
  nextCursor: page.pageInfo.endCursor,
  hasMore: page.pageInfo.hasNextPage,
};`,
  },
  {
    key: "CS BOTS",
    ar: "خدمة",
    role: "Customer-care bots",
    meaning: "the service, answers every customer",
    group: "Customer care",
    Icon: Headset,
    brief:
      "The front line. Three AI bots answer every customer on WhatsApp, Instagram and email themselves — in the customer's own language, as the same named account manager every time. They look up orders across the three stores, send product and tracking cards, ask the team when they do not know, and escalate exactly one thing: a damaged or wrong item.",
    tasks: [
      "Answers every message on WhatsApp, Instagram and email, around the clock, in the language of the customer's last message",
      "Greets as the customer's own account manager — the same name every time, handed over by WAZIR",
      "Looks the order up across all three stores and answers with product and tracking cards, not prose",
      "When it does not know: tells the customer it is checking, asks the team on Telegram, and passes the reply on itself",
      "Reads before every reply: ATHAR's sentence for a late parcel, the lessons MIZAN proposed and a human approved, the answers HAFEZ keeps",
      "Escalates one thing only — a damaged or wrong item — to AMEEN; asks for a rating when the conversation ends",
    ],
    tools: ["AI model", "WhatsApp Business API", "Instagram messaging API × 4 accounts", "Mailbox API", "Shopify Admin GraphQL × 3", "Telegram · ask the team"],
    codeTitle: "Five layers, one reply - and the hard rules win",
    code: `// What a bot reads before every reply - top wins, and every layer was approved by a human.
const prompt = joinBlocks(
  deliveryCase && caseBlock(deliveryCase),  // ATHAR: one exact sentence, no dates, no promises
  supervisorInstruction,                     // WAZIR's standing instruction (often empty)
  houseLessons({ state: 'approved' }),       // MIZAN proposed it, a human approved it
  teamAnswers(customer.question),            // HAFEZ: what the team already answered once
  basePrompt({ manager: customer.accountManager, language: detectLanguage(message.text) }),
);
// The hard rules live in basePrompt and outrank every layer above it:
// refunds only for a damaged or wrong item, and never a promise the store cannot keep.`,
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
      "Watches every human reply to a customer and asks the model: reusable policy, or one-off?",
      "Deduplicates against the knowledge base before proposing a new entry",
      "Stores candidates as Suggested — only Approved entries reach a bot's prompt",
      "Nightly digest of questions the bots could not answer; the team replies with the answer",
    ],
    tools: ["AI model", "Knowledge-base data table", "Telegram", "[TEAM ANSWERS] prompt block"],
    codeTitle: "Classify, dedupe, queue — never auto-publish",
    code: `const verdict = await askModel(\`Is this a reusable store policy answer, or a one-off?
Customer asked: \${customerMessage}
Human replied: \${humanReply}\`);

if (!verdict.reusable) return { logged: true, reusable: false };

const existing = await findSimilarEntry(verdict.question, knowledgeBaseTable);
if (existing) return { deduped: true, matchedId: existing.id };

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
      "Two signatures: customer care decides first, the supervisor gives the final approve or reject",
      "Carries out the final decision: approve, reject, or manual adjustment — and refuses to act on one signature",
    ],
    tools: ["Google Sheets queue", "Shopify Admin API", "Telegram red alert", "Team app two-step approval"],
    codeTitle: "Idempotent by construction",
    code: `// Calling this twice for the same order/reason is a no-op.
const idempotencyKey = \`\${orderId}:\${reasonCode}\`;
const existing = await findByKey(refundQueueTable, idempotencyKey);
if (existing) return { ok: true, alreadyQueued: true, id: existing.id };

const row = await insertRow(refundQueueTable, {
  idempotencyKey,
  orderId,
  reasonCode, // only ever 'damaged' or 'wrong_item'
  status: 'pending_review',
  flaggedAt: new Date().toISOString(),
});
await alertOpsChannel('Refund request queued - decide within the SLA window');
return { ok: true, id: row.id };`,
  },
  {
    key: "MIZAN",
    ar: "ميزان",
    role: "Customer ratings & AI quality",
    meaning: "the scale, weighs every conversation",
    group: "Customer care",
    Icon: Scale,
    brief: "The daily reviewer of the support bots' own conversations, and the engine behind the \"what should we teach the bots\" cycle.",
    tasks: [
      "Reviews every day's support conversations for quality and tone",
      "Ties every customer rating back to the conversation that earned it",
      "Proposes house lessons every day — a human approves, edits, rejects or retires each one",
    ],
    tools: ["AI model", "Ratings table", "House-lessons table (approval state machine)", "Dashboard review UI"],
    codeTitle: "Lessons are proposed, never self-installed",
    code: `// Daily proposal run - writes nothing a bot can read yet
for (const c of await findRecurringIssues(yesterdaysConversations)) {
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
    key: "ATHAR",
    ar: "أثر",
    role: "Order tracking & delivery watch",
    meaning: "the trace, follows every parcel",
    group: "Customer care",
    Icon: PackageSearch,
    brief:
      "Follows every order from the supplier to the customer's door. Reads the shipping emails of three mailboxes, links tracking numbers to purchases, watches every shipped order, and opens a case the moment a parcel is late or stuck — with the one sentence the support bots may say about it.",
    tasks: [
      "Every 30 minutes reads the new shipping emails from shops, forwarders and couriers: carrier, tracking numbers, stage",
      "Links each shipment to the purchase and the store order, so the care page shows an order's whole journey",
      "Every 2 hours checks every shipped order; a shipment with no new step is looked up on the courier's tracking page",
      "Opens a case at 15 days late, 4 days without a step, a courier problem, or no tracking after 3 days; closes it on delivery",
      "Gives the support bots one approved English sentence per case — they say exactly that: no dates, refunds or courier names",
      "Marks a case urgent the moment the customer asks about it; team only, never names a supplier to a customer",
    ],
    tools: ["Mailbox API × 3 (read only)", "Shopify Admin GraphQL × 3", "Courier tracking pages", "AI model · one read per email", "Delivery-cases table shared with the bots", "Team app · Care page"],
    codeTitle: "A case is a rule, not a feeling",
    code: `// When does a shipment become a case the team must act on?
function caseFor(s, now) {
  if (s.delivered) return null;
  if (!s.tracking && days(now, s.shippedAt) > 3) return { kind: 'no_tracking' };
  if (/held|customs|returned to shipper|exception/i.test(s.lastStep)) return { kind: 'carrier_problem' };
  if (days(now, s.lastStepAt) > 4) return { kind: 'stuck' };
  if (days(now, s.shippedAt) > 15) return { kind: 'late' };
  return null;
}
// Every open case carries one sentence the support bots may say - written once, in English,
// with no dates, refunds or courier names. The bot repeats it word for word, nothing more.`,
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
    tools: ["AI model", "Free web reader (no paid credits)", "Shopify productSet", "Headless-browser relay", "Product-team view with login"],
    codeTitle: "Self-batching to survive a big import",
    code: `// "Bulk Import From Page" calls itself in small groups
const BATCH_SIZE = 3;
const thisBatch = input.productUrls.slice(0, BATCH_SIZE);
const remaining = input.productUrls.slice(BATCH_SIZE);

for (const url of thisBatch) await importOneProduct(url);

if (remaining.length) {
  await callSelf({ productUrls: remaining }); // same automation, next batch
}
return { importedThisRun: thisBatch.length, remaining: remaining.length };`,
  },
  {
    key: "KASHEF",
    ar: "كاشف",
    role: "SEO, AI search & content",
    meaning: "the discoverer, finds what search is missing",
    group: "Growth",
    Icon: SearchCheck,
    brief:
      "Owns how the stores get found — by Google, Bing and the AI answer engines. Fixes products, collections and country links on its own, writes the blog, logs every change as before / after / why, and never touches ads.",
    tasks: [
      "Daily search pass over every new product: title, description, alt text, the real brand in the brand field, structured data",
      "Weekly AI-visibility test: asks the AI answer engines about the store's categories in English and Arabic, then rewrites the matching collections so the store gets named",
      "Country links (hreflang) between sibling stores, collection SEO and Search Console / Bing data across the 3 storefronts",
      "Two blog articles a week from best sellers and real customer questions, published to the store blogs",
      "A fix-one-product button in the team app for the products team, SEO-only mode",
      "Logs every change as before / after / why; never touches ads",
    ],
    tools: ["AI model", "Search Console API", "Bing URL Submission API", "Shopify Admin GraphQL × 3", "Team log sheet", "Team app button"],
    codeTitle: "Changes on its own, never silently",
    code: `// KASHEF may fix a product by itself - but every fix leaves a paper trail.
const product = await getProduct(storeId, productId);
if (await fixedRecently(product.id, { days: 21 })) return { skipped: true, reason: 'touched this month' };

const fix = await proposeSearchFix(product); // title, description, brand, alt text, schema
await applySearchFix(storeId, product.id, fix);

await logToTeamSheet('kashef', {
  type: 'product SEO',
  before: pick(product, ['seoTitle', 'seoDescription', 'vendor']),
  after: fix,
  why: fix.rationale, // one sentence a human can audit later
});`,
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
return { checked: seen.size, broken };`,
  },
  {
    key: "DHAWWAQ",
    ar: "ذواق",
    role: "Shopping experience",
    meaning: "the connoisseur, judges how the store feels",
    group: "Growth",
    Icon: Eye,
    brief: "The watchdog making sure sibling storefronts actually agree with each other, nothing is listed twice, and the experience reads well.",
    tasks: [
      "Weekly: compares every storefront against its siblings — products, content, collections, policies, menus",
      "Daily: finds the same product live twice in a store and lists the pairs in the team sheet",
      "Runs a separate UX review of the storefront experience",
      "Report-only — the one write is a 'make it a draft' button a human presses, with undo",
    ],
    tools: ["Shopify Admin GraphQL × 3", "AI model", "Telegram", "Team app make-draft / undo"],
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
return { mismatches }; // report only`,
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
      "Ongoing performance monitoring across Google Ads and Meta Ads, daily spend fed to the team app",
      "On-demand advisor report, cross-checked line by line against real storefront orders",
      "Tracks the share of orders that used a discount code, so promotions are judged on margin, not volume",
      "A live chat the team can ask ad questions of, for any date range",
    ],
    tools: ["Google Ads API", "Meta Ads API", "Shopify Admin GraphQL", "AI model", "Team app"],
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
      "Keeps the repeat-buyer and VIP list per store — lifetime orders and spend — and treats them accordingly",
      "Reports every couple of hours: sent, waiting, codes issued, orders attributed",
    ],
    tools: ["AI model", "Shopify discount codes", "Loyalty connector", "Journeys data table", "Team results sheet"],
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
  {
    key: "BASHIR",
    ar: "بشير",
    role: "WhatsApp manager",
    meaning: "the herald, carries every WhatsApp message",
    group: "Sales",
    Icon: MessageCircleMore,
    brief:
      "Runs the whole WhatsApp operation: order updates the moment the store changes an order, a thank-you three days after delivery, abandoned-checkout and abandoned-cart cards, and one campaign per customer per month. The team only picks templates and switches cards on.",
    tasks: [
      "Order confirmed, shipped (when tracking appears) and delivered cards as soon as the order changes, any hour; thank-you 3 days after delivery",
      "Abandoned-checkout and abandoned-cart cards one day later, with the product photo and link, daytime only",
      "One campaign per customer per month by priority: high spenders, repeat buyers, 30–60-day lapsed, fragrance and beauty lovers, everyone else — evenings only",
      "Reward-balance and refill nudges on WhatsApp in sync with WASEL's emails: same code, same money, same product",
      "One 10 % code per store per month, created at month start and deleted before the next",
      "Cleans the lists before each month and reads the delivery reports per number; pauses itself on refusals or a billing problem",
    ],
    tools: ["WhatsApp Business API × 3 numbers", "Shopify Admin GraphQL", "Meta delivery reports", "Campaign queue tables", "Team app cards"],
    codeTitle: "One campaign per person per month, no exceptions",
    code: `// Monthly groups run by priority; a person reached once this month is skipped everywhere else.
const reached = await monthContacts(store, month); // Set of customer ids
for (const group of ['high_spenders', 'repeat_buyers', 'lapsed_30_60', 'beauty_lovers', 'everyone_else']) {
  for (const p of await audience(store, group)) {
    if (reached.has(p.id) || !p.whatsappOk || stopList.has(p.phone)) continue;
    await queue({ store, campaign: group, to: p, code: monthlyCode(store, month), window: '18:00-22:00' });
    reached.add(p.id);
  }
}
// Order updates ignore the monthly cap - and go first on every number.`,
  },
  {
    key: "MUSHTARI",
    ar: "مشتري",
    role: "Purchasing search & stock check",
    meaning: "the buyer, finds every product's best price",
    group: "Operations",
    Icon: ShoppingCart,
    brief:
      "For every new order, searches each product across the whole supplier list — more than 190 shops in the Gulf and worldwide — plus the open web, reads price, stock and the exact shade or size on the real product page, and lists every shop cheapest first. The buyer decides and buys; MUSHTARI never pays. It also walks the catalogue against supplier stock, so items nobody can source stop being sold.",
    tasks: [
      "Every new order: each product searched on every shop in the supplier list, Gulf and international, plus a web search",
      "Opens the real product page — exact brand, product, variant — and reads price, sale price and stock; one verdict per shop",
      "Available, not available, uncertain, check by hand, or skipped with the reason; every list shop appears, cheapest first",
      "'I bought it' covers several orders and stores in one purchase; the invoice comes by upload, by email, or later",
      "Stock check: walks the catalogue oldest-first, re-checks sellers every 3 days, lists what is sold out everywhere and what is back",
      "Reports which shops block it, every day; never buys, never pays, never changes a product",
    ],
    tools: ["Shopify Admin GraphQL × 3", "Shop search APIs + headless browser", "AI model · judges product pages", "Web search", "Live FX rates", "Team app · Purchasing page"],
    codeTitle: "One product, every shop, a verdict the buyer can trust",
    code: `// Search every shop in the list, read the real page, never check out.
for (const shop of suppliers.orderedBy('hitRate')) {
  const page = await openSearch(shop, item.brand, item.title, item.variant);
  if (page.blocked) { verdicts.push({ shop, status: 'skipped', why: page.reason }); continue; }
  const read = await judgeProductPage(page, item); // exact variant? price? in stock? add-to-cart live?
  verdicts.push({
    shop, url: read.url, price: toUSD(read.price, read.currency),
    status: !read.exactMatch ? 'uncertain' : read.inStock ? 'available' : 'not_available',
  });
}
return verdicts.sort(cheapestFirst); // the buyer decides - MUSHTARI never pays`,
  },
  {
    key: "DAFTAR",
    ar: "دفتر",
    role: "Invoices & accounts",
    meaning: "the ledger, keeps every invoice",
    group: "Operations",
    Icon: ReceiptText,
    brief:
      "The accountant's agent. Turns every purchase invoice — PDF, photo or order email — into the same clean fields, checks the total against what the buyer recorded, lists purchases still waiting for an invoice, finds the ones that arrive by email, and exports the lot to the team's accounting sheet on one click. Only the accountant sees it.",
    tasks: [
      "Reads each invoice once: supplier, reference, number, date, currency, subtotal, shipping, tax, discount, total, payment (never the full card), items",
      "Flags a total more than 1 % off the buyer's recorded cost, a low-confidence read, or a file that is not an invoice",
      "Finds invoices that 'come by email': searches three mailboxes by reference first, then by shop and date",
      "Keeps the file and the text side by side, linked to the purchase and to every store order it covers",
      "Lists purchases still waiting for an invoice",
      "One Export button writes everything to the accounting sheet; only the accountant sees the page",
    ],
    tools: ["AI model · structured output", "Mailbox API × 3 (read only)", "Team app file store", "Purchases table", "Google Sheets export"],
    codeTitle: "Read once, checked against the buyer's own number",
    code: `// Every invoice becomes the same row - and the row is checked, not trusted.
const read = await readInvoice(file, { schema: INVOICE_FIELDS }); // one structured pass
const purchase = await purchaseFor(read.supplierRef, read.ourOrders);
const status =
  !read.isInvoice ? 'not_an_invoice' :
  read.confidence < 0.7 ? 'check' :
  purchase && Math.abs(read.total - purchase.cost) / purchase.cost > 0.01 ? 'check' :
  'read';
await saveInvoice({ ...read, purchaseId: purchase?.id, status, payment: maskCard(read.payment) });
// 'check' rows wait for the accountant; 'read' rows go straight into the export.`,
  },
  {
    key: "RASSAM",
    ar: "رسام",
    role: "Brand design & social content",
    meaning: "the painter, keeps every post on brand",
    group: "Brand",
    Icon: Palette,
    brief:
      "The in-house designer. Learned the brand's own playbook from years of real campaign files and designs posts, stories, carousels and reels in that pattern, with the real product kept pixel-perfect. Nothing is published until the owner approves it.",
    tasks: [
      "Designs feed posts, stories, carousels and short reels for each storefront's Instagram account, in the house style",
      "Builds from the brand's own hi-res product photos: AI makes the scene, never redraws the product",
      "Follows a written brand playbook: colours, type, logo placement, rows of three, one colour story per row",
      "Reads reach and saves on every published post to learn what the audience responds to",
      "Every draft waits for the owner's approval; only approved designs reach the publishing step",
      "Reels are cut to an in-house royalty-free music library, so there are no licensing surprises",
    ],
    tools: ["AI image & video models", "Background removal", "Brand design library", "Instagram publishing API", "Video renderer", "Royalty-free music library"],
    codeTitle: "AI makes the scene, never the product",
    code: `// The product is the one thing AI may not touch.
const cutout = await removeBackground(product.heroPhoto);            // real pixels, kept as-is
const scene = await generateScene(brief.concept, { aspect: '4:5' }); // AI builds the stage
const composed = placeProduct(scene, cutout, { shadow: 'contact', relight: 'brightness-only' });

const post = brandFrame(composed, { logo: brand.logo, caption: brief.caption, font: PLAYBOOK.font });

await insertRow(designQueue, { account: brief.account, post, status: 'awaiting_approval' });
// Only 'approved' rows ever reach the publishing step.`,
  },
];

export const ALL = [WAZIR, ...TEAM];

export const REPO = "https://github.com/a-elradi/wazir-agents-showcase";
export const CONTACT = "https://github.com/a-elradi";
export const agentSlug = (key: string) => key.toLowerCase().replace(/\s+/g, "-"); // "CS BOTS" -> cs-bots
export const agentDoc = (key: string) => `${REPO}/blob/main/agents/${agentSlug(key)}.md`;

// The cold-open log from the film, reused by the hero terminal and the ticker.
export const LOG = [
  "06:00:02  NASEEJ   health check · 82 automations ........... OK",
  "06:00:05  NASEEJ   AI health check · backup AI ready ....... OK",
  "06:00:09  FAHES    kw.glam-moda.com · links & pages ......... 200",
  "06:00:18  CS BOTS  41 chats answered overnight · 2 asked the team",
  "06:00:30  AMEEN    2 refund requests · damaged items",
  "06:00:41  MIZAN    312 chats reviewed · AI score 4.6 / 5",
  "06:00:55  ATHAR    14 parcels watched · 1 late · case opened",
  "06:01:40  RAED     150 shops + 36 press sources scanned",
  "06:02:11  KASHEF   14 new products · SEO + brand fixed · logged",
  "06:02:30  MUSHTARI 6 new orders · 23 products priced at 190 shops",
  "06:02:48  WASEL    38 follow-up emails · signed by account managers",
  "06:03:05  BASHIR   9 order updates sent · tonight's campaign queued",
  "06:03:20  DAFTAR   4 invoices read · 1 total to check",
  "06:03:52  RASSAM   3 post drafts ready · awaiting approval",
  "06:04:30  RASID    ads advisor report ready",
  "06:05:12  WAZIR    daily brief ready",
];
