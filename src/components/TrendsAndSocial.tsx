
import { useState } from "react";
import { TrendingUp, Heart, MessageCircle, Share2, Crown, Fire } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface TrendsAndSocialProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TrendPost {
  id: string;
  title: string;
  description: string;
  image: string;
  aesthetic: string;
  likes: number;
  comments: number;
  isHot: boolean;
}

interface VotingOutfit {
  id: string;
  image: string;
  aesthetic: string;
  votes: number;
  hasVoted: boolean;
}

const TrendsAndSocial = ({ isOpen, onClose }: TrendsAndSocialProps) => {
  const [activeTab, setActiveTab] = useState<'trends' | 'voting'>('trends');
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [votedOutfits, setVotedOutfits] = useState<string[]>([]);

  const trendPosts: TrendPost[] = [
    {
      id: '1',
      title: 'Y2K Chrome is BACK',
      description: 'Metallic accessories are dominating TikTok feeds. Think chrome bags, silver jewelry, and holographic everything!',
      image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=300&fit=crop',
      aesthetic: 'y2k',
      likes: 1234,
      comments: 89,
      isHot: true
    },
    {
      id: '2',
      title: 'Quiet Luxury Trend',
      description: 'Old money aesthetic is having a moment. Neutral tones, quality fabrics, and timeless pieces are key.',
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=300&fit=crop',
      aesthetic: 'old-money',
      likes: 987,
      comments: 56,
      isHot: true
    },
    {
      id: '3',
      title: 'Oversized Everything',
      description: 'Streetwear is going bigger! Oversized hoodies, baggy jeans, and chunky sneakers are the move.',
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop',
      aesthetic: 'streetwear',
      likes: 756,
      comments: 43,
      isHot: false
    },
    {
      id: '4',
      title: 'Coquette Core Rising',
      description: 'Bows, pastels, and feminine details are everywhere. The coquette aesthetic is taking over!',
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=300&fit=crop',
      aesthetic: 'coquette',
      likes: 892,
      comments: 67,
      isHot: true
    }
  ];

  const votingOutfits: VotingOutfit[] = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop',
      aesthetic: 'maximalist',
      votes: 234,
      hasVoted: false
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&h=400&fit=crop',
      aesthetic: 'minimalist',
      votes: 189,
      hasVoted: false
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=300&h=400&fit=crop',
      aesthetic: 'y2k',
      votes: 342,
      hasVoted: false
    },
    {
      id: '4',
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=400&fit=crop',
      aesthetic: 'streetwear',
      votes: 276,
      hasVoted: false
    }
  ];

  const toggleLike = (postId: string) => {
    setLikedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const voteOutfit = (outfitId: string, rating: 'hot' | 'not') => {
    if (votedOutfits.includes(outfitId)) {
      toast.error("You've already voted on this outfit!");
      return;
    }

    setVotedOutfits(prev => [...prev, outfitId]);
    
    if (rating === 'hot') {
      toast.success("Voted HOT! 🔥");
    } else {
      toast.success("Voted NOT 😬");
    }
  };

  const sharePost = (postTitle: string) => {
    if (navigator.share) {
      navigator.share({
        title: postTitle,
        text: `Check out this trend: ${postTitle}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(`Check out this trend: ${postTitle} - ${window.location.href}`);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dark-card border-gray-700 text-white max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Fire className="text-neon-yellow" size={24} />
            <span>Trends & Community</span>
            <span className="text-xs bg-neon-purple px-2 py-1 rounded-full">PREMIUM</span>
          </DialogTitle>
        </DialogHeader>
        
        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6">
          <Button
            onClick={() => setActiveTab('trends')}
            variant={activeTab === 'trends' ? "default" : "outline"}
            className={activeTab === 'trends' ? "bg-neon-pink" : "border-gray-600"}
          >
            <TrendingUp size={16} className="mr-2" />
            Trends Feed
          </Button>
          <Button
            onClick={() => setActiveTab('voting')}
            variant={activeTab === 'voting' ? "default" : "outline"}
            className={activeTab === 'voting' ? "bg-neon-pink" : "border-gray-600"}
          >
            <Crown size={16} className="mr-2" />
            Hot or Not
          </Button>
        </div>

        {/* Trends Feed */}
        {activeTab === 'trends' && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold mb-2">This Week's Hottest Trends</h3>
              <p className="text-gray-300 text-sm">Stay ahead of the fashion curve with trending looks from TikTok and Instagram!</p>
            </div>

            {trendPosts.map((post) => (
              <div key={post.id} className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                  <div className="relative">
                    <img src={post.image} alt={post.title} className="w-full h-48 md:h-full object-cover" />
                    {post.isHot && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                        <Fire size={12} className="mr-1" />
                        HOT
                      </div>
                    )}
                  </div>
                  
                  <div className="md:col-span-2 p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xl font-bold">{post.title}</h4>
                      <span className="text-xs bg-neon-purple px-2 py-1 rounded-full capitalize">
                        {post.aesthetic.replace('-', ' ')}
                      </span>
                    </div>
                    
                    <p className="text-gray-300 mb-4 leading-relaxed">{post.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Button
                          onClick={() => toggleLike(post.id)}
                          variant="ghost"
                          className="flex items-center space-x-1 hover:bg-gray-700"
                        >
                          <Heart 
                            size={16} 
                            className={likedPosts.includes(post.id) ? "fill-red-500 text-red-500" : "text-gray-400"}
                          />
                          <span className="text-sm">{post.likes + (likedPosts.includes(post.id) ? 1 : 0)}</span>
                        </Button>
                        
                        <div className="flex items-center space-x-1 text-gray-400">
                          <MessageCircle size={16} />
                          <span className="text-sm">{post.comments}</span>
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => sharePost(post.title)}
                        variant="outline"
                        className="border-gray-600"
                        size="sm"
                      >
                        <Share2 size={14} className="mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Voting Game */}
        {activeTab === 'voting' && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold mb-2">Hot or Not? 🔥</h3>
              <p className="text-gray-300 text-sm">Vote on community outfits and see what's trending! Your votes help others discover great style.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {votingOutfits.map((outfit) => (
                <div key={outfit.id} className="bg-gray-800 rounded-lg overflow-hidden">
                  <div className="relative">
                    <img src={outfit.image} alt="Community outfit" className="w-full h-80 object-cover" />
                    
                    {/* Overlay voting buttons */}
                    {!votedOutfits.includes(outfit.id) && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <div className="flex space-x-4">
                          <Button
                            onClick={() => voteOutfit(outfit.id, 'hot')}
                            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 text-lg font-bold"
                          >
                            🔥 HOT
                          </Button>
                          <Button
                            onClick={() => voteOutfit(outfit.id, 'not')}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 text-lg font-bold"
                          >
                            😬 NOT
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {/* Voted indicator */}
                    {votedOutfits.includes(outfit.id) && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        ✓ VOTED
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400 capitalize">
                        {outfit.aesthetic.replace('-', ' ')} Aesthetic
                      </span>
                      <span className="text-sm font-bold">
                        {outfit.votes} votes
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-400">
                💡 Tip: Hover over outfits to vote! Help the community discover great style.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TrendsAndSocial;
