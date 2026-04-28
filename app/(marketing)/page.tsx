import { HomePageView } from "@/components/marketing/home-page-view";
import { getMarketingContent } from "@/lib/content/queries";

export default async function HomePage() {
  const content = await getMarketingContent();

  return <HomePageView content={content} />;
}
