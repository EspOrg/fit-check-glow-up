
import { useState } from "react";
import { Wand2, Download, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface AIOutfitEditorProps {
  isOpen: boolean;
  onClose: () => void;
  originalImage: string;
  aesthetic: string;
  onImageModified: (modifiedImage: string) => void;
}

const AIOutfitEditor = ({ 
  isOpen, 
  onClose, 
  originalImage, 
  aesthetic, 
  onImageModified 
}: AIOutfitEditorProps) => {
  const [modifiedImage, setModifiedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedModification, setSelectedModification] = useState<string>("");

  const modifications = {
    'y2k': [
      'Add metallic accessories',
      'Add chrome jewelry',
      'Add platform boots',
      'Add holographic bag',
      'Add neon lighting effect'
    ],
    'old-money': [
      'Add luxury watch',
      'Add pearl necklace',
      'Add blazer overlay',
      'Add cashmere sweater',
      'Add designer handbag'
    ],
    'minimalist': [
      'Remove excess accessories',
      'Add clean lines',
      'Simplify color palette',
      'Add structured jacket',
      'Add minimalist jewelry'
    ],
    'maximalist': [
      'Add bold patterns',
      'Layer more accessories',
      'Add bright colors',
      'Add statement pieces',
      'Mix textures'
    ],
    'streetwear': [
      'Add oversized hoodie',
      'Add chunky sneakers',
      'Add cap or beanie',
      'Add bomber jacket',
      'Add streetwear brands'
    ],
    'coquette': [
      'Add bow accessories',
      'Add pastel colors',
      'Add feminine details',
      'Add delicate jewelry',
      'Add flowy elements'
    ]
  };

  const processImage = async (modification: string) => {
    setIsProcessing(true);
    setSelectedModification(modification);
    
    // Simulate AI image processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // In a real implementation, this would call an AI service
    // For now, we'll create a mock modified image with overlay effects
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw original image
      ctx?.drawImage(img, 0, 0);
      
      // Add modification overlay effect
      if (ctx) {
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = aesthetic === 'y2k' ? '#ff0080' : 
                       aesthetic === 'old-money' ? '#d97706' :
                       aesthetic === 'streetwear' ? '#00d4ff' : '#8b5cf6';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add text overlay showing modification
        ctx.globalAlpha = 1;
        ctx.font = '24px Arial';
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.strokeText(modification, 20, 50);
        ctx.fillText(modification, 20, 50);
      }
      
      const modifiedDataUrl = canvas.toDataURL();
      setModifiedImage(modifiedDataUrl);
      setIsProcessing(false);
      
      toast.success("Outfit modified successfully! ✨");
    };
    
    img.src = originalImage;
  };

  const applyModification = () => {
    if (modifiedImage) {
      onImageModified(modifiedImage);
      toast.success("Changes applied to your outfit!");
      onClose();
    }
  };

  const resetToOriginal = () => {
    setModifiedImage(null);
    setSelectedModification("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dark-card border-gray-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Wand2 className="text-neon-pink" size={24} />
            <span>AI Outfit Editor</span>
            <span className="text-xs bg-neon-purple px-2 py-1 rounded-full">PREMIUM</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Original Image */}
          <div>
            <h3 className="text-lg font-bold mb-4">Original</h3>
            <div className="relative rounded-lg overflow-hidden border border-gray-600">
              <img src={originalImage} alt="Original outfit" className="w-full h-80 object-cover" />
            </div>
          </div>
          
          {/* Modified Image */}
          <div>
            <h3 className="text-lg font-bold mb-4">AI Modified</h3>
            <div className="relative rounded-lg overflow-hidden border border-gray-600 bg-gray-800">
              {modifiedImage ? (
                <img src={modifiedImage} alt="Modified outfit" className="w-full h-80 object-cover" />
              ) : (
                <div className="w-full h-80 flex items-center justify-center text-gray-400">
                  {isProcessing ? (
                    <div className="text-center">
                      <Sparkles className="animate-spin mx-auto mb-2" size={32} />
                      <p>AI is modifying your outfit...</p>
                      <p className="text-sm mt-1">{selectedModification}</p>
                    </div>
                  ) : (
                    <p>Select a modification to preview</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Modification Options */}
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-4">
            {aesthetic.charAt(0).toUpperCase() + aesthetic.slice(1).replace('-', ' ')} Modifications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {modifications[aesthetic as keyof typeof modifications]?.map((mod, index) => (
              <Button
                key={index}
                onClick={() => processImage(mod)}
                disabled={isProcessing}
                variant={selectedModification === mod ? "default" : "outline"}
                className="text-left justify-start bg-gray-800 border-gray-600 hover:bg-gray-700"
              >
                <Wand2 size={16} className="mr-2" />
                {mod}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            onClick={resetToOriginal}
            variant="outline"
            className="border-gray-600"
            disabled={!modifiedImage}
          >
            <RotateCcw size={16} className="mr-2" />
            Reset
          </Button>
          
          <div className="space-x-3">
            <Button
              onClick={applyModification}
              disabled={!modifiedImage}
              className="bg-gradient-to-r from-neon-pink to-neon-purple hover:from-neon-purple hover:to-neon-pink"
            >
              <Download size={16} className="mr-2" />
              Apply Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIOutfitEditor;
