"use client";

import Link from "next/link";
import { Link2, Mail, MessageSquareText, Send } from "lucide-react";
import { FormEvent, useState, useTransition } from "react";

import { Button } from "@/components/primitives/button";
import { GlassCard } from "@/components/primitives/glass-card";
import { Input } from "@/components/primitives/input";
import { SectionHeader } from "@/components/primitives/section-header";
import { Textarea } from "@/components/primitives/textarea";
import type { MarketingContent } from "@/lib/content/site-content";

type ContactPanelProps = {
  contact: MarketingContent["contact"];
};

export function ContactPanel({ contact }: ContactPanelProps) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message")
        })
      });

      if (response.ok) {
        setStatus("Message sent. I will follow up through the best matching channel.");
        form.reset();
        return;
      }

      const payload = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;
      setStatus(payload?.error ?? "Unable to send the message right now.");
    });
  }

  return (
    <section id="contact" className="section-shell section-anchor">
      <div className="page-shell">
        <SectionHeader
          label="Contact"
          title={contact.title}
          description={contact.description}
        />

        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <GlassCard className="rounded-[32px] bg-[rgba(255,255,255,0.04)] p-7">
            <div className="eyebrow mb-5">Direct Channels</div>
            <div className="grid gap-4">
              <Link
                href={`mailto:${contact.email}`}
                className="group flex items-center justify-between rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-5 py-4 transition-all duration-300 hover:border-[rgba(40,240,211,0.22)] hover:bg-[rgba(255,255,255,0.06)]"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl border border-[rgba(40,240,211,0.14)] bg-[rgba(40,240,211,0.08)] p-3 text-[var(--accent-teal)]">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[var(--text-primary)]">Email</div>
                    <div className="text-sm text-[var(--text-secondary)]">{contact.email}</div>
                  </div>
                </div>
                <Send className="h-4 w-4 text-[var(--text-muted)] transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href={contact.whatsapp}
                className="group flex items-center justify-between rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-5 py-4 transition-all duration-300 hover:border-[rgba(59,130,246,0.22)] hover:bg-[rgba(255,255,255,0.06)]"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl border border-[rgba(59,130,246,0.14)] bg-[rgba(59,130,246,0.08)] p-3 text-[var(--accent-blue)]">
                    <MessageSquareText className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[var(--text-primary)]">WhatsApp</div>
                    <div className="text-sm text-[var(--text-secondary)]">Fast project coordination</div>
                  </div>
                </div>
                <Send className="h-4 w-4 text-[var(--text-muted)] transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href={contact.linkedin}
                className="group flex items-center justify-between rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-5 py-4 transition-all duration-300 hover:border-[rgba(139,92,246,0.22)] hover:bg-[rgba(255,255,255,0.06)]"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl border border-[rgba(139,92,246,0.14)] bg-[rgba(139,92,246,0.08)] p-3 text-[var(--accent-violet)]">
                    <Link2 className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[var(--text-primary)]">LinkedIn</div>
                    <div className="text-sm text-[var(--text-secondary)]">Professional context and profile</div>
                  </div>
                </div>
                <Send className="h-4 w-4 text-[var(--text-muted)] transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </GlassCard>

          <GlassCard className="rounded-[32px] bg-[rgba(255,255,255,0.05)] p-7">
            <div className="eyebrow mb-5">Project Inquiry</div>
            <form className="grid gap-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
                  Name
                  <Input name="name" placeholder="Your name" required />
                </label>
                <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
                  Email
                  <Input name="email" type="email" placeholder="you@company.com" required />
                </label>
              </div>
              <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
                Message
                <Textarea
                  name="message"
                  placeholder="Tell me about the workflow, integration, product, or system challenge."
                  required
                />
              </label>
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <p className="max-w-md text-sm leading-7 text-[var(--text-muted)]">
                  Enterprise workflow modernization, secure internal tools, AI-enabled systems, and QA-led product improvement.
                </p>
                <Button type="submit" variant="primary" disabled={isPending}>
                  {isPending ? "Sending..." : "Submit Inquiry"}
                </Button>
              </div>
              {status ? (
                <div className="rounded-2xl border border-[rgba(40,240,211,0.16)] bg-[rgba(40,240,211,0.08)] px-4 py-3 text-sm text-[var(--text-secondary)]">
                  {status}
                </div>
              ) : null}
            </form>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
