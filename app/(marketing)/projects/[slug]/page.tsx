import { notFound } from "next/navigation";

import { CaseStudyPageView } from "@/components/case-studies/case-study-page-view";
import { getAllProjects, getProjectContent } from "@/lib/content/queries";

export async function generateStaticParams() {
  const projects = await getAllProjects();

  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectContent(slug);

  if (!project) {
    notFound();
  }

  return <CaseStudyPageView project={project} />;
}
