import { fetchSiteData } from "@/utils/sites/sites";
import { Templates } from "@/components/Templates/Templates";

// Import all possible components here
import MainHome from "@/components/Templates/Main/MainHome";

const componentMap = {
  MainHome,
};

export default async function Home({ params }) {
  const subdomain = params.id;
  const siteData = await fetchSiteData(subdomain);

  const templateName = siteData.template;
  const template = Templates.find(t => t.name === templateName);

  const mainPage = template?.pages?.find(p => p.name === "main");
  const ComponentToRender = mainPage ? componentMap[mainPage.componentName] : null;

  if (!ComponentToRender) {
    return <div>Template or component not found</div>;
  }

  return (
    <div>
      <ComponentToRender config={siteData.data} tripsData={siteData.tripsData}/>
    </div>
  );
}
