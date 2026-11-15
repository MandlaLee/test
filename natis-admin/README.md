# NaTIS-inspired Administration Workspace — Empty-data UI

An **independent, unconnected administration interface prototype** following the user-provided visual references for the public NaTIS website. This is **not an official RTMC/NaTIS administration service**; it does not connect to government databases or use live accounts.

## Phase 1.2 — all fictional operational data removed

- There are no seeded applications, appointments, DLTC schedules, citizen profiles, payments, vehicle renewals, accident reports, staff members or audit events.
- The dashboard does **not** invent service levels, activity trends, revenue, bookings, or licence figures.
- Unknown metrics display **— / Not connected**, rather than a misleading zero.
- All 15 responsive navigation sections still work; search/filter headers remain, and operational views show helpful empty states.
- Create-record and fictitious-status-editing controls are removed, and CSV exports are disabled pending an authorised backend.
- Previous locally saved demo datasets are cleared on load. Only interface preferences (notifications and compact layout) are stored in the browser.
- The supplied RTMC/NaTIS logos, SVG icons, campaigns, blank forms and reference manuals are available for review. Campaign banners are **not** claimed to be live notices.
- The role permission matrix is a proposed design, not actual access enforcement.

## Run

Open `index.html` locally in a browser or run `python3 -m http.server 8080` in the `natis-admin` folder and open `http://localhost:8080`.

For a single-file review, run `python3 build_standalone.py` to create `standalone.html`. Logos, icons and campaign images are embedded in this variant; links to PDFs still require the adjacent `assets/documents` folder.

## Test

Install `playwright` and Chromium, then run `python3 test_ui.py`. The tests verify navigation, empty states, non-connected metrics, reference content, mobile menu, stale demo storage cleanup and client-side JavaScript health. This is front-end testing only: there is no official API, account session or live service to test.

## Planned next phase

Google Apps Script login and Google Sheets can be used for **low-risk test data** after appropriate access controls are designed. Do not store plaintext passwords, full citizen ID databases, sensitive medical information or government credentials in Google Sheets. Actual NaTIS integration requires authorised API access, server-side permissions, protected audit logs and a POPIA review.

## Brand and document rights

The blue-gradient header, light-grey workspace, Open Sans typography and green accents follow the user's reference pages. User-provided RTMC/NaTIS logos, campaign images and manuals may be protected by copyright or trademark. The commissioning team must confirm redistribution and production usage rights. This GitHub repository is currently public; review permissions before wider distribution.

**Repository:** `MandlaLee/test` · branch `natis-admin-ui-prototype` · folder `natis-admin/`.
