# Portfolio Platform Design Spec

**Date:** 2026-04-23
**Owner:** Athulraj Palayi
**Status:** Draft for review

## Goal

Build a premium, futuristic, production-ready portfolio platform that combines:

- a cinematic public-facing portfolio experience
- dedicated case-study pages for featured work
- a high-security internal admin control plane

The final product should present Athulraj Palayi as an IT operations and systems modernization lead with a cyber-AI edge and ethical-hacker credibility, while remaining readable, performant, maintainable, and enterprise-grade.

## Product Positioning

The public experience should communicate:

- trust
- precision
- technical depth
- premium execution
- enterprise-tech sophistication
- practical systems thinking
- modern AI-aware product taste

The visual language should not feel like:

- a freelancer template
- a gaming site
- a cyberpunk poster
- a generic agency clone
- a plain resume page with effects added afterward

## Scope

### In Scope

- one `Next.js` App Router application with TypeScript
- one premium public landing page with anchored sections
- three dedicated case-study pages
- one secured `/admin` control plane
- PostgreSQL-backed content and admin data
- email/password authentication with mandatory TOTP 2FA for admin access
- reusable design system and motion primitives
- responsive design for desktop and mobile
- accessible interactions and reduced-motion support
- documentation of design, progress, plan, and verification

### Out of Scope for V1

- multi-tenant support
- public blog or article engine
- multilingual support
- advanced analytics dashboarding beyond operational overview cards
- external S3 storage requirement on day one
- portrait/photo integration as a launch dependency

## Technical Stack

- `Next.js` App Router
- `TypeScript`
- `PostgreSQL`
- `Prisma`
- `Tailwind CSS`
- `Framer Motion`
- secure session/auth layer with credentials + TOTP 2FA
- route handlers and/or server actions for admin operations

## Architecture Overview

The platform will be a single integrated app with two primary surfaces:

1. **Marketing surface**
   - fast, premium public portfolio experience
   - landing page with anchored sections
   - dedicated case-study pages
   - mostly static rendering where possible

2. **Admin surface**
   - secured operations console under `/admin`
   - content management, project management, systems diagram management, media handling, inbox handling, and user/security controls
   - dynamic, authenticated, audited workflows

This single-app approach keeps deployment simple, enforces a unified design system, and avoids duplicating auth, data access, and component logic across multiple repositories.

## Public Experience

### Page Structure

1. Sticky Navbar
2. Hero
3. Core Capabilities
4. Featured Projects
5. Systems and Integrations
6. Apps Built
7. Contact
8. Footer

### Navbar

- glassmorphism surface with thin lower border
- sticky behavior
- subtle load-in animation
- stronger blur and density on scroll
- links: About, Projects, Systems, Apps, Contact
- CTA: Download Resume

### Hero

The hero is the signature visual moment and should feel like a secure systems command environment with AI-era polish.

Content:

- headline: Athulraj Palayi
- positioning line emphasizing systems modernization, QA mindset, ERP integrations, automation
- concise two-line intro about internal enterprise apps, integrations, reporting systems, workflow automation, and technical reliability
- CTA buttons for projects and contact
- highlight chips for credentials and location
- scroll indicator

Visual direction:

- dark luxury base
- layered glass panels
- secure systems / AI operations art direction
- subtle grids, particles, orbit traces, signal layers, and architecture fragments
- enterprise-tech mood, not hacker-terminal cosplay

### Core Capabilities

Capability cards:

- ERP Integrations
- Automation and Reporting
- Mobile App QA + UX Review
- Cloud Deployments
- Security (Authorized Assessments)
- AI Production Pipelines

Each card should feel like a premium technical module with elegant layering, iconography, restrained glow, and strong hover behavior.

### Featured Projects

Three large project cards:

1. Founder Story Film - AI Brand Documentary (5 min)
2. ERP + Sales Workflow Upgrade
3. FirstBit -> Zoho Invoice Sync

Each card includes:

- title
- concise summary
- tags
- metrics
- featured treatment
- CTA to dedicated case-study page

These cards should read as case-study entries, not thumbnail tiles.

### Systems and Integrations

This section is a major visual anchor and should present a refined architecture flow such as:

`FirstBit ERP -> Middleware -> Zoho Creator -> Zoho Books -> PostgreSQL -> Power BI`

The section should use glass nodes, subtle animated lines, active pulse styling, and concise captions to reinforce systems thinking and enterprise integration depth.

### Apps Built

Compact premium product cards for:

- Video Calling App (WebRTC)
- Water Reminder App
- PDF Tools App
- Color Mixing App

### Contact

The closing section should feel trustworthy and premium, with:

- direct action buttons for email, WhatsApp, LinkedIn
- modern form with name, email, message, submit
- strong input focus states
- refined glass styling and soft motion

### Footer

Minimal, polished, and calm, including:

- name
- copyright
- social links
- closing line about precision, systems thinking, and modern automation

## Case-Study Pages

Each featured project gets its own page with:

- case-study hero
- problem statement
- system/workflow context
- solution architecture
- implementation details
- tools and stack
- metrics / outcomes
- optional diagram, gallery, or timeline
- next project CTA

Case studies should preserve the premium product-site feel while shifting from marketing storytelling into more technical explanatory depth.

## Admin Surface

### Information Architecture

- Dashboard
- Content
- Projects
- Systems
- Apps
- Inbox
- Media
- Users and Roles
- Audit and Security
- Settings

### Admin Design Language

The admin should feel like an internal operations console that shares the public brand DNA but is calmer and more disciplined:

- same dark palette
- reduced glow intensity
- stronger data hierarchy
- clearer state treatments
- better density control
- strong focus on legibility and trust

### Admin Functional Scope

The admin panel must support:

- editing site content and section order
- editing projects and case-study content
- managing app entries
- editing systems diagram nodes and edges
- reviewing and updating contact submissions
- uploading resume and media assets
- managing admin users, roles, 2FA state, and security settings

## Design System

### Typography

Font family: `Inter`

Desktop:

- headline: `56/64`, `700`
- subhead: `20/30`
- body: `16/26`
- label: `12/16`, uppercase, tracking `+6`

Mobile:

- headline: `36/44`, `700`
- subhead: `16/26`
- body: `16/26`
- label: `12/16`, uppercase, tracking `+6`

### Color Tokens

- background: `#070A12`
- surface: `rgba(255,255,255,0.06)`
- border: `rgba(255,255,255,0.10)`
- text primary: `#F2F6FF`
- text secondary: `rgba(242,246,255,0.72)`
- accent teal: `#28F0D3`
- accent blue: `#3B82F6`
- accent violet: `#8B5CF6`

### Gradient Tokens

- teal -> blue
- blue -> violet
- teal radial glow for ambient emphasis

### Layout Tokens

- desktop 12-column grid
- 80px page margins
- 24px gutters
- 8px base spacing system
- 96px desktop section spacing
- 64px mobile section spacing
- button height 48px

### Effect Tokens

- glass blur between 14px and 20px
- layered transparency
- ambient radial glow
- subtle background grid
- low-opacity shadows
- hover-only teal or blue glow accents

## Component Architecture

### Primitives

- `Button`
- `GlassCard`
- `Badge`
- `SectionHeader`
- `Input`
- `Textarea`

### Marketing Components

- `Navbar`
- `Hero`
- `CapabilityCard`
- `ProjectCard`
- `ArchitectureNode`
- `SignalLine`
- `AppCard`
- `ContactActionButton`
- `Footer`

### Case-Study Components

- `CaseStudyHero`
- `CaseStudyMetrics`
- `CaseStudyTimeline`
- `CaseStudySection`

### Admin Components

- `AdminShell`
- `DataTable`
- `EditorPanel`
- `AuditLogList`
- `SettingsPanel`

### Motion Components

- `Reveal`
- `MagneticButton`
- `ParallaxLayer`
- `SignalLine`

## Folder Structure

```text
portfolio-26/
  app/
    (marketing)/
      layout.tsx
      page.tsx
      projects/
        [slug]/
          page.tsx
    admin/
      login/
        page.tsx
      verify-2fa/
        page.tsx
      dashboard/
        page.tsx
      content/
        page.tsx
      projects/
        page.tsx
      systems/
        page.tsx
      apps/
        page.tsx
      inbox/
        page.tsx
      media/
        page.tsx
      settings/
        page.tsx
    api/
      auth/
      contact/
      uploads/
      admin/
  components/
    primitives/
    marketing/
    case-studies/
    admin/
    motion/
  lib/
    db/
    auth/
    content/
    security/
    validation/
  prisma/
    schema.prisma
  styles/
    tokens.css
  public/
    media/
    icons/
```

## Motion Strategy

Motion is a first-class experience layer, but it must remain restrained and premium.

Required patterns:

- section reveal with fade + slight upward motion
- navbar transition on load and scroll
- hero background parallax and floating micro-elements
- magnetic CTA behavior
- staggered chip reveal
- project card layered hover response
- architecture line pulses and node emphasis
- scroll indicator loop motion

Rules:

- no noisy, continuous motion that competes with reading
- mobile motion simplified and lighter
- reduced-motion mode falls back to opacity and short positional transitions
- architecture animation should imply signal flow, not visual chaos

## Responsive Strategy

Desktop target:

- optimized for wide-screen premium landing view around `1440px`

Mobile target:

- optimized around `390px`

Rules:

- re-stack, do not shrink
- simplify architecture diagram into a guided vertical flow on small screens
- preserve tap target sizes
- preserve premium spacing and type hierarchy
- reduce hover-dependent interactions on touch devices

## Data Model

Initial entities:

- `AdminUser`
- `AdminRole`
- `Session`
- `TwoFactorSecret`
- `AuditLog`
- `SiteSetting`
- `LandingSection`
- `Project`
- `ProjectMetric`
- `ProjectTag`
- `ProjectBlock`
- `AppItem`
- `SystemNode`
- `SystemEdge`
- `MediaAsset`
- `ContactSubmission`

Goals of the model:

- avoid hardcoded content lock-in
- support long-term extension
- support admin-driven ordering and visibility
- keep public rendering clean and query-efficient

## Security Model

- password hashing with a strong one-way algorithm
- mandatory TOTP 2FA for admin access
- role-based access control
- secure server-side authorization checks on every admin route and mutation
- audit logging for logins, content changes, uploads, deletes, and permission changes
- rate limiting on login, 2FA verification, uploads, and contact submissions
- upload restrictions by MIME type, extension, and size
- secure cookies and session rotation
- strict input validation with shared schemas
- environment-driven secret management

The admin experience should make risky actions explicit and should expose clear state changes around auth, lockouts, verification, and destructive operations.

## Performance and Accessibility

### Performance

- static-first public rendering where practical
- careful animation budgeting
- layered visuals built with performant CSS and selective motion primitives
- media optimization
- code-split admin where sensible
- avoid client-heavy logic in static marketing sections unless necessary for experience quality

### Accessibility

- semantic landmarks
- keyboard-navigable controls
- strong visible focus states
- accessible contrast
- form labeling and validation clarity
- reduced-motion support
- no motion that obscures content comprehension

## Deployment

The app should deploy cleanly to a VPS as a single service with:

- one `Next.js` application
- one `PostgreSQL` database
- environment-driven secrets
- file storage abstraction with local storage first
- ability to front with nginx or caddy later

The architecture should avoid choices that make future migration to object storage, external email providers, or more advanced monitoring difficult.

## Testing and Quality Gates

- linting
- TypeScript typechecking
- production build validation
- unit tests for validation, auth helpers, and data mappers
- integration tests for admin auth, protected routes, content editing, uploads, and contact flow
- component tests for key reusable UI pieces
- accessibility and reduced-motion verification on the public experience

## Documentation Requirements

The project must continuously document progress and planning, not just implementation outcomes.

Documentation deliverables:

- this design spec
- a dedicated implementation plan after spec approval
- a running progress log updated at each major phase
- verification notes at the end of build/check cycles

For every major build phase, document:

- what changed
- what remains
- what was verified
- any tradeoffs or deviations

## Implementation Order

1. scaffold app architecture
2. define tokens and theme foundation
3. build reusable primitives
4. build marketing sections
5. build case-study pages
6. build admin auth and shell
7. build admin content/data modules
8. add advanced motion and polish
9. refine responsive behavior
10. run checks, fix issues, document results

## Decisions Confirmed During Brainstorming

- use `Next.js` App Router with TypeScript
- build a flagship landing page plus dedicated case-study pages
- position Athulraj as an IT operations and systems modernization lead with a cyber-AI edge and ethical-hacker credibility
- allow personal photo integration later without making it a launch dependency
- require a fully controllable admin panel
- start with admin management for content, projects, apps, systems, inbox, media, and users/roles
- use email/password with 2FA for admin auth
- use PostgreSQL from day one
- document progress and planning continuously

## Open Follow-On Items for Planning

- exact package selection for auth/session management
- exact storage abstraction for uploads on local VPS
- exact test tooling choices
- seeding strategy for initial content
- whether audit views ship in the first implementation slice or second

These are implementation-plan decisions, not unresolved product-scope gaps.
