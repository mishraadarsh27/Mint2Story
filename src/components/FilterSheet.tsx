import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface FilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FilterSheet = ({ open, onOpenChange }: FilterSheetProps) => {
  const categories = ["Video", "Photo", "Story", "Audio", "3D Model"];
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter Assets</SheetTitle>
          <SheetDescription>
            Refine your search results
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div>
            <Label className="text-base font-semibold mb-3 block">Category</Label>
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox id={category} />
                  <label
                    htmlFor={category}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <Label className="text-base font-semibold mb-3 block">
              Price Range (ETH)
            </Label>
            <Slider
              defaultValue={[0, 2]}
              max={5}
              step={0.1}
              className="mt-2"
            />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>0 ETH</span>
              <span>5 ETH</span>
            </div>
          </div>

          <Separator />

          <div>
            <Label className="text-base font-semibold mb-3 block">Sort By</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox id="newest" defaultChecked />
                <label htmlFor="newest" className="text-sm font-medium">
                  Newest First
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="popular" />
                <label htmlFor="popular" className="text-sm font-medium">
                  Most Popular
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="price-low" />
                <label htmlFor="price-low" className="text-sm font-medium">
                  Price: Low to High
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Reset
            </Button>
            <Button variant="hero" className="flex-1" onClick={() => onOpenChange(false)}>
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
