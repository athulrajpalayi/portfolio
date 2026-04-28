import { createAuditEvent, type AuditEvent } from "@/lib/security/audit";
import { getStoredMarketingContent, buildProjectBlocks, siteSettingKeys } from "@/lib/content/repository";
import { marketingContent, type AppCardItem, type CaseStudyStep, type FeaturedProject, type MarketingContent, type SystemNode } from "@/lib/content/site-content";
import { getPrismaClient, isDatabaseConfigured, runOptionalDatabaseQuery } from "@/lib/db/prisma";
import { listStoredContactSubmissions, type StoredContactSubmission } from "@/lib/admin/contact-submissions";
import { getAdminAuthState, listStoredAdminUsers, type AdminAuthState, type StoredAdminUser } from "@/lib/auth/admin-users";

export type LandingSectionRow = {
  id?: string;
  key: string;
  title: string;
  description: string;
  order: number;
  visible: boolean;
};

export type AdminProjectInput = {
  previousSlug: string;
  slug: string;
  title: string;
  summary: string;
  domain: string;
  featuredLabel: string;
  featured: boolean;
  tags: string[];
  metrics: Array<{ label: string; value: string }>;
  challenge: string;
  architecture: string[];
  solution: string[];
  outcomes: string[];
  tools: string[];
  timeline: CaseStudyStep[];
};

export type AdminContentInput = {
  hero: MarketingContent["hero"];
  contact: MarketingContent["contact"];
  sections: LandingSectionRow[];
};

export type AdminSettingsInput = MarketingContent["site"];

export type AdminAppInput = AppCardItem & {
  id: string;
  order: number;
  visible: boolean;
};

export type AdminSystemNodeInput = SystemNode & {
  id: string;
  order: number;
};

export type AdminInboxData = {
  submissions: StoredContactSubmission[];
  databaseReady: boolean;
};

export type AdminUsersData = {
  databaseReady: boolean;
  authState: AdminAuthState;
  users: StoredAdminUser[];
};

function normalizeAppIcon(icon: string): AppCardItem["icon"] {
  if (
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
  ) {
    return icon;
  }

  return "file-text";
}

const defaultLandingSections: LandingSectionRow[] = [
  { key: "hero", title: "Hero", description: "Primary brand and identity block.", order: 1, visible: true },
  { key: "capabilities", title: "Capabilities", description: "Core capability storytelling.", order: 2, visible: true },
  { key: "projects", title: "Projects", description: "Featured case studies.", order: 3, visible: true },
  { key: "systems", title: "Systems", description: "Architecture and integrations.", order: 4, visible: true },
  { key: "apps", title: "Apps", description: "Supporting product modules.", order: 5, visible: true },
  { key: "contact", title: "Contact", description: "Primary inquiry and direct links.", order: 6, visible: true }
];

function fallbackAuditEvents(): AuditEvent[] {
  return [
    createAuditEvent("Control plane ready", "Admin console wiring is available and awaiting persistent storage."),
    createAuditEvent("Public site connected", "Shared content settings now feed the marketing shell and case-study views."),
    createAuditEvent("Bootstrap required", "Run the owner bootstrap flow before expecting persistent edits.", "warning")
  ];
}

function buildProjectCreateData(project: AdminProjectInput) {
  return {
    slug: project.slug,
    title: project.title,
    summary: project.summary,
    domain: project.domain,
    featured: project.featured,
    featuredLabel: project.featuredLabel,
    tags: {
      create: project.tags.map((tag) => ({
        label: tag
      }))
    },
    metrics: {
      create: project.metrics.map((metric) => ({
        label: metric.label,
        value: metric.value
      }))
    },
    blocks: {
      create: buildProjectBlocks(project)
    }
  };
}

function buildProjectUpdateData(project: AdminProjectInput) {
  return {
    slug: project.slug,
    title: project.title,
    summary: project.summary,
    domain: project.domain,
    featured: project.featured,
    featuredLabel: project.featuredLabel,
    tags: {
      deleteMany: {},
      create: project.tags.map((tag) => ({
        label: tag
      }))
    },
    metrics: {
      deleteMany: {},
      create: project.metrics.map((metric) => ({
        label: metric.label,
        value: metric.value
      }))
    },
    blocks: {
      deleteMany: {},
      create: buildProjectBlocks(project)
    }
  };
}

export function getDefaultLandingSections() {
  return defaultLandingSections;
}

async function createAuditLog(title: string, detail: string, status: "ok" | "warning" | "error" = "ok") {
  if (!isDatabaseConfigured()) {
    return;
  }

  await getPrismaClient().auditLog.create({
    data: {
      title,
      detail,
      status
    }
  });
}

export async function getAdminDashboardData() {
  const content = await getStoredMarketingContent();
  const counts =
    (await runOptionalDatabaseQuery(async (db) => {
      const [projects, systems, apps, contacts, users] = await Promise.all([
        db.project.count(),
        db.systemNode.count(),
        db.appItem.count({ where: { visible: true } }),
        db.contactSubmission.count(),
        db.adminUser.count()
      ]);

      return { projects, systems, apps, contacts, users };
    })) ?? {
      projects: content.featuredProjects.length,
      systems: content.systemsFlow.length,
      apps: content.apps.length,
      contacts: 0,
      users: 0
    };

  const auditEvents =
    (await runOptionalDatabaseQuery((db) =>
      db.auditLog.findMany({
        orderBy: {
          createdAt: "desc"
        },
        take: 6
      })
    ))?.map((event) => ({
      title: event.title,
      detail: event.detail,
      status: (event.status === "warning" || event.status === "error" ? event.status : "ok") as
        | "ok"
        | "warning"
        | "error",
      occurredAt: event.createdAt.toISOString()
    })) ?? fallbackAuditEvents();

  return {
    content,
    counts,
    auditEvents,
    databaseReady: isDatabaseConfigured()
  };
}

export async function getAdminContentData() {
  const content = await getStoredMarketingContent();
  const sections =
    (await runOptionalDatabaseQuery((db) =>
      db.landingSection.findMany({
        orderBy: {
          order: "asc"
        }
      })
    ))?.map((section) => ({
      id: section.id,
      key: section.key,
      title: section.title,
      description: section.description,
      order: section.order,
      visible: section.visible
    })) ?? defaultLandingSections;

  return {
    content,
    sections,
    databaseReady: isDatabaseConfigured()
  };
}

export async function saveAdminContent(input: AdminContentInput) {
  const db = getPrismaClient();

  await Promise.all([
    db.siteSetting.upsert({
      where: { key: siteSettingKeys.hero },
      update: { value: input.hero },
      create: { key: siteSettingKeys.hero, value: input.hero }
    }),
    db.siteSetting.upsert({
      where: { key: siteSettingKeys.contact },
      update: { value: input.contact },
      create: { key: siteSettingKeys.contact, value: input.contact }
    })
  ]);

  for (const section of input.sections) {
    await db.landingSection.upsert({
      where: {
        key: section.key
      },
      update: {
        title: section.title,
        description: section.description,
        order: section.order,
        visible: section.visible
      },
      create: {
        key: section.key,
        title: section.title,
        description: section.description,
        order: section.order,
        visible: section.visible,
        payload: {}
      }
    });
  }

  await createAuditLog("Content updated", "Hero, contact, and section ordering were updated.");
}

export async function getAdminProjectsData() {
  const content = await getStoredMarketingContent();
  return {
    projects: content.featuredProjects,
    databaseReady: isDatabaseConfigured()
  };
}

export async function saveAdminProject(input: AdminProjectInput) {
  const db = getPrismaClient();

  const existingByPreviousSlug =
    input.previousSlug && input.previousSlug !== input.slug
      ? await db.project.findUnique({
          where: {
            slug: input.previousSlug
          }
        })
      : null;

  if (existingByPreviousSlug) {
    await db.project.update({
      where: {
        slug: input.previousSlug
      },
      data: buildProjectUpdateData(input)
    });
  } else {
    await db.project.upsert({
      where: {
        slug: input.slug
      },
      update: buildProjectUpdateData(input),
      create: buildProjectCreateData(input)
    });
  }

  await createAuditLog("Project updated", `Updated case study ${input.slug}.`);
}

export async function getAdminSystemsData() {
  const nodes =
    (await runOptionalDatabaseQuery((db) =>
      db.systemNode.findMany({
        orderBy: {
          order: "asc"
        }
      })
    ))?.map((node) => ({
      id: node.id,
      title: node.title,
      label: node.label,
      caption: node.caption,
      order: node.order
    })) ??
    marketingContent.systemsFlow.map((node, index) => ({
      id: `fallback-${index}`,
      title: node.title,
      label: node.label,
      caption: node.caption,
      order: index
    }));

  return {
    nodes,
    databaseReady: isDatabaseConfigured()
  };
}

export async function saveAdminSystemNode(input: AdminSystemNodeInput) {
  const db = getPrismaClient();

  if (!input.id || input.id.startsWith("fallback-")) {
    await db.systemNode.create({
      data: {
        title: input.title,
        label: input.label,
        caption: input.caption,
        order: input.order
      }
    });
  } else {
    await db.systemNode.update({
      where: {
        id: input.id
      },
      data: {
        title: input.title,
        label: input.label,
        caption: input.caption,
        order: input.order
      }
    });
  }

  await createAuditLog("System node updated", `Updated node ${input.title}.`);
}

export async function getAdminAppsData() {
  const apps =
    (await runOptionalDatabaseQuery((db) =>
      db.appItem.findMany({
        orderBy: {
          order: "asc"
        }
      })
    ))?.map((app) => ({
      id: app.id,
      title: app.title,
      value: app.value,
      tag: app.tag,
      icon: normalizeAppIcon(app.icon),
      order: app.order,
      visible: app.visible
    })) ??
    marketingContent.apps.map((app, index) => ({
      id: `fallback-${index}`,
      title: app.title,
      value: app.value,
      tag: app.tag,
      icon: app.icon,
      order: index,
      visible: true
    }));

  return {
    apps,
    databaseReady: isDatabaseConfigured()
  };
}

export async function saveAdminApp(input: AdminAppInput) {
  const db = getPrismaClient();

  if (!input.id || input.id.startsWith("fallback-")) {
    await db.appItem.create({
      data: {
        title: input.title,
        value: input.value,
        tag: input.tag,
        icon: input.icon,
        order: input.order,
        visible: input.visible
      }
    });
  } else {
    await db.appItem.update({
      where: {
        id: input.id
      },
      data: {
        title: input.title,
        value: input.value,
        tag: input.tag,
        icon: input.icon,
        order: input.order,
        visible: input.visible
      }
    });
  }

  await createAuditLog("Application updated", `Updated application ${input.title}.`);
}

export async function getAdminInboxData(): Promise<AdminInboxData> {
  return {
    submissions: await listStoredContactSubmissions(),
    databaseReady: isDatabaseConfigured()
  };
}

export async function getAdminUsersData(): Promise<AdminUsersData> {
  const authState = await getAdminAuthState();

  return {
    databaseReady: isDatabaseConfigured(),
    authState,
    users: authState.users.length > 0 ? authState.users : await listStoredAdminUsers()
  };
}

export async function getAdminSecurityData() {
  const authState = await getAdminAuthState();
  const auditEvents =
    (await runOptionalDatabaseQuery((db) =>
      db.auditLog.findMany({
        orderBy: {
          createdAt: "desc"
        },
        take: 8
      })
    ))?.map((event) => ({
      title: event.title,
      detail: event.detail,
      status: (event.status === "warning" || event.status === "error" ? event.status : "ok") as
        | "ok"
        | "warning"
        | "error",
      occurredAt: event.createdAt.toISOString()
    })) ?? fallbackAuditEvents();

  return {
    databaseReady: isDatabaseConfigured(),
    authState,
    auditEvents,
    bootstrapCommand:
      "npm run db:push && npm run bootstrap:admin"
  };
}

export async function getAdminSettingsData() {
  const content = await getStoredMarketingContent();

  return {
    site: content.site,
    databaseReady: isDatabaseConfigured()
  };
}

export async function saveAdminSettings(input: AdminSettingsInput) {
  await getPrismaClient().siteSetting.upsert({
    where: { key: siteSettingKeys.site },
    update: { value: input },
    create: { key: siteSettingKeys.site, value: input }
  });

  await createAuditLog("Settings updated", "Global site metadata and deployment values were updated.");
}

export async function getAdminMediaData() {
  const settings = await getAdminSettingsData();

  return {
    databaseReady: settings.databaseReady,
    resumePath: settings.site.resumePath
  };
}

export async function deleteAdminProject(slug: string) {
  const db = getPrismaClient();
  await db.project.delete({ where: { slug } });
  await createAuditLog("Project deleted", `Deleted project ${slug}.`);
}

export async function deleteAdminApp(id: string) {
  const db = getPrismaClient();
  await db.appItem.delete({ where: { id } });
  await createAuditLog("App deleted", `Deleted app item ${id}.`);
}
