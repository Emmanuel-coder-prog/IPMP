# IPMP Platform
## Inventory & Pricing Management for CETECH Operations

**Replacing spreadsheet chaos with a controlled, real-time operations platform**

---

# Slide 1 — Title

## IPMP
### Inventory & Pricing Management Platform

**CETECH internal operations system**

One platform for inventory intake, procurement costing, administrative approval, and full operational visibility—with audit-ready history and live coordination across teams.

---

# Slide 2 — Problem Statement

## The Business Problem

Operations today depend on **disconnected spreadsheets and manual handoffs**. That creates:

- **Fragmented workflows** — inventory, procurement, and leadership work in separate files
- **No single source of truth** — product status and pricing live in different places
- **Slow approvals** — admin review happens outside a structured queue
- **Limited visibility** — leadership cannot see live pipeline health without chasing updates
- **Weak accountability** — who changed what, and when, is hard to prove later

The cost is not only time—it is **pricing inconsistency**, **approval delay**, and **operational risk** when audits or disputes arise.

---

# Slide 3 — Current Challenges

## What Teams Experience Today

| Challenge | Operational impact |
|-----------|-------------------|
| **Disconnected workflows** | Handoffs via email or copy-paste between sheets |
| **Inconsistent pricing** | Manual formulas; version drift between files |
| **Manual tracking** | Status columns updated by hand; easy to miss items |
| **Delayed notifications** | Teams discover new work only when someone asks |
| **Weak auditability** | Historical changes are not centrally logged with actor identity |
| **Approval bottlenecks** | No dedicated review experience; decisions scattered |
| **Spreadsheet dependency** | Scaling users increases error rate and coordination cost |
| **No live coordination** | Procurement and admin do not see inventory changes instantly |

These are the pains IPMP was built to address—grounded in the actual three-role workflow implemented in the platform.

---

# Slide 4 — Proposed Solution

## The IPMP Platform

A **web-based operations platform** that unifies:

- **Inventory intake** — worksheet-style product creation with automatic SKU assignment
- **Procurement costing** — unit cost entry that drives a **standardized pricing formula**
- **Administrative control** — review, approve final selling prices, and reject when needed
- **Live updates** — changes appear across roles without refreshing spreadsheets
- **Notifications** — role-targeted alerts when work is ready or decisions are made
- **Audit logs** — searchable history of who did what, including product SKU context

IPMP does not ask teams to abandon familiar grid interaction—it **elevates** it with permissions, workflow states, and governance.

---

# Slide 5 — System Overview

## How the Platform Is Organized

```text
┌─────────────────────────────────────────────────────────────┐
│                     CETECH IPMP Platform                     │
├──────────────┬──────────────────────┬───────────────────────┤
│  INVENTORY   │    PROCUREMENT       │        ADMIN          │
│  Add products│  Apply unit costs    │  Approve prices       │
│  SKUs, qty   │  Trigger formula     │  Configure rates      │
│              │                      │  Users & audit        │
├──────────────┴──────────────────────┴───────────────────────┤
│  Shared: Live updates · Notifications · Audit trail · ₵ pricing │
└─────────────────────────────────────────────────────────────┘
```

**Inventory** creates demand. **Procurement** prices it. **Admin** approves and governs. Everyone works on the **same product record**, not duplicate files.

---

# Slide 6 — Key Features

## Capabilities That Deliver Value

| Feature | Business value |
|---------|----------------|
| **Live worksheet updates** | Procurement and admin see new inventory immediately—no “did you save?” |
| **Automatic SKU generation** | Fewer duplicate or missing identifiers; faster data entry |
| **Pricing formula engine** | Consistent margins and tax-inclusive minimums (20% / 4% floors) |
| **Approval workflow** | Clear gate before products go to approved selling price |
| **In-app notifications** | Right roles alerted when costing completes or products are approved |
| **Audit logs with actor identity** | Accountability for compliance and internal review |
| **Role-based access** | Each team sees only what they need to do their job |
| **Ghana Cedis (₵) display** | Pricing shown in the business currency across the UI |

Every feature maps to a implemented workflow in the current system—not a future roadmap slide.

---

# Slide 7 — Workflow

## End-to-End Operational Flow

```text
INVENTORY                    PROCUREMENT                 ADMIN
    │                             │                        │
    │  Create product             │                        │
    │  (SKU assigned)             │                        │
    ├────────────────────────────►│                        │
    │                             │  Enter unit cost       │
    │                             │  (formula runs)        │
    │                             ├───────────────────────►│
    │                             │                        │  Review breakdown
    │                             │                        │  Set final price
    │                             │                        │  Approve / Reject
    │◄──── live update ───────────┼──── notification ──────┤
    │                             │                        │
    └──────── audit log + searchable history ─────────────┘
```

**Outcome:** A single auditable path from “new item” to “approved selling price,” with notifications at handoff points.

---

# Slide 8 — Benefits

## Business Benefits of Implementation

### Speed
- Faster handoffs between inventory, procurement, and admin
- No manual consolidation of spreadsheets

### Quality
- Standardized pricing calculations reduce arithmetic and formula errors
- Structured approval before go-live pricing

### Visibility
- Dashboard metrics for leadership (totals, pending, approved, rejected)
- Real-time awareness when records change

### Control & risk
- Role permissions limit who can cost, approve, or configure formulas
- Audit trail with actor email and SKU for investigations

### Scalability
- Platform supports more products and users without proportional spreadsheet overhead

### Accountability
- Decisions and changes are logged—not buried in file versions

---

# Slide 9 — Implementation Plan

## Rollout Approach

### Phase 1 — Foundation (Complete in codebase)
- Core platform: auth, roles, product workflow, pricing engine
- Inventory and procurement spreadsheets
- Admin workspace and approval sidebar

### Phase 2 — Governance & visibility (Complete in codebase)
- Audit logs with search and timeline
- Notification center
- Pricing formula administration
- User management

### Phase 3 — Organizational rollout (Operational)
- Migrate active product lists from spreadsheets
- Train each role on their screen (Inventory / Procurement / Admin)
- Run parallel operation for a defined pilot period
- Cut over when audit samples match business expectations

### Phase 4 — Hardening (As needed)
- Production hosting, backups, and monitoring
- Optional: email for invitations, multi-server realtime (if scale requires)

Phases 1–2 reflect **delivered software**; Phases 3–4 are **organizational deployment** steps leadership controls.

---

# Slide 10 — Timeline

## Suggested Stakeholder Timeline

| Period | Activity |
|--------|----------|
| **Week 1–2** | Executive sign-off; nominate pilot product catalog owner |
| **Week 3–4** | User provisioning (admin accounts); pricing formula validation with finance |
| **Week 5–6** | Pilot: inventory + procurement live on IPMP; admin approvals daily |
| **Week 7–8** | Review audit samples, notification coverage, exception handling |
| **Week 9+** | Full cutover; decommission parallel spreadsheets for in-scope SKUs |

Timeline is **staged and realistic**—technical core is implementable now; organizational adoption pace depends on training and data migration scope.

---

# Slide 11 — Cost / ROI

## Return on Investment (Qualitative)

IPMP does not require invented financial models to show value. Leadership can frame ROI around:

### Time savings
- Eliminate duplicate data entry across inventory, procurement, and admin files
- Reduce status meetings (“where is this SKU?”)

### Error reduction
- Formula-driven costing replaces manual spreadsheet links
- Approval gate prevents premature final pricing

### Risk reduction
- Audit-ready logs with actor identity and SKU
- Role separation reduces unauthorized price or cost changes

### Operational efficiency
- Live updates and notifications shorten queue time between departments

### Accountability & compliance readiness
- Central history for internal review or external inquiry

**Qualitative ROI:** Higher throughput per FTE, fewer pricing disputes, faster approvals, stronger governance—without claiming specific dollar figures not measured in this project.

Optional future measurement: hours saved per week × loaded labor rate (requires baseline time study).

---

# Slide 12 — Q&A

## Questions & Next Steps

**Recommended leadership decisions:**

1. Approve pilot scope (product categories / SKUs in first wave)
2. Confirm pricing formula rates with finance (active configuration in admin)
3. Assign owners: Inventory lead, Procurement lead, Admin approver
4. Set cutover date for spreadsheet decommission

**We are ready to demonstrate:**

- Live inventory → procurement → approval flow
- Notifications and real-time grid updates
- Audit log search by user, action, or SKU

---

*Executive presentation aligned to the implemented IPMP/CETECH platform. For technical detail, see `documentation.md`.*
