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