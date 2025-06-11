
import { ArrowRight, Trophy, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeAfterComparisonProps {
  beforeImage: string;
  afterImage: string;
  beforeScore: number;
  afterScore: number;
  beforeFeedback: string;
  afterFeedback: string;
  aesthetic: string;
  onTryAgain: () => void;
}

const BeforeAfterComparison = ({
  beforeImage,
  afterImage,
  beforeScore,
  afterScore,
  beforeFeedback,
  afterFeedback,
  aesthetic,
  onTryAgain
}: BeforeAfterComparisonProps) => {
  const scoreImproved = afterScore > beforeScore;
  const scoreDifference = afterScore - beforeScore;
  
  const getScoreColor = (score: number) => {
    if (score >= 9) return 'text-green-400';
    if (score >= 7) return 'text-yellow-400';
    if (score >= 5) return 'text-orange-400';
    return 'text-red-400';
  };

  const aestheticName = aesthetic.charAt(0).toUpperCase() + aesthetic.slice(1).replace('-', ' ');

  return (
    <div className="min-h-screen gradient-bg p-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-60 h-60 bg-neon-pink opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-neon-purple opacity-10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-cyber font-black text-white mb-4 glow-text">
            Before vs After
          </h1>
          <p className="text-lg text-gray-300">
            Your <span className="text-neon-pink font-bold">{aestheticName}</span> style journey
          </p>
          
          {scoreImproved && (
            <div className="mt-4 inline-flex items-center space-x-2 bg-green-500/20 border border-green-500 rounded-full px-6 py-2 animate-bounce-in">
              <Trophy className="text-green-400" size={20} />
              <span className="text-green-400 font-bold">
                +{scoreDifference} Point{scoreDifference !== 1 ? 's' : ''} Improvement!
              </span>
            </div>
          )}
        </div>

        {/* Score Comparison */}
        <div className="text-center mb-8 animate-bounce-in">
          <div className="inline-flex items-center space-x-6 bg-dark-card rounded-3xl p-6 neon-border">
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-1">Before</div>
              <div className={`text-4xl font-black ${getScoreColor(beforeScore)}`}>
                {beforeScore}
              </div>
            </div>
            
            <ArrowRight className="text-neon-pink" size={32} />
            
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-1">After</div>
              <div className={`text-4xl font-black ${getScoreColor(afterScore)}`}>
                {afterScore}
              </div>
            </div>
            
            {scoreImproved && (
              <div className="text-center">
                <TrendingUp className="text-green-400 mx-auto mb-1" size={24} />
                <div className="text-green-400 font-bold">
                  +{scoreDifference}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Images Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Before Image */}
          <div className="animate-slide-up">
            <h3 className="text-xl font-bold text-white mb-4 text-center">Before</h3>
            <div className="relative rounded-3xl overflow-hidden neon-border">
              <img 
                src={beforeImage} 
                alt="Before outfit" 
                className="w-full h-80 object-cover"
              />
              <div className="absolute top-4 left-4 bg-gray-800/80 backdrop-blur rounded-full px-3 py-1">
                <span className={`font-bold ${getScoreColor(beforeScore)}`}>
                  {beforeScore}/10
                </span>
              </div>
            </div>
          </div>

          {/* After Image */}
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-xl font-bold text-white mb-4 text-center">After</h3>
            <div className="relative rounded-3xl overflow-hidden neon-border">
              <img 
                src={afterImage} 
                alt="After outfit" 
                className="w-full h-80 object-cover"
              />
              <div className="absolute top-4 left-4 bg-gray-800/80 backdrop-blur rounded-full px-3 py-1">
                <span className={`font-bold ${getScoreColor(afterScore)}`}>
                  {afterScore}/10
                </span>
              </div>
              {scoreImproved && (
                <div className="absolute top-4 right-4 bg-green-500/80 backdrop-blur rounded-full px-3 py-1">
                  <span className="text-white font-bold text-sm">Improved!</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Feedback Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Before Feedback */}
          <div className="bg-dark-card rounded-3xl p-6 neon-border animate-slide-up">
            <h3 className="text-xl font-bold text-white mb-4">Before Feedback</h3>
            <p className="text-gray-300 leading-relaxed">{beforeFeedback}</p>
          </div>

          {/* After Feedback */}
          <div className="bg-dark-card rounded-3xl p-6 neon-border animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-xl font-bold text-white mb-4">After Feedback</h3>
            <p className="text-gray-300 leading-relaxed">{afterFeedback}</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center animate-slide-up">
          <Button
            onClick={onTryAgain}
            className="bg-gradient-to-r from-neon-pink to-neon-purple hover:from-neon-purple hover:to-neon-pink text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 animate-neon-pulse"
          >
            Try Another Improvement
          </Button>
          
          <p className="text-gray-400 text-sm mt-4">
            Keep refining your style until you achieve the perfect look!
          </p>
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterComparison;
