# Site Performance & Accessibility — Status for Leadership

**Date:** 2026-08-29 · **Prepared from:** `docs/bundle-comparison-2026-08-29.md`,
`docs/lighthouse-comparison-2026-08-29.md`, `docs/fix-plan-2026-08-29.md` — every number below
was independently re-checked against the live codebase and production build today, not just
copied from those reports.

**Note on scope:** three earlier working docs (`implementation-plan.md`, `performance-audit.md`,
`feature-folder-structure.md`) were removed from the repo before this summary was requested —
not by this session. Their content is recoverable from git history if needed; this summary is
built entirely from the three docs still on disk, which cover this session's actual shipped work.

---

## Bottom line

This work made the site meaningfully faster on mobile and removed a chunk of dead weight from
the codebase. **One metric — layout stability — is currently showing a false "fixed" reading
that needs a real fix before we can trust it.** Everything else moved in the right direction or
stayed flat; nothing regressed.

---

## What shipped, in business terms

| Change | What it means |
|---|---|
| Mobile page-speed score: **45 → 70** (out of 100, Google's own tool) | Faster mobile load — matters directly for bounce rate and Google's mobile-ranking signal |
| Team page: **122 KB → 9.3 KB** of code sent to every visitor's browser | A 93% cut on one of our heaviest pages |
| Removed one entire outdated library, replaced with a lighter one | Net ~80 KB lighter across every page that has a carousel, plus one less dependency to maintain |
| Removed a second unused icon library entirely | Less code shipped, one less dependency |
| Event sub-pages now only load their own code, not all 5 pages' code bundled together | Visitors to one event page no longer download the other four |
| No regressions found anywhere we measured | Every score that moved, moved the right direction or held flat |

---

## The one thing to flag before calling this done

Google's tooling shows our **layout stability score** (a measure of whether page content jumps
around while loading — one of the 3 metrics Google uses to rank mobile search results) went
from failing to passing. **We checked, and the actual bug causing it was never fixed.** The
tool happened to not catch it on this particular test run, purely due to timing — the bug is
still live in the code today and could show up again on the next measurement, or for a real
visitor.

**The fix is a single line of code**, already identified (a logo image on every page is missing
its height, so it doesn't reserve space before loading). Low risk, no visual change, ready to
ship. We're flagging it rather than quietly letting the score stand, because this is a metric
Google independently re-checks using real visitor data over time — it needs to be actually
fixed, not just pass one test.

---

## Phased plan — every open issue, the fix, and what we get for fixing it

### Phase 1 — Ship now (low risk, ready today, roughly half a day combined)

**1. Layout stability bug (the flagged item above)**
- **Issue:** A logo image in the site footer has no reserved height, so the footer visibly
  jumps when it loads. Present on every single page.
- **Fix:** One line of code — give the image its correct height. No visual change, nothing
  else touches this.
- **Gain if fixed:** Removes the risk called out above — locks in a real pass on a metric
  Google uses for mobile search ranking, instead of a score we currently can't trust. Also
  removes a small but real annoyance for every visitor (page content jumping under their
  cursor/thumb while it loads).

**2. Missing labels for screen-reader users**
- **Issue:** A dropdown control and a "back to top" button have no accessible label — a
  screen-reader user hears "button" with no indication of what it does.
- **Fix:** Add one line of descriptive text to each of the 2 elements (not visible to sighted
  users, read aloud by assistive tech only).
- **Gain if fixed:** Closes a real accessibility gap for visually-impaired visitors, and
  removes 2 failing checks from our compliance-adjacent scoring in the same tool Google uses.

**3. Heading structure**
- **Issue:** Several sections use a heading tag for what's actually body text, which skips
  levels in the page's content hierarchy — this affects how screen readers announce page
  structure and how search engines parse it.
- **Fix:** Swap the tag on 9 text blocks across the home page to the correct one; requires a
  visual check afterward to confirm nothing shifted (styling stays identical, only the
  underlying tag changes).
- **Gain if fixed:** Improves how both assistive technology and search engines understand the
  page's structure — a real accessibility and SEO improvement, not just a score.

**Phase 1 total gain:** closes every currently-known issue in Accessibility and locks in the
Performance gain from this round of work, for roughly half a day of engineering time.

### Phase 2 — Investigate before committing (research task, not a known fix yet)

**4. The ~600 KB unattributed code**
- **Issue:** A large chunk of code — roughly 600 KB — ships to every page on the site, and we
  haven't yet broken down what's actually inside it. Some of it is almost certainly waste
  (unused code from libraries we only partially use), but we don't know how much yet.
- **Fix:** Not defined yet — this phase *is* the work of finding out. An engineer reads the
  build tool's breakdown report, identifies what's actually inside this code, and comes back
  with a scoped fix (or a "not worth it" call) based on real numbers.
- **Gain if fixed:** Unknown until investigated, but potentially the single largest remaining
  speed win on the list — bigger than everything shipped in this round, if the investigation
  finds a meaningful chunk of it is genuinely removable. Budget this as a discovery task with
  its own follow-up, not a fix to schedule directly yet.

### Phase 3 — Deliberately scheduled later, each blocked on a real decision

**5. Stronger security policy (Content-Security-Policy header)**
- **Issue:** The site is missing one layer of browser-level protection against a class of
  attack (malicious scripts getting injected into the page). Everything else in this category
  is already shipped; this is the one piece left.
- **Why it's not done yet:** Configuring it wrong silently breaks other things with **no
  visible error** — analytics stops recording, the contact form's spam protection stops
  working — and nobody notices until someone asks "why did our analytics drop to zero." It
  needs a small config decision made deliberately first (how we reference our backend address
  in a way that works across every environment we deploy to), not a blind copy-paste.
- **Gain once fixed:** Closes our last open browser-security gap; safe to ship once the config
  question is answered, in a monitoring-only mode first before it's fully turned on.

**6. Production debugging maps (source maps)**
- **Issue:** We don't currently ship the technical files that would let us debug a production
  error back to the original source code.
- **Why it's not done yet:** We don't have an error-tracking tool set up yet to use them —
  shipping them now would only expose extra technical detail to the public for zero benefit.
- **Gain once fixed:** Real only once we add an error-tracking tool (e.g. Sentry) — bundle
  this with that decision, not before.

---

## Recommendation

**Ship Phase 1 now** — one quick follow-up, low risk, high confidence, closes every currently
known gap. **Kick off Phase 2 as its own short discovery task** — it's the one item big enough
to matter and not yet understood well enough to act on; the outcome of that investigation
should inform how urgently we prioritize it. **Phase 3 stays parked** until each item's
specific blocking decision gets made — none of it is being neglected, each is waiting on a
real answer rather than engineering time.

---

*Full technical detail, file-level references, and a line-by-line verification log are in
`docs/fix-plan-2026-08-29.md`.*
