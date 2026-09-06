# Release validation

## 1.16.0 modernization candidate

Validation date: 2026-08-14

The modernization candidate is validated with Node 22 and a lockfile v3 generated from the committed `package.json` dependency set.

An independent GitHub Actions build lab cloned `feature/modernization`, regenerated the dependency lock and then performed a clean install from that lock. The completed validation stages were:

- dependency resolution: success
- clean `npm ci`: success
- unit tests: success
- source / JSON / web-extension lint: success
- manual build dependency (Pandoc): success
- extension ZIP build: success
- built ZIP validation with `addons-linter`: success

The repository-local `checker` remains the authoritative merge/release gate. This document records the additional independent validation used while modernizing the old dependency stack.

## 1.20.0 RC8 final hands-on candidate

RC8 is the current final hands-on prerelease candidate after the post-RC7 Software-Engineering-Framework hardening. Do not infer any physical-browser gate from automated CI.

Candidate identity:

- release: `1.20.0-rc.8`
- exact tagged code commit: `f64eeddbab703d0285569508f2c315dfe2ef6608`
- release workflow: #16, green
- candidate master Build: #531, green
- XPI/ZIP size: 265,770 bytes each
- SHA-256 for both byte-identical artifacts: `887c96e9496fc249470cade725a8cec048882c6f6c05e3e3774448ae3008ef8a`
- XPI: `https://github.com/HyperCriSiS/Request-Control-Evo/releases/download/1.20.0-rc.8/request_control-1.20.0.xpi`
- ZIP: `https://github.com/HyperCriSiS/Request-Control-Evo/releases/download/1.20.0-rc.8/request_control-1.20.0.zip`
- Mozilla signing/publishing: intentionally skipped for prerelease testing

Before hands-on testing, verify that the artifact under test is RC8 and, where practical, verify the SHA-256 above. Do not use RC6 or RC7 for final sign-off because later hardening changed the candidate artifact.

### Desktop hands-on gate

Test in real Firefox and/or Waterfox. A pass requires all of the following without clipping, stale controls, uncaught errors, silent state loss or unexpected persistent rule mutation:

1. **Popup and current-site recovery controls**
   - popup opens at a usable width; primary controls fit without accidental horizontal clipping;
   - Referer mode is visible, compact and understandable without the removed verbose explanatory paragraph;
   - exact-host Referer exception can be added and removed for the active host and survives reopening the popup;
   - Request Control can be disabled and re-enabled for the current site without changing global enablement;
   - the currently matched rule can be suppressed for the current site without mutating the managed rule payload.
2. **Inspector / Breakage Check**
   - explicit Reload & Inspect starts successfully and reloads the active page;
   - requests are captured and rendered after reload;
   - request selection/details remain usable while capture is active;
   - integrated URL findings distinguish known tracking parameters, redirects and ambiguous review-only parameters;
   - Breakage Check appears only as bounded Inspector diagnostics and does not block core capture/rendering;
   - Referer diagnostics expose only action/mode/target-host metadata and the exact-host exception action;
   - Stop returns the Inspector to an idle state and a new session can be started again;
   - repeated start/stop/reopen cycles do not duplicate captured requests or leave stale listeners/session state.
3. **Rules**
   - fixed Type sections remain Filter / Redirect / Secure / Block / Whitelist;
   - creating a user Group, assigning a rule and filtering by that Group works;
   - search/status/source/type/category/group filters can be combined without changing runtime order;
   - long localized rule strings wrap without pushing the checkbox/action column out of alignment;
   - checkbox spacing and text-button sizing remain usable with localized labels;
   - individual Quick Actions can be enabled independently; Edit and Enable/Disable remain compact;
   - drag/display ordering remains a presentation operation only.
4. **Imports / managed updates**
   - Official / Community / Custom remain visibly separate trust channels;
   - Standard / Advanced and behavior categories are understandable and not visually noisy;
   - package rows expand/collapse correctly;
   - All / None / Invert / Reset selection controls behave predictably;
   - Official update state and Update All remain usable;
   - a locally modified managed rule is preserved as a conflict instead of being overwritten during reconciliation;
   - a failed storage write must not leave visibly half-applied managed import state.
5. **Private-window browser policy**
   - with Firefox private access explicitly **allowed** for Request Control, verify expected rule behavior in a real private window, including a private-only rule and a normal-window-only rule;
   - with Firefox private access explicitly **denied**, verify that Request Control does not unexpectedly act in the private window and that normal-window behavior remains intact;
   - restore the intended private-access setting after the test.
6. **Restricted / CSP-heavy browser pages**
   - smoke-test representative pages where Firefox denies extension page-script/navigation operations (for example a browser-protected page) and at least one ordinary CSP-heavy site;
   - failed operations must not leave a fake pending navigation target, stale Inspector state or broken extension UI;
   - returning to an ordinary page must restore normal operation without restarting the extension.

### Firefox Android hands-on gate

Use a real Firefox Android installation and a large real-world package. A pass requires:

1. popup controls fit the viewport and remain tappable;
2. Referer mode, exact-host exception and current-site recovery controls are usable by touch;
3. Inspector navigation, start/reload, request list, details and stop remain usable without desktop-only hover assumptions;
4. a large package can be expanded/collapsed without freezing or runaway layout growth;
5. sparse rule selection and repeated taps do not trigger visible full-list resynchronization or lost selections;
6. update reconciliation preserves the selected UUID set and does not silently enable newly published rules;
7. long localized strings wrap without overlapping checkboxes/buttons;
8. scrolling does not trigger accidental selection/action activation;
9. the selected-rule action sheet has a clear close/back path and returns focus/state predictably;
10. repeated Inspector and package-selection use does not accumulate stale state after navigating away and back.

### Reporting a hands-on result

Record each platform as `PASS` or `FAIL`. For a failure, include:

- candidate/tag and, if available, artifact SHA-256;
- browser and exact version;
- OS/platform/device;
- shortest reproducible path;
- expected result;
- actual result;
- screenshot for layout/visual failures when useful.

For the two desktop-only Browser Extension Assurance smokes, record private-access **allowed** and **denied** separately and record the restricted/CSP page used. Do not mark any ROADMAP physical gate complete until the corresponding real-browser result has actually been reported.

Stable `1.20.0` promotion remains a separate explicit approval after both physical-browser gates pass. The changelog must remain `1.20.0 - Unreleased` until that approval.
