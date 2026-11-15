# Road Services / NaTIS-inspired Admin Workspace — UI prototype

This is an **independent, fictional administration UI concept** inspired by the public NaTIS online portal's South African government blue/green visual language. It is not an official RTMC/NaTIS product, does not impersonate the official website, and has **no access** to government systems. The original NaTIS mark, verified typefaces and official asset library have **not** been supplied or reproduced; brand alignment must be approved by the commissioning team before production use.

## Run locally

Open `index.html` in a modern browser, or run `python3 -m http.server 8080` in this folder, then open http://localhost:8080.

## What works in phase 1

- Twelve responsive dashboard routes with hash-based deep links, including Overview, Applications, Appointments, Vehicle renewals, DLTC & slots, Citizen profiles, Payments, Accident reports, Reports, Team & access, Activity log, Settings.
- Search, per-table status filtering and records detail dialogs.
- Locally update demo record statuses, appointment times and DLTC slot capacity.
- Create sample appointments, centres and operator profiles.
- Download synthetic CSV datasets, view activity logs, reset demo data, adjust settings.
- Persist demonstration changes in browser `localStorage`; no API calls, real credentials, or real identities.
- Keyboard shortcuts: Cmd/Ctrl+K for search and Escape to close dialogs; mobile navigation included.

## Not yet implemented (phase 2 and beyond)

- **No login**. Google Apps Script and Google Sheets integration is intentionally postponed.
- No real RTMC or NaTIS API, authorisation rules, data validation, billing, payment capture or automated messaging.
- No actual email invites or permission enforcement (role matrix is a design proposal).
- Reports use illustrative local sample data; metrics are not official statistics.

## Planned secure integrations

For phase 2, use a properly reviewed authentication provider, session controls and server-side authorisation. Do not store passwords in Google Sheets. If Sheets is used for low-risk test fixtures or metadata, limit scopes, protect access and avoid storing full SA IDs or other unnecessary personal information. An authorised NaTIS database integration needs contracts, a secure backend/API gateway, audit logging and POPIA compliance review; never expose government database credentials to browser JavaScript or Apps Script published as a public web app.

## Suggested handoff / test plan

1. Review page navigation at desktop and mobile widths and the sidebar/menu focus behaviour.
2. Open each table, filter/search it, update a demo record and reload to confirm local persistence.
3. Create a booking, centre and team operator; check activity log and CSV exports.
4. Restore seed data and verify the database resets as expected.
5. Obtain official approved logos, fonts, icons and brand palette from the commissioning team, then replace placeholder wordmark styling.
6. Agree on roles, fields, workflow states, backend endpoints and access/privacy requirements before connecting data.

## Automated checks

With Python 3.10+, run `python3 -m pip install playwright`, `python3 -m playwright install chromium`, then `python3 test_ui.py`. The 10 Playwright checks mount the local HTML/CSS/JS into an isolated browser document (network navigation is restricted in the test environment) and exercise navigation, filtering, editing, creating records, exporting CSV, mobile layout and error-free execution. The local-storage mock is in-memory for test isolation; production browser persistence was not verified against any server.

## Source inspiration

- https://online.natis.gov.za/#/
- https://www.gcis.gov.za/guidelines/website/common-look-feel

Independent concept; all records synthetic.