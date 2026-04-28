import { render, screen } from "@testing-library/react";

import { marketingContent } from "@/lib/content/site-content";
import { HomePageView } from "@/components/marketing/home-page-view";

describe("HomePageView", () => {
  test("renders the primary hero identity", () => {
    render(<HomePageView content={marketingContent} />);
    expect(
      screen.getByRole("heading", { name: /athulraj palayi/i })
    ).toBeInTheDocument();
  });

  test("renders the required section headings", () => {
    render(<HomePageView content={marketingContent} />);

    expect(
      screen.getByRole("heading", { name: /core capabilities/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /featured projects/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /systems & integrations/i })
    ).toBeInTheDocument();
  });

  test("uses stored site settings in the navbar and footer", () => {
    const content = {
      ...marketingContent,
      site: {
        ...marketingContent.site,
        displayName: "Athulraj Control Plane",
        resumePath: "/athulraj-resume.pdf"
      },
      contact: {
        ...marketingContent.contact,
        email: "hello@athulrajpalayi.com"
      }
    };

    render(<HomePageView content={content} />);

    expect(screen.getAllByText(/athulraj control plane/i)).toHaveLength(2);
    expect(screen.getByRole("link", { name: /download resume/i })).toHaveAttribute(
      "href",
      "/athulraj-resume.pdf"
    );
    expect(
      screen.getAllByRole("link", { name: /email/i }).map((link) => link.getAttribute("href"))
    ).toEqual([
      "mailto:hello@athulrajpalayi.com",
      "mailto:hello@athulrajpalayi.com"
    ]);
  });
});
