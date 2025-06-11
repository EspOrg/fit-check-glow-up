
import { useState, useEffect } from "react";
import { Shirt, Plus, Star, Trash2, Tag, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface OutfitItem {
  id: string;
  image: string;
  label: string;
  category: string;
  aesthetic: string;
  score: number;
  tags: string[];
  dateAdded: Date;
}

interface SmartClosetProps {
  isOpen: boolean;
  onClose: () => void;
  currentImage?: string;
  currentAesthetic?: string;
  currentScore?: number;
  onOutfitSelect: (outfit: OutfitItem) => void;
}

const SmartCloset = ({ 
  isOpen, 
  onClose, 
  currentImage, 
  currentAesthetic, 
  currentScore,
  onOutfitSelect 
}: SmartClosetProps) => {
  const [outfits, setOutfits] = useState<OutfitItem[]>([]);
  const [newLabel, setNewLabel] = useState("");
  const [newTags, setNewTags] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showRecommendations, setShowRecommendations] = useState(false);

  const categories = ["all", "casual", "formal", "party", "interview", "date", "workout"];

  // Load saved outfits from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('smartCloset');
    if (saved) {
      const parsedOutfits = JSON.parse(saved).map((outfit: any) => ({
        ...outfit,
        dateAdded: new Date(outfit.dateAdded)
      }));
      setOutfits(parsedOutfits);
    }
  }, []);

  // Save outfits to localStorage
  const saveOutfits = (updatedOutfits: OutfitItem[]) => {
    localStorage.setItem('smartCloset', JSON.stringify(updatedOutfits));
    setOutfits(updatedOutfits);
  };

  const saveCurrentOutfit = () => {
    if (!currentImage || !newLabel) {
      toast.error("Please provide a label for your outfit");
      return;
    }

    const newOutfit: OutfitItem = {
      id: Date.now().toString(),
      image: currentImage,
      label: newLabel,
      category: selectedCategory === "all" ? "casual" : selectedCategory,
      aesthetic: currentAesthetic || "minimalist",
      score: currentScore || 5,
      tags: newTags.split(',').map(tag => tag.trim()).filter(Boolean),
      dateAdded: new Date()
    };

    const updatedOutfits = [...outfits, newOutfit];
    saveOutfits(updatedOutfits);
    
    setNewLabel("");
    setNewTags("");
    toast.success("Outfit saved to your closet! 👗");
  };

  const deleteOutfit = (id: string) => {
    const updatedOutfits = outfits.filter(outfit => outfit.id !== id);
    saveOutfits(updatedOutfits);
    toast.success("Outfit removed from closet");
  };

  const getRecommendations = () => {
    // Simple recommendation logic based on highest scores and similar aesthetics
    const recommendations = outfits
      .filter(outfit => outfit.score >= 7)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    return recommendations;
  };

  const generateOutfitCombination = () => {
    if (outfits.length < 2) {
      toast.error("Add more outfits to get combinations!");
      return;
    }

    const randomOutfits = outfits
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);

    toast.success(
      `Try combining: "${randomOutfits[0].label}" with elements from "${randomOutfits[1].label}"!`
    );
  };

  const filteredOutfits = selectedCategory === "all" 
    ? outfits 
    : outfits.filter(outfit => outfit.category === selectedCategory);

  const recommendations = getRecommendations();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dark-card border-gray-700 text-white max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shirt className="text-neon-green" size={24} />
            <span>Smart Closet</span>
            <span className="text-xs bg-neon-purple px-2 py-1 rounded-full">PREMIUM</span>
          </DialogTitle>
        </DialogHeader>
        
        {/* Save Current Outfit */}
        {currentImage && (
          <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-bold mb-3">Save Current Outfit</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <img src={currentImage} alt="Current outfit" className="w-full h-32 object-cover rounded-lg" />
                <p className="text-center text-sm mt-2">Score: {currentScore}/10</p>
              </div>
              <div className="space-y-3">
                <Input
                  placeholder="Label (e.g., Interview Outfit)"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="bg-gray-700 border-gray-600"
                />
                <Input
                  placeholder="Tags (comma separated)"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <div className="flex items-center">
                <Button
                  onClick={saveCurrentOutfit}
                  className="w-full bg-gradient-to-r from-neon-green to-neon-blue hover:from-neon-blue hover:to-neon-green"
                >
                  <Plus size={16} className="mr-2" />
                  Save to Closet
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold">Top Recommendations</h3>
              <Button
                onClick={generateOutfitCombination}
                variant="outline"
                className="border-gray-600"
              >
                <Shuffle size={16} className="mr-2" />
                Mix & Match
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendations.map((outfit) => (
                <div
                  key={outfit.id}
                  className="bg-gray-800 rounded-lg p-3 cursor-pointer hover:bg-gray-700 transition-colors"
                  onClick={() => onOutfitSelect(outfit)}
                >
                  <img src={outfit.image} alt={outfit.label} className="w-full h-32 object-cover rounded-lg mb-2" />
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{outfit.label}</span>
                    <div className="flex items-center">
                      <Star className="text-yellow-400" size={12} />
                      <span className="text-xs ml-1">{outfit.score}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? "default" : "outline"}
              className={selectedCategory === category ? "bg-neon-pink" : "border-gray-600"}
              size="sm"
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>

        {/* Outfits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOutfits.map((outfit) => (
            <div key={outfit.id} className="bg-gray-800 rounded-lg p-4">
              <div className="relative">
                <img 
                  src={outfit.image} 
                  alt={outfit.label} 
                  className="w-full h-48 object-cover rounded-lg mb-3 cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => onOutfitSelect(outfit)}
                />
                <Button
                  onClick={() => deleteOutfit(outfit.id)}
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2 bg-red-500/80 border-red-500 hover:bg-red-600"
                >
                  <Trash2 size={12} />
                </Button>
              </div>
              
              <h4 className="font-bold mb-2">{outfit.label}</h4>
              <div className="flex items-center justify-between text-sm text-gray-300 mb-2">
                <span>{outfit.category}</span>
                <div className="flex items-center">
                  <Star className="text-yellow-400" size={12} />
                  <span className="ml-1">{outfit.score}/10</span>
                </div>
              </div>
              
              {outfit.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {outfit.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gray-700 px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredOutfits.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Shirt size={48} className="mx-auto mb-4 opacity-50" />
            <p>No outfits in this category yet</p>
            <p className="text-sm">Start saving your favorite looks!</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SmartCloset;
