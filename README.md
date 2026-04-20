# Blackbox Calendar

A shared calendar and task system for working teams. Every event. Every checklist. Every person. One screen.

Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and the shadcn design-token conventions. Ships with a cinematic GSAP-powered landing page and a fully functional week-view workspace that persists to localStorage out of the box.

## Quick start

```bash
cd blackbox-calendar
npm install
npm run dev
```

Open http://localhost:3000. The landing page lives at `/`. The workspace lives at `/workspace`.

## What's inside

- **Landing page** at `/` with the cinematic hero, feature grid, how-it-works section, and the scroll-reveal footer from the prompt you provided.
- **Workspace** at `/workspace`:
  - Week calendar with drag-time-to-create, now-line, overlap layout, and color-coded events.
  - Team sidebar: add teammates, assign colors, filter the calendar by one or many teammates.
  - Task panel on the right: Today, Next 7 days, and Overdue sections. Check items off inline without opening the event.
  - Event modal: title, date, start/end time, location, status, assignees (multi), checklist, notes. Delete in place.
  - Keyboard-friendly search that matches titles, notes, locations, and checklist items.
- **Local-first storage**: your data saves to `localStorage` in the browser. Zero backend required.

## Project structure

```
app/
  layout.tsx                 Root layout, fonts, metadata
  globals.css                Tailwind + shadcn CSS vars + Blackbox theme helpers
  page.tsx                   Landing page (hero + features + cinematic footer)
  workspace/
    page.tsx                 Main calendar workspace (state owner)

components/
  ui/
    button.tsx               shadcn-style button
    input.tsx                shadcn-style input
    modal.tsx                Lightweight dialog (escape + backdrop close, scroll-lock)
    motion-footer.tsx        Cinematic GSAP footer, adapted for Blackbox
  workspace/
    top-bar.tsx              Nav, week range, today/prev/next, search, new event
    team-sidebar.tsx         Team list, filter, add/edit teammates
    week-calendar.tsx        7-day grid, now-line, event blocks with overlap layout
    event-modal.tsx          Create / edit / delete event + checklist
    member-modal.tsx         Create / edit / remove teammate
    task-panel.tsx           Today + upcoming + overdue checklist view

lib/
  utils.ts                   cn(), uid()
  types.ts                   Member, CalendarEvent, ChecklistItem, AppState
  date.ts                    Week/day math, time formatting
  storage.ts                 localStorage load/save/clear
  seed.ts                    First-run default workspace
```

## Theming

Theme tokens live in `app/globals.css` under `:root`. It ships in dark mode by default to match the cinematic landing page. Colors map to standard shadcn variables so you can wire in the full shadcn component library (`npx shadcn@latest add ...`) without any remapping.

Primary accent is violet (`--primary: 262 83% 68%`). Secondary is blue (`--secondary: 217 91% 60%`). Change those two lines to re-skin the entire app.

## Deploying

The project is a standard Next.js app. Easiest deploy is Vercel:

1. `git init && git add . && git commit -m "blackbox calendar"`
2. `gh repo create blackbox-calendar --private --source=. --push` (or push to an existing repo)
3. Import the repo on https://vercel.com. Defaults work, no env vars required.

Or any Node host: `npm run build && npm run start`.

## Next steps worth doing

- **Backend sync**: swap `lib/storage.ts` for a server-backed persistence layer (Supabase, Neon, Convex). The rest of the app already treats `state` as the single source of truth, so this is a localized change.
- **Auth**: once real users, Clerk or NextAuth drops in over the layout.
- **Month / day view**: `WeekCalendar` is isolated. A `MonthCalendar` or `DayCalendar` can be dropped in next to it and the top bar can switch between them.
- **Recurring events**: extend `CalendarEvent` with an `rrule` field and expand on read.
- **Drag to reschedule**: the event block's `top`/`left` is already calculated, so drag-and-drop is a matter of wiring `onMouseDown` + `onMouseMove` to update `date` and `startTime`.

## License

All yours, Carson. Ship it.
