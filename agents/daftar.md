# DAFTAR — Invoices & Accounts

"Ledger" — the accountant's agent. Turns every purchase invoice — PDF, photo or order email — into the same clean fields, checks the total against what the buyer recorded, lists purchases still waiting for an invoice, finds the ones that arrive by email, and exports the lot to the team's accounting sheet on one click. Only the accountant sees it.

## Day-to-day tasks

- Reads each invoice once, as structured output: supplier, supplier reference, invoice number, date, currency, subtotal, shipping, tax, discount, total, payment method (never the full card number), ship-to, items, notes, and its own confidence.
- Flags a total that differs from the buyer's recorded cost by more than 1 %, a low-confidence read, a file that is not an invoice at all, or one it cannot read — those wait for the accountant; clean reads go straight into the export.
- Finds invoices that "come by email": every 10 minutes searches the three mailboxes for purchases marked that way — by the shop's reference first, then by the shop's name and the purchase date — and keeps the attachment as the invoice file, or the email itself when there is no attachment. An email is never used twice.
- Keeps the file and the text side by side, linked to the purchase and to every store order it covers; a purchase that covers several orders shows its total once.
- Lists purchases still waiting for an invoice, and notes what a shop's order email cannot provide (an order email carries only the total and the order number).
- One Export button writes every invoice row into the team's accounting sheet; the books themselves stay where the accountant keeps them.

## Connects to

An AI model with structured output (PDF, photo and email text), the mailbox API on three mailboxes (read only, no copies kept of successful runs), the team app's file store, the purchases table the buyer fills, Google Sheets for the export, and the accountant's page in the team app (invoice list, waiting list, Export).

## Excerpt — read once, checked against the buyer's own number

```js
// Every invoice becomes the same row - and the row is checked, not trusted.
const read = await readInvoice(file, { schema: INVOICE_FIELDS }); // one structured pass
const purchase = await purchaseFor(read.supplierRef, read.ourOrders);
const status =
  !read.isInvoice ? 'not_an_invoice' :
  read.confidence < 0.7 ? 'check' :
  purchase && Math.abs(read.total - purchase.cost) / purchase.cost > 0.01 ? 'check' :
  'read';
await saveInvoice({ ...read, purchaseId: purchase?.id, status, payment: maskCard(read.payment) });
// 'check' rows wait for the accountant; 'read' rows go straight into the export.
```

The accountant is the only role that can see or export invoices; the buyer sees a purchase's "invoice received" state and nothing more.
