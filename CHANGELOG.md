# Changelog

## Bugs fixed

- **"New Resume" button silently failing / "Invalid email" error** — root cause: the resume content schema required `personalInfo.email` to be a valid email string (`z.string().email()`). Creating a new resume sends an *empty* content object (`emptyResumeContent`), where `email: ''`. An empty string fails `.email()` validation, so the API rejected the creation request with a 400 and the button appeared to do nothing. Fixed by allowing an empty string at creation time and only validating format once a real value is entered (`z.union([z.literal(''), z.string().email()])`).
- **Overly strict entry validation** — `experience` and `education` entry fields (`company`, `role`, `school`, `degree`, `startDate`) were required strings with no default, which could reject a save if a new entry was added but not fully filled in before autosave fired. Given defaults so partial entries don't block saving.
- **Missing duplicate-resume feature** — referenced in the test checklist but not implemented. Added `POST /api/v1/resumes/:id/duplicate` (service, controller, route) and a "Duplicate" action on each dashboard card.
- **@types/express version mismatch** — `@types/express` was pinned to `^5.0.0` while the actual installed `express` is v4, causing `req.params` to type as `string | string[] | undefined` instead of `string` in several controllers. Pinned `@types/express` to `^4.17.21` to match.
- **TypeScript/Prisma dependency drift** — unpinned `^5.x`/`^6.x` ranges resolved to incompatible newer majors (TypeScript 7, Prisma 7) in a fresh install, breaking `moduleResolution`. Pinned exact compatible versions (`typescript@5.6.3`, `prisma@5.20.0`, `@prisma/client@5.20.0`).
- **Missing `@types/morgan`** — caused an implicit-`any` type error on the logger import.

## Design system overhaul

- Rebuilt the visual identity on a navy / indigo / emerald palette (background `#FAFAFC`, indigo `#3730A3` primary, emerald `#10B981` accent), replacing the previous editorial red-pen theme per your new direction.
- Added full **dark mode** — a `ThemeContext` toggles a `.dark` class on the root element, with all colors defined as CSS variables that swap automatically; persisted to `localStorage` and respects the OS preference on first load.
- Typography consolidated to Inter across the whole app.
- Rounded corners standardized to a 16px `--radius-card` token; all transitions set to 200ms.

## Dashboard rebuild

- Added a persistent sidebar (logo, nav, theme toggle, account card with logout).
- Added a search box that filters resumes by title client-side.
- Added stat cards (total resumes, updated this week, templates available).
- Added skeleton loaders for the initial data fetch, and a proper empty state (distinct copy for "no resumes yet" vs. "no search matches").
- Added hover-revealed Duplicate/Delete actions on each resume card.

## Resume editor rebuild

- Converted the flat form into **accordion sections**: Personal Info, Experience, Education, Projects, Certificates, Skills, Languages, Interests, References — each independently expandable, matching the full field set from your brief.
- Skills/Languages/Interests are now tag inputs (type + Enter) instead of comma-separated text fields.
- Added a **template switcher** with 3 distinct, original layouts:
  - **Modern** — clean sans-serif, single accent rule, ATS-friendly single column.
  - **Minimal** — maximum white space, understated single column.
  - **Executive** — serif headline with a dark structured sidebar.
- Added **zoom controls** (60%–130%) on the live preview.
- Replaced the manual "Save" button with **autosave**: edits debounce for 900ms, then save automatically, with a status indicator (Saving… / Saved / Save failed).
- PDF export unchanged in mechanism (browser print), now scoped to whichever template is active.

## Explicitly deferred (not built in this pass)

Being upfront rather than claiming a false "100% complete" state — these items from the brief were **not** built and would need a dedicated follow-up pass:

- Testimonials, pricing preview, and FAQ sections on the landing page.
- 7 additional templates (brief asked for 10; 3 were built to a real standard instead of 10 shallow ones).
- Undo/redo and keyboard shortcuts in the editor.
- Multi-page PDF pagination logic (current export is single continuous page via browser print).
- Button-ripple and other micro-interaction polish beyond hover/transition states.
- Live end-to-end runtime testing against a running database — this sandbox cannot reach Prisma's binary CDN, so testing here was limited to full TypeScript type-checking and production builds on both client and server. Runtime verification (register → login → CRUD → duplicate → export) should be done on your machine after `prisma generate` / `migrate`.
