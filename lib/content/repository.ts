import { marketingContent, type Capability, type CaseStudyStep, type FeaturedProject, type MarketingContent } from "@/lib/content/site-content";
import { runOptionalDatabaseQuery } from "@/lib/db/prisma";

export const siteSettingKeys = {
  hero: "hero",
  contact: "contact",
  site: "site",
  capabilities: "capabilities"
} as const;

export type DatabaseProjectRecord = {
  slug: string;
  title: string;
  summary: string;
  domain: string;
  featuredLabel: string;
  tags: Array<{ label: string }>;
  metrics: Array<{ label: string; value: string }>;
  blocks: Array<{ kind: string; body: unknown; heading?: string | null; order?: number }>;
};

export type DatabaseAppRecord = {
  id?: string;
  title: string;
  value: string;
  tag: string;
  icon: string;
  order: number;
};

export type DatabaseSystemNodeRecord = {
  id?: string;
  title: string;
  label: string;
  caption: string;
  order: number;
};

export type DatabaseContentRecords = {
  settings?: {
    hero?: Partial<MarketingContent["hero"]>;
    contact?: Partial<MarketingContent["contact"]>;
    site?: Partial<MarketingContent["site"]>;
    capabilities?: Capability[];
  };
  projects?: DatabaseProjectRecord[];
  apps?: DatabaseAppRecord[];
  systemNodes?: DatabaseSystemNodeRecord[];
};

const capabilityIcons = new Set([
  "workflow",
  "sparkles",
  "shield",
  "cloud",
  "smartphone",
  "database"
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function asString(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function asStringArray(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const items = value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  return items.length > 0 ? items : fallback;
}

function asTimeline(value: unknown, fallback: CaseStudyStep[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const items = value
    .filter((item): item is Record<string, unknown> => isRecord(item))
    .map((item) => ({
      title: asString(item.title, ""),
      detail: asString(item.detail, "")
    }))
    .filter((item) => item.title && item.detail);

  return items.length > 0 ? items : fallback;
}

function asCapabilities(value: unknown, fallback: Capability[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const items = value
    .filter((item): item is Record<string, unknown> => isRecord(item))
    .map((item) => ({
      title: asString(item.title, ""),
      description: asString(item.description, ""),
      icon: asString(item.icon, "")
    }))
    .filter(
      (item): item is Capability =>
        item.title.length > 0 &&
        item.description.length > 0 &&
        capabilityIcons.has(item.icon)
    );

  return items.length > 0 ? items : fallback;
}

function getBlockBody(
  blocks: DatabaseProjectRecord["blocks"],
  kind: string
) {
  return blocks.find((block) => block.kind === kind)?.body;
}

function mapProjectRecord(
  project: DatabaseProjectRecord,
  fallbackProject?: FeaturedProject
): FeaturedProject {
  return {
    slug: project.slug,
    title: project.title,
    summary: project.summary,
    domain: project.domain,
    featuredLabel: project.featuredLabel,
    tags: project.tags.map((tag) => tag.label),
    metrics: project.metrics.map((metric) => ({
      label: metric.label,
      value: metric.value
    })),
    challenge: asString(getBlockBody(project.blocks, "challenge"), fallbackProject?.challenge ?? ""),
    architecture: asStringArray(
      getBlockBody(project.blocks, "architecture"),
      fallbackProject?.architecture ?? []
    ),
    solution: asStringArray(getBlockBody(project.blocks, "solution"), fallbackProject?.solution ?? []),
    outcomes: asStringArray(getBlockBody(project.blocks, "outcomes"), fallbackProject?.outcomes ?? []),
    tools: asStringArray(getBlockBody(project.blocks, "tools"), fallbackProject?.tools ?? []),
    timeline: asTimeline(getBlockBody(project.blocks, "timeline"), fallbackProject?.timeline ?? [])
  };
}

function mapSettingsRows(
  rows: Array<{ key: string; value: unknown }>
): DatabaseContentRecords["settings"] {
  const settings: DatabaseContentRecords["settings"] = {};

  for (const row of rows) {
    if (row.key === siteSettingKeys.hero && isRecord(row.value)) {
      settings.hero = row.value as Partial<MarketingContent["hero"]>;
    }

    if (row.key === siteSettingKeys.contact && isRecord(row.value)) {
      settings.contact = row.value as Partial<MarketingContent["contact"]>;
    }

    if (row.key === siteSettingKeys.site && isRecord(row.value)) {
      settings.site = row.value as Partial<MarketingContent["site"]>;
    }

    if (row.key === siteSettingKeys.capabilities) {
      settings.capabilities = asCapabilities(row.value, marketingContent.capabilities);
    }
  }

  return settings;
}

export function buildProjectBlocks(project: Pick<
  FeaturedProject,
  "challenge" | "architecture" | "solution" | "outcomes" | "tools" | "timeline"
>) {
  return [
    { kind: "challenge", heading: "Challenge", order: 1, body: project.challenge },
    { kind: "architecture", heading: "Architecture", order: 2, body: project.architecture },
    { kind: "solution", heading: "Solution", order: 3, body: project.solution },
    { kind: "outcomes", heading: "Outcomes", order: 4, body: project.outcomes },
    { kind: "tools", heading: "Tools", order: 5, body: project.tools },
    { kind: "timeline", heading: "Timeline", order: 6, body: project.timeline }
  ];
}

export function mapDatabaseRecordsToMarketingContent(
  records: DatabaseContentRecords,
  fallback: MarketingContent = marketingContent
): MarketingContent {
  const projectFallbacks = new Map(
    fallback.featuredProjects.map((project) => [project.slug, project])
  );

  return {
    site: {
      ...fallback.site,
      ...(records.settings?.site ?? {})
    },
    hero: {
      ...fallback.hero,
      ...(records.settings?.hero ?? {})
    },
    capabilities:
      records.settings?.capabilities && records.settings.capabilities.length > 0
        ? records.settings.capabilities
        : fallback.capabilities,
    featuredProjects:
      records.projects && records.projects.length > 0
        ? records.projects.map((project) =>
            mapProjectRecord(project, projectFallbacks.get(project.slug))
          )
        : fallback.featuredProjects,
    systemsFlow:
      records.systemNodes && records.systemNodes.length > 0
        ? [...records.systemNodes]
            .sort((left, right) => left.order - right.order)
            .map((node) => ({
              title: node.title,
              label: node.label,
              caption: node.caption
            }))
        : fallback.systemsFlow,
    apps:
      records.apps && records.apps.length > 0
        ? [...records.apps]
            .sort((left, right) => left.order - right.order)
            .map((app) => ({
              title: app.title,
              value: app.value,
              tag: app.tag,
              icon:
                app.icon === "phone" ||
                app.icon === "droplets" ||
                app.icon === "file-text" ||
                app.icon === "palette"
                  ? app.icon
                  : "file-text"
            }))
        : fallback.apps,
    contact: {
      ...fallback.contact,
      ...(records.settings?.contact ?? {})
    }
  };
}

export async function getDatabaseContentRecords() {
  return runOptionalDatabaseQuery(async (db) => {
    const [settings, projects, apps, systemNodes] = await Promise.all([
      db.siteSetting.findMany({
        where: {
          key: {
            in: Object.values(siteSettingKeys)
          }
        }
      }),
      db.project.findMany({
        include: {
          tags: true,
          metrics: true,
          blocks: {
            orderBy: {
              order: "asc"
            }
          }
        },
        orderBy: {
          createdAt: "asc"
        }
      }),
      db.appItem.findMany({
        where: { visible: true },
        orderBy: {
          order: "asc"
        }
      }),
      db.systemNode.findMany({
        orderBy: {
          order: "asc"
        }
      })
    ]);

    return {
      settings: mapSettingsRows(settings),
      projects,
      apps,
      systemNodes
    } satisfies DatabaseContentRecords;
  });
}

export async function getStoredMarketingContent() {
  const records = await getDatabaseContentRecords();
  return records ? mapDatabaseRecordsToMarketingContent(records) : marketingContent;
}

export async function getStoredProjects() {
  return (await getStoredMarketingContent()).featuredProjects;
}

export async function getStoredProjectBySlug(slug: string) {
  return (await getStoredProjects()).find((project) => project.slug === slug) ?? null;
}
