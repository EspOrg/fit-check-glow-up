
import { useState } from "react";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface AIStyleAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  aesthetic: string;
  imageData?: string;
  currentScore?: number;
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const AIStyleAssistant = ({ isOpen, onClose, aesthetic, imageData, currentScore }: AIStyleAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hi! I'm your AI style assistant. I can see you're going for a ${aesthetic} aesthetic. Upload your outfit and I'll give you specific suggestions to improve your look!`,
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getStyleSuggestions = (aesthetic: string, score?: number) => {
    const suggestions = {
      'y2k': [
        "Try adding metallic accessories like chrome jewelry or a holographic bag",
        "Low-rise jeans with a fitted crop top would nail this aesthetic",
        "Consider adding platform boots or chunky sneakers",
        "A metallic or iridescent jacket would elevate this look",
        "Try incorporating tech-wear elements like cargo pants with straps"
      ],
      'old-money': [
        "A cream cashmere sweater would perfect this sophisticated look",
        "Try adding a structured blazer in navy or camel",
        "Pearl accessories would enhance the elegant vibe",
        "Consider well-tailored trousers instead of jeans",
        "A classic trench coat would complete this timeless aesthetic"
      ],
      'minimalist': [
        "Stick to a monochromatic color palette - try all black or all white",
        "A structured white button-down would clean up this look",
        "Consider slim-fit black trousers for a sleeker silhouette",
        "Remove any unnecessary accessories - less is more",
        "Try a minimalist watch or simple gold jewelry"
      ],
      'maximalist': [
        "Mix bold patterns - try pairing stripes with florals",
        "Add more colorful accessories like statement earrings",
        "Layer different textures like velvet with metallics",
        "Try bright, clashing colors instead of neutrals",
        "Add a bold printed scarf or colorful bag"
      ],
      'streetwear': [
        "Oversized hoodies or graphic tees work better for streetwear",
        "Try chunky sneakers like Air Force 1s or Jordans",
        "Add a bucket hat or beanie for authentic street style",
        "Consider baggy jeans or cargo pants instead",
        "Layer with a bomber jacket or denim jacket"
      ],
      'coquette': [
        "Try a flowy midi skirt in pink or white",
        "Add delicate jewelry like layered necklaces",
        "A cropped cardigan would enhance the feminine vibe",
        "Consider Mary Jane shoes or ballet flats",
        "Soft, romantic colors like blush pink work best"
      ]
    };

    return suggestions[aesthetic as keyof typeof suggestions] || suggestions['y2k'];
  };

  const generateAIResponse = async (userMessage: string) => {
    setIsLoading(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const suggestions = getStyleSuggestions(aesthetic, currentScore);
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    
    let response = "";
    
    if (userMessage.toLowerCase().includes("improve") || userMessage.toLowerCase().includes("better")) {
      response = `Based on your ${aesthetic} aesthetic, here's a specific suggestion: ${randomSuggestion}. This would immediately elevate your look and align better with the style you're going for!`;
    } else if (userMessage.toLowerCase().includes("color")) {
      const colorSuggestions = {
        'y2k': "Try metallics like silver or holographic pieces, or go bold with neon pink and electric blue",
        'old-money': "Stick to neutral tones like cream, camel, navy, and classic black or white",
        'minimalist': "Keep it monochromatic - all black, all white, or varying shades of one color",
        'maximalist': "Mix bold, contrasting colors! Try pairing bright pink with orange, or purple with green",
        'streetwear': "Go for urban colors like black, grey, and white with pops of bright colors",
        'coquette': "Soft, romantic colors work best - think blush pink, cream, and soft pastels"
      };
      response = colorSuggestions[aesthetic as keyof typeof colorSuggestions] || colorSuggestions['y2k'];
    } else {
      response = `For your ${aesthetic} look, I'd specifically recommend: ${randomSuggestion}. This would work much better than what you currently have and really capture the essence of this aesthetic!`;
    }
    
    setIsLoading(false);
    
    const aiMessage: Message = {
      id: Date.now().toString(),
      text: response,
      isUser: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, aiMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    
    await generateAIResponse(inputMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dark-card border-gray-700 text-white max-w-2xl h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Sparkles className="text-neon-pink" size={24} />
            <span>AI Style Assistant</span>
          </DialogTitle>
        </DialogHeader>
        
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-gray-900/50 rounded-lg">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.isUser
                    ? 'bg-neon-pink text-white'
                    : 'bg-gray-700 text-gray-100'
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-700 text-gray-100 px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-neon-pink rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-neon-pink rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-neon-pink rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Input Area */}
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask for style suggestions..."
            className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-pink"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="bg-gradient-to-r from-neon-pink to-neon-purple hover:from-neon-purple hover:to-neon-pink text-white"
          >
            <Send size={20} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIStyleAssistant;
