"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  deleteAdminApp,
  deleteAdminProject,
  saveAdminApp,
  saveAdminContent,
  saveAdminProject,
  saveAdminSettings,
  saveAdminSystemNode,
  type LandingSectionRow
} from "@/lib/admin/console";
import { updateStoredContactSubmissionStatus } from "@/lib/admin/contact-submissions";

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function getBoolean(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function getNumber(formData: FormData, key: string, fallback = 0) {
  const value = Number(getString(formData, key));
  return Number.isFinite(value) ? value : fallback;
}

function getLines(formData: FormData, key: string) {
  return getString(formData, key)
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getCsv(formData: FormData, key: string) {
  return getString(formData, key)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getMetrics(formData: FormData, key: string) {
  return getLines(formData, key)
    .map((line) => line.split("::").map((item) => item.trim()))
    .filter((parts) => parts.length >= 2 && parts[0] && parts[1])
    .map(([label, value]) => ({ label, value }));
}

function getTimeline(formData: FormData, key: string) {
  return getLines(formData, key)
    .map((line) => line.split("::").map((item) => item.trim()))
    .filter((parts) => parts.length >= 2 && parts[0] && parts[1])
    .map(([title, detail]) => ({ title, detail }));
}

function getSections(formData: FormData): LandingSectionRow[] {
  const raw = getString(formData, "sections");

  if (!raw) {
    return [];
  }

  return raw
    .split(/\r?\n/)
    .map((line) => line.split("|").map((part) => part.trim()))
    .filter((parts) => parts.length >= 5)
    .map(([key, title, description, order, visible]) => ({
      key,
      title,
      description,
      order: Number(order),
      visible: visible === "true"
    }));
}

export async function saveAdminContentAction(formData: FormData) {
  await saveAdminContent({
    hero: {
      eyebrow: getString(formData, "heroEyebrow"),
      title: getString(formData, "heroTitle"),
      headlineAccent: getString(formData, "heroHeadlineAccent"),
      subtitle: getString(formData, "heroSubtitle"),
      intro: getString(formData, "heroIntro"),
      chips: getCsv(formData, "heroChips"),
      statusLabel: getString(formData, "heroStatusLabel")
    },
    contact: {
      title: getString(formData, "contactTitle"),
      description: getString(formData, "contactDescription"),
      email: getString(formData, "contactEmail"),
      whatsapp: getString(formData, "contactWhatsapp"),
      linkedin: getString(formData, "contactLinkedin")
    },
    sections: getSections(formData)
  });

  revalidatePath("/");
  revalidatePath("/admin/content");
  redirect("/admin/content?saved=1");
}

export async function saveAdminProjectAction(formData: FormData) {
  const previousSlug = getString(formData, "previousSlug");
  const slug = getString(formData, "slug");

  await saveAdminProject({
    previousSlug,
    slug,
    title: getString(formData, "title"),
    summary: getString(formData, "summary"),
    domain: getString(formData, "domain"),
    featuredLabel: getString(formData, "featuredLabel"),
    featured: getBoolean(formData, "featured"),
    tags: getCsv(formData, "tags"),
    metrics: getMetrics(formData, "metrics"),
    challenge: getString(formData, "challenge"),
    architecture: getLines(formData, "architecture"),
    solution: getLines(formData, "solution"),
    outcomes: getLines(formData, "outcomes"),
    tools: getLines(formData, "tools"),
    timeline: getTimeline(formData, "timeline")
  });

  revalidatePath("/");
  revalidatePath("/admin/projects");
  revalidatePath(`/projects/${slug}`);
  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/projects/${previousSlug}`);
  }
  redirect("/admin/projects?saved=1");
}

export async function saveAdminSystemNodeAction(formData: FormData) {
  await saveAdminSystemNode({
    id: getString(formData, "id"),
    title: getString(formData, "title"),
    label: getString(formData, "label"),
    caption: getString(formData, "caption"),
    order: getNumber(formData, "order")
  });

  revalidatePath("/");
  revalidatePath("/admin/systems");
  redirect("/admin/systems?saved=1");
}

export async function saveAdminAppAction(formData: FormData) {
  const icon = getString(formData, "icon");

  await saveAdminApp({
    id: getString(formData, "id"),
    title: getString(formData, "title"),
    value: getString(formData, "value"),
    tag: getString(formData, "tag"),
    icon: (
      icon === "phone" ||
      icon === "droplets" ||
      icon === "file-text" ||
      icon === "palette" ||
      icon === "globe" ||
      icon === "message-circle" ||
      icon === "bell" ||
      icon === "calculator" ||
      icon === "image" ||
      icon === "video"
        ? icon
        : "file-text"
    ) as "phone" | "droplets" | "file-text" | "palette" | "globe" | "message-circle" | "bell" | "calculator" | "image" | "video",
    order: getNumber(formData, "order"),
    visible: getBoolean(formData, "visible")
  });

  revalidatePath("/");
  revalidatePath("/admin/apps");
  redirect("/admin/apps?saved=1");
}

export async function updateInboxStatusAction(formData: FormData) {
  await updateStoredContactSubmissionStatus(
    getString(formData, "submissionId"),
    getString(formData, "status") as "NEW" | "REVIEWING" | "RESPONDED" | "ARCHIVED"
  );

  revalidatePath("/admin/inbox");
  redirect("/admin/inbox?saved=1");
}

export async function saveAdminSettingsAction(formData: FormData) {
  await saveAdminSettings({
    displayName: getString(formData, "displayName"),
    monogram: getString(formData, "monogram"),
    navBadge: getString(formData, "navBadge"),
    roleLabel: getString(formData, "roleLabel"),
    location: getString(formData, "location"),
    resumePath: getString(formData, "resumePath"),
    domain: getString(formData, "domain"),
    serverIp: getString(formData, "serverIp"),
    footerNote: getString(formData, "footerNote"),
    copyright: getString(formData, "copyright")
  });

  revalidatePath("/");
  revalidatePath("/admin/settings");
  redirect("/admin/settings?saved=1");
}

export async function deleteAdminProjectAction(formData: FormData) {
  const slug = getString(formData, "slug");
  await deleteAdminProject(slug);
  revalidatePath("/");
  revalidatePath("/admin/projects");
  redirect("/admin/projects?saved=1");
}

export async function deleteAdminAppAction(formData: FormData) {
  const id = getString(formData, "id");
  await deleteAdminApp(id);
  revalidatePath("/");
  revalidatePath("/admin/apps");
  redirect("/admin/apps?saved=1");
}
