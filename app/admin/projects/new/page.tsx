import { AdminShell } from "@/components/admin/admin-shell";
import { EditorPanel } from "@/components/admin/editor-panel";
import { Button } from "@/components/primitives/button";
import { Input } from "@/components/primitives/input";
import { Textarea } from "@/components/primitives/textarea";
import { saveAdminProjectAction } from "@/app/admin/actions";
import { isDatabaseConfigured } from "@/lib/db/prisma";

export default async function NewProjectPage() {
  const databaseReady = isDatabaseConfigured();

  return (
    <AdminShell
      title="New Project"
      description="Create a new featured case study for the portfolio."
    >
      {!databaseReady ? (
        <div className="rounded-[24px] border border-[rgba(255,191,102,0.16)] bg-[rgba(255,191,102,0.08)] px-5 py-4 text-sm leading-7 text-[var(--text-secondary)]">
          Project creation requires a live PostgreSQL connection. Connect the database first.
        </div>
      ) : null}

      <form action={saveAdminProjectAction}>
        <EditorPanel title="New Project" description="Fill in all fields and save to publish.">
          <input type="hidden" name="previousSlug" value="" />
          <div className="grid gap-4 xl:grid-cols-2">
            <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
              Title
              <Input name="title" placeholder="Project title" disabled={!databaseReady} />
            </label>
            <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
              Slug
              <Input name="slug" placeholder="project-slug" disabled={!databaseReady} />
            </label>
            <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
              Domain
              <Input name="domain" placeholder="Web Application" disabled={!databaseReady} />
            </label>
            <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
              Featured label
              <Input name="featuredLabel" placeholder="Featured" disabled={!databaseReady} />
            </label>
            <label className="xl:col-span-2 grid gap-2 text-sm text-[var(--text-secondary)]">
              Summary
              <Textarea name="summary" placeholder="One-paragraph project summary." disabled={!databaseReady} />
            </label>
            <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
              Tags (comma separated)
              <Input name="tags" placeholder="Next.js, API, Automation" disabled={!databaseReady} />
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm text-[var(--text-secondary)]">
              <input type="checkbox" name="featured" defaultChecked disabled={!databaseReady} />
              Featured on public site
            </label>
            <label className="xl:col-span-2 grid gap-2 text-sm text-[var(--text-secondary)]">
              Metrics (`Label :: Value`, one per line)
              <Textarea
                name="metrics"
                placeholder={"Users :: 500+\nUptime :: 99.9%"}
                className="min-h-32"
                disabled={!databaseReady}
              />
            </label>
            <label className="xl:col-span-2 grid gap-2 text-sm text-[var(--text-secondary)]">
              Challenge
              <Textarea name="challenge" placeholder="Describe the problem this project solved." disabled={!databaseReady} />
            </label>
            <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
              Architecture (one per line)
              <Textarea
                name="architecture"
                placeholder={"Next.js frontend\nPostgreSQL database\nDocker deployment"}
                className="min-h-32"
                disabled={!databaseReady}
              />
            </label>
            <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
              Solution (one per line)
              <Textarea
                name="solution"
                placeholder={"Built the core feature.\nAdded user authentication.\nDeployed to VPS."}
                className="min-h-32"
                disabled={!databaseReady}
              />
            </label>
            <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
              Outcomes (one per line)
              <Textarea
                name="outcomes"
                placeholder={"Reduced manual work by 80%.\nImproved processing speed."}
                className="min-h-32"
                disabled={!databaseReady}
              />
            </label>
            <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
              Tools (one per line)
              <Textarea
                name="tools"
                placeholder={"Next.js\nTailwind CSS\nSupabase"}
                className="min-h-32"
                disabled={!databaseReady}
              />
            </label>
            <label className="xl:col-span-2 grid gap-2 text-sm text-[var(--text-secondary)]">
              Timeline (`Title :: Detail`, one per line)
              <Textarea
                name="timeline"
                placeholder={"Planning :: Defined scope and architecture.\nBuild :: Developed core features.\nLaunch :: Deployed and tested live."}
                className="min-h-32"
                disabled={!databaseReady}
              />
            </label>
          </div>
          <div className="mt-5 flex items-center justify-between">
            <a
              href="/admin/projects"
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
            >
              ← Back to projects
            </a>
            <Button type="submit" variant="admin" disabled={!databaseReady}>
              Create project
            </Button>
          </div>
        </EditorPanel>
      </form>
    </AdminShell>
  );
}
