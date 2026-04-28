import { bootstrapPortfolioPlatform } from "@/lib/admin/bootstrap";
import { createStoredContactSubmission } from "@/lib/admin/contact-submissions";
import { mapDatabaseRecordsToMarketingContent } from "@/lib/content/repository";

describe("portfolio platform persistence", () => {
  test("maps stored records into the marketing content shape", () => {
    const content = mapDatabaseRecordsToMarketingContent({
      settings: {
        hero: {
          subtitle: "Systems Modernization • Security • AI Operations",
          intro: "Stored intro copy from the database.",
          chips: ["Dubai, UAE", "CEH v10", "CISCP / CISCM"]
        },
        contact: {
          title: "Let's build something reliable.",
          description: "Stored contact description.",
          email: "athulraj@athulrajpalayi.com",
          whatsapp: "https://wa.me/971500000000",
          linkedin: "https://www.linkedin.com/in/athulraj-palayi"
        }
      },
      projects: [
        {
          slug: "stored-project",
          title: "Stored Project",
          summary: "A persisted case study summary from PostgreSQL.",
          domain: "Operations",
          featuredLabel: "Featured",
          tags: [{ label: "ERP" }, { label: "Automation" }],
          metrics: [{ label: "Reduced manual steps", value: "18" }],
          blocks: [
            { kind: "challenge", body: "Stored challenge" },
            { kind: "architecture", body: ["FirstBit", "Middleware", "Power BI"] },
            { kind: "solution", body: ["Mapped the workflow", "Added operational checkpoints"] },
            { kind: "outcomes", body: ["Improved reliability"] },
            { kind: "tools", body: ["PostgreSQL", "Zoho Creator"] },
            {
              kind: "timeline",
              body: [{ title: "Audit", detail: "Captured the current workflow before refactoring." }]
            }
          ]
        }
      ],
      apps: [
        {
          title: "Stored App",
          value: "Stored app value proposition.",
          tag: "Utility",
          icon: "file-text",
          order: 0
        }
      ],
      systemNodes: [
        {
          title: "Stored ERP",
          label: "Source of record",
          caption: "Database-backed system node.",
          order: 0
        }
      ]
    });

    expect(content.hero.subtitle).toBe(
      "Systems Modernization • Security • AI Operations"
    );
    expect(content.featuredProjects[0]).toMatchObject({
      slug: "stored-project",
      title: "Stored Project",
      challenge: "Stored challenge"
    });
    expect(content.featuredProjects[0].architecture).toEqual([
      "FirstBit",
      "Middleware",
      "Power BI"
    ]);
    expect(content.apps[0].title).toBe("Stored App");
    expect(content.systemsFlow[0].title).toBe("Stored ERP");
    expect(content.contact.email).toBe("athulraj@athulrajpalayi.com");
  });

  test("bootstraps the first owner and starter content into the database", async () => {
    const db = {
      adminUser: {
        upsert: vi.fn().mockResolvedValue({ id: "user-1" })
      },
      twoFactorSecret: {
        upsert: vi.fn().mockResolvedValue({ id: "totp-1" })
      },
      siteSetting: {
        upsert: vi.fn().mockResolvedValue({})
      },
      landingSection: {
        count: vi.fn().mockResolvedValue(0),
        createMany: vi.fn().mockResolvedValue({ count: 6 })
      },
      project: {
        count: vi.fn().mockResolvedValue(0),
        create: vi.fn().mockResolvedValue({})
      },
      appItem: {
        count: vi.fn().mockResolvedValue(0),
        createMany: vi.fn().mockResolvedValue({ count: 4 })
      },
      systemNode: {
        count: vi.fn().mockResolvedValue(0),
        create: vi.fn().mockResolvedValue({})
      },
      auditLog: {
        create: vi.fn().mockResolvedValue({})
      }
    };

    await bootstrapPortfolioPlatform(
      {
        email: "owner@athulrajpalayi.com",
        displayName: "Athulraj Palayi",
        passwordHash: "hash",
        totpSecret: "totp-secret",
        domain: "athulrajpalayi.com",
        serverIp: "5.223.63.213"
      },
      db
    );

    expect(db.adminUser.upsert).toHaveBeenCalledTimes(1);
    expect(db.twoFactorSecret.upsert).toHaveBeenCalledTimes(1);
    expect(db.siteSetting.upsert).toHaveBeenCalled();
    expect(db.landingSection.createMany).toHaveBeenCalledTimes(1);
    expect(db.project.create).toHaveBeenCalledTimes(3);
    expect(db.appItem.createMany).toHaveBeenCalledTimes(1);
    expect(db.systemNode.create).toHaveBeenCalledTimes(6);
    expect(db.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          title: "Owner bootstrap completed"
        })
      })
    );
  });

  test("stores validated contact submissions with new status", async () => {
    const db = {
      contactSubmission: {
        create: vi.fn().mockResolvedValue({
          id: "contact-1",
          name: "Enterprise Lead",
          email: "lead@example.com",
          message: "We need a secure ERP workflow upgrade.",
          status: "NEW"
        })
      }
    };

    const submission = await createStoredContactSubmission(
      {
        name: "Enterprise Lead",
        email: "lead@example.com",
        message: "We need a secure ERP workflow upgrade."
      },
      db
    );

    expect(db.contactSubmission.create).toHaveBeenCalledWith({
      data: {
        name: "Enterprise Lead",
        email: "lead@example.com",
        message: "We need a secure ERP workflow upgrade."
      }
    });
    expect(submission.status).toBe("NEW");
  });
});
