
import React, { useState, useRef, useEffect } from 'react';
import { Pin, Upload, Clock, Calendar, Plus, X, Check, AlertCircle, ExternalLink } from 'lucide-react';
import { MOCK_BULLETIN_POSTS } from '../constants';
import { Profile, BulletinPost } from '../types';

interface BulletinBoardProps {
  profile: Profile;
  onUpdateProfile: (updated: Profile) => void;
}

const BulletinBoard: React.FC<BulletinBoardProps> = ({ profile, onUpdateProfile }) => {
  // State
  const [posts, setPosts] = useState<BulletinPost[]>(MOCK_BULLETIN_POSTS);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newFlyerImage, setNewFlyerImage] = useState<string | null>(null);
  const [newFlyerTitle, setNewFlyerTitle] = useState('');
  const [newFlyerLink, setNewFlyerLink] = useState('');
  const [isPinning, setIsPinning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Logic: Check if user is allowed to post (2 per month)
  const canPost = (() => {
    if (!profile.flyerPostHistory || profile.flyerPostHistory.length === 0) return true;
    
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    // Count posts in the last 30 days
    const recentPosts = profile.flyerPostHistory.filter(dateStr => {
        const postDate = new Date(dateStr);
        return postDate > thirtyDaysAgo;
    });

    return recentPosts.length < 2;
  })();

  const daysUntilNextPost = (() => {
      if (!profile.flyerPostHistory || profile.flyerPostHistory.length < 2) return 0;
      
      // Find the oldest post in the current "window" of active posts
      // Sort history descending (newest first) just to be safe, though logic needs oldest
      const sortedHistory = [...profile.flyerPostHistory].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
      
      // If we have 2 or more posts, we need the date of the one that will "expire" from the count first
      // That is the (length - 2)th item if we consider we want to free up a slot
      // Simplified: Just look at the oldest relevant post that is blocking us.
      // For 2 post limit: The one that happened roughly 30 days ago.
      
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const recentPosts = sortedHistory.filter(d => new Date(d) > thirtyDaysAgo);
      
      if (recentPosts.length < 2) return 0;

      // The oldest of the recent posts determines when the slot frees up
      const oldestRecentPost = new Date(recentPosts[0]);
      const nextAvailableDate = new Date(oldestRecentPost);
      nextAvailableDate.setDate(oldestRecentPost.getDate() + 30);
      
      const diffTime = nextAvailableDate.getTime() - now.getTime();
      const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return days > 0 ? days : 0;
  })();

  // Filter expired posts
  const activePosts = posts.filter(post => {
      const expiry = new Date(post.expiryDate);
      const now = new Date();
      return expiry > now;
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewFlyerImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handlePinFlyer = () => {
      if (!newFlyerImage || !newFlyerTitle) return;

      setIsPinning(true);

      // Simulate processing and animation delay
      setTimeout(() => {
          const now = new Date();
          const newPost: BulletinPost = {
              id: Date.now().toString(),
              userId: 'current-user',
              username: profile.username || 'Me',
              userAvatar: profile.avatarUrl,
              title: newFlyerTitle,
              imageUrl: newFlyerImage,
              linkUrl: newFlyerLink.trim() || undefined,
              postedDate: now.toISOString(),
              expiryDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(), // +14 Days
          };

          setPosts([newPost, ...posts]);
          
          // Update User Profile to record the post date in history
          const newHistory = [...(profile.flyerPostHistory || []), now.toISOString()];
          onUpdateProfile({
              ...profile,
              flyerPostHistory: newHistory
          });

          // Reset Modal
          setIsPinning(false);
          setShowUploadModal(false);
          setNewFlyerImage(null);
          setNewFlyerTitle('');
          setNewFlyerLink('');
      }, 1500);
  };

  // Helper to calculate days left
  const getDaysLeft = (expiryStr: string) => {
      const expiry = new Date(expiryStr);
      const now = new Date();
      const diffTime = expiry.getTime() - now.getTime();
      const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return days > 0 ? days : 0;
  };

  return (
    <div className="h-full flex flex-col relative bg-[#080808]">
        {/* Header */}
        <div className="p-8 border-b border-gray-800 bg-black/50 backdrop-blur-sm z-10 sticky top-0 flex items-center justify-between">
            <div>
                <h2 className="text-3xl font-bold text-white flex items-center space-x-3">
                    <Pin className="text-yellow-500 rotate-45" />
                    <span>Community Board</span>
                </h2>
                <p className="text-gray-400 text-sm mt-1">Pin your monthly event flyer for the Goat Unit network.</p>
            </div>
            
            {canPost ? (
                <button 
                    onClick={() => setShowUploadModal(true)}
                    className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6 py-3 rounded-xl flex items-center space-x-2 transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)]"
                >
                    <Plus size={20} />
                    <span>Pin New Flyer</span>
                </button>
            ) : (
                <div className="bg-gray-900 border border-gray-800 text-gray-400 px-4 py-2 rounded-lg flex items-center space-x-2 text-xs">
                    <Clock size={14} />
                    <span>Limit reached. Next post in {daysUntilNextPost} days</span>
                </div>
            )}
        </div>

        {/* Board Grid */}
        <div className="flex-1 overflow-y-auto p-8 relative">
            {/* Background Mesh Pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

            {activePosts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-600 border-2 border-dashed border-gray-800 rounded-2xl">
                    <Pin size={48} className="mb-4 opacity-20" />
                    <p>The board is empty. Be the first to pin something!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {activePosts.map((post, index) => {
                        const daysLeft = getDaysLeft(post.expiryDate);
                        // Random rotation for visual flair
                        const rot = index % 2 === 0 ? 'rotate-1' : '-rotate-1';
                        
                        return (
                            <div 
                                key={post.id} 
                                className={`group relative bg-white p-3 shadow-xl rounded-sm transform transition-transform hover:scale-[1.02] hover:rotate-0 hover:z-10 duration-300 ${rot} animate-in fade-in zoom-in-95 duration-500 flex flex-col h-full`}
                            >
                                {/* Physical Pin Graphic */}
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20 drop-shadow-md">
                                    <div className="w-4 h-4 rounded-full bg-red-600 border-2 border-red-800 shadow-inner"></div>
                                    <div className="w-1 h-3 bg-gray-400 mx-auto opacity-50"></div>
                                </div>

                                {/* Image */}
                                <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden mb-3 border border-gray-200">
                                    <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                                    <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm">
                                        Expires in {daysLeft}d
                                    </div>
                                </div>

                                {/* Footer Info */}
                                <div className="px-1 flex flex-col flex-1">
                                    <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2 truncate">{post.title}</h3>
                                    <div className="mt-auto pt-3 border-t border-gray-200 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <img src={post.userAvatar || 'https://placehold.co/100x100/333/fff?text=User'} alt="user" className="w-6 h-6 rounded-full border border-gray-300" />
                                                <span className="text-xs font-medium text-gray-600">@{post.username}</span>
                                            </div>
                                            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Verified</span>
                                        </div>
                                        
                                        {post.linkUrl && (
                                            <a 
                                              href={post.linkUrl} 
                                              target="_blank" 
                                              rel="noreferrer"
                                              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 rounded flex items-center justify-center space-x-1 transition-colors"
                                            >
                                                <span>More Info</span>
                                                <ExternalLink size={12} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <div className="bg-[#111] border border-gray-800 rounded-2xl w-full max-w-lg p-8 shadow-2xl relative flex flex-col max-h-[90vh] overflow-y-auto">
                    <button onClick={() => setShowUploadModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                    
                    <h3 className="text-2xl font-bold text-white mb-2">Pin a Flyer</h3>
                    <div className="flex items-start space-x-2 text-sm text-gray-400 mb-6 bg-blue-900/10 p-3 rounded-lg border border-blue-500/20">
                        <AlertCircle size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
                        <p>
                            Your flyer will be visible to the entire community for <span className="text-white font-bold">14 days</span>. 
                            Limit <span className="text-white font-bold">2 posts per month</span>.
                        </p>
                    </div>

                    <div className="space-y-5">
                        {/* Image Input */}
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-xl h-48 flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden ${newFlyerImage ? 'border-green-500 bg-black' : 'border-gray-700 hover:border-gray-500 hover:bg-gray-900'}`}
                        >
                            {newFlyerImage ? (
                                <img src={newFlyerImage} alt="Preview" className="w-full h-full object-contain" />
                            ) : (
                                <>
                                    <Upload size={32} className="text-gray-500 mb-2" />
                                    <span className="text-sm text-gray-400 font-medium">Click to upload flyer</span>
                                    <span className="text-xs text-gray-600 mt-1">JPG, PNG (Max 5MB)</span>
                                </>
                            )}
                            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                        </div>

                        {/* Title Input */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Event Title / Headline</label>
                            <input 
                                type="text" 
                                value={newFlyerTitle}
                                onChange={(e) => setNewFlyerTitle(e.target.value)}
                                placeholder="e.g. Summer Networking Bash"
                                className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-yellow-500 outline-none"
                            />
                        </div>

                        {/* Link Input */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Event Link / More Info URL (Optional)</label>
                            <input 
                                type="text" 
                                value={newFlyerLink}
                                onChange={(e) => setNewFlyerLink(e.target.value)}
                                placeholder="e.g. https://eventbrite.com/..."
                                className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-yellow-500 outline-none"
                            />
                        </div>

                        <button 
                            onClick={handlePinFlyer}
                            disabled={!newFlyerImage || !newFlyerTitle || isPinning}
                            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            {isPinning ? (
                                <span className="animate-pulse">Pinning to board...</span>
                            ) : (
                                <>
                                    <Pin size={20} className="fill-black" />
                                    <span>Pin It Now</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default BulletinBoard;
