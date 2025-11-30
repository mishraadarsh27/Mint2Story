import { useParams, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { LicenseDialog } from "@/components/LicenseDialog";

const sampleAssets = [
  {
    id: "1",
    title: "Summer Sunset Collection",
    creator: "@creator_one",
    price: "0.05 ETH",
    category: "Photography",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    licenses: 12,
    description: "A stunning collection of summer sunset photographs capturing golden hour moments across various landscapes.",
  },
  {
    id: "2",
    title: "Urban Street Style",
    creator: "@fashionista",
    price: "0.08 ETH",
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&h=600&fit=crop",
    licenses: 8,
    description: "Contemporary urban fashion photography showcasing modern street style and cultural trends.",
  },
  {
    id: "3",
    title: "Food Photography Series",
    creator: "@foodie_creator",
    price: "0.03 ETH",
    category: "Food",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop",
    licenses: 24,
    description: "Professional food photography perfect for restaurants, blogs, and culinary publications.",
  },
];

export default function AssetDetail() {
  const { id } = useParams();
  const [licenseDialogOpen, setLicenseDialogOpen] = useState(false);
  
  const asset = sampleAssets.find((a) => a.id === id);

  if (!asset) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Asset Not Found</h1>
            <Link to="/marketplace">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Marketplace
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-6">
          <Link to="/marketplace">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Marketplace
            </Button>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div>
              <img
                src={asset.image}
                alt={asset.title}
                className="w-full rounded-lg shadow-xl"
              />
            </div>

            <div className="space-y-6">
              <div>
                <Badge variant="secondary" className="mb-4">
                  {asset.category}
                </Badge>
                <h1 className="text-4xl font-bold mb-2">{asset.title}</h1>
                <p className="text-lg text-muted-foreground">{asset.creator}</p>
              </div>

              <Card className="glass border-border/50">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">License Price</p>
                    <p className="text-3xl font-bold text-brand-purple">{asset.price}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Licenses Sold</p>
                    <p className="text-xl font-semibold">{asset.licenses}</p>
                  </div>

                  <Button 
                    variant="hero" 
                    size="lg" 
                    className="w-full"
                    onClick={() => setLicenseDialogOpen(true)}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Purchase License
                  </Button>
                </CardContent>
              </Card>

              <div>
                <h2 className="text-2xl font-bold mb-4">Description</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {asset.description}
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">License Terms</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li>✓ Commercial use allowed</li>
                  <li>✓ Attribution required</li>
                  <li>✓ Resale not permitted</li>
                  <li>✓ Unlimited projects</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <LicenseDialog
        open={licenseDialogOpen}
        onOpenChange={setLicenseDialogOpen}
        asset={asset}
      />
    </div>
  );
}
