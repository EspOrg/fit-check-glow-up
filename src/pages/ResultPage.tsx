
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { RefreshCcw, Share, MessageCircle, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import AIStyleAssistant from "@/components/AIStyleAssistant";
import BeforeAfterComparison from "@/components/BeforeAfterComparison";

const ResultPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const aesthetic = searchParams.get('aesthetic') || 'y2k';
  const score = parseInt(searchParams.get('score') || '8');
  const imageData = searchParams.get('image');
  
  // Before/After comparison state
  const beforeImage = searchParams.get('beforeImage');
  const beforeScore = searchParams.get('beforeScore') ? parseInt(searchParams.get('beforeScore')!) : null;
  const beforeFeedback = searchParams.get('beforeFeedback');
  const isComparison = beforeImage && beforeScore && beforeFeedback;

  const [showAIAssistant, setShowAIAssistant] = useState(false);

  const aestheticName = aesthetic.charAt(0).toUpperCase() + aesthetic.slice(1).replace('-', ' ');

  const getScoreColor = (score: number) => {
    if (score >= 9) return 'from-green-400 to-emerald-500';
    if (score >= 7) return 'from-yellow-400 to-orange-500';
    if (score >= 5) return 'from-orange-400 to-red-500';
    return 'from-red-400 to-red-600';
  };

  const getScoreGlow = (score: number) => {
    if (score >= 9) return '#10b981';
    if (score >= 7) return '#f59e0b';
    if (score >= 5) return '#f97316';
    return '#ef4444';
  };

  const getFeedback = (score: number, aesthetic: string) => {
    const feedbacks = {
      9: `Perfect ${aestheticName} execution! Your outfit captures the essence flawlessly.`,
      8: `Strong ${aestheticName} vibes! Just a few tweaks could make this perfect.`,
      7: `Good ${aestheticName} foundation with room for elevated details.`,
      6: `Decent attempt at ${aestheticName}, but missing some key elements.`,
      5: `Basic ${aestheticName} understanding, needs more authentic pieces.`
    };
    
    return feedbacks[score as keyof typeof feedbacks] || feedbacks[5];
  };

  const getTips = (aesthetic: string) => {
    const tips = {
      'y2k': ['Add metallic accessories', 'Try low-rise bottoms', 'Include tech-wear elements'],
      'old-money': ['Invest in quality fabrics', 'Choose neutral colors', 'Add classic accessories'],
      'minimalist': ['Stick to basic colors', 'Focus on fit and silhouette', 'Remove unnecessary details'],
      'maximalist': ['Mix bold patterns', 'Layer accessories', 'Embrace bright colors'],
      'streetwear': ['Add statement sneakers', 'Include graphic elements', 'Try oversized fits'],
      'coquette': ['Add feminine touches', 'Choose soft colors', 'Include romantic details']
    };
    
    return tips[aesthetic as keyof typeof tips] || tips['y2k'];
  };

  const handleTryImprovement = () => {
    if (imageData) {
      // Store current result as "before" for comparison
      const currentFeedback = getFeedback(score, aesthetic);
      navigate(`/upload?aesthetic=${aesthetic}&beforeImage=${encodeURIComponent(imageData)}&beforeScore=${score}&beforeFeedback=${encodeURIComponent(currentFeedback)}`);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Fit Check AI Score',
          text: `I scored ${score}/10 on ${aestheticName} aesthetic!`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  // If this is a comparison view, show the BeforeAfterComparison component
  if (isComparison && imageData) {
    return (
      <BeforeAfterComparison
        beforeImage={decodeURIComponent(beforeImage!)}
        afterImage={decodeURIComponent(imageData)}
        beforeScore={beforeScore!}
        afterScore={score}
        beforeFeedback={decodeURIComponent(beforeFeedback!)}
        afterFeedback={getFeedback(score, aesthetic)}
        aesthetic={aesthetic}
        onTryAgain={handleTryImprovement}
      />
    );
  }

  const circleCircumference = 2 * Math.PI * 90; // radius = 90
  const strokeDasharray = circleCircumference;
  const strokeDashoffset = circleCircumference - (score / 10) * circleCircumference;

  return (
    <div className="min-h-screen gradient-bg p-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute top-20 left-20 w-60 h-60 opacity-20 rounded-full blur-3xl animate-pulse"
          style={{ backgroundColor: getScoreGlow(score) }}
        ></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-neon-purple opacity-10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-cyber font-black text-white mb-2 glow-text">
            Your Fit Score
          </h1>
          <p className="text-lg text-gray-300">
            <span className="text-neon-pink font-bold">{aestheticName}</span> Aesthetic
          </p>
        </div>

        {/* Score Circle */}
        <div className="text-center mb-8 animate-bounce-in">
          <div className="relative inline-block">
            <svg width="200" height="200" className="transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="100"
                cy="100"
                r="90"
                stroke="#374151"
                strokeWidth="8"
                fill="transparent"
              />
              {/* Progress circle */}
              <circle
                cx="100"
                cy="100"
                r="90"
                stroke="url(#scoreGradient)"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-2000 ease-out"
                strokeLinecap="round"
                style={{
                  filter: `drop-shadow(0 0 10px ${getScoreGlow(score)})`
                }}
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={score >= 9 ? '#10b981' : score >= 7 ? '#f59e0b' : '#ef4444'} />
                  <stop offset="100%" stopColor={score >= 9 ? '#059669' : score >= 7 ? '#d97706' : '#dc2626'} />
                </linearGradient>
              </defs>
            </svg>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-6xl font-black bg-gradient-to-r ${getScoreColor(score)} bg-clip-text text-transparent glow-text`}>
                  {score}
                </div>
                <div className="text-gray-300 text-lg font-medium">/ 10</div>
              </div>
            </div>
          </div>
        </div>

        {/* Image Display */}
        {imageData && (
          <div className="mb-8 animate-slide-up">
            <div className="relative rounded-3xl overflow-hidden neon-border">
              <img 
                src={decodeURIComponent(imageData)} 
                alt="Your outfit" 
                className="w-full h-64 object-cover"
              />
            </div>
          </div>
        )}

        {/* Feedback */}
        <div className="bg-dark-card rounded-3xl p-6 mb-6 neon-border animate-slide-up">
          <h3 className="text-2xl font-bold text-white mb-4 text-center">AI Feedback</h3>
          <p className="text-gray-300 text-lg text-center leading-relaxed">
            {getFeedback(score, aesthetic)}
          </p>
        </div>

        {/* Tips */}
        <div className="bg-dark-card rounded-3xl p-6 mb-8 neon-border animate-slide-up">
          <h3 className="text-xl font-bold text-white mb-4">Style Tips</h3>
          <ul className="space-y-2">
            {getTips(aesthetic).map((tip, index) => (
              <li key={index} className="text-gray-300 flex items-center">
                <span className="text-neon-pink mr-2">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 animate-slide-up">
          {/* AI Assistant Button */}
          <Button
            onClick={() => setShowAIAssistant(true)}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl text-lg transition-all duration-300"
          >
            <MessageCircle className="mr-2" size={20} />
            💬 Get AI Style Suggestions
          </Button>

          {/* Try Improvement Button */}
          <Button
            onClick={handleTryImprovement}
            className="w-full bg-gradient-to-r from-neon-blue to-cyan-500 hover:from-cyan-500 hover:to-neon-blue text-white font-bold py-4 rounded-xl text-lg transition-all duration-300"
          >
            <Camera className="mr-2" size={20} />
            📸 Try to Improve This Look
          </Button>

          <div className="flex space-x-4">
            <Button
              onClick={() => navigate("/style-selection")}
              className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white font-bold py-4 rounded-xl text-lg transition-all duration-300"
            >
              <RefreshCcw className="mr-2" size={20} />
              🔄 Try Another Style
            </Button>
            
            <Button
              onClick={handleShare}
              className="flex-1 bg-gradient-to-r from-neon-pink to-neon-purple hover:from-neon-purple hover:to-neon-pink text-white font-bold py-4 rounded-xl text-lg transition-all duration-300"
            >
              <Share className="mr-2" size={20} />
              📤 Share Result
            </Button>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            💫 Keep experimenting with your style journey!
          </p>
        </div>
      </div>

      {/* AI Style Assistant Modal */}
      <AIStyleAssistant
        isOpen={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
        aesthetic={aesthetic}
        imageData={imageData || undefined}
        currentScore={score}
      />
    </div>
  );
};

export default ResultPage;
