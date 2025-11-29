import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAccount } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { hasValidProjectId } from '@/config/wallet';
import { API_URL, getAuthHeader } from "@/config/api";

interface LicenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: {
    id: string;
    title: string;
    creator: string;
    price: string;
    category: string;
    image: string;
    licenses: number;
  };
}

export const LicenseDialog = ({ open, onOpenChange, asset }: LicenseDialogProps) => {
  const { toast } = useToast();
  const { address, isConnected } = useAccount();
  const web3Modal = useWeb3Modal();
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    setLoading(true);

    try {
      if (!isConnected || !address) {
        toast({
          title: "Wallet Required",
          description: "Please connect your wallet to complete the purchase",
        });
        if (hasValidProjectId) {
          web3Modal.open();
        }
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to purchase licenses",
          variant: "destructive",
        });
        return;
      }

      // Parse price (remove " ETH" if present)
      const priceValue = parseFloat(asset.price.replace(/[^0-9.]/g, ''));

      const response = await fetch(`${API_URL}/licenses/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({
          assetId: asset.id,
          pricePaid: priceValue,
          transactionHash: `mock-tx-${Date.now()}`, // In real app, we'd use actual tx hash
          buyerWallet: address,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to purchase license');
      }

      toast({
        title: "License Purchased!",
        description: `You now have a license for ${asset.title}`,
      });
      onOpenChange(false);

    } catch (error: any) {
      toast({
        title: "Purchase Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>License Asset</DialogTitle>
          <DialogDescription>
            Purchase a license for {asset.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex gap-4">
            <img
              src={asset.image}
              alt={asset.title}
              className="w-32 h-32 object-cover rounded-lg"
            />
            <div className="flex-1 space-y-2">
              <h3 className="font-semibold text-lg">{asset.title}</h3>
              <p className="text-sm text-muted-foreground">{asset.creator}</p>
              <Badge>{asset.category}</Badge>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">License Details</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Commercial use allowed</li>
                <li>✓ Unlimited projects</li>
                <li>✓ Perpetual license</li>
                <li>✓ Attribution required</li>
              </ul>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">License Price</p>
                <p className="text-2xl font-bold gradient-text">{asset.price}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {asset.licenses} licenses already sold
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="hero" onClick={handlePurchase} disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Purchase License
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
