# Portfolio — Dharani Dharan Arunkumar

A personal portfolio built as a live Angular application: the page shows its own
component code, a running signal graph, a git-log career history, and an
Angular-DevTools-style inspector that outlines the components that render it.

Angular 21 — standalone components, signals, zoneless change detection, OnPush
throughout. No UI, icon or animation libraries: just Angular, TypeScript, SCSS,
inline SVG and Google Fonts (Geist, Geist Mono).

## Run locally

Requires Node `^20.19`, `^22.12` or `>=24`.

```bash
npm install
npm start        # or: ng serve  → http://localhost:4200
```

## Build

```bash
npm run build    # or: ng build  → dist/portfolio/browser/
```

The build fetches the Google Fonts CSS once and inlines it into `index.html`, so it
needs network access.

## Before deploying

| What | Where |
| --- | --- |
| **Résumé** | Put your file at `public/resume.pdf`. Everything in `public/` is copied to the site root, so the `./resume.pdf` link resolves to it. |
| **Domain** | Search `src/index.html` for `TODO` — uncomment the canonical URL and `og:url` and fill in the domain. |
| **Open Graph image** | Add a 1200×630 image (e.g. `public/og-image.png`), then uncomment `og:image` / `twitter:image` in `src/index.html` and switch `twitter:card` to `summary_large_image`. |
| **Project repositories** | When a personal project goes public, set `repositoryUrl` for it in `src/app/data/projects.ts`. The "Source on GitHub" link then renders automatically. |

## Deploy

**Netlify** — connect the repository; `netlify.toml` already sets the build command and publish
directory.

**GitHub Pages** — for a project site served from `https://<user>.github.io/<repo>/`, build with
the repository name as the base path and publish `dist/portfolio/browser`:

```bash
npx ng build --base-href /<repo>/
```

For a user site (`https://<user>.github.io/`), the default build works as is.

## Editing content

All content lives in typed data files — templates contain no portfolio copy. The hero's code
sample, the signal graph, the skill references and the YAML facts are all *generated* from these
files, so they can't drift out of date.

```
src/app/data/
├── profile.ts        name, headline, statement, about, credentials, contact (+ terminal commands)
├── experience.ts     employers, roles (most recent first), responsibilities, education
├── projects.ts       projects; the `featured` one gets the case study, `demo` picks each demo
├── skills.ts         skill groups (+ aliases used by "Find All References"), marquee items
├── recognition.ts    certifications, total count, awards
├── signal-graph.ts   nodes and wires of the hero's signal graph
└── navigation.ts     page sections, in document order
```

Dates are `'YYYY-MM'` strings; the site formats them ("Nov 2025") and computes tenures. Omit
`end` for a current role.

## What's on the page

| Feature | Where |
| --- | --- |
| IDE hero: generated, syntax-highlighted component code + live signal graph | `components/hero/` |
| Pinned career sequence rendered as `git log` releases v1.0.0 → v4.0.0 | `components/experience/` |
| Analance case study: architecture schematic + telecom data pipeline | `components/projects/` |
| Illustrative demos: RRF retrieval, probe monitor, agent lifecycle | `components/projects/demos/` |
| Skills as "Find All References" across the work on the page | `components/skills/` |
| Certifications as test output, awards as badges, contact as a terminal | `recognition/`, `contact/` |
| Command palette (⌘K / Ctrl K), status bar, component inspector | `command-palette/`, `status-bar/`, `inspector/` |

## Accessibility and motion

- Every self-running animation can be paused site-wide (status bar, footer, mobile menu or the
  command palette) — WCAG 2.2.2. It starts paused when the OS asks for reduced motion.
- Under `prefers-reduced-motion`, entrance and scroll-linked effects are off and the pinned
  career sequence becomes a static list.
- Decorative visuals (graph, demos' animations, marquee) are hidden from assistive technology;
  the information they illustrate is in the page text.
- Printing produces a plain résumé: no chrome, no demos, light colours.

## Structure

```
src/
├── index.html                 metadata, fonts, pre-paint theme + motion script
├── styles.scss                imports the partials below
├── styles/                    tokens, base, layout, components, effects, motion, print
└── app/
    ├── app.component.*        page shell and global overlays
    ├── components/            one folder per section, plus the global UI
    ├── data/                  all content (see above)
    ├── models/                interfaces for the data
    ├── services/              theme, motion, scroll-spy, command palette, inspector, toast
    └── shared/                icon, window chrome, section header, period/tenure,
                               highlighter, reveal / scroll-progress / pointer directives
```
