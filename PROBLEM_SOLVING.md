## Context: Cheque and Cash Dominant AEC SMEs

Indian AEC SMEs rely heavily on cheques (incl. PDCs) and cash. This creates operational risk: delayed collections, bounce risk, poor visibility, reconciliation errors, fraud (fake notes), and compliance friction. The goal is to shorten cash conversion cycles, reduce write-offs, and improve financial visibility without over-engineering or forcing behavior changes prematurely.

## Key Problems and Root Causes

- Delays and uncertainty
  - PDCs mature on different dates; manual calendars are error-prone
  - Cheque deposit and clearing statuses tracked in WhatsApp/Excel
  - No automated nudges to customers before maturity/after bounce

- Bounce risk and penalties
  - No proactive verification of funds or cheque validity
  - No structured escalation or retry logic

- Reconciliation and bookkeeping errors
  - Cash/cheque receipts not linked to invoices or customers reliably
  - Partial payments and split tenders (cash+cheque) are mishandled
  - Data scattered across Tally/Excel/WhatsApp/photos

- Fraud and compliance
  - Fake notes undetected; missing audit trail for cash
  - Weak maker-checker controls for approvals and write-offs

- Operational overhead
  - Collection teams manually ping customers and branches
  - No single source of truth or aging dashboards

## Solution Themes (Tech + Process)

1) Intake, normalization, and single source of truth
   - Standardized capture of payments: cheque/cash details with attachments (cheque photo, deposit slip)
   - Link to invoices, customers, collectors; capture PDC date, bank, branch
   - Enforce required fields; roles and maker-checker for sensitive actions (void, write-off)

2) PDC calendar and nudges
   - Automatic PDC calendar across customers; daily digest per collector
   - Pre-maturity reminder to customer (SMS/WhatsApp/email) with courteous copy
   - Post-deposit status tracking: deposited, cleared, bounced with reasons

3) Bounce handling playbooks
   - Record bounce reason/charges; compute next attempt date
   - Structured escalation (collector → manager) and SLA timers
   - Generate payment links/UPI QR as alternate tender option

4) Reconciliation guardrails
   - Match payments to invoices using customer, amount, due date
   - Allow partial allocations and split tenders; maintain running balance
   - Lock edits after approval; audit trail of changes

5) Cash controls
   - Cash receipt issuance with unique IDs; daily cash book
   - Deposit tracking: expected vs actual bank credit; variance flags
   - Optional bank statement ingestion (CSV) for reconciliation

6) Risk scoring and watchlists
   - Simple risk signals: historical bounce rate, delays, exposure
   - Flag high-risk PDCs for preemptive reminders/escalations

7) Reporting and visibility
   - Aging by customer; PDC pipeline by maturity bucket
   - Bounce rate; recovery cycle times; collector performance

## What Does NOT Need Heavy Tech (Process First)

- Cheque photo quality and cheque metadata capture: create a 3-step checklist and train collectors; tech only validates required fields.
- Cash handling discipline: sealed envelopes and end-of-day deposits; simple serial-numbered receipt books (system-generated IDs help).
- Escalation etiquette and script: templates provided; managers review weekly.

## POC Scope (Pragmatic, High-Impact)

- Payment intake (cheque/cash) with required fields and attachments (URL fields in POC)
- PDC calendar with due reminders; status transitions (created → deposited → cleared/bounced)
- Basic reconciliation: link to invoices; support partial allocation on the UI later
- Bounce recording with next-steps date, charges, and escalation flag
- Simple risk score: prior bounce count and exposure to set a risk label
- Dashboards: list, filter by status/date; reminder queue view

## Assumptions for POC

- SMS/WhatsApp not integrated; reminders appear in an internal queue with manual send action
- Attachments are stored as URLs; real upload can be added later
- Auth is simplified; single-tenant, no roles
- MongoDB used for flexibility; no background job runner—reminders are computed on read

## KPIs to Improve

- Days Sales Outstanding (DSO) reduction via timely nudges
- Bounce rate reduction via pre-maturity reminders and risk flags
- Time-to-recovery reduction via structured playbooks
- Reconciliation accuracy increase; fewer manual errors


