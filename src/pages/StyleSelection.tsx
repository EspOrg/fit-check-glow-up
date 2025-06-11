
import { useNavigate } from "react-router-dom";
import { Camera, Sparkles, Crown, Zap, Minimize, Palette } from "lucide-react";

const aesthetics = [
  {
    id: "y2k",
    name: "Y2K",
    description: "Futuristic, metallic, cyber vibes",
    colors: "from-neon-pink to-neon-purple",
    glowColor: "#ff0080",
    icon: Zap,
    bgStart: "#ff0080",
    bgEnd: "#8b5cf6",
    image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=300&h=200&fit=crop&crop=center"
  },
  {
    id: "old-money",
    name: "Old Money",
    description: "Timeless, elegant, sophisticated",
    colors: "from-amber-600 to-yellow-800",
    glowColor: "#d97706",
    icon: Crown,
    bgStart: "#d97706",
    bgEnd: "#92400e",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&h=200&fit=crop&crop=center"
  },
  {
    id: "minimalist",
    name: "Bare Minimums",
    description: "Clean, simple, essential",
    colors: "from-gray-600 to-gray-800",
    glowColor: "#6b7280",
    icon: Minimize,
    bgStart: "#6b7280",
    bgEnd: "#374151",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&h=200&fit=crop&crop=center"
  },
  {
    id: "maximalist",
    name: "Maximalist",
    description: "Bold, colorful, expressive",
    colors: "from-pink-500 to-orange-500",
    glowColor: "#ec4899",
    icon: Palette,
    bgStart: "#ec4899",
    bgEnd: "#f97316",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=200&fit=crop&crop=center"
  },
  {
    id: "streetwear",
    name: "Streetwear",
    description: "Urban, edgy, trendy",
    colors: "from-neon-blue to-cyan-500",
    glowColor: "#00d4ff",
    icon: Camera,
    bgStart: "#00d4ff",
    bgEnd: "#06b6d4",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=200&fit=crop&crop=center"
  },
  {
    id: "coquette",
    name: "Coquette",
    description: "Feminine, romantic, dreamy",
    colors: "from-pink-400 to-rose-500",
    glowColor: "#f472b6",
    icon: Sparkles,
    bgStart: "#f472b6",
    bgEnd: "#f43f5e",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&h=200&fit=crop&crop=center"
  }
];

const StyleSelection = () => {
  const navigate = useNavigate();

  const handleAestheticSelect = (aesthetic: string) => {
    console.log(`Selected aesthetic: ${aesthetic}`);
    navigate(`/upload?aesthetic=${aesthetic}`);
  };

  return (
    <div className="min-h-screen gradient-bg p-6 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-neon-blue opacity-10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-neon-pink opacity-10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-neon-purple opacity-5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-4xl md:text-6xl font-cyber font-black text-white mb-4 glow-text">
            Choose Your Vibe
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-medium">
            Select your aesthetic to get the most accurate fit check
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aesthetics.map((aesthetic, index) => {
            const IconComponent = aesthetic.icon;
            return (
              <button
                key={aesthetic.id}
                onClick={() => handleAestheticSelect(aesthetic.id)}
                className="relative overflow-hidden rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 animate-bounce-in group"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {/* Background Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={aesthetic.image} 
                    alt={aesthetic.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div 
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
                  ></div>
                  
                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <div className="flex items-center space-x-3 mb-2">
                    <IconComponent size={32} className="text-white drop-shadow-lg" />
                    <h3 className="text-2xl font-bold drop-shadow-lg">{aesthetic.name}</h3>
                  </div>
                  <p className="text-sm opacity-90 drop-shadow-lg">{aesthetic.description}</p>
                </div>

                {/* Glow Effect */}
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    boxShadow: `0 0 30px ${aesthetic.glowColor}`
                  }}
                ></div>

                {/* Shine Effect */}
                <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-500 group-hover:left-[100%]"></div>
              </button>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400 text-sm">
            💡 Your choice helps our AI provide more accurate style scores
          </p>
        </div>
      </div>
    </div>
  );
};

export default StyleSelection;
