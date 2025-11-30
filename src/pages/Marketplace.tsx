import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { LicenseDialog } from "@/components/LicenseDialog";
import { FilterSheet } from "@/components/FilterSheet";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { API_URL } from "@/config/api";

interface Asset {
  id: string;
  title: string;
  creator: {
    email: string;
    wallet_address: string | null;
  };
  price: number;
  category: string;
  image_url: string;
  licenses: number; // Placeholder or fetched
}

const Marketplace = () => {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetch(`${API_URL}/assets`);
        if (!response.ok) throw new Error('Failed to fetch assets');
        const data = await response.json();
        setAssets(data);
      } catch (error) {
        console.error('Error fetching assets:', error);
        toast({
          title: "Error",
          description: "Failed to load marketplace assets",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, [toast]);

  const filteredAssets = assets.filter(asset =>
    asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.creator.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-20">
        <section className="py-16 px-6">
          <div className="container mx-auto">
            <div className="max-w-2xl mx-auto text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
                IP Asset Marketplace
              </h1>
              <p className="text-xl text-foreground/70">
                Discover and license premium content from top creators
              </p>
            </div>

            <div className="max-w-4xl mx-auto mb-12 flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Search assets..."
                  className="pl-10 glass"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="glass" onClick={() => setFilterOpen(true)}>
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading assets...</p>
              </div>
            ) : filteredAssets.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No assets found. Try adjusting your search.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAssets.map((asset) => (
                  <Card key={asset.id} className="glass overflow-hidden hover:scale-105 transition-smooth">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={asset.image_url || "https://placehold.co/600x400"}
                        alt={asset.title}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-3 right-3 glass">
                        {asset.category}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{asset.title}</h3>
                      <p className="text-sm text-foreground/60 mb-3">{asset.creator.email}</p>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-sm text-foreground/60">Price</p>
                          <p className="font-bold gradient-text">{asset.price} ETH</p>
                        </div>
                        <p className="text-xs text-foreground/50">
                          {asset.licenses || 0} licenses
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="hero" size="sm" className="flex-1" onClick={() => setSelectedAsset(asset)}>
                          License
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => navigate(`/marketplace`)}>
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />

      {selectedAsset && (
        <LicenseDialog
          open={!!selectedAsset}
          onOpenChange={(open) => !open && setSelectedAsset(null)}
          asset={{
            ...selectedAsset,
            creator: selectedAsset.creator.email,
            image: selectedAsset.image_url || "https://placehold.co/600x400",
            price: `${selectedAsset.price} ETH`
          }}
        />
      )}

      <FilterSheet open={filterOpen} onOpenChange={setFilterOpen} />
    </div>
  );
};

export default Marketplace;
