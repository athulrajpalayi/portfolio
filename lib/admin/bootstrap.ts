import { marketingContent, type FeaturedProject } from "@/lib/content/site-content";
import { buildProjectBlocks, siteSettingKeys } from "@/lib/content/repository";
import { getPrismaClient } from "@/lib/db/prisma";

export type BootstrapConfig = {
  email: string;
  displayName: string;
  passwordHash: string;
  totpSecret: string;
  domain: string;
  serverIp: string;
};

const landingSections = [
  { key: "hero", title: "Hero", description: "Primary brand and identity block.", order: 1, visible: true },
  { key: "capabilities", title: "Capabilities", description: "Core capability storytelling.", order: 2, visible: true },
  { key: "projects", title: "Projects", description: "Featured case studies.", order: 3, visible: true },
  { key: "systems", title: "Systems", description: "Architecture and integrations.", order: 4, visible: true },
  { key: "apps", title: "Apps", description: "Supporting product modules.", order: 5, visible: true },
  { key: "contact", title: "Contact", description: "Primary inquiry and direct links.", order: 6, visible: true }
];

type BootstrapDb = {
  adminUser: {
    upsert: (args: {
      where: { email: string };
      update: {
        displayName: string;
        passwordHash: string;
        role: "OWNER";
      };
      create: {
        email: string;
        displayName: string;
        passwordHash: string;
        role: "OWNER";
      };
    }) => Promise<{ id: string }>;
  };
  twoFactorSecret: {
    upsert: (args: {
      where: { userId: string };
      update: { secret: string; enabled: boolean };
      create: { userId: string; secret: string; enabled: boolean };
    }) => Promise<unknown>;
  };
  siteSetting: {
    upsert: (args: {
      where: { key: string };
      update: { value: unknown };
      create: { key: string; value: unknown };
    }) => Promise<unknown>;
  };
  landingSection: {
    count: () => Promise<number>;
    createMany: (args: { data: Array<Record<string, unknown>> }) => Promise<unknown>;
  };
  project: {
    count: () => Promise<number>;
    create: (args: { data: ReturnType<typeof createProjectData> }) => Promise<unknown>;
  };
  appItem: {
    count: () => Promise<number>;
    createMany: (args: { data: Array<Record<string, unknown>> }) => Promise<unknown>;
  };
  systemNode: {
    count: () => Promise<number>;
    create: (args: {
      data: {
        title: string;
        label: string;
        caption: string;
        order: number;
      };
    }) => Promise<unknown>;
  };
  auditLog: {
    create: (args: {
      data: {
        title: string;
        detail: string;
        status: "ok";
        actorId: string;
      };
    }) => Promise<unknown>;
  };
};

function createProjectData(project: FeaturedProject) {
  return {
    slug: project.slug,
    title: project.title,
    summary: project.summary,
    domain: project.domain,
    featured: true,
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

export async function bootstrapPortfolioPlatform(
  config: BootstrapConfig,
  db: BootstrapDb = getPrismaClient() as unknown as BootstrapDb
) {
  const owner = await db.adminUser.upsert({
    where: {
      email: config.email.trim().toLowerCase()
    },
    update: {
      displayName: config.displayName,
      passwordHash: config.passwordHash,
      role: "OWNER"
    },
    create: {
      email: config.email.trim().toLowerCase(),
      displayName: config.displayName,
      passwordHash: config.passwordHash,
      role: "OWNER"
    }
  });

  await db.twoFactorSecret.upsert({
    where: {
      userId: owner.id
    },
    update: {
      secret: config.totpSecret,
      enabled: true
    },
    create: {
      userId: owner.id,
      secret: config.totpSecret,
      enabled: true
    }
  });

  await Promise.all([
    db.siteSetting.upsert({
      where: { key: siteSettingKeys.hero },
      update: { value: marketingContent.hero },
      create: { key: siteSettingKeys.hero, value: marketingContent.hero }
    }),
    db.siteSetting.upsert({
      where: { key: siteSettingKeys.contact },
      update: { value: marketingContent.contact },
      create: { key: siteSettingKeys.contact, value: marketingContent.contact }
    }),
    db.siteSetting.upsert({
      where: { key: siteSettingKeys.capabilities },
      update: { value: marketingContent.capabilities },
      create: { key: siteSettingKeys.capabilities, value: marketingContent.capabilities }
    }),
    db.siteSetting.upsert({
      where: { key: siteSettingKeys.site },
      update: {
        value: {
          ...marketingContent.site,
          displayName: config.displayName,
          domain: config.domain,
          serverIp: config.serverIp
        }
      },
      create: {
        key: siteSettingKeys.site,
        value: {
          ...marketingContent.site,
          displayName: config.displayName,
          domain: config.domain,
          serverIp: config.serverIp
        }
      }
    })
  ]);

  if ((await db.landingSection.count()) === 0) {
    await db.landingSection.createMany({
      data: landingSections.map((section) => ({
        ...section,
        payload: {}
      }))
    });
  }

  if ((await db.project.count()) === 0) {
    for (const project of marketingContent.featuredProjects) {
      await db.project.create({
        data: createProjectData(project)
      });
    }
  }

  if ((await db.appItem.count()) === 0) {
    await db.appItem.createMany({
      data: marketingContent.apps.map((app, index) => ({
        title: app.title,
        value: app.value,
        tag: app.tag,
        icon: app.icon,
        visible: true,
        order: index
      }))
    });
  }

  if ((await db.systemNode.count()) === 0) {
    for (const [index, node] of marketingContent.systemsFlow.entries()) {
      await db.systemNode.create({
        data: {
          title: node.title,
          label: node.label,
          caption: node.caption,
          order: index
        }
      });
    }
  }

  await db.auditLog.create({
    data: {
      title: "Owner bootstrap completed",
      detail: `Seeded secure portfolio control plane for ${config.domain}.`,
      status: "ok",
      actorId: owner.id
    }
  });

  return owner;
}
