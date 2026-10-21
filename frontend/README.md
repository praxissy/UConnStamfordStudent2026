# Praxissy Student Portfolio — Frontend

The merged prototype. Brandon's **Student Portfolio Search Feature** and Elsa's
**Student Dashboard Portfolio Interface** are now one Vite + React app, styled
from the search feature's palette.

All data is mock data. Nothing talks to the database yet.

## Running it

```sh
npm install
npm run dev        # http://localhost:5173
```

Other scripts: `npm run typecheck`, `npm run build`, `npm run preview`.

## Routes

| Route | What it is |
|---|---|
| `/` | Public search — labs, students, projects, with the business-login gate |
| `/item/:slug` | Public detail page for any item |
| `/dashboard` | A student's work items, with status and stats |
| `/dashboard/new` | Submit a new work item |
| `/dashboard/:id/edit` | Edit a work item and work through reviewer comments |
| `/preview` | How the student's accepted work looks to the public |

Students and projects on `/` are locked until you press **Business Login** —
the modal accepts anything, it's a prototype flag.

## Structure — atomic design

```
src/
  components/
    atoms/        Button, TextInput, Select, Textarea, Pill, InitialsAvatar,
                  CardAction, StatusBadge, StatusIcon, FieldLabel, icons
    molecules/    WorkCard, WorkItemCard, CommentCard, FormCard, SearchBar,
                  FilterRow, DomainSwitcher, SearchModeToggle, SkillPicker,
                  ImageDropzone, EmptyState
    organisms/    SiteHeader, Sidebar, TopBar, SearchHero, ResultsSection,
                  WorkDetail, SubmitForm, ReviewSidebar, LoginModal,
                  GatePrompt, WorkItemDetailsModal
    templates/    PublicLayout, DashboardLayout   (layout only, take children)
  pages/          one per route; these own the data and state
  state/          PortfolioContext — work items and the login flag
  data/           mock data
  lib/            publicWork adapters, date parsing
  types.ts
  index.css       the design tokens
```

## Colour

Every colour lives in the `@theme` block in `src/index.css` and is used as a
utility — `bg-navy`, `text-gold`, `border-line`, `text-ink-faint`. There are no
hex literals anywhere else in `src/`, which is deliberate: both original exports
hardcoded their colours inline, and that is exactly how they drifted into two
different-looking apps. Changing the brand should be a one-line edit.

| Token | Value | |
|---|---|---|
| `navy` / `navy-mid` | `#0d1e3b` / `#112240` | headers, buttons, sidebar |
| `gold` / `gold-dark` / `gold-deep` | `#c9972d` / `#b8882a` / `#9b6f18` | accents, primary CTA |
| `surface` / `surface-muted` / `surface-soft` | `#f4f5f7` / `#f0f2f5` / `#f8f9fb` | backgrounds |
| `line` / `line-strong` / `line-input` | `#e2e6ec` / `#d8dde5` / `#d1d5db` | borders |
| `ink` → `ink-ghost` | `#0d1e3b` → `#9ca3af` | text, darkest to lightest |

Status colours (amber / red / emerald / slate) stay semantic rather than brand
colours — they tell a student whether work was accepted or declined, so they
should not look decorative.

## One shared public view

`WorkCard` and `WorkDetail` are the only components that render work to the
public. Labs, students, research projects, and a student's own accepted work
items all convert into a single `PublicWork` shape (`src/lib/publicWork.ts`)
and render through them.

That means `/preview` shows a student the *real* public component, not a
lookalike that can drift out of sync.

## Known gaps

- **Search filters are presentational.** The university and type/program
  dropdowns in the hero do not filter results yet. The free-text box does.
- **AI search is a mock.** It runs the same text filter as standard search.
- **Image upload does nothing.** The dropzone is UI only.
- **`public_slug` is capped at 20 characters** to match
  `db/02_portfolio_work_items.sql`. Real titles get cut:
  `Biomedical Engineering Lab` becomes `biomedical-engineeri`. No collisions in
  the current mock data, but this is worth raising with Drew.
- **Sidebar nav items other than Portfolio are inert.**

## Next step

Align these types with the database in `db/`. `src/types.ts` still carries two
vocabularies — the search side (`Lab`, `Student`, `ResearchProject`) and the
dashboard side (`WorkItem`) — because they came from two Figma files.
`PublicWork` is the first step toward one shape; the real target is
`portfolio_work_items` and its children.

`WorkItemStatus` already maps onto the `portfolio_work_item_status` enum:
`Draft → draft`, `Under Review → pending_review`, `Approved → accepted`,
`Changes Requested → declined`.
