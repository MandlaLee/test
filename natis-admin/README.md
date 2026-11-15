# NaTIS / RTMC Admin UI — Prototype v2

**Client-commissioned UI demonstration — not an official RTMC/NaTIS administration portal.** All data is synthetic, all administrative actions are browser-only, and there is no login, government API, payment processing or Google Apps Script connection.

## Open the UI

- **Main entry:** `index.html` — forwards to the fully working, single-file `standalone.html`.
- **Best for review:** download and open `standalone.html` in a browser. The CSS, JavaScript, RTMC emblem, icons and campaign artwork are embedded; **no network or image server is required**.
- The previous `app.js` and `styles.css` source files remain in this development branch as phase-1 modular references. **The v2 canonical implementation is `standalone.html`**, which now carries the new branding and navigation.
- Complete modular source, individual source artwork, original supplied PDFs and screenshots are included in the separate local handoff ZIP delivered with this change.

## 14 functional sections

Overview · Applications · Appointments · Vehicle renewals · DLTC & slots · Citizen profiles · Payments · Accident reports · **Forms & manuals** · **Campaign artwork** · Reports & analytics · Team & access · Activity log · Settings.

The **Forms & manuals** library contains eight source-backed guides: LL1, DL1, PD1, MC, Rules of the Road, Road Traffic Signs, Vehicle Controls and the supplied RTMC POPI disclaimer. The **Campaign artwork** page displays six supplied images as **archived reference artwork, not current public notices**.

## Functional demo capabilities

Hash-route navigation, mobile drawer, sample case-status updates, appointment creation/editing, centre-capacity editing, demo operator creation, table search/filters, CSV export, audit log, reset, localStorage persistence, eight reference guide dialogs, six campaign preview dialogs, keyboard search shortcut.

## Test evidence

The original ten interaction checks passed. Additional Playwright checks passed **19/19**, including navigation through all 14 routes, source-backed form guides, campaign-image rendering, mobile layout and no browser JavaScript exceptions. An additional smoke test verified the 1.5 MB standalone file opens and renders its embedded art without HTTP access.

## Handoff and security

Client brand rights, official typefaces, current operational notices and data contracts require approval by the commissioning team. No real personal data or government credentials should be used in this demo. In phase 2, Google Apps Script and Sheets may be used solely for secured, low-risk synthetic test fixtures; do not store passwords in Sheets, nor expose RTMC/NaTIS credentials in client-side code. Real deployment requires independently implemented authentication, access controls, audit logging and POPIA review.

The PDF source documents and original image files supplied by the client were **not uploaded to this public repository**; only art embedded for prototype visual review is present. The uploaded Gauteng High Court order is outside the product workflow and has not been published.

Version: 2.0.0 — 15 November 2026.
