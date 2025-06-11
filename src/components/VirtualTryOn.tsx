
import { useState } from "react";
import { Glasses, Square, Shirt, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface VirtualTryOnProps {
  isOpen: boolean;
  onClose: () => void;
  originalImage: string;
  aesthetic: string;
  onImageUpdated: (updatedImage: string) => void;
}

const VirtualTryOn = ({ 
  isOpen, 
  onClose, 
  originalImage, 
  aesthetic, 
  onImageUpdated 
}: VirtualTryOnProps) => {
  const [overlayItems, setOverlayItems] = useState<string[]>([]);
  const [previewImage, setPreviewImage] = useState<string>(originalImage);

  const tryOnItems = {
    accessories: [
      { name: 'Chrome Sunglasses', icon: Glasses, aesthetic: 'y2k' },
      { name: 'Classic Glasses', icon: Glasses, aesthetic: 'old-money' },
      { name: 'Bucket Hat', icon: Crown, aesthetic: 'streetwear' },
      { name: 'Pearl Earrings', icon: Crown, aesthetic: 'coquette' },
    ],
    clothing: [
      { name: 'Oversized Blazer', icon: Shirt, aesthetic: 'old-money' },
      { name: 'Cropped Hoodie', icon: Shirt, aesthetic: 'streetwear' },
      { name: 'Metallic Jacket', icon: Shirt, aesthetic: 'y2k' },
      { name: 'Cardigan', icon: Shirt, aesthetic: 'coquette' },
    ],
    extras: [
      { name: 'Designer Bag', icon: Square, aesthetic: 'old-money' },
      { name: 'Holographic Bag', icon: Square, aesthetic: 'y2k' },
      { name: 'Cross-body Bag', icon: Square, aesthetic: 'streetwear' },
      { name: 'Mini Purse', icon: Square, aesthetic: 'coquette' },
    ]
  };

  const addOverlay = async (itemName: string, category: string) => {
    // Simulate adding virtual item
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw original image
      ctx?.drawImage(img, 0, 0);
      
      // Add overlay item effect
      if (ctx) {
        // Add a simple overlay effect for demonstration
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = aesthetic === 'y2k' ? '#ff0080' : 
                       aesthetic === 'old-money' ? '#d97706' :
                       aesthetic === 'streetwear' ? '#00d4ff' : '#f472b6';
        
        // Position overlay based on category
        if (category === 'accessories') {
          ctx.fillRect(img.width * 0.3, img.height * 0.15, img.width * 0.4, 20);
        } else if (category === 'clothing') {
          ctx.fillRect(img.width * 0.2, img.height * 0.3, img.width * 0.6, img.height * 0.4);
        } else {
          ctx.fillRect(img.width * 0.7, img.height * 0.4, img.width * 0.25, img.height * 0.3);
        }
        
        // Add text label
        ctx.globalAlpha = 1;
        ctx.font = '16px Arial';
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.strokeText(itemName, 20, img.height - 30);
        ctx.fillText(itemName, 20, img.height - 30);
      }
      
      const updatedDataUrl = canvas.toDataURL();
      setPreviewImage(updatedDataUrl);
      setOverlayItems(prev => [...prev, itemName]);
      
      toast.success(`${itemName} added! 👗`);
    };
    
    img.src = previewImage;
  };

  const removeOverlay = (itemName: string) => {
    setOverlayItems(prev => prev.filter(item => item !== itemName));
    // Reset to original and re-apply remaining overlays
    setPreviewImage(originalImage);
    toast.success(`${itemName} removed`);
  };

  const applyChanges = () => {
    onImageUpdated(previewImage);
    toast.success("Virtual try-on applied!");
    onClose();
  };

  const resetAll = () => {
    setOverlayItems([]);
    setPreviewImage(originalImage);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dark-card border-gray-700 text-white max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Glasses className="text-neon-blue" size={24} />
            <span>Virtual Try-On</span>
            <span className="text-xs bg-neon-purple px-2 py-1 rounded-full">PREMIUM</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Try-On Categories */}
          <div className="lg:col-span-2 space-y-6">
            {Object.entries(tryOnItems).map(([category, items]) => (
              <div key={category}>
                <h3 className="text-lg font-bold mb-3 capitalize">{category}</h3>
                <div className="grid grid-cols-2 gap-3">
                  {items
                    .filter(item => item.aesthetic === aesthetic || aesthetic === 'minimalist')
                    .map((item, index) => {
                      const IconComponent = item.icon;
                      const isActive = overlayItems.includes(item.name);
                      
                      return (
                        <Button
                          key={index}
                          onClick={() => isActive ? removeOverlay(item.name) : addOverlay(item.name, category)}
                          variant={isActive ? "default" : "outline"}
                          className={`p-4 h-auto flex flex-col items-center space-y-2 ${
                            isActive ? 'bg-neon-pink' : 'bg-gray-800 border-gray-600 hover:bg-gray-700'
                          }`}
                        >
                          <IconComponent size={24} />
                          <span className="text-sm text-center">{item.name}</span>
                        </Button>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
          
          {/* Preview */}
          <div>
            <h3 className="text-lg font-bold mb-4">Preview</h3>
            <div className="relative rounded-lg overflow-hidden border border-gray-600">
              <img src={previewImage} alt="Try-on preview" className="w-full h-96 object-cover" />
              
              {/* Active overlays indicator */}
              {overlayItems.length > 0 && (
                <div className="absolute top-2 left-2 bg-black/70 rounded-lg p-2">
                  <p className="text-xs text-white">{overlayItems.length} items added</p>
                </div>
              )}
            </div>
            
            {/* Action buttons */}
            <div className="flex space-x-2 mt-4">
              <Button
                onClick={resetAll}
                variant="outline"
                className="flex-1 border-gray-600"
                disabled={overlayItems.length === 0}
              >
                Reset
              </Button>
              <Button
                onClick={applyChanges}
                className="flex-1 bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-purple hover:to-neon-blue"
                disabled={overlayItems.length === 0}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VirtualTryOn;
