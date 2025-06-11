
import { useState } from "react";
import { ShoppingBag, ExternalLink, Star, Heart, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ShoppingAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  aesthetic: string;
  budget?: 'low' | 'medium' | 'high';
}

interface Product {
  id: string;
  name: string;
  brand: string;
  price: string;
  image: string;
  link: string;
  rating: number;
  category: string;
  aesthetic: string;
}

const ShoppingAssistant = ({ isOpen, onClose, aesthetic, budget = 'medium' }: ShoppingAssistantProps) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [savedItems, setSavedItems] = useState<string[]>([]);

  const products: Product[] = [
    // Y2K Products
    {
      id: '1',
      name: 'Metallic Platform Boots',
      brand: 'Urban Outfitters',
      price: '$89',
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&h=300&fit=crop',
      link: 'https://urbanoutfitters.com',
      rating: 4.5,
      category: 'shoes',
      aesthetic: 'y2k'
    },
    {
      id: '2',
      name: 'Holographic Mini Bag',
      brand: 'ASOS',
      price: '$45',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
      link: 'https://asos.com',
      rating: 4.2,
      category: 'accessories',
      aesthetic: 'y2k'
    },
    // Old Money Products
    {
      id: '3',
      name: 'Cashmere Blazer',
      brand: 'COS',
      price: '$199',
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop',
      link: 'https://cosstores.com',
      rating: 4.8,
      category: 'clothing',
      aesthetic: 'old-money'
    },
    {
      id: '4',
      name: 'Pearl Drop Earrings',
      brand: '& Other Stories',
      price: '$65',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop',
      link: 'https://stories.com',
      rating: 4.6,
      category: 'accessories',
      aesthetic: 'old-money'
    },
    // Streetwear Products
    {
      id: '5',
      name: 'Oversized Graphic Hoodie',
      brand: 'Stussy',
      price: '$120',
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=300&fit=crop',
      link: 'https://stussy.com',
      rating: 4.7,
      category: 'clothing',
      aesthetic: 'streetwear'
    },
    {
      id: '6',
      name: 'Chunky White Sneakers',
      brand: 'Nike',
      price: '$130',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop',
      link: 'https://nike.com',
      rating: 4.9,
      category: 'shoes',
      aesthetic: 'streetwear'
    },
    // Coquette Products
    {
      id: '7',
      name: 'Silk Bow Hair Clips',
      brand: 'Ganni',
      price: '$35',
      image: 'https://images.unsplash.com/photo-1583292650898-7d22cd27ca6f?w=300&h=300&fit=crop',
      link: 'https://ganni.com',
      rating: 4.4,
      category: 'accessories',
      aesthetic: 'coquette'
    },
    {
      id: '8',
      name: 'Pink Midi Skirt',
      brand: 'Reformation',
      price: '$88',
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop',
      link: 'https://reformation.com',
      rating: 4.3,
      category: 'clothing',
      aesthetic: 'coquette'
    }
  ];

  const categories = ['all', 'clothing', 'shoes', 'accessories'];

  const filteredProducts = products.filter(product => {
    const matchesAesthetic = product.aesthetic === aesthetic;
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesAesthetic && matchesCategory;
  });

  const toggleSaved = (productId: string) => {
    setSavedItems(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const openProductLink = (link: string, productName: string) => {
    window.open(link, '_blank');
    console.log(`Opening product: ${productName}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dark-card border-gray-700 text-white max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <ShoppingBag className="text-neon-yellow" size={24} />
            <span>Shop The Look</span>
            <span className="text-xs bg-neon-purple px-2 py-1 rounded-full">PREMIUM</span>
          </DialogTitle>
        </DialogHeader>
        
        {/* Aesthetic Info */}
        <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-bold mb-2">
            {aesthetic.charAt(0).toUpperCase() + aesthetic.slice(1).replace('-', ' ')} Curated Picks
          </h3>
          <p className="text-gray-300 text-sm">
            Handpicked items that perfectly match your aesthetic. All links are affiliate - supporting your style journey! ✨
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? "default" : "outline"}
              className={selectedCategory === category ? "bg-neon-pink" : "border-gray-600"}
              size="sm"
            >
              <Filter size={14} className="mr-1" />
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform">
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <Button
                  onClick={() => toggleSaved(product.id)}
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2 bg-black/70 border-none hover:bg-black/90"
                >
                  <Heart 
                    size={16} 
                    className={savedItems.includes(product.id) ? "fill-red-500 text-red-500" : "text-white"}
                  />
                </Button>
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400 uppercase">{product.brand}</span>
                  <div className="flex items-center">
                    <Star className="text-yellow-400" size={12} />
                    <span className="text-xs ml-1">{product.rating}</span>
                  </div>
                </div>
                
                <h4 className="font-bold text-sm mb-2 line-clamp-2">{product.name}</h4>
                
                <div className="flex items-center justify-between">
                  <span className="text-neon-green font-bold">{product.price}</span>
                  <Button
                    onClick={() => openProductLink(product.link, product.name)}
                    className="bg-gradient-to-r from-neon-pink to-neon-purple hover:from-neon-purple hover:to-neon-pink text-white text-xs py-1 px-3"
                  >
                    <ExternalLink size={12} className="mr-1" />
                    Shop
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <ShoppingBag size={48} className="mx-auto mb-4 opacity-50" />
            <p>No products found for this category</p>
            <p className="text-sm">Try a different filter!</p>
          </div>
        )}

        {/* Saved Items Count */}
        {savedItems.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-300">
              💖 {savedItems.length} item{savedItems.length !== 1 ? 's' : ''} saved to wishlist
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ShoppingAssistant;
