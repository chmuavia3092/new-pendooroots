# Website Recovery Instructions: Fix the Navigation-Bar Regression

## Goal

The website looked good before a recent agent changed the navigation
bar. After that change, the page now looks wrong (see the supplied
screenshot). **Repair the regression while preserving the existing
design, content, and functionality.** Do not redesign the site from
scratch.

The screenshot is evidence of the visible result, not enough by itself
to prove the exact source-code cause. Inspect the actual code, Git
history, browser behavior, and relevant network/API requests before
deciding what caused it.

## 1. Protect the current work and investigate with Git

Before editing anything:

1.  Run `git status --short` and note all modified, staged, untracked,
    or deleted files.
2.  Do not discard the user's uncommitted changes. Do not run
    destructive commands such as `git reset --hard`, `git clean -fd`, or
    broad checkout/revert commands without explicit approval.
3.  Inspect the latest history and relevant changes:
    -   `git log --oneline -n 10`
    -   `git diff`
    -   `git diff --staged`
    -   `git show --stat <commit>`
    -   `git show <commit> -- <relevant-file>`
4.  Identify the commit or patch where the navigation change was
    introduced, if available. Compare affected files against the last
    known-good version.
5.  Record the files and specific lines changed by the agent. Separate
    the requested nav changes from unrelated changes.
6.  If Git history is unavailable, state that limitation and inspect
    backups, earlier versions, or other available evidence. Do not
    invent a prior state.
7.  Before making a fix, summarize the suspected cause and proposed
    minimal repair. Preserve a diff so the repair can be reviewed.

## 2. Trace the navigation component and shared styles

Find the navigation component and all styles, scripts, and configuration
it uses. Trace imported styles and shared classes.

Check these likely failure points, confirming them in code rather than
guessing:

### CSS scope and selectors

-   Look for broad selectors such as `header`, `nav`, `section`, `main`,
    `body`, `*`, `a`, `button`, or generic class names that could affect
    unrelated components.
-   Check whether rules override existing styles because of specificity,
    source order, duplicate selectors, or `!important`.
-   Ensure nav-only rules are scoped to a unique navigation
    class/component, such as `.site-nav ...`, or use the project's
    existing CSS Modules/component conventions.
-   Check for accidental global resets or changed design tokens/CSS
    variables.

### Layout, sizing, and spacing

-   Review changes to `height`, `min-height`, `width`, `max-width`,
    `margin`, `padding`, `gap`, `position`, `display`, `overflow`,
    `transform`, `box-sizing`, `z-index`, and flex/grid rules.
-   Check whether the navigation or its wrapper creates excessive
    vertical space or pushes page content down.
-   Check whether a shared `.container`, wrapper, or grid width makes
    content too narrow or misaligned.
-   Check for unintended absolute/fixed positioning, stacking contexts,
    overflow clipping, or changed breakpoints.
-   Verify the header, hero/title area, main content, values section,
    and footer dimensions and alignment.

### Typography and assets

-   Check changes to `font-size`, `line-height`, `font-family`,
    `font-weight`, letter spacing, text transforms, and font imports.
-   Verify that the original fonts, logos, icons, and images still load
    and display at the intended size.
-   Check for missing or changed asset paths.

### Responsive behavior

-   Inspect media queries and breakpoint changes. Ensure desktop changes
    did not break tablet/mobile styles, or vice versa.
-   Check for fixed dimensions, viewport assumptions, accidental
    `zoom`/`scale`, and horizontal overflow.
-   Test at the project's normal desktop width and at a narrow mobile
    width.

### Framework and build configuration

-   If the project uses Tailwind, CSS Modules, Sass, or another styling
    system, inspect configuration and class-name changes.
-   Check whether stylesheet imports were removed, reordered, or
    duplicated.
-   Run the project's existing lint, type-check, and build commands
    where available. Do not invent command names; inspect `package.json`
    or the relevant project config first.
-   Review browser-console errors and build warnings.

## 3. Check GET and other HTTP methods where relevant

If the site uses API requests, server routes, form submissions, or
navigation data loaded from a backend, inspect the Network panel and
relevant code. Do not assume an HTTP-method problem caused a visual CSS
regression; investigate it only where the app actually uses requests.

1.  Inspect requests triggered when the page loads and when navigation
    links or menu controls are used.
2.  Check **GET** requests for page data, navigation data,
    product/content data, and assets. Confirm the URL, status code,
    response body, and whether the response is unexpectedly empty or
    malformed.
3.  Check **POST**, **PUT**, **PATCH**, and **DELETE** requests only
    where the application uses them, especially for forms, cart actions,
    account actions, or admin functionality. Confirm the intended
    method, request payload, response, and status code.
4.  Check for `404`, `401`, `403`, `405 Method Not Allowed`, `500`, CORS
    errors, failed requests, redirects, and unexpected cached responses.
5.  Verify that client code uses the intended HTTP method and endpoint
    and correctly handles loading, success, and error states.
6.  If a route is expected to support `GET` but the server returns
    `405`, inspect the route/controller configuration. Do not change an
    endpoint's method speculatively.
7.  Check that navigation links point to the correct local routes and do
    not accidentally submit a form or trigger an API request.
8.  Do not change backend routes, API methods, request payloads,
    authentication, or data contracts unless evidence shows they are
    part of the regression.
9.  Do not expose API keys, cookies, authorization headers, passwords,
    or private user data in the report. Redact secrets from logs and
    screenshots.

If the site is entirely static and no relevant API requests are used,
state that HTTP-method checks were not applicable.

## 4. What the screenshot suggests (hypotheses, not confirmed causes)

The supplied screenshot shows that the page still has its main sections
and product imagery, but the overall presentation may differ from the
intended design. The header/title region, small typography, spacing, or
content alignment may warrant investigation.

These observations are only hypotheses. Confirm the cause by comparing
the current code with the last known-good version and checking relevant
browser behavior. Do not claim that a specific CSS rule or HTTP method
is responsible without evidence.

## 5. Repair strategy

1.  Make the smallest targeted fix that addresses the confirmed cause.
2.  If the nav change modified unrelated global CSS, revert only those
    unrelated changes. Preserve the intended navigation improvement if
    it can be isolated safely.
3.  Scope new styles to the navigation component using unique classes or
    the project's existing component styling conventions.
4.  Restore previous design tokens, fonts, container widths, spacing,
    and responsive rules wherever the nav change unintentionally altered
    them.
5.  If an API or route issue is proven to be involved, make the smallest
    compatible correction and preserve existing contracts.
6.  Do not replace the whole stylesheet, rewrite the page, remove
    content, or introduce a new design system as a shortcut.
7.  Do not use arbitrary negative margins, transforms, fixed heights, or
    `!important` patches merely to make one screenshot look right.
8.  Avoid changing product copy, product images, section order, footer
    content, or unrelated functionality.
9.  Review the final `git diff` and ensure every changed line is
    necessary.

## 6. Validate before finishing

Use the project's existing run/build commands and validate the actual
repaired page.

-   [ ] Navigation links, logo, icons, dropdowns, and menu interactions
    still work.
-   [ ] The header has the intended height and spacing; page content
    begins in the correct place.
-   [ ] Typography, colors, and fonts match the last known-good design.
-   [ ] Main content width and alignment are restored.
-   [ ] Product image and its background/accent shape are positioned
    correctly.
-   [ ] Values cards and footer retain their intended layout and
    spacing.
-   [ ] No horizontal overflow, unexpected blank space, overlap, or
    clipped content appears.
-   [ ] Desktop and mobile breakpoints both work.
-   [ ] Browser console and build output have no new errors.
-   [ ] Relevant GET/API requests return expected status codes and data,
    if the project uses them.
-   [ ] Other HTTP methods are tested only for the features that use
    them.
-   [ ] Existing forms and interactive features still work.
-   [ ] `git diff` contains only intentional changes;
    `git status --short` is reviewed before finishing.

If a known-good screenshot exists, compare it with the repaired page at
the same viewport size and browser zoom. Use visual regression tooling
if available. Do not claim a test passed unless it was actually
performed.

## 7. Report back to me

When finished, provide a concise but specific report:

1.  **Root cause:** exact file, selector/component, and changed rule or
    code that caused the regression.
2.  **Why it happened:** explain how the change affected other parts of
    the site.
3.  **Git evidence:** identify the relevant commit/diff or state that
    history was unavailable.
4.  **Fix applied:** list changed files and describe the minimal repair.
5.  **HTTP/API checks:** report relevant requests, methods, endpoints,
    and status codes only when applicable. Never include secrets.
6.  **Validation:** state the viewport sizes and build, lint, console,
    and interaction checks actually performed.
7.  **Remaining issues:** disclose anything that could not be verified.

If the exact cause cannot be established from the available history or
files, say so clearly and explain what evidence is missing. Do not
invent a root cause.

## Important constraint

**Preserve the original website. Fix the regression caused by the
navigation-bar change; do not redesign the website.**
