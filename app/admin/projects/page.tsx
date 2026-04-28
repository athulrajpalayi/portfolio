import { AdminShell } from "@/components/admin/admin-shell";
import { EditorPanel } from "@/components/admin/editor-panel";
import { Button } from "@/components/primitives/button";
import { Input } from "@/components/primitives/input";
import { Textarea } from "@/components/primitives/textarea";
import { deleteAdminProjectAction, saveAdminProjectAction } from "@/app/admin/actions";
import Link from "next/link";
import { getAdminProjectsData } from "@/lib/admin/console";

export default async function AdminProjectsPage({
  searchParams
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const { projects, databaseReady } = await getAdminProjectsData();

  return (
    <AdminShell
      title="Projects"
      description="Manage featured case studies, metrics, narrative framing, and public story depth."
    >
      {saved ? (
        <div className="rounded-[24px] border border-[rgba(40,240,211,0.18)] bg-[rgba(40,240,211,0.08)] px-5 py-4 text-sm text-[var(--text-secondary)]">
          Project changes saved and revalidated.
        </div>
      ) : null}

      {!databaseReady ? (
        <div className="rounded-[24px] border border-[rgba(255,191,102,0.16)] bg-[rgba(255,191,102,0.08)] px-5 py-4 text-sm leading-7 text-[var(--text-secondary)]">
          Project forms are hydrated from fallback content right now. Persistent editing unlocks once the PostgreSQL connection is live and the bootstrap seed has been run.
        </div>
      ) : null}

      <div className="flex justify-end">
        <Link href="/admin/projects/new">
          <button className="rounded-2xl border border-[rgba(40,240,211,0.2)] bg-[rgba(40,240,211,0.06)] px-5 py-2.5 text-sm text-[var(--accent-teal)] transition-colors duration-200 hover:bg-[rgba(40,240,211,0.12)]">
            + New Project
          </button>
        </Link>
      </div>

      <div className="grid gap-6">
        {projects.map((project: (typeof projects)[number]) => (
          <div key={project.slug} className="grid gap-1">
          <form action={saveAdminProjectAction}>
            <EditorPanel title={project.title} description="Case-study narrative, metrics, and tags.">
              <input type="hidden" name="previousSlug" value={project.slug} />
              <div className="grid gap-4 xl:grid-cols-2">
                <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
                  Title
                  <Input name="title" defaultValue={project.title} disabled={!databaseReady} />
                </label>
                <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
                  Slug
                  <Input name="slug" defaultValue={project.slug} disabled={!databaseReady} />
                </label>
                <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
                  Domain
                  <Input name="domain" defaultValue={project.domain} disabled={!databaseReady} />
                </label>
                <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
                  Featured label
                  <Input
                    name="featuredLabel"
                    defaultValue={project.featuredLabel}
                    disabled={!databaseReady}
                  />
                </label>
                <label className="xl:col-span-2 grid gap-2 text-sm text-[var(--text-secondary)]">
                  Summary
                  <Textarea name="summary" defaultValue={project.summary} disabled={!databaseReady} />
                </label>
                <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
                  Tags (comma separated)
                  <Input name="tags" defaultValue={project.tags.join(", ")} disabled={!databaseReady} />
                </label>
                <label className="flex items-center gap-3 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm text-[var(--text-secondary)]">
                  <input type="checkbox" name="featured" defaultChecked disabled={!databaseReady} />
                  Featured on public site
                </label>
                <label className="xl:col-span-2 grid gap-2 text-sm text-[var(--text-secondary)]">
                  Metrics (`Label :: Value`, one per line)
                  <Textarea
                    name="metrics"
                    defaultValue={project.metrics
                      .map(
                        (metric: (typeof project.metrics)[number]) =>
                          `${metric.label} :: ${metric.value}`
                      )
                      .join("\n")}
                    className="min-h-40"
                    disabled={!databaseReady}
                  />
                </label>
                <label className="xl:col-span-2 grid gap-2 text-sm text-[var(--text-secondary)]">
                  Challenge
                  <Textarea name="challenge" defaultValue={project.challenge} disabled={!databaseReady} />
                </label>
                <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
                  Architecture (one per line)
                  <Textarea
                    name="architecture"
                    defaultValue={project.architecture.join("\n")}
                    className="min-h-40"
                    disabled={!databaseReady}
                  />
                </label>
                <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
                  Solution (one per line)
                  <Textarea
                    name="solution"
                    defaultValue={project.solution.join("\n")}
                    className="min-h-40"
                    disabled={!databaseReady}
                  />
                </label>
                <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
                  Outcomes (one per line)
                  <Textarea
                    name="outcomes"
                    defaultValue={project.outcomes.join("\n")}
                    className="min-h-40"
                    disabled={!databaseReady}
                  />
                </label>
                <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
                  Tools (one per line)
                  <Textarea
                    name="tools"
                    defaultValue={project.tools.join("\n")}
                    className="min-h-40"
                    disabled={!databaseReady}
                  />
                </label>
                <label className="xl:col-span-2 grid gap-2 text-sm text-[var(--text-secondary)]">
                  Timeline (`Title :: Detail`, one per line)
                  <Textarea
                    name="timeline"
                    defaultValue={project.timeline
                      .map(
                        (step: (typeof project.timeline)[number]) =>
                          `${step.title} :: ${step.detail}`
                      )
                      .join("\n")}
                    className="min-h-40"
                    disabled={!databaseReady}
                  />
                </label>
              </div>
              <div className="mt-5 flex justify-end">
                <Button type="submit" variant="admin" disabled={!databaseReady}>
                  Save project
                </Button>
              </div>
            </EditorPanel>
          </form>
          <form action={deleteAdminProjectAction} className="flex justify-end px-1">
            <input type="hidden" name="slug" value={project.slug} />
            <button
              type="submit"
              disabled={!databaseReady}
              className="text-xs text-[var(--danger)] opacity-50 transition-opacity duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-20"
            >
              Delete project
            </button>
          </form>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
