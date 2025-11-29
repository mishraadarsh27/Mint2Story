import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { HowItWorks } from "@/components/HowItWorks";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-20">
        <section className="py-16 px-6">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
                How Mint2Story Works
              </h1>
              <p className="text-xl text-foreground/70 mb-8">
                Transform your Instagram content into licensed IP assets in three simple steps
              </p>
            </div>
          </div>
        </section>
        
        <HowItWorks />
        
        <section className="py-16 px-6">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
              Join thousands of creators already monetizing their content with Story Protocol
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/dashboard">
                <Button variant="hero" size="xl">
                  Get Started
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button variant="glass" size="xl">
                  Explore Marketplace
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
