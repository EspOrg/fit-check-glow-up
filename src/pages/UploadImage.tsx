
import { useState, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Camera, Upload, Crop, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

const UploadImage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const aesthetic = searchParams.get('aesthetic') || 'y2k';
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadedImage(result);
      setShowCropper(true);
      setShowModal(false);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleGallerySelect = () => {
    fileInputRef.current?.click();
  };

  const handleCameraCapture = () => {
    cameraInputRef.current?.click();
  };

  const handleCropComplete = () => {
    // In a real app, this would handle actual cropping
    // For demo purposes, we'll just use the original image
    setCroppedImage(uploadedImage);
    setShowCropper(false);
    toast.success('Image cropped successfully!');
  };

  const handleAnalyze = async () => {
    if (!croppedImage) return;

    setIsLoading(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate random score for demo
    const score = Math.floor(Math.random() * 4) + 7; // Score between 7-10
    
    navigate(`/result?aesthetic=${aesthetic}&score=${score}&image=${encodeURIComponent(croppedImage)}`);
  };

  const aestheticName = aesthetic.charAt(0).toUpperCase() + aesthetic.slice(1).replace('-', ' ');

  return (
    <div className="min-h-screen gradient-bg p-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-40 h-40 bg-neon-pink opacity-10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-neon-blue opacity-10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-cyber font-black text-white mb-4 glow-text">
            Upload Your Fit
          </h1>
          <p className="text-lg text-gray-300">
            Selected aesthetic: <span className="text-neon-pink font-bold">{aestheticName}</span>
          </p>
        </div>

        {/* Upload Area */}
        {!uploadedImage && (
          <div className="animate-bounce-in">
            <div 
              onClick={() => setShowModal(true)}
              className="border-2 border-dashed border-gray-600 rounded-3xl p-12 text-center cursor-pointer transition-all duration-300 hover:border-neon-pink hover:bg-gray-900/20 group"
            >
              <Camera size={80} className="mx-auto mb-6 text-gray-400 group-hover:text-neon-pink transition-colors duration-300" />
              <h3 className="text-2xl font-bold text-white mb-2">Add Your Photo</h3>
              <p className="text-gray-400">Tap to upload or take a photo</p>
            </div>
          </div>
        )}

        {/* Image Preview */}
        {uploadedImage && !showCropper && (
          <div className="animate-slide-up">
            <div className="relative rounded-3xl overflow-hidden mb-6 neon-border">
              <img 
                src={uploadedImage} 
                alt="Uploaded outfit" 
                className="w-full h-96 object-cover"
              />
            </div>
            
            <div className="flex space-x-4">
              <Button
                onClick={() => setShowCropper(true)}
                className="flex-1 bg-gradient-to-r from-neon-blue to-cyan-500 hover:from-cyan-500 hover:to-neon-blue text-white font-bold py-3 rounded-xl transition-all duration-300"
              >
                <Crop className="mr-2" size={20} />
                Crop Image
              </Button>
              
              <Button
                onClick={() => setUploadedImage(null)}
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 py-3 rounded-xl"
              >
                Choose Different
              </Button>
            </div>
          </div>
        )}

        {/* Cropped Image Preview */}
        {croppedImage && !showCropper && (
          <div className="animate-slide-up mt-6">
            <div className="relative rounded-3xl overflow-hidden mb-6 neon-border">
              <img 
                src={croppedImage} 
                alt="Cropped outfit" 
                className="w-full h-96 object-cover"
              />
              <div className="absolute top-4 right-4 bg-green-500 rounded-full p-2">
                <Check size={20} className="text-white" />
              </div>
            </div>
            
            <Button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-neon-pink to-neon-purple hover:from-neon-purple hover:to-neon-pink text-white font-bold py-4 rounded-xl text-lg transition-all duration-300 animate-neon-pulse"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Analyzing Your Fit...</span>
                </div>
              ) : (
                <>
                  <Sparkles className="mr-2" size={20} />
                  Get My Style Score
                </>
              )}
            </Button>
          </div>
        )}

        {/* Cropping Interface */}
        {showCropper && (
          <div className="animate-slide-up">
            <div className="bg-dark-card rounded-3xl p-6 neon-border">
              <h3 className="text-2xl font-bold text-white mb-4 text-center">Crop Your Image</h3>
              <div className="relative rounded-xl overflow-hidden mb-6">
                <img 
                  src={uploadedImage} 
                  alt="Image to crop" 
                  className="w-full h-80 object-cover"
                />
                {/* Cropping overlay */}
                <div className="absolute inset-4 border-2 border-neon-pink rounded-lg bg-transparent">
                  <div className="absolute inset-0 bg-black/20"></div>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <Button
                  onClick={handleCropComplete}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-emerald-600 hover:to-green-500 text-white font-bold py-3 rounded-xl"
                >
                  <Check className="mr-2" size={20} />
                  Apply Crop
                </Button>
                
                <Button
                  onClick={() => setShowCropper(false)}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 py-3 rounded-xl"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Upload Modal */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="bg-dark-card border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">Add Your Photo</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Button
                onClick={handleGallerySelect}
                className="w-full bg-gradient-to-r from-neon-blue to-cyan-500 hover:from-cyan-500 hover:to-neon-blue text-white font-bold py-4 rounded-xl text-lg"
              >
                <Upload className="mr-2" size={24} />
                📁 Choose from Gallery
              </Button>
              
              <Button
                onClick={handleCameraCapture}
                className="w-full bg-gradient-to-r from-neon-pink to-neon-purple hover:from-neon-purple hover:to-neon-pink text-white font-bold py-4 rounded-xl text-lg"
              >
                <Camera className="mr-2" size={24} />
                📸 Take a Photo
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          className="hidden"
        />
        
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default UploadImage;
