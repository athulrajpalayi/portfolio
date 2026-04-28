import {
  getStoredMarketingContent,
  getStoredProjectBySlug,
  getStoredProjects
} from "@/lib/content/repository";

export async function getMarketingContent() {
  return getStoredMarketingContent();
}

export async function getAllProjects() {
  return getStoredProjects();
}

export async function getProjectContent(slug: string) {
  return getStoredProjectBySlug(slug);
}
