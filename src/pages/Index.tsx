
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/style-selection");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen gradient-bg flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-neon-pink opacity-20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-neon-blue opacity-20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Main content */}
      <div className="text-center z-10 animate-bounce-in">
        <h1 className="text-6xl md:text-8xl font-cyber font-black text-white mb-4 glow-text animate-glow">
          FIT CHECK
        </h1>
        <h2 className="text-3xl md:text-4xl font-cyber font-bold text-neon-pink mb-8 glow-text">
          AI
        </h2>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-8 font-medium">
          Rate your style with AI-powered fashion insights
        </p>

        <div className="flex items-center justify-center space-x-2 text-neon-blue">
          <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>

        <Button 
          onClick={() => navigate("/style-selection")}
          className="mt-8 bg-gradient-to-r from-neon-pink to-neon-purple hover:from-neon-purple hover:to-neon-blue text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 animate-neon-pulse"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default Index;
