
import { useState } from "react";
import { MessageCircle, Send, Sparkles, ShoppingBag, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface EnhancedAIStyleAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  aesthetic: string;
  imageData?: string;
  currentScore?: number;
  userName?: string;
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  suggestions?: string[];
}

const EnhancedAIStyleAssistant = ({ 
  isOpen, 
  onClose, 
  aesthetic, 
  imageData, 
  currentScore,
  userName = "bestie"
}: EnhancedAIStyleAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Yooo ${userName}! 💅 Your AI stylist is here and I'm absolutely LIVING for this ${aesthetic} moment! Drop your fit pic and let's make you serve some serious looks! ✨`,
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const genZResponses = {
    greetings: [
      "Hey bestie! What's the tea? ☕",
      "Omg hiiii! Ready to serve some looks? 💅",
      "Bestie you came to the right place! Let's get you STYLED! ✨"
    ],
    compliments: [
      "OK but this is actually fire! 🔥",
      "You're giving main character energy and I'm here for it! ⭐",
      "This is sending me - but in the best way possible! 😍",
      "No cap, you understood the assignment! 💯"
    ],
    suggestions: {
      'y2k': [
        "Bestie, throw on some chunky platforms and you'll be serving Y2K princess! 👑",
        "The metallic vibes are IT - maybe add some chrome accessories? ✨",
        "Low-rise with a baby tee would be absolutely iconic rn! 💗",
        "Holographic bag = instant slay! Trust me on this one 🌈"
      ],
      'old-money': [
        "Giving quiet luxury and we love to see it! Maybe add a silk scarf? 🤍",
        "Pearl earrings would make this look so chic and timeless! 💎",
        "A cashmere cardigan would be the perfect finishing touch! ☁️",
        "Trench coat energy = old money aesthetic perfected! 🧥"
      ],
      'streetwear': [
        "This fit needs some chunky sneakers to complete the vibe! 👟",
        "Oversized hoodie + cargo pants = streetwear perfection! 🔥",
        "A bucket hat would make this look absolutely unmatched! 🧢",
        "Layer up with a bomber jacket for maximum street cred! ✈️"
      ],
      'minimalist': [
        "Less is more and you're proving it! Maybe try all black? 🖤",
        "Clean lines are everything - structured blazer would be perfect! 💼",
        "Minimalist jewelry would elevate this so much! ✨",
        "Monochrome moment = instant sophistication! 🤍"
      ],
      'maximalist': [
        "More is more and we LIVE for it! Add more patterns! 🌈",
        "Mix those textures bestie - velvet with silk would be iconic! ✨",
        "Statement earrings would make this look absolutely iconic! 💎",
        "Bold prints + bright colors = maximalist perfection! 🎨"
      ],
      'coquette': [
        "The feminine energy is immaculate! Maybe add a bow detail? 🎀",
        "Soft pastels would make this look so dreamy! 🌸",
        "Mary Jane shoes = coquette aesthetic goals! 👠",
        "Delicate layered necklaces would be perfect here! ✨"
      ]
    },
    reactions: [
      "Bestie... this is giving EVERYTHING! 💅",
      "I'm literally obsessed with this energy! ⭐",
      "You said 'I'm gonna serve looks today' and meant it! 🔥",
      "The way you understood the assignment... chef's kiss! 💋"
    ]
  };

  const generateGenZResponse = async (userMessage: string) => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const lowerMessage = userMessage.toLowerCase();
    let response = "";
    let suggestions: string[] = [];
    
    if (lowerMessage.includes("hi") || lowerMessage.includes("hello")) {
      response = genZResponses.greetings[Math.floor(Math.random() * genZResponses.greetings.length)];
    } else if (lowerMessage.includes("good") || lowerMessage.includes("great") || lowerMessage.includes("love")) {
      response = genZResponses.compliments[Math.floor(Math.random() * genZResponses.compliments.length)];
    } else if (lowerMessage.includes("improve") || lowerMessage.includes("better") || lowerMessage.includes("help")) {
      const aestheticSuggestions = genZResponses.suggestions[aesthetic as keyof typeof genZResponses.suggestions] || genZResponses.suggestions['y2k'];
      const randomSuggestion = aestheticSuggestions[Math.floor(Math.random() * aestheticSuggestions.length)];
      response = `${genZResponses.reactions[Math.floor(Math.random() * genZResponses.reactions.length)]} ${randomSuggestion}`;
      suggestions = aestheticSuggestions.slice(0, 3);
    } else if (lowerMessage.includes("color")) {
      response = `Bestie, for ${aesthetic} vibes, let me break it down for you! ✨ `;
      if (aesthetic === 'y2k') response += "Metallics, neon pink, electric blue - anything that screams cyber princess! 🤖💖";
      else if (aesthetic === 'old-money') response += "Think neutral queen - cream, camel, navy. Classic never goes out of style! 🤍";
      else if (aesthetic === 'streetwear') response += "Black, white, grey with pops of bright colors - keep it urban! 🏙️";
      else response += "Whatever makes you feel like THAT girl! 💅";
    } else if (lowerMessage.includes("shop") || lowerMessage.includes("buy") || lowerMessage.includes("where")) {
      response = "Bestie, I can totally help you find the perfect pieces! Check out the shopping suggestions I'm about to drop! 🛍️✨";
      suggestions = [
        "Zara for trendy pieces",
        "ASOS for unique finds",
        "Urban Outfitters for streetwear",
        "& Other Stories for chic basics"
      ];
    } else {
      response = `${genZResponses.reactions[Math.floor(Math.random() * genZResponses.reactions.length)]} Let me give you some specific advice for your ${aesthetic} moment! 💅`;
      const aestheticSuggestions = genZResponses.suggestions[aesthetic as keyof typeof genZResponses.suggestions] || genZResponses.suggestions['y2k'];
      suggestions = aestheticSuggestions.slice(0, 2);
    }
    
    setIsLoading(false);
    
    const aiMessage: Message = {
      id: Date.now().toString(),
      text: response,
      isUser: false,
      timestamp: new Date(),
      suggestions: suggestions.length > 0 ? suggestions : undefined
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
    
    await generateGenZResponse(inputMessage);
  };

  const handleQuickResponse = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dark-card border-gray-700 text-white max-w-2xl h-[700px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Sparkles className="text-neon-pink" size={24} />
            <span>AI Style Bestie</span>
            <span className="text-xs bg-neon-purple px-2 py-1 rounded-full">PREMIUM</span>
          </DialogTitle>
        </DialogHeader>
        
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-gray-900/50 rounded-lg">
          {messages.map((message) => (
            <div key={message.id} className="space-y-2">
              <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    message.isUser
                      ? 'bg-gradient-to-r from-neon-pink to-neon-purple text-white'
                      : 'bg-gray-700 text-gray-100'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
              </div>
              
              {/* Suggestions */}
              {message.suggestions && (
                <div className="flex justify-start">
                  <div className="max-w-md space-y-2">
                    {message.suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        onClick={() => handleQuickResponse(suggestion)}
                        variant="outline"
                        className="text-left justify-start text-xs h-auto py-2 px-3 border-gray-600 hover:bg-gray-700 text-gray-300"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-700 text-gray-100 px-4 py-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-neon-pink rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-neon-pink rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-neon-pink rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  <span className="text-sm ml-2">Your bestie is typing...</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 py-2">
          <Button
            onClick={() => handleQuickResponse("How can I improve this outfit?")}
            variant="outline"
            size="sm"
            className="border-gray-600 text-xs"
          >
            💅 Improve my fit
          </Button>
          <Button
            onClick={() => handleQuickResponse("What colors work with this aesthetic?")}
            variant="outline"
            size="sm"
            className="border-gray-600 text-xs"
          >
            🎨 Color advice
          </Button>
          <Button
            onClick={() => handleQuickResponse("Where can I shop for this style?")}
            variant="outline"
            size="sm"
            className="border-gray-600 text-xs"
          >
            🛍️ Shopping help
          </Button>
        </div>
        
        {/* Input Area */}
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask your style bestie anything..."
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

export default EnhancedAIStyleAssistant;
