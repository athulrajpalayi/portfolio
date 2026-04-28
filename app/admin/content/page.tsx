import { AdminShell } from "@/components/admin/admin-shell";
import { EditorPanel } from "@/components/admin/editor-panel";
import { Button } from "@/components/primitives/button";
import { Input } from "@/components/primitives/input";
import { Textarea } from "@/components/primitives/textarea";
import { saveAdminContentAction } from "@/app/admin/actions";
import { getAdminContentData } from "@/lib/admin/console";

export default async function AdminContentPage({
  searchParams
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const { content, sections, databaseReady } = await getAdminContentData();
  const sectionsValue = sections
    .map((section: (typeof sections)[number]) =>
      [
        section.key,
        section.title,
        section.description,
        String(section.order),
        String(section.visible)
      ].join(" | ")
    )
    .join("\n");

  return (
    <AdminShell
      title="Content"
      description="Control hero copy, direct contact messaging, and the order-sensitive public narrative."
    >
      {saved ? (
        <div className="rounded-[24px] border border-[rgba(40,240,211,0.18)] bg-[rgba(40,240,211,0.08)] px-5 py-4 text-sm text-[var(--text-secondary)]">
          Content changes saved and revalidated.
        </div>
      ) : null}

      {!databaseReady ? (
        <div className="rounded-[24px] border border-[rgba(255,191,102,0.16)] bg-[rgba(255,191,102,0.08)] px-5 py-4 text-sm leading-7 text-[var(--text-secondary)]">
          This form is showing the current fallback content. Persistent saves will start working after the PostgreSQL connection and owner bootstrap are configured.
        </div>
      ) : null}

      <form action={saveAdminContentAction} className="grid gap-6">
        <div className="grid gap-6 xl:grid-cols-2">
          <EditorPanel title="Hero configuration" description="Primary identity and first-impression messaging for the landing experience.">
            <div className="grid gap-4">
              <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
                Eyebrow
                <Input name="heroEyebrow" defaultValue={content.hero.eyebrow} disabled={!databaseReady} />
              </label>
              <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
                Title
                <Input name="heroTitle" defaultValue={content.hero.title} disabled={!databaseReady} />
              </label>
              <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
                Headline accent
                <Textarea name="heroHeadlineAccent" defaultValue={content.hero.headlineAccent} disabled={!databaseReady} />
              </label>
              <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
                Subtitle
                <Textarea name="heroSubtitle" defaultValue={content.hero.subtitle} disabled={!databaseReady} />
              </label>
              <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
                Intro
                <Textarea name="heroIntro" defaultValue={content.hero.intro} disabled={!databaseReady} />
              </label>
              <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
                Chips (comma separated)
                <Input
                  name="heroChips"
                  defaultValue={content.hero.chips.join(", ")}
                  disabled={!databaseReady}
                />
              </label>
              <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
                Status label
                <Input
                  name="heroStatusLabel"
                  defaultValue={content.hero.statusLabel}
                  disabled={!databaseReady}
                />
              </label>
            </div>
          </EditorPanel>

          <EditorPanel title="Contact framing" description="Direct channel labels and inquiry positioning for the closing section.">
            <div className="grid gap-4">
              <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
                Contact title
                <Input name="contactTitle" defaultValue={content.contact.title} disabled={!databaseReady} />
              </label>
              <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
                Contact description
                <Textarea
                  name="contactDescription"
                  defaultValue={content.contact.description}
                  disabled={!databaseReady}
                />
              </label>
              <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
                Email
                <Input name="contactEmail" defaultValue={content.contact.email} disabled={!databaseReady} />
              </label>
              <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
                WhatsApp
                <Input
                  name="contactWhatsapp"
                  defaultValue={content.contact.whatsapp}
                  disabled={!databaseReady}
                />
              </label>
              <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
                LinkedIn
                <Input
                  name="contactLinkedin"
                  defaultValue={content.contact.linkedin}
                  disabled={!databaseReady}
                />
              </label>
            </div>
          </EditorPanel>
        </div>

        <EditorPanel title="Section ordering" description="One section per line: key | title | description | order | visible">
          <div className="grid gap-4">
            <Textarea
              name="sections"
              defaultValue={sectionsValue}
              className="min-h-56"
              disabled={!databaseReady}
            />
            <div className="flex justify-end">
              <Button type="submit" variant="admin" disabled={!databaseReady}>
                Save content
              </Button>
            </div>
          </div>
        </EditorPanel>
      </form>
    </AdminShell>
  );
}
