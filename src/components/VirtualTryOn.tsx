import { useState, useRef, useEffect, useMemo } from "react";
import { Camera, Upload, Wand2, RotateCcw, Download, Sparkles, Loader2 } from "lucide-react";
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
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isLiveOverlay, setIsLiveOverlay] = useState(false);
  const [overlayImages, setOverlayImages] = useState<{ [key: string]: HTMLImageElement }>({});
  const [areOverlaysLoading, setAreOverlaysLoading] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const animationFrameRef = useRef<number>();

  const clothingItems = useMemo(() => {
    const baseItems = {
      y2k: [
        { name: 'Metallic Crop Top', type: 'tops', color: '#ff0080', overlay: 'crop-top', position: { x: 0.25, y: 0.3, width: 0.5, height: 0.25 }},
        { name: 'Low-Rise Jeans', type: 'bottoms', color: '#0066ff', overlay: 'jeans', position: { x: 0.2, y: 0.55, width: 0.6, height: 0.4 }},
        { name: 'Platform Sneakers', type: 'shoes', color: '#ff6600', overlay: 'sneakers', position: { x: 0.15, y: 0.85, width: 0.7, height: 0.15 }},
        { name: 'Butterfly Accessories', type: 'accessories', color: '#ff66ff', overlay: 'accessories', position: { x: 0.1, y: 0.1, width: 0.8, height: 0.2 }},
      ],
      'old-money': [
        { name: 'Cashmere Sweater', type: 'tops', color: '#8b4513', overlay: 'sweater', position: { x: 0.2, y: 0.25, width: 0.6, height: 0.35 }},
        { name: 'Tailored Trousers', type: 'bottoms', color: '#2f4f4f', overlay: 'trousers', position: { x: 0.25, y: 0.6, width: 0.5, height: 0.35 }},
        { name: 'Loafers', type: 'shoes', color: '#654321', overlay: 'loafers', position: { x: 0.2, y: 0.9, width: 0.6, height: 0.1 }},
        { name: 'Pearl Necklace', type: 'accessories', color: '#f8f8ff', overlay: 'pearls', position: { x: 0.35, y: 0.22, width: 0.3, height: 0.08 }},
      ],
      streetwear: [
        { name: 'Oversized Hoodie', type: 'tops', color: '#333333', overlay: 'hoodie', position: { x: 0.15, y: 0.2, width: 0.7, height: 0.4 }},
        { name: 'Cargo Pants', type: 'bottoms', color: '#556b2f', overlay: 'cargo', position: { x: 0.2, y: 0.6, width: 0.6, height: 0.35 }},
        { name: 'High-Top Sneakers', type: 'shoes', color: '#ff4500', overlay: 'hightops', position: { x: 0.15, y: 0.85, width: 0.7, height: 0.15 }},
        { name: 'Chain Necklace', type: 'accessories', color: '#ffd700', overlay: 'chain', position: { x: 0.35, y: 0.25, width: 0.3, height: 0.15 }},
      ],
      coquette: [
        { name: 'Lace Blouse', type: 'tops', color: '#ffb6c1', overlay: 'blouse', position: { x: 0.25, y: 0.3, width: 0.5, height: 0.3 }},
        { name: 'Mini Skirt', type: 'bottoms', color: '#ff69b4', overlay: 'skirt', position: { x: 0.3, y: 0.6, width: 0.4, height: 0.2 }},
        { name: 'Mary Jane Shoes', type: 'shoes', color: '#8b0000', overlay: 'maryjanes', position: { x: 0.25, y: 0.9, width: 0.5, height: 0.1 }},
        { name: 'Bow Hair Clip', type: 'accessories', color: '#ff1493', overlay: 'bow', position: { x: 0.4, y: 0.05, width: 0.2, height: 0.1 }},
      ]
    };

    const aestheticKey = aesthetic as keyof typeof baseItems;
    const itemsForAesthetic = baseItems[aestheticKey] || baseItems.y2k;
    
    return itemsForAesthetic.map(item => ({
        ...item,
        imageUrl: `https://placehold.co/256x256/${item.color.substring(1)}/FFFFFF.png?text=${encodeURIComponent(item.name)}`
    }));
  }, [aesthetic]);

  useEffect(() => {
    const loadImages = async () => {
      setAreOverlaysLoading(true);
      toast.info('Loading virtual clothing items...');
      
      const imagePromises = clothingItems.map(item => {
        return new Promise<{ name: string; image: HTMLImageElement | null }>((resolve) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = item.imageUrl;
          img.onload = () => resolve({ name: item.name, image: img });
          img.onerror = () => {
            console.warn(`Could not load overlay image: ${item.imageUrl}`);
            resolve({ name: item.name, image: null }); 
          };
        });
      });

      const loadedImagesResults = await Promise.all(imagePromises);
      const imagesMap = loadedImagesResults.reduce((acc, result) => {
        if (result && result.image) {
          acc[result.name] = result.image;
        }
        return acc;
      }, {} as { [key: string]: HTMLImageElement });

      setOverlayImages(imagesMap);
      setAreOverlaysLoading(false);
      if (Object.keys(imagesMap).length > 0) {
        toast.success('Clothing items are ready to try on!');
      } else {
        toast.error('Could not load any clothing items. Please check the console for errors.');
      }
    };

    if (clothingItems.length > 0) {
      loadImages();
    }
  }, [clothingItems]);

  const startCamera = async () => {
    try {
      console.log('Requesting camera access...');
      
      // Request camera with specific constraints
      const constraints = {
        video: {
          facingMode: 'user',
          width: { ideal: 640, max: 1280 },
          height: { ideal: 480, max: 720 }
        },
        audio: false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Camera access granted:', mediaStream);
      
      setStream(mediaStream);
      setCameraMode(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded');
          setIsCameraReady(true);
          if (videoRef.current) {
            videoRef.current.play().then(() => {
              console.log('Video playing successfully');
              toast.success('Camera started! Select a clothing item to see live overlay.');
            }).catch(err => {
              console.error('Error playing video:', err);
              toast.error('Error starting video playback');
            });
          }
        };
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error(`Camera access failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const stopCamera = () => {
    console.log('Stopping camera...');
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
        console.log('Track stopped:', track.kind);
      });
      setStream(null);
    }
    setCameraMode(false);
    setIsCameraReady(false);
    setIsLiveOverlay(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const drawClothingOverlay = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, clothingItem: any) => {
    const overlayImage = overlayImages[clothingItem.name];
    if (!overlayImage) {
        console.warn(`Overlay image for ${clothingItem.name} not available.`);
        // Simple fallback visualization
        ctx.fillStyle = 'rgba(255, 0, 255, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = '16px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(`Overlay for "${clothingItem.name}" not available.`, canvas.width / 2, canvas.height / 2);
        return;
    }

    const { position } = clothingItem;
    
    const x = canvas.width * position.x;
    const y = canvas.height * position.y;
    const width = canvas.width * position.width;
    const height = canvas.height * position.height;

    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;

    ctx.drawImage(overlayImage, x, y, width, height);
  };

  const startLiveOverlay = () => {
    if (!selectedClothingItem || !isCameraReady || !videoRef.current || !overlayCanvasRef.current) {
      toast.error('Please select a clothing item and ensure camera is ready');
      return;
    }

    setIsLiveOverlay(true);
    toast.success('Live clothing overlay started! 👕✨');

    const clothingItem = clothingItems.find(item => item.name === selectedClothingItem);
    if (!clothingItem) return;

    const renderOverlay = () => {
      const video = videoRef.current;
      const canvas = overlayCanvasRef.current;
      
      if (video && canvas && isLiveOverlay) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Set canvas size to match video
          canvas.width = video.videoWidth || video.clientWidth;
          canvas.height = video.videoHeight || video.clientHeight;

          // Clear canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Draw the clothing overlay
          drawClothingOverlay(ctx, canvas, clothingItem);
        }
        
        animationFrameRef.current = requestAnimationFrame(renderOverlay);
      }
    };

    renderOverlay();
  };

  const stopLiveOverlay = () => {
    setIsLiveOverlay(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (overlayCanvasRef.current) {
      const ctx = overlayCanvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, overlayCanvasRef.current.width, overlayCanvasRef.current.height);
      }
    }
  };

  const captureWithOverlay = () => {
    if (!videoRef.current || !canvasRef.current) {
      toast.error('Camera not ready');
      return null;
    }

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;

    // Set canvas size
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    // Draw video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Apply clothing overlay if selected
    if (selectedClothingItem) {
      const clothingItem = clothingItems.find(item => item.name === selectedClothingItem);
      if (clothingItem) {
        drawClothingOverlay(ctx, canvas, clothingItem);
      }
    }

    return canvas.toDataURL('image/jpeg', 0.8);
  };

  const handleTryOnWithCamera = () => {
    const imageWithOverlay = captureWithOverlay();
    if (imageWithOverlay) {
      setResultImage(imageWithOverlay);
      toast.success('Virtual try-on captured! 📸');
    }
  };

  const handleTryOnWithUpload = () => {
    if (!selectedClothingItem) {
      toast.error('Please select a clothing item first');
      return;
    }

    setIsProcessing(true);
    
    // Create overlay on uploaded image
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw original image
        ctx.drawImage(img, 0, 0);
        
        // Apply clothing overlay
        const clothingItem = clothingItems.find(item => item.name === selectedClothingItem);
        if (clothingItem) {
          drawClothingOverlay(ctx, canvas, clothingItem);
        }
        
        const result = canvas.toDataURL('image/jpeg', 0.8);
        setResultImage(result);
        toast.success('Virtual try-on applied! 👗');
      }
      setIsProcessing(false);
    };
    
    img.src = originalImage;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (ctx && selectedClothingItem) {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            const clothingItem = clothingItems.find(item => item.name === selectedClothingItem);
            if (clothingItem) {
              drawClothingOverlay(ctx, canvas, clothingItem);
            }
            
            const finalResult = canvas.toDataURL('image/jpeg', 0.8);
            setResultImage(finalResult);
            toast.success('Virtual try-on applied to uploaded image!');
          }
        };
        img.src = result;
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

  useEffect(() => {
    if (selectedClothingItem && isLiveOverlay && isCameraReady) {
      startLiveOverlay();
    } else if (!selectedClothingItem && isLiveOverlay) {
      stopLiveOverlay();
    }
  }, [selectedClothingItem, isLiveOverlay, isCameraReady]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dark-card border-gray-700 text-white max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Wand2 className="text-neon-pink" size={24} />
            <span>AI Virtual Try-On</span>
            <span className="text-xs bg-neon-purple px-2 py-1 rounded-full">LIVE CAMERA</span>
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
              {areOverlaysLoading && (
                <div className="flex items-center justify-center p-4 bg-gray-800 rounded-lg text-white">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  <span>Loading Outfits...</span>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3 mt-2">
                {clothingItems.map((item, index) => (
                  <Button
                    key={index}
                    onClick={() => setSelectedClothingItem(item.name)}
                    variant={selectedClothingItem === item.name ? "default" : "outline"}
                    disabled={areOverlaysLoading || !overlayImages[item.name]}
                    className={`p-4 h-auto flex flex-col items-center space-y-2 relative ${
                      selectedClothingItem === item.name 
                        ? 'bg-neon-pink border-neon-pink' 
                        : 'bg-gray-800 border-gray-600 hover:bg-gray-700'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: item.color + '40' }}
                    >
                      <Wand2 size={16} style={{ color: item.color }} />
                    </div>
                    <span className="text-sm text-center">{item.name}</span>
                    {!areOverlaysLoading && !overlayImages[item.name] && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-lg">
                           <span className="text-xs text-red-400 font-bold">UNAVAILABLE</span>
                        </div>
                    )}
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
                    disabled={!selectedClothingItem || isProcessing || areOverlaysLoading}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 py-3"
                  >
                    <Upload className="mr-2" size={20} />
                    Try On Current Image
                  </Button>
                  
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={!selectedClothingItem || areOverlaysLoading}
                    variant="outline"
                    className="border-gray-600 py-3"
                  >
                    <Upload className="mr-2" size={20} />
                    Upload New Photo
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {isCameraReady && (
                    <>
                      <Button
                        onClick={isLiveOverlay ? stopLiveOverlay : startLiveOverlay}
                        disabled={!selectedClothingItem || areOverlaysLoading}
                        className={`w-full py-3 ${
                          isLiveOverlay 
                            ? 'bg-red-600 hover:bg-red-700' 
                            : 'bg-gradient-to-r from-neon-pink to-neon-purple hover:from-neon-purple hover:to-neon-pink'
                        }`}
                      >
                        <Wand2 className="mr-2" size={20} />
                        {isLiveOverlay ? 'Stop Live Overlay' : 'Start Live Overlay'}
                      </Button>
                      
                      <Button
                        onClick={handleTryOnWithCamera}
                        disabled={!selectedClothingItem || areOverlaysLoading}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-3"
                      >
                        <Camera className="mr-2" size={20} />
                        Capture with Overlay
                      </Button>
                    </>
                  )}
                  
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
            <h3 className="text-lg font-bold">
              {cameraMode ? 'Live Camera Feed' : 'Preview'}
              {isLiveOverlay && <span className="text-neon-pink ml-2">● LIVE</span>}
            </h3>
            
            <div className="relative rounded-lg overflow-hidden border border-gray-600 bg-gray-800 min-h-[400px]">
              {cameraMode ? (
                <div className="relative w-full h-full">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay canvas for live clothing overlay */}
                  <canvas
                    ref={overlayCanvasRef}
                    className="absolute inset-0 w-full h-full pointer-events-none"
                  />
                  {!isCameraReady && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Camera className="animate-pulse mx-auto mb-2" size={32} />
                        <p>Starting camera...</p>
                      </div>
                    </div>
                  )}
                </div>
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
                  {isLiveOverlay && <span className="text-green-400 ml-2">● LIVE</span>}
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
