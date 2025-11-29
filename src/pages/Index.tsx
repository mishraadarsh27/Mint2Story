import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { MarketplacePreview } from "@/components/MarketplacePreview";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* <h1>Test Landing Page</h1> */}
      <Navigation />
      <Hero />
      <HowItWorks />
      <MarketplacePreview />
      <Footer />
    </div>
  );
};

export default Index;
