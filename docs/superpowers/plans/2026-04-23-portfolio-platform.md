# Portfolio Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a premium portfolio platform with a cinematic marketing site, dedicated case-study pages, and a PostgreSQL-ready secure admin control plane.

**Architecture:** Use a single `Next.js` App Router application with a shared design system, Prisma-backed data model, public marketing routes, and a protected admin surface. The public site should render from structured content and fall back safely when the database is not configured so the app remains buildable during setup.

**Tech Stack:** Next.js, TypeScript, React, Tailwind CSS, Framer Motion, Prisma, PostgreSQL, Vitest, Testing Library, Zod, TOTP-based 2FA utilities

---

### Task 1: Scaffold the Application Foundation

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.mjs`
- Create: `postcss.config.mjs`
- Create: `eslint.config.mjs`
- Create: `vitest.config.mts`
- Create: `vitest.setup.ts`
- Create: `next-env.d.ts`
- Create: `app/layout.tsx`
- Create: `app/globals.css`
- Create: `app/page.tsx`

- [ ] **Step 1: Write the failing smoke tests**

```tsx
import { render, screen } from "@testing-library/react";
import { HomePageView } from "@/components/marketing/home-page-view";

test("renders the primary hero identity", () => {
  render(<HomePageView content={marketingContent} />);
  expect(screen.getByRole("heading", { name: /athulraj palayi/i })).toBeInTheDocument();
});

test("renders the admin entry affordance only in admin routes", () => {
  render(<HomePageView content={marketingContent} />);
  expect(screen.queryByText(/admin dashboard/i)).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm.cmd test -- --runInBand`
Expected: FAIL because project files and test runner do not exist yet

- [ ] **Step 3: Write the minimal project scaffold**

```json
{
  "name": "portfolio-26",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run"
  }
}
```

```tsx
export default function Page() {
  return <main>Loading portfolio...</main>;
}
```

- [ ] **Step 4: Run tests and verify the runner now executes**

Run: `npm.cmd test`
Expected: FAIL on missing component/content imports rather than missing tooling

- [ ] **Step 5: Document progress**

Update: `docs/superpowers/progress/2026-04-23-portfolio-platform-progress.md`

### Task 2: Build the Token System and Core Primitives

**Files:**
- Create: `styles/tokens.css`
- Create: `lib/utils/cn.ts`
- Create: `components/primitives/button.tsx`
- Create: `components/primitives/glass-card.tsx`
- Create: `components/primitives/badge.tsx`
- Create: `components/primitives/section-header.tsx`
- Create: `components/primitives/input.tsx`
- Create: `components/primitives/textarea.tsx`
- Test: `tests/primitives/primitives.test.tsx`

- [ ] **Step 1: Write the failing primitive tests**

```tsx
test("button exposes accessible variants", () => {
  render(<Button variant="primary">View Projects</Button>);
  expect(screen.getByRole("button", { name: /view projects/i })).toHaveClass("group");
});

test("glass card renders a named region", () => {
  render(<GlassCard as="section" aria-label="Capability Card">Content</GlassCard>);
  expect(screen.getByRole("region", { name: /capability card/i })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm.cmd test -- tests/primitives/primitives.test.tsx`
Expected: FAIL because primitives do not exist

- [ ] **Step 3: Implement tokens and primitives**

```css
:root {
  --bg-base: #070a12;
  --text-primary: #f2f6ff;
  --accent-teal: #28f0d3;
}
```

```tsx
export function Button({ variant = "primary", ...props }: ButtonProps) {
  return <button className={buttonVariants({ variant })} {...props} />;
}
```

- [ ] **Step 4: Run primitive tests**

Run: `npm.cmd test -- tests/primitives/primitives.test.tsx`
Expected: PASS

- [ ] **Step 5: Refactor for shared styling utilities**

Run: `npm.cmd test -- tests/primitives/primitives.test.tsx`
Expected: PASS after cleanup

### Task 3: Model the Content and Data Boundaries

**Files:**
- Create: `prisma/schema.prisma`
- Create: `lib/content/site-content.ts`
- Create: `lib/content/queries.ts`
- Create: `lib/content/mappers.ts`
- Create: `lib/db/prisma.ts`
- Test: `tests/content/site-content.test.ts`

- [ ] **Step 1: Write the failing content tests**

```ts
test("exposes three featured projects", () => {
  expect(marketingContent.featuredProjects).toHaveLength(3);
});

test("preserves the systems flow order", () => {
  expect(marketingContent.systemsFlow.map((node) => node.title)).toEqual([
    "FirstBit ERP",
    "Middleware",
    "Zoho Creator",
    "Zoho Books",
    "PostgreSQL",
    "Power BI",
  ]);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm.cmd test -- tests/content/site-content.test.ts`
Expected: FAIL because content layer does not exist

- [ ] **Step 3: Implement the Prisma schema and fallback content model**

```prisma
model Project {
  id        String   @id @default(cuid())
  slug      String   @unique
  title     String
  featured  Boolean  @default(false)
}
```

```ts
export const marketingContent = {
  featuredProjects: [...],
  systemsFlow: [...],
};
```

- [ ] **Step 4: Run content tests**

Run: `npm.cmd test -- tests/content/site-content.test.ts`
Expected: PASS

- [ ] **Step 5: Generate Prisma client**

Run: `npx.cmd prisma generate`
Expected: PASS without requiring a live database

### Task 4: Build the Public Marketing Experience

**Files:**
- Create: `components/marketing/home-page-view.tsx`
- Create: `components/marketing/navbar.tsx`
- Create: `components/marketing/hero.tsx`
- Create: `components/marketing/capabilities.tsx`
- Create: `components/marketing/featured-projects.tsx`
- Create: `components/marketing/systems-architecture.tsx`
- Create: `components/marketing/apps-grid.tsx`
- Create: `components/marketing/contact-panel.tsx`
- Create: `components/marketing/footer.tsx`
- Create: `components/motion/reveal.tsx`
- Create: `components/motion/parallax-layer.tsx`
- Create: `components/motion/magnetic-button.tsx`
- Test: `tests/marketing/home-page-view.test.tsx`

- [ ] **Step 1: Write the failing page tests**

```tsx
test("renders the required section headings", () => {
  render(<HomePageView content={marketingContent} />);
  expect(screen.getByRole("heading", { name: /core capabilities/i })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /featured projects/i })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /systems & integrations/i })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm.cmd test -- tests/marketing/home-page-view.test.tsx`
Expected: FAIL because the composed marketing view does not exist

- [ ] **Step 3: Implement the composed page and sections**

```tsx
export function HomePageView({ content }: HomePageViewProps) {
  return (
    <>
      <Navbar />
      <Hero hero={content.hero} />
      <Capabilities items={content.capabilities} />
      <FeaturedProjects projects={content.featuredProjects} />
      <SystemsArchitecture nodes={content.systemsFlow} />
      <AppsGrid apps={content.apps} />
      <ContactPanel contact={content.contact} />
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: Run marketing tests**

Run: `npm.cmd test -- tests/marketing/home-page-view.test.tsx`
Expected: PASS

- [ ] **Step 5: Verify responsive rendering in build output**

Run: `npm.cmd run build`
Expected: PASS

### Task 5: Build the Case-Study Pages

**Files:**
- Create: `app/(marketing)/projects/[slug]/page.tsx`
- Create: `components/case-studies/case-study-page-view.tsx`
- Create: `components/case-studies/case-study-hero.tsx`
- Create: `components/case-studies/case-study-metrics.tsx`
- Create: `components/case-studies/case-study-timeline.tsx`
- Test: `tests/case-studies/case-study-page.test.tsx`

- [ ] **Step 1: Write the failing case-study tests**

```tsx
test("renders project outcomes and stack details", () => {
  render(<CaseStudyPageView project={marketingContent.featuredProjects[0]} />);
  expect(screen.getByText(/outcomes/i)).toBeInTheDocument();
  expect(screen.getByText(/tools used/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm.cmd test -- tests/case-studies/case-study-page.test.tsx`
Expected: FAIL because case-study view does not exist

- [ ] **Step 3: Implement the case-study route and view**

```tsx
export default function ProjectPage({ params }: ProjectPageProps) {
  const project = getProjectBySlug(params.slug);
  return <CaseStudyPageView project={project} />;
}
```

- [ ] **Step 4: Run case-study tests**

Run: `npm.cmd test -- tests/case-studies/case-study-page.test.tsx`
Expected: PASS

- [ ] **Step 5: Re-run build**

Run: `npm.cmd run build`
Expected: PASS

### Task 6: Build the Admin Security and Shell

**Files:**
- Create: `app/admin/login/page.tsx`
- Create: `app/admin/verify-2fa/page.tsx`
- Create: `app/admin/dashboard/page.tsx`
- Create: `components/admin/admin-shell.tsx`
- Create: `lib/auth/passwords.ts`
- Create: `lib/auth/totp.ts`
- Create: `lib/auth/session.ts`
- Create: `lib/auth/permissions.ts`
- Create: `middleware.ts`
- Test: `tests/auth/auth-utils.test.ts`

- [ ] **Step 1: Write the failing auth utility tests**

```ts
test("hashes and verifies admin passwords", async () => {
  const hash = await hashPassword("StrongPassword!234");
  await expect(verifyPassword("StrongPassword!234", hash)).resolves.toBe(true);
});

test("creates a valid TOTP secret descriptor", () => {
  const setup = createTotpSetup("owner@example.com");
  expect(setup.otpauthUrl).toContain("otpauth://");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm.cmd test -- tests/auth/auth-utils.test.ts`
Expected: FAIL because auth utilities do not exist

- [ ] **Step 3: Implement auth utilities and admin shell**

```ts
export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}
```

```tsx
export function AdminShell({ children }: PropsWithChildren) {
  return <div className="min-h-screen bg-[var(--bg-base)]">{children}</div>;
}
```

- [ ] **Step 4: Run auth tests**

Run: `npm.cmd test -- tests/auth/auth-utils.test.ts`
Expected: PASS

- [ ] **Step 5: Verify protected admin routing compiles**

Run: `npm.cmd run build`
Expected: PASS

### Task 7: Build Admin Content Management Screens

**Files:**
- Create: `app/admin/content/page.tsx`
- Create: `app/admin/projects/page.tsx`
- Create: `app/admin/systems/page.tsx`
- Create: `app/admin/apps/page.tsx`
- Create: `app/admin/inbox/page.tsx`
- Create: `app/admin/media/page.tsx`
- Create: `app/admin/settings/page.tsx`
- Create: `components/admin/editor-panel.tsx`
- Create: `components/admin/data-table.tsx`
- Create: `components/admin/audit-log-list.tsx`
- Create: `lib/validation/contact.ts`
- Create: `lib/validation/project.ts`
- Create: `lib/validation/system-node.ts`
- Create: `lib/validation/admin-user.ts`
- Test: `tests/admin/admin-pages.test.tsx`

- [ ] **Step 1: Write the failing admin page tests**

```tsx
test("renders the content operations console sections", () => {
  render(<ContentAdminPage />);
  expect(screen.getByText(/hero configuration/i)).toBeInTheDocument();
  expect(screen.getByText(/section ordering/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm.cmd test -- tests/admin/admin-pages.test.tsx`
Expected: FAIL because admin management pages do not exist

- [ ] **Step 3: Implement the admin page modules**

```tsx
export default function ContentPage() {
  return (
    <AdminShell>
      <EditorPanel title="Hero configuration" />
    </AdminShell>
  );
}
```

- [ ] **Step 4: Run admin page tests**

Run: `npm.cmd test -- tests/admin/admin-pages.test.tsx`
Expected: PASS

- [ ] **Step 5: Verify build with all admin routes**

Run: `npm.cmd run build`
Expected: PASS

### Task 8: Add Contact Flow, Motion Polish, and Final Verification

**Files:**
- Create: `app/api/contact/route.ts`
- Create: `lib/security/rate-limit.ts`
- Create: `lib/security/audit.ts`
- Create: `lib/security/upload-policy.ts`
- Modify: `components/marketing/contact-panel.tsx`
- Modify: `docs/superpowers/progress/2026-04-23-portfolio-platform-progress.md`
- Create: `docs/superpowers/verification/2026-04-23-portfolio-platform-verification.md`
- Test: `tests/contact/contact-route.test.ts`

- [ ] **Step 1: Write the failing contact route tests**

```ts
test("rejects invalid contact submissions", async () => {
  const response = await POST(new Request("http://localhost/api/contact", {
    method: "POST",
    body: JSON.stringify({ email: "bad" }),
  }));
  expect(response.status).toBe(400);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm.cmd test -- tests/contact/contact-route.test.ts`
Expected: FAIL because the route and validation do not exist

- [ ] **Step 3: Implement contact validation, route handling, and remaining polish**

```ts
export async function POST(request: Request) {
  const payload = contactSchema.parse(await request.json());
  return Response.json({ ok: true, payload }, { status: 200 });
}
```

- [ ] **Step 4: Run full verification**

Run: `npm.cmd test`
Expected: PASS

Run: `npm.cmd run build`
Expected: PASS

- [ ] **Step 5: Update documentation**

Update:
- `docs/superpowers/progress/2026-04-23-portfolio-platform-progress.md`
- `docs/superpowers/verification/2026-04-23-portfolio-platform-verification.md`
