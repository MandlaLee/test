# Road Services / NaTIS-inspired Admin Workspace — UI prototype

This is an **independent, fictional administration UI concept** inspired by the public NaTIS online portal's South African government blue/green visual language. It is not an official RTMC/NaTIS product, does not impersonate the official website, and has **no access** to government systems. The supplied NaTIS wordmark and RTMC logo are bundled in `assets/brand/`; eight original portal service illustrations are bundled in `assets/icons/`. The colours are matched to the supplied artwork, but exact official typeface specifications were not provided. Brand use still requires commissioning-team approval before deployment.

## Run locally

Open `index.html` in a modern browser, or run `python3 -m http.server 8080` in this folder, then open http://localhost:8080.

## What works in phase 1

- Fifteen responsive dashboard routes with hash-based deep links, including Overview, Applications, Appointments, Vehicle renewals, DLTC & slots, Citizen profiles, Payments, Accident reports, Reports, Forms & manuals, Campaigns & notices, Brand assets, Team & access, Activity log, Settings.
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
5. Confirm that the supplied logos, imagery, icons, manual editions, typeface choices and colour values are approved for the intended production environment.
6. Agree on roles, fields, workflow states, backend endpoints and access/privacy requirements before connecting data.

## Automated checks

With Python 3.10+, run `python3 -m pip install playwright`, `python3 -m playwright install chromium`, then `python3 test_ui.py`. The 15 Playwright checks mount the local HTML/CSS/JS into an isolated browser document (network navigation is restricted in the test environment) and exercise navigation, filtering, editing, creating records, exporting CSV, mobile layout and error-free execution. The local-storage mock is in-memory for test isolation; production browser persistence was not verified against any server.

## Source inspiration

- https://online.natis.gov.za/#/
- https://www.gcis.gov.za/guidelines/website/common-look-feel

Independent concept; all records synthetic.

## Phase 1.1 — supplied branding and reference materials

The GitHub branch and internal ZIP both contain the NaTIS wordmark, RTMC logo, supplied SVG service illustrations, campaign banners, and the eight reference PDFs mapped to **Forms & manuals**. The **Campaigns & notices** section previews five banners and can locally select a featured banner; **Brand assets** previews the supplied logos, colour reference and service icons. These pages use client-side state only.

The PDF manuals have their own copyright/redistribution conditions, and the brand artwork may be trademarked. These files are bundled for authorised internal evaluation, **not automatically cleared for publication in a public repository or commercial deployment**. Do not use demo copies to process real applications. Do not publish legal documents with contact or case details merely because a user uploaded them.

Brand fidelity uses the supplied graphics. The palette is visually derived, not an officially supplied brand specification; exact typeface names remain unverified. The real RTMC/NaTIS brand owners must approve production use.

## Asset parity and standalone preview

GitHub contains all 25 supplied production-facing assets used by the UI: 2 logos, 8 SVG illustrations, 7 campaign photos and 8 PDF reference documents. The `road-traffic-signs.pdf` file on GitHub is an optimised 67-page browser-view copy (2.4 MB); the full-quality 5.3 MB upload is retained in the ZIP package. The 2026 manuals and the remaining blank application forms were not filled with user information.

`standalone.html` embeds the logos, illustrations and campaign photos directly, allowing the UI screens to render without the asset image folder. **PDF reference links still require the adjacent `assets/documents` folder.** For full use, open `index.html` from the extracted ZIP or a locally served folder, rather than moving `standalone.html` away from its documents.

The visual identity uses supplied materials solely for the commissioned prototype; appearance does not establish official endorsement or operational access. This public repository should be reviewed by the commissioning organisation for trademark/copyright permissions and document distribution rules before sharing widely.


## Branding alignment — public NaTIS page captures (15 Nov 2026)

The November branding refresh uses four user-provided static captures of the NaTIS public homepage, login, and FAQ pages as visual references, rather than reusing website source code. The admin workspace now follows that public portal’s blue-gradient header, white navigation, light-grey backgrounds, Open Sans typography, green action buttons and RTMC/NaTIS logos (uploaded by the commissioning party). The original work was an independent UI concept, and the prototype remains synthetic-data-only, not officially authorised or connected to RTMC/NaTIS systems.

**Source observations:** homepage header blue gradient, white navigation and cards, green CTA; login and FAQ grey background/white panels; `--green: #2dce89`, `--blue: #2779b8`, typography Open Sans; contrast-adjusted button text for accessibility.

The original ZIP captures are **reference material only**, not included or published. Authentication and official database integrations remain out of scope for Phase 1.