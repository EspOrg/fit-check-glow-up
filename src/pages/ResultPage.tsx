import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, RotateCcw, MessageCircle, Crown, Star, Sparkles, Wand2, Glasses, Shirt, ShoppingBag, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import BeforeAfterComparison from "@/components/BeforeAfterComparison";
import AIStyleAssistant from "@/components/AIStyleAssistant";
import AIOutfitEditor from "@/components/AIOutfitEditor";
import VirtualTryOn from "@/components/VirtualTryOn";
import SmartCloset from "@/components/SmartCloset";
import EnhancedAIStyleAssistant from "@/components/EnhancedAIStyleAssistant";
import ShoppingAssistant from "@/components/ShoppingAssistant";
import TrendsAndSocial from "@/components/TrendsAndSocial";

const ResultPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isImproving, setIsImproving] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showOutfitEditor, setShowOutfitEditor] = useState(false);
  const [showVirtualTryOn, setShowVirtualTryOn] = useState(false);
  const [showSmartCloset, setShowSmartCloset] = useState(false);
  const [showEnhancedAssistant, setShowEnhancedAssistant] = useState(false);
  const [showShoppingAssistant, setShowShoppingAssistant] = useState(false);
  const [showTrendsAndSocial, setShowTrendsAndSocial] = useState(false);
  const [currentImage, setCurrentImage] = useState<string>("");

  const aesthetic = searchParams.get('aesthetic') || 'y2k';

  useEffect(() => {
    const imageParam = searchParams.get('image');
    if (imageParam) {
      setCurrentImage(imageParam);
    }
  }, [searchParams]);

  const calculateScore = (aesthetic: string) => {
    const baseScore = Math.floor(Math.random() * 4) + 6;
    const bonus = aesthetic === 'y2k' ? 1 : aesthetic === 'old-money' ? 0.5 : 0;
    return Math.min(10, baseScore + bonus);
  };

  const score = calculateScore(aesthetic);

  const getFeedback = (score: number, aesthetic: string) => {
    if (score >= 9) {
      return `Absolutely stunning! You've mastered the ${aesthetic} aesthetic perfectly. Your outfit coordination and style choices are impeccable.`;
    } else if (score >= 7) {
      return `Great job! You're on the right track with the ${aesthetic} vibe. A few small adjustments could make this look even more polished.`;
    } else if (score >= 5) {
      return `Good foundation! You understand the ${aesthetic} aesthetic, but there's room for improvement in execution and styling details.`;
    } else {
      return `This look needs some work to capture the true ${aesthetic} essence. Consider revisiting the key elements of this style.`;
    }
  };

  const improveOutfit = async () => {
    setIsImproving(true);
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const newScore = Math.min(10, score + Math.floor(Math.random() * 3) + 1);
    const newFeedback = getFeedback(newScore, aesthetic);
    
    const beforeData = {
      image: currentImage,
      score: score,
      feedback: getFeedback(score, aesthetic)
    };
    
    const afterData = {
      image: currentImage,
      score: newScore,
      feedback: newFeedback
    };
    
    setIsImproving(false);
    setShowComparison(true);
    
    localStorage.setItem('beforeAfterData', JSON.stringify({ beforeData, afterData, aesthetic }));
  };

  const handleImageModified = (modifiedImage: string) => {
    setCurrentImage(modifiedImage);
    toast.success("Outfit updated with AI modifications!");
  };

  const handleClosetOutfitSelect = (outfit: any) => {
    setCurrentImage(outfit.image);
    toast.success(`Loaded "${outfit.label}" from your closet!`);
  };

  const getScoreColor = (score: number) => {
    if (score >= 9) return 'text-neon-green';
    if (score >= 7) return 'text-neon-yellow';
    if (score >= 5) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 9) return "ICONIC! 👑";
    if (score >= 7) return "SERVING LOOKS! ✨";
    if (score >= 5) return "GETTING THERE! 💪";
    return "WORK IN PROGRESS 🔧";
  };

  if (showComparison) {
    const comparisonData = JSON.parse(localStorage.getItem('beforeAfterData') || '{}');
    return (
      <BeforeAfterComparison
        beforeImage={comparisonData.beforeData?.image || currentImage}
        afterImage={comparisonData.afterData?.image || currentImage}
        beforeScore={comparisonData.beforeData?.score || score}
        afterScore={comparisonData.afterData?.score || score + 1}
        beforeFeedback={comparisonData.beforeData?.feedback || getFeedback(score, aesthetic)}
        afterFeedback={comparisonData.afterData?.feedback || getFeedback(score + 1, aesthetic)}
        aesthetic={aesthetic}
        onTryAgain={() => setShowComparison(false)}
      />
    );
  }

  return (
    <div className="min-h-screen gradient-bg p-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-60 h-60 bg-neon-pink opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-neon-purple opacity-10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-slide-up">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="border-gray-600 hover:bg-gray-700"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
          
          <h1 className="text-3xl md:text-4xl font-cyber font-black text-white glow-text">
            Your Style Score
          </h1>
          
          <div className="w-20"></div>
        </div>

        {/* Score Display */}
        <div className="text-center mb-8 animate-bounce-in">
          <div className="inline-block bg-dark-card rounded-3xl p-8 neon-border">
            <div className={`text-6xl md:text-8xl font-black ${getScoreColor(score)} glow-text mb-4`}>
              {score}
            </div>
            <div className="text-lg text-gray-300 mb-2">out of 10</div>
            <div className="text-2xl font-bold text-neon-pink">
              {getScoreMessage(score)}
            </div>
          </div>
        </div>

        {/* Image Display */}
        {currentImage && (
          <div className="mb-8 animate-slide-up">
            <div className="relative max-w-md mx-auto rounded-3xl overflow-hidden neon-border">
              <img 
                src={currentImage} 
                alt="Your outfit" 
                className="w-full h-96 object-cover"
              />
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur rounded-full px-3 py-1">
                <span className={`font-bold ${getScoreColor(score)}`}>
                  {score}/10
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Feedback */}
        <div className="bg-dark-card rounded-3xl p-6 mb-8 neon-border animate-slide-up">
          <h3 className="text-xl font-bold text-white mb-4">Style Analysis</h3>
          <p className="text-gray-300 leading-relaxed">
            {getFeedback(score, aesthetic)}
          </p>
        </div>

        {/* Premium Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Button
            onClick={() => setShowOutfitEditor(true)}
            className="h-auto p-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex flex-col items-center space-y-2"
          >
            <Wand2 size={32} />
            <span className="font-bold">AI Outfit Editor</span>
            <span className="text-xs opacity-80">Visual modifications</span>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">PREMIUM</span>
          </Button>

          <Button
            onClick={() => setShowVirtualTryOn(true)}
            className="h-auto p-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 flex flex-col items-center space-y-2"
          >
            <Glasses size={32} />
            <span className="font-bold">Virtual Try-On</span>
            <span className="text-xs opacity-80">AR accessories</span>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">PREMIUM</span>
          </Button>

          <Button
            onClick={() => setShowSmartCloset(true)}
            className="h-auto p-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 flex flex-col items-center space-y-2"
          >
            <Shirt size={32} />
            <span className="font-bold">Smart Closet</span>
            <span className="text-xs opacity-80">Save & organize</span>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">PREMIUM</span>
          </Button>

          <Button
            onClick={() => setShowEnhancedAssistant(true)}
            className="h-auto p-6 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 flex flex-col items-center space-y-2"
          >
            <Sparkles size={32} />
            <span className="font-bold">Style Bestie</span>
            <span className="text-xs opacity-80">Gen Z AI chat</span>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">PREMIUM</span>
          </Button>

          <Button
            onClick={() => setShowShoppingAssistant(true)}
            className="h-auto p-6 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 flex flex-col items-center space-y-2"
          >
            <ShoppingBag size={32} />
            <span className="font-bold">Shop The Look</span>
            <span className="text-xs opacity-80">Curated picks</span>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">PREMIUM</span>
          </Button>

          <Button
            onClick={() => setShowTrendsAndSocial(true)}
            className="h-auto p-6 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 flex flex-col items-center space-y-2"
          >
            <TrendingUp size={32} />
            <span className="font-bold">Trends & Social</span>
            <span className="text-xs opacity-80">Hot or Not voting</span>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">PREMIUM</span>
          </Button>
        </div>

        {/* Basic Actions */}
        <div className="flex flex-col sm:flex-row gap-4 animate-slide-up">
          <Button
            onClick={improveOutfit}
            disabled={isImproving}
            className="flex-1 bg-gradient-to-r from-neon-pink to-neon-purple hover:from-neon-purple hover:to-neon-pink text-white font-bold py-4 text-lg transition-all duration-300 animate-neon-pulse"
          >
            {isImproving ? (
              <>
                <div className="animate-spin mr-2">⚡</div>
                AI is working...
              </>
            ) : (
              <>
                <Crown className="mr-2" size={20} />
                Improve My Style
              </>
            )}
          </Button>
          
          <Button
            onClick={() => setShowAIAssistant(true)}
            variant="outline"
            className="flex-1 border-gray-600 hover:bg-gray-700 py-4 text-lg"
          >
            <MessageCircle className="mr-2" size={20} />
            Ask AI Stylist
          </Button>
          
          <Button
            onClick={() => navigate('/upload?aesthetic=' + aesthetic)}
            variant="outline"
            className="border-gray-600 hover:bg-gray-700 py-4 px-6"
          >
            <RotateCcw size={20} />
          </Button>
        </div>
      </div>

      {/* Modal Components */}
      <AIStyleAssistant
        isOpen={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
        aesthetic={aesthetic}
        imageData={currentImage}
        currentScore={score}
      />

      <AIOutfitEditor
        isOpen={showOutfitEditor}
        onClose={() => setShowOutfitEditor(false)}
        originalImage={currentImage}
        aesthetic={aesthetic}
        onImageModified={handleImageModified}
      />

      <VirtualTryOn
        isOpen={showVirtualTryOn}
        onClose={() => setShowVirtualTryOn(false)}
        originalImage={currentImage}
        aesthetic={aesthetic}
        onImageUpdated={handleImageModified}
      />

      <SmartCloset
        isOpen={showSmartCloset}
        onClose={() => setShowSmartCloset(false)}
        currentImage={currentImage}
        currentAesthetic={aesthetic}
        currentScore={score}
        onOutfitSelect={handleClosetOutfitSelect}
      />

      <EnhancedAIStyleAssistant
        isOpen={showEnhancedAssistant}
        onClose={() => setShowEnhancedAssistant(false)}
        aesthetic={aesthetic}
        imageData={currentImage}
        currentScore={score}
      />

      <ShoppingAssistant
        isOpen={showShoppingAssistant}
        onClose={() => setShowShoppingAssistant(false)}
        aesthetic={aesthetic}
      />

      <TrendsAndSocial
        isOpen={showTrendsAndSocial}
        onClose={() => setShowTrendsAndSocial(false)}
      />
    </div>
  );
};

export default ResultPage;
