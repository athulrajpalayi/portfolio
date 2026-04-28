import { marketingContent } from "@/lib/content/site-content";

describe("marketingContent", () => {
  test("exposes the three featured projects", () => {
    expect(marketingContent.featuredProjects).toHaveLength(3);
  });

  test("preserves the systems flow order", () => {
    expect(marketingContent.systemsFlow.map((node) => node.title)).toEqual([
      "FirstBit ERP",
      "Middleware",
      "Zoho Creator",
      "Zoho Books",
      "PostgreSQL",
      "Power BI"
    ]);
  });
});

