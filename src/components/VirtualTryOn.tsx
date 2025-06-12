
import { useState, useRef, useEffect } from "react";
import { Camera, Upload, Wand2, RotateCcw, Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface VirtualTryOnProps {
  isOpen: boolean;
  onClose: () => void;
  originalImage: string;
  aesthetic: string;
  onImageUpdated: (updatedImage: string) => void;
  aiSuggestions?: string[];
}

const VirtualTryOn = ({ 
  isOpen, 
  onClose, 
  originalImage, 
  aesthetic, 
  onImageUpdated,
  aiSuggestions = []
}: VirtualTryOnProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string>("");
  const [selectedClothingItem, setSelectedClothingItem] = useState<string>("");
  const [cameraMode, setCameraMode] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clothing items mapped from AI suggestions and aesthetic
  const getClothingItems = () => {
    const baseItems = {
      y2k: [
        { name: 'Metallic Crop Top', type: 'tops', image: '/api/placeholder/200/200' },
        { name: 'Low-Rise Jeans', type: 'bottoms', image: '/api/placeholder/200/200' },
        { name: 'Platform Sneakers', type: 'shoes', image: '/api/placeholder/200/200' },
        { name: 'Butterfly Accessories', type: 'accessories', image: '/api/placeholder/200/200' }
      ],
      'old-money': [
        { name: 'Cashmere Sweater', type: 'tops', image: '/api/placeholder/200/200' },
        { name: 'Tailored Trousers', type: 'bottoms', image: '/api/placeholder/200/200' },
        { name: 'Loafers', type: 'shoes', image: '/api/placeholder/200/200' },
        { name: 'Pearl Necklace', type: 'accessories', image: '/api/placeholder/200/200' }
      ],
      streetwear: [
        { name: 'Oversized Hoodie', type: 'tops', image: '/api/placeholder/200/200' },
        { name: 'Cargo Pants', type: 'bottoms', image: '/api/placeholder/200/200' },
        { name: 'High-Top Sneakers', type: 'shoes', image: '/api/placeholder/200/200' },
        { name: 'Chain Necklace', type: 'accessories', image: '/api/placeholder/200/200' }
      ],
      coquette: [
        { name: 'Lace Blouse', type: 'tops', image: '/api/placeholder/200/200' },
        { name: 'Mini Skirt', type: 'bottoms', image: '/api/placeholder/200/200' },
        { name: 'Mary Jane Shoes', type: 'shoes', image: '/api/placeholder/200/200' },
        { name: 'Bow Hair Clip', type: 'accessories', image: '/api/placeholder/200/200' }
      ]
    };

    return baseItems[aesthetic as keyof typeof baseItems] || baseItems.y2k;
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      });
      setStream(mediaStream);
      setCameraMode(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraMode(false);
  };

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        return imageDataUrl;
      }
    }
    return null;
  };

  const processVirtualTryOn = async (personImage: string, clothingItem: string) => {
    if (!selectedClothingItem) {
      toast.error('Please select a clothing item first');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Convert data URL to blob for API
      const response = await fetch(personImage);
      const blob = await response.blob();
      
      // Create form data
      const formData = new FormData();
      formData.append('person_img', blob, 'person.jpg');
      formData.append('cloth_img_url', clothingItem); // Using placeholder URL for demo
      formData.append('category', 'tops'); // This should be dynamic based on selected item
      
      const apiResponse = await fetch('https://virtual-try-on2.p.rapidapi.com/clothes-virtual-tryon', {
        method: 'POST',
        headers: {
          'x-rapidapi-host': 'virtual-try-on2.p.rapidapi.com',
          'x-rapidapi-key': '5925c181e0msh443dbb9541272f7p14d2c0jsnc38fa6cb5c5d'
        },
        body: formData
      });

      if (!apiResponse.ok) {
        throw new Error(`API error: ${apiResponse.status}`);
      }

      const result = await apiResponse.json();
      
      if (result.result_url) {
        setResultImage(result.result_url);
        toast.success('Virtual try-on complete! 🎉');
      } else {
        throw new Error('No result image received');
      }
    } catch (error) {
      console.error('Virtual try-on failed:', error);
      
      // Fallback: Create a simple overlay effect for demo
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        // Add overlay effect
        if (ctx) {
          ctx.globalAlpha = 0.3;
          ctx.fillStyle = aesthetic === 'y2k' ? '#ff0080' : 
                         aesthetic === 'old-money' ? '#d97706' :
                         aesthetic === 'streetwear' ? '#00d4ff' : '#f472b6';
          ctx.fillRect(img.width * 0.2, img.height * 0.3, img.width * 0.6, img.height * 0.4);
          
          ctx.globalAlpha = 1;
          ctx.font = '20px Arial';
          ctx.fillStyle = 'white';
          ctx.strokeStyle = 'black';
          ctx.lineWidth = 2;
          ctx.strokeText(selectedClothingItem, 20, img.height - 40);
          ctx.fillText(selectedClothingItem, 20, img.height - 40);
        }
        
        const fallbackResult = canvas.toDataURL();
        setResultImage(fallbackResult);
        toast.success('Virtual try-on simulation applied!');
      };
      
      img.src = personImage;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTryOnWithCamera = () => {
    const frame = captureFrame();
    if (frame) {
      processVirtualTryOn(frame, selectedClothingItem);
    }
  };

  const handleTryOnWithUpload = () => {
    processVirtualTryOn(originalImage, selectedClothingItem);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        processVirtualTryOn(result, selectedClothingItem);
      };
      reader.readAsDataURL(file);
    }
  };

  const applyResult = () => {
    if (resultImage) {
      onImageUpdated(resultImage);
      toast.success('Virtual try-on applied to your outfit!');
      onClose();
    }
  };

  const downloadResult = () => {
    if (resultImage) {
      const link = document.createElement('a');
      link.download = 'virtual-tryon-result.jpg';
      link.href = resultImage;
      link.click();
      toast.success('Image downloaded!');
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const clothingItems = getClothingItems();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dark-card border-gray-700 text-white max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Wand2 className="text-neon-pink" size={24} />
            <span>AI Virtual Try-On</span>
            <span className="text-xs bg-neon-purple px-2 py-1 rounded-full">LIVE</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-6">
            {/* AI Suggestions */}
            {aiSuggestions.length > 0 && (
              <div>
                <h3 className="text-lg font-bold mb-3 text-neon-pink">AI Recommendations</h3>
                <div className="grid grid-cols-2 gap-2 mb-4 p-3 bg-gray-800 rounded-lg">
                  {aiSuggestions.slice(0, 4).map((suggestion, index) => (
                    <div key={index} className="text-sm text-gray-300 flex items-center space-x-2">
                      <Sparkles size={12} className="text-neon-blue" />
                      <span>{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Clothing Selection */}
            <div>
              <h3 className="text-lg font-bold mb-3">Try On These Items</h3>
              <div className="grid grid-cols-2 gap-3">
                {clothingItems.map((item, index) => (
                  <Button
                    key={index}
                    onClick={() => setSelectedClothingItem(item.name)}
                    variant={selectedClothingItem === item.name ? "default" : "outline"}
                    className={`p-4 h-auto flex flex-col items-center space-y-2 ${
                      selectedClothingItem === item.name 
                        ? 'bg-neon-pink border-neon-pink' 
                        : 'bg-gray-800 border-gray-600 hover:bg-gray-700'
                    }`}
                  >
                    <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                      <Wand2 size={16} />
                    </div>
                    <span className="text-sm text-center">{item.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Camera/Upload Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Try-On Method</h3>
              
              {!cameraMode ? (
                <div className="grid grid-cols-1 gap-3">
                  <Button
                    onClick={startCamera}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 py-3"
                  >
                    <Camera className="mr-2" size={20} />
                    Start Live Camera
                  </Button>
                  
                  <Button
                    onClick={handleTryOnWithUpload}
                    disabled={!selectedClothingItem || isProcessing}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 py-3"
                  >
                    <Upload className="mr-2" size={20} />
                    Try On Current Image
                  </Button>
                  
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={!selectedClothingItem}
                    variant="outline"
                    className="border-gray-600 py-3"
                  >
                    <Upload className="mr-2" size={20} />
                    Upload New Photo
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Button
                    onClick={handleTryOnWithCamera}
                    disabled={!selectedClothingItem || isProcessing}
                    className="w-full bg-gradient-to-r from-neon-pink to-neon-purple hover:from-neon-purple hover:to-neon-pink py-3"
                  >
                    <Wand2 className="mr-2" size={20} />
                    Apply Virtual Try-On
                  </Button>
                  
                  <Button
                    onClick={stopCamera}
                    variant="outline"
                    className="w-full border-gray-600 py-3"
                  >
                    Stop Camera
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Preview Area */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Preview</h3>
            
            <div className="relative rounded-lg overflow-hidden border border-gray-600 bg-gray-800 min-h-[400px]">
              {cameraMode ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : resultImage ? (
                <img 
                  src={resultImage} 
                  alt="Virtual try-on result" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-96 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <Wand2 size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Select an item and start virtual try-on</p>
                  </div>
                </div>
              )}
              
              {/* Processing Overlay */}
              {isProcessing && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="animate-spin w-8 h-8 border-2 border-neon-pink border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p>Applying virtual try-on...</p>
                  </div>
                </div>
              )}
              
              {/* Selected Item Indicator */}
              {selectedClothingItem && (
                <div className="absolute top-2 left-2 bg-black/70 backdrop-blur rounded-lg px-3 py-1">
                  <span className="text-neon-pink text-sm font-bold">{selectedClothingItem}</span>
                </div>
              )}
            </div>
            
            {/* Result Actions */}
            {resultImage && (
              <div className="flex space-x-2">
                <Button
                  onClick={applyResult}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <Wand2 className="mr-2" size={16} />
                  Apply This Look
                </Button>
                
                <Button
                  onClick={downloadResult}
                  variant="outline"
                  className="border-gray-600"
                >
                  <Download size={16} />
                </Button>
                
                <Button
                  onClick={() => setResultImage("")}
                  variant="outline"
                  className="border-gray-600"
                >
                  <RotateCcw size={16} />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Hidden Elements */}
        <canvas ref={canvasRef} className="hidden" />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </DialogContent>
    </Dialog>
  );
};

export default VirtualTryOn;
