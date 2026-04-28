import type { FeaturedProject, SystemNode } from "@/lib/content/site-content";

export function projectHref(project: FeaturedProject) {
  return `/projects/${project.slug}`;
}

export function summarizeSystemNode(node: SystemNode) {
  return `${node.title}: ${node.label}`;
}
