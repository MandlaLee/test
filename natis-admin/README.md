## Phase 2 — Supabase connected (16 November 2026)

The existing website now loads `auth.js` and `data.js` (both part of this folder). They connect to the previously named CHOVHA Supabase project, repurposed for this *independent* NaTIS admin prototype.

- **Authentication:** email/password via Supabase Auth, plus a server-side check against `natis_private.master_admin`. This table has a singleton constraint, allowing a maximum of **one** approved master user. Merely creating an Auth account does not grant access. Never use the service-role key in browser code.
- **Database:** empty, protected tables `natis_clients`, `natis_applications`, `natis_appointments`, `natis_test_results`, `natis_documents`, `natis_print_requests`, `natis_audit_events`. Read/write policies check the master allowlist.
- **Storage:** private buckets `natis-client-photos` and `natis-protected-documents`; no public photo URLs. The UI supports uploads to the former.
- **Admin actions:** create client profile, draft application, pending appointment, internal test result or watermarked demo print request. No official licence printing or government systems integration.
- **No seeded/fabricated data** and no existing CHOVHA user/upload/profile data before migration.
- **Before first use:** create the intended administrator through Supabase Authentication (via authorised Auth management), insert **that user's actual UUID** into `natis_private.master_admin`, disable public Auth signups in Supabase Dashboard, and validate the live authenticated workflow in a test deployment. None of these account steps have been completed yet; **zero master users currently exist**.
- **Hosting:** the GitHub source branch is connected in code, but editing GitHub source is not itself a live deployment. Deploy the site via an approved host and configure appropriate HTTPS security headers and origin policy.
- **Sensitive information:** do not upload real South African identity, driving, medical, or licensing data until the commissioning team explicitly approves hosting, access policy, retention and POPIA compliance.

---

# NaTIS Administration UI — public portal structure reference

Independent UI demonstration for commissioning-team review. **Not an official NaTIS or RTMC service**, not endorsed for public use, and **not connected** to any official databases, identity providers or payment systems.

## Visual direction: reference homepage structure (16 November 2026)

The previous version was a generic enterprise dashboard. This version recreates the **page hierarchy** shown in the user-supplied NaTIS public homepage screenshot:

1. Blue gradient masthead and utility row with green social icons, login/register placeholder, and green support/contact banner.
2. White logo/navigation strip containing the RTMC and NaTIS logos and a right-aligned hamburger menu.
3. Centre-aligned blue WELCOME title region.
4. White section with the exact green service introduction and blue explanatory sentence from the supplied reference.
5. Administration workspace and white-panel operational screens **below** the public-portal introductory structure.

At the reference viewport width of **838 CSS pixels**, the masthead is **304px tall**, navigation bar begins at **y=72px** and is **80px tall**, and the white introduction begins at **y=304px**. Other sizes respond fluidly. The header logo reference was cropped from the screenshot the user provided; it is not an official downloadable brand master. The public portal's source code was not used.

## Phase 1 — working

- 15 routes via the header hamburger, grouped into workspace, operations, administration.
- Overview, applications, appointments, vehicle renewals, DLTC/slots, citizen profiles, payments, accidents, reports, forms, campaigns, brand resources, team, activity log and settings.
- Search/filter controls, deep links, responsive navigation, keyboard shortcut (Cmd/Ctrl+K), and Esc-to-close.
- Forms/manuals and campaign previews from the supplied reference assets.
- **No fabricated records, revenue, percentages, capacity, staff identities or audit activity**. Metrics display em dash/unavailable and empty tables show no connection.
- Legacy demonstration data is cleared from localStorage, only interface preferences may persist.
- Login/register is explicitly a **non-functional UI placeholder** and reports that the login integration has not been connected. No credentials are collected.

## Run and preview

```bash
cd natis-admin
python3 -m http.server 8080
```

Open `http://localhost:8080/` in a browser. You can also open the generated `standalone.html` without installing any dependencies. It embeds styles, JS and images; accompanying PDF document links require the `assets/documents/` directory.

To rebuild the single-file preview:

```bash
python3 build_standalone.py
```

## Browser checks

Requires Chromium and Playwright. Run `python3 test_ui.py`. Most recent local execution: **23/23 checks passed**, covering precise reference-viewport layout, heading and imagery, 15 routes, navigation accessibility, empty records, forms, settings and mobile overflow. Browser tests use inline content to avoid network access and cover UI interactions only; these are not integration, penetration, performance or production security tests.

## Future phase

1. Get commissioning-team approval for branding and confirm the authorised scope.
2. Define staff roles, permissions, session protections and server-enforced authorisation.
3. Integrate a reviewed login provider; Google Apps Script is not automatically suitable as a security boundary for government/personal data.
4. Test with anonymised data in Google Sheets only if the project owner approves; never store plaintext passwords, ID numbers, medical documents or cardholder data there.
5. Hand over secure API contract specifications for the authorised national systems team.

The supplied RTMC/NaTIS artwork, public reference screenshot and PDF manuals have distinct ownership and distribution terms. The commissioning team should verify rights before public hosting. Never imply this prototype can issue documents, book real appointments, access citizen data or authenticate official staff.