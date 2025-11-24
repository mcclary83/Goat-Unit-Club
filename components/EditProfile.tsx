
import React, { useState, useRef, useEffect } from 'react';
import { Upload, AlertCircle, Check, X, ZoomIn, ZoomOut, Move, Palette, Layout, BoxSelect, Youtube, Sparkles, Wand2, Loader2, Trash2, Music, Mic2, Plus, FileAudio, ShoppingBag } from 'lucide-react';
import { Profile, ButtonStyle, ContactMethod, ContactType, MusicTrack } from '../types';
import { GoogleGenAI } from "@google/genai";

// Fix for TypeScript build error regarding 'process'
declare const process: any;

interface EditProfileProps {
  profile: Profile;
  onUpdateProfile: (updated: Profile) => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ profile, onUpdateProfile }) => {
  const [localProfile, setLocalProfile] = useState<Profile>(profile);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Cropping State
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [cropScale, setCropScale] = useState(1);
  const [cropPosition, setCropPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // AI Gen State
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [generatedBgPreview, setGeneratedBgPreview] = useState<string | null>(null);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const product1ImageRef = useRef<HTMLInputElement>(null);
  const product2ImageRef = useRef<HTMLInputElement>(null);
  
  // Music Manager State
  const [newTrack, setNewTrack] = useState<Partial<MusicTrack>>({ title: '', artist: '' });
  const trackCoverInputRef = useRef<HTMLInputElement>(null);
  const trackAudioInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof Profile, value: any) => {
    setLocalProfile(prev => ({ ...prev, [field]: value }));
    // Live update immediately for better UX, or could debounce if needed
    onUpdateProfile({ ...localProfile, [field]: value });
  };

  const handleSave = () => {
    setSaveStatus('saving');
    // Simulate API call
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 800);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'background' | 'logo' | 'trackCover' | 'product1' | 'product2') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);

    if (type === 'background') {
      // Check GIF size constraint for background
      if (file.type === 'image/gif' && file.size > 50 * 1024 * 1024) {
        setErrorMsg("This GIF is extremely large (over 50MB). Please compress it and upload again.");
        return;
      }
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (type === 'avatar') {
        setCropImageSrc(result);
        setCropPosition({ x: 0, y: 0 });
        setShowCropModal(true);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else if (type === 'logo') {
        handleChange('dashboardLogoUrl', result);
      } else if (type === 'trackCover') {
        setNewTrack(prev => ({ ...prev, coverUrl: result }));
      } else if (type === 'product1') {
        handleChange('product1ImageUrl', result);
      } else if (type === 'product2') {
        handleChange('product2ImageUrl', result);
      } else {
        handleChange('backgroundUrl', result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // For demo purposes, we'll use FileReader to get a Data URL.
    if (file.size > 10 * 1024 * 1024) {
        setErrorMsg("Audio file too large for demo (Limit 10MB). Please use a URL or smaller file.");
        return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
        setNewTrack(prev => ({ ...prev, audioUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const addMusicTrack = () => {
    if (!newTrack.title || !newTrack.artist || !newTrack.audioUrl) {
      setErrorMsg("Please provide at least a title, artist, and audio file.");
      return;
    }

    const track: MusicTrack = {
      id: Date.now().toString(),
      title: newTrack.title,
      artist: newTrack.artist,
      coverUrl: newTrack.coverUrl || 'https://placehold.co/300x300/333/fff?text=Music',
      audioUrl: newTrack.audioUrl
    };

    const updatedPlaylist = [...(localProfile.musicPlaylist || []), track];
    handleChange('musicPlaylist', updatedPlaylist);
    
    // Reset form
    setNewTrack({ title: '', artist: '' });
    if (trackAudioInputRef.current) trackAudioInputRef.current.value = '';
    if (trackCoverInputRef.current) trackCoverInputRef.current.value = '';
  };

  const removeMusicTrack = (id: string) => {
    const updatedPlaylist = localProfile.musicPlaylist.filter(t => t.id !== id);
    handleChange('musicPlaylist', updatedPlaylist);
  };

  const handlePodcastUrlChange = (url: string) => {
      // Extract playlist ID from URL (list=...)
      let id = url;
      try {
          const u = new URL(url);
          const listParam = u.searchParams.get('list');
          if (listParam) id = listParam;
      } catch (e) {
          // If not a URL, assume it's an ID if it looks like one, or leave as is
      }
      handleChange('podcastPlaylistId', id);
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    
    // Safety check for API Key presence
    let apiKey = '';
    try {
      if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
        apiKey = process.env.API_KEY;
      }
    } catch (e) {
      console.warn("Process env not available", e);
    }

    if (!apiKey) {
      setErrorMsg("API Key missing. AI generation unavailable in this environment.");
      return;
    }
    
    setIsGeneratingAi(true);
    setErrorMsg(null);
    setGeneratedBgPreview(null);

    try {
      const ai = new GoogleGenAI({ apiKey });
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: aiPrompt }] },
        config: {
          imageConfig: {
            aspectRatio: "9:16" // Phone portrait aspect ratio
          }
        }
      });

      let foundImage = null;
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            foundImage = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      if (foundImage) {
        setGeneratedBgPreview(foundImage);
      } else {
        setErrorMsg("AI could not generate an image. Please try a different prompt.");
      }

    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to generate image. Please try again.");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const applyGeneratedBg = () => {
    if (generatedBgPreview) {
      handleChange('backgroundUrl', generatedBgPreview);
      setGeneratedBgPreview(null);
      setAiPrompt('');
    }
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    // Auto-fit logic: roughly fit the image within the viewport (approx 250px visible)
    const minDimension = Math.min(naturalWidth, naturalHeight);
    const calculatedScale = 250 / minDimension;
    setCropScale(calculatedScale);
  };

  // Cropper Logic
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - cropPosition.x, y: e.clientY - cropPosition.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setCropPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const performCrop = () => {
    if (!cropImageSrc || !canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const sourceImg = imageRef.current;
    
    if (!ctx) return;
      
    // Constants matching the UI
    const OUTPUT_SIZE = 400;
    const VISUAL_MASK_SIZE = 192; // w-48 = 12rem = 192px
    const RATIO = OUTPUT_SIZE / VISUAL_MASK_SIZE;

    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    
    // Clear
    ctx.clearRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
    
    // Circular Clip
    ctx.beginPath();
    ctx.arc(OUTPUT_SIZE/2, OUTPUT_SIZE/2, OUTPUT_SIZE/2, 0, 2 * Math.PI);
    ctx.clip();

    // Transform Logic to match WYSIWYG
    // 1. Move origin to center of canvas
    ctx.translate(OUTPUT_SIZE/2, OUTPUT_SIZE/2);
    
    // 2. Apply User Translation (scaled up by ratio)
    ctx.translate(cropPosition.x * RATIO, cropPosition.y * RATIO);
    
    // 3. Apply User Scale (scaled up by ratio)
    ctx.scale(cropScale * RATIO, cropScale * RATIO);
    
    // 4. Draw Image centered at current origin
    ctx.drawImage(sourceImg, -sourceImg.naturalWidth/2, -sourceImg.naturalHeight/2);
    
    const croppedDataUrl = canvas.toDataURL('image/png');
    handleChange('avatarUrl', croppedDataUrl);
    setShowCropModal(false);
  };

  const renderButtonStyleOption = (style: ButtonStyle, label?: string) => {
    const isSelected = localProfile.buttonStyle === style;
    
    // Dynamic classes for preview
    let shapeClass = '';
    if (style.includes('square')) shapeClass = 'rounded-none';
    else if (style.includes('pill')) shapeClass = 'rounded-full';
    else shapeClass = 'rounded-lg';

    let lookClass = '';
    if (style.includes('outline')) lookClass = 'border-2 border-blue-500 bg-transparent';
    else if (style.includes('hard-shadow')) lookClass = 'bg-blue-500 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]';
    else lookClass = 'bg-blue-500'; // fill

    return (
      <button
        key={style}
        onClick={() => handleChange('buttonStyle', style)}
        className={`relative group p-2 rounded-xl border-2 transition-all ${isSelected ? 'border-blue-500 bg-blue-500/10' : 'border-transparent hover:bg-gray-800'}`}
      >
        <div className={`w-full h-10 ${shapeClass} ${lookClass} transition-transform group-hover:scale-105`}></div>
        {isSelected && (
          <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-0.5">
            <Check size={12} />
          </div>
        )}
      </button>
    );
  };

  // Contact Method Helpers
  const addContactMethod = () => {
    const newMethod: ContactMethod = {
      id: Date.now().toString(),
      type: 'phone',
      value: ''
    };
    handleChange('contactMethods', [...localProfile.contactMethods, newMethod]);
  };

  const updateContactMethod = (id: string, field: keyof ContactMethod, value: string) => {
    const updatedMethods = localProfile.contactMethods.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    );
    handleChange('contactMethods', updatedMethods);
  };

  const removeContactMethod = (id: string) => {
    handleChange('contactMethods', localProfile.contactMethods.filter(m => m.id !== id));
  };

  return (
    <div className="h-full flex flex-col relative">
      {/* Header */}
      <div className="flex items-center justify-between p-8 border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
        <h2 className="text-3xl font-bold text-white">Edit Profile</h2>
        <button 
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
          className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center space-x-2 ${
            saveStatus === 'saved' 
              ? 'bg-green-500 text-white' 
              : 'bg-white text-black hover:bg-gray-200'
          }`}
        >
          {saveStatus === 'saved' ? (
            <>
              <Check size={16} />
              <span>Saved</span>
            </>
          ) : (
            <span>Save Changes</span>
          )}
        </button>
      </div>

      {/* Scrollable Form Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 pb-24">
        
        {/* Error Toast */}
        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl flex items-center space-x-3">
            <AlertCircle size={20} className="text-red-500" />
            <span className="text-sm">{errorMsg}</span>
            <button onClick={() => setErrorMsg(null)} className="ml-auto text-xs hover:underline">Dismiss</button>
          </div>
        )}

        {/* Admin Store Manager Section */}
        <div className="bg-[#1a1a1a] border border-yellow-900/50 rounded-2xl p-6 space-y-5 relative overflow-hidden">
           {/* Admin Badge */}
           <div className="absolute top-4 right-4 bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider border border-yellow-500/30">
              Admin Only
           </div>

           <h3 className="text-lg font-semibold text-white flex items-center space-x-2 mb-4">
              <ShoppingBag size={18} className="text-yellow-400" />
              <span>Admin Store Settings</span>
           </h3>
           
           <div className="space-y-6">
             {/* Product 1 */}
             <div className="bg-black/30 p-4 rounded-xl border border-gray-800">
                <h4 className="text-sm font-bold text-white mb-3">Product 1: Combo ($30)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-400 mb-1 block uppercase">Square Checkout Link</label>
                    <input 
                      type="text" 
                      value={localProfile.product1SquareUrl}
                      onChange={(e) => handleChange('product1SquareUrl', e.target.value)}
                      placeholder="https://square.link/..."
                      className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-yellow-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-400 mb-1 block uppercase">Product Image</label>
                    <div className="flex items-center space-x-3">
                      <img src={localProfile.product1ImageUrl} alt="Prod 1" className="w-10 h-10 rounded object-cover bg-gray-800" />
                      <input 
                        type="file" 
                        ref={product1ImageRef}
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, 'product1')}
                      />
                      <button 
                        onClick={() => product1ImageRef.current?.click()}
                        className="flex-1 bg-gray-800 hover:bg-gray-700 text-xs text-white py-2 rounded border border-gray-700"
                      >
                        Upload Image
                      </button>
                    </div>
                  </div>
                </div>
             </div>

             {/* Product 2 */}
             <div className="bg-black/30 p-4 rounded-xl border border-gray-800">
                <h4 className="text-sm font-bold text-white mb-3">Product 2: Card Only ($20)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-400 mb-1 block uppercase">Square Checkout Link</label>
                    <input 
                      type="text" 
                      value={localProfile.product2SquareUrl}
                      onChange={(e) => handleChange('product2SquareUrl', e.target.value)}
                      placeholder="https://square.link/..."
                      className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-yellow-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-400 mb-1 block uppercase">Product Image</label>
                    <div className="flex items-center space-x-3">
                      <img src={localProfile.product2ImageUrl} alt="Prod 2" className="w-10 h-10 rounded object-cover bg-gray-800" />
                      <input 
                        type="file" 
                        ref={product2ImageRef}
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, 'product2')}
                      />
                      <button 
                        onClick={() => product2ImageRef.current?.click()}
                        className="flex-1 bg-gray-800 hover:bg-gray-700 text-xs text-white py-2 rounded border border-gray-700"
                      >
                        Upload Image
                      </button>
                    </div>
                  </div>
                </div>
             </div>
           </div>
        </div>
        
        {/* Exclusive Features Section (Admin Content Toggles) */}
        <div className="bg-gradient-to-b from-gray-900 to-[#111] border border-gray-800 rounded-2xl p-6 space-y-5 relative overflow-hidden">
           {/* Decorative glow */}
           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[50px] pointer-events-none rounded-full"></div>
           
           <div className="relative z-10">
             <h3 className="text-lg font-semibold text-white flex items-center space-x-2 mb-4">
                <Sparkles size={18} className="text-yellow-400" />
                <span>Goat Unit Features</span>
             </h3>
             
             <div className="space-y-4">
               
               {/* --- Music Player Section --- */}
               <div className="flex flex-col bg-black/40 rounded-xl border border-gray-800 overflow-hidden transition-all">
                 <div className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                        <Music size={20} />
                        </div>
                        <div>
                        <h4 className="text-sm font-medium text-gray-200">Featured Music Playlist</h4>
                        <p className="text-xs text-gray-500">Show the 3-track curated playlist.</p>
                        </div>
                    </div>
                    <button 
                    onClick={() => handleChange('showMusicPlayer', !localProfile.showMusicPlayer)}
                    className={`w-11 h-6 rounded-full transition-colors relative ${localProfile.showMusicPlayer ? 'bg-purple-600' : 'bg-gray-700'}`}
                    >
                    <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform shadow-sm ${localProfile.showMusicPlayer ? 'translate-x-5' : ''}`} />
                    </button>
                 </div>
                 
                 {/* Music Manager - Only Visible if ON */}
                 {localProfile.showMusicPlayer && (
                    <div className="border-t border-gray-800 p-4 bg-black/20">
                        <h5 className="text-xs font-bold text-gray-400 uppercase mb-3">Manage Tracks</h5>
                        
                        {/* Track List */}
                        <div className="space-y-2 mb-4">
                            {localProfile.musicPlaylist?.map((track, idx) => (
                                <div key={track.id} className="flex items-center justify-between bg-gray-900/50 p-2 rounded-lg border border-gray-800">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-xs text-gray-500 font-mono w-4">{idx + 1}</span>
                                        <img src={track.coverUrl} alt="cover" className="w-8 h-8 rounded object-cover bg-gray-800" />
                                        <div className="flex flex-col">
                                            <span className="text-xs font-medium text-white">{track.title}</span>
                                            <span className="text-xs text-gray-500">{track.artist}</span>
                                        </div>
                                    </div>
                                    <button onClick={() => removeMusicTrack(track.id)} className="p-1.5 text-gray-500 hover:text-red-400">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Add New Track Form */}
                        <div className="bg-gray-900/30 rounded-lg p-3 border border-gray-800/50 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <input 
                                    type="text" 
                                    placeholder="Song Title" 
                                    value={newTrack.title}
                                    onChange={(e) => setNewTrack(prev => ({...prev, title: e.target.value}))}
                                    className="bg-black border border-gray-800 rounded px-2 py-1.5 text-xs text-white focus:border-purple-500 outline-none"
                                />
                                <input 
                                    type="text" 
                                    placeholder="Artist Name" 
                                    value={newTrack.artist}
                                    onChange={(e) => setNewTrack(prev => ({...prev, artist: e.target.value}))}
                                    className="bg-black border border-gray-800 rounded px-2 py-1.5 text-xs text-white focus:border-purple-500 outline-none"
                                />
                            </div>
                            <div className="flex items-center space-x-3">
                                <button 
                                    onClick={() => trackCoverInputRef.current?.click()}
                                    className="flex-1 flex items-center justify-center space-x-2 bg-gray-800 hover:bg-gray-700 py-2 rounded border border-gray-700 text-xs text-gray-300 transition-colors"
                                >
                                    {newTrack.coverUrl ? <Check size={12} className="text-green-400" /> : <Upload size={12} />}
                                    <span>{newTrack.coverUrl ? 'Cover Uploaded' : 'Upload Cover'}</span>
                                </button>
                                <input 
                                    type="file" 
                                    ref={trackCoverInputRef} 
                                    accept="image/*" 
                                    onChange={(e) => handleImageUpload(e, 'trackCover')} 
                                    className="hidden" 
                                />

                                <button 
                                    onClick={() => trackAudioInputRef.current?.click()}
                                    className="flex-1 flex items-center justify-center space-x-2 bg-gray-800 hover:bg-gray-700 py-2 rounded border border-gray-700 text-xs text-gray-300 transition-colors"
                                >
                                    {newTrack.audioUrl ? <FileAudio size={12} className="text-green-400" /> : <Upload size={12} />}
                                    <span>{newTrack.audioUrl ? 'Audio Ready' : 'Upload MP3'}</span>
                                </button>
                                <input 
                                    type="file" 
                                    ref={trackAudioInputRef} 
                                    accept="audio/*" 
                                    onChange={handleAudioUpload} 
                                    className="hidden" 
                                />
                            </div>
                            <button 
                                onClick={addMusicTrack}
                                className="w-full bg-purple-600 hover:bg-purple-500 text-white py-2 rounded text-xs font-bold transition-colors flex items-center justify-center space-x-1"
                            >
                                <Plus size={14} />
                                <span>Add Track to Playlist</span>
                            </button>
                        </div>
                    </div>
                 )}
               </div>

               {/* --- Podcast Toggle Section --- */}
               <div className="flex flex-col bg-black/40 rounded-xl border border-gray-800 overflow-hidden transition-all">
                 <div className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400">
                        <Mic2 size={20} />
                        </div>
                        <div>
                        <h4 className="text-sm font-medium text-gray-200">Video Podcast</h4>
                        <p className="text-xs text-gray-500">Show embedded YouTube Playlist.</p>
                        </div>
                    </div>
                    <button 
                    onClick={() => handleChange('showPodcastPlayer', !localProfile.showPodcastPlayer)}
                    className={`w-11 h-6 rounded-full transition-colors relative ${localProfile.showPodcastPlayer ? 'bg-red-600' : 'bg-gray-700'}`}
                    >
                    <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform shadow-sm ${localProfile.showPodcastPlayer ? 'translate-x-5' : ''}`} />
                    </button>
                 </div>

                 {/* Podcast Manager - Only Visible if ON */}
                 {localProfile.showPodcastPlayer && (
                    <div className="border-t border-gray-800 p-4 bg-black/20 space-y-3">
                        <label className="text-xs font-bold text-gray-400 uppercase">YouTube Playlist URL</label>
                        <input 
                             type="text"
                             value={localProfile.podcastPlaylistId ? `https://youtube.com/playlist?list=${localProfile.podcastPlaylistId}` : ''}
                             onChange={(e) => handlePodcastUrlChange(e.target.value)}
                             placeholder="https://www.youtube.com/playlist?list=PL..."
                             className="w-full bg-black border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none"
                        />
                        <p className="text-[10px] text-gray-500">Paste the full URL of your YouTube playlist.</p>
                    </div>
                 )}
               </div>
               
               <p className="text-[10px] text-gray-600 italic mt-2">* These features appear at the bottom of your profile.</p>
             </div>
           </div>
        </div>

        {/* Dashboard Logo (Branding) */}
        <div className="bg-[#111] border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-200 flex items-center space-x-2 mb-4">
            <Layout size={18} />
            <span>Dashboard Logo</span>
          </h3>
          <div className="flex items-center space-x-6">
            <div className="bg-black/50 border border-gray-800 rounded-lg p-4 flex items-center justify-center w-40 h-24">
              <img 
                src={localProfile.dashboardLogoUrl || "https://placehold.co/400x400/0a0a0a/ffffff.png?text=GOAT+UNIT"} 
                alt="Dashboard Logo" 
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <input 
                type="file" 
                ref={logoInputRef}
                accept="image/png, image/jpeg, image/svg+xml"
                className="hidden"
                onChange={(e) => handleImageUpload(e, 'logo')}
              />
              <button 
                onClick={() => logoInputRef.current?.click()}
                className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors border border-gray-700"
              >
                <Upload size={16} />
                <span>Upload Logo</span>
              </button>
              <p className="text-xs text-gray-500">Replaces the logo in the top-left of the sidebar.</p>
            </div>
          </div>
        </div>

        {/* Button Design Section */}
        <div className="bg-[#111] border border-gray-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-lg font-semibold text-gray-200 flex items-center space-x-2">
            <BoxSelect size={18} />
            <span>Button Design</span>
          </h3>

          {/* Icon Position */}
          <div>
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wide block mb-3">Icon Position</label>
            <div className="flex space-x-4">
              <button
                onClick={() => handleChange('buttonIconPosition', 'left')}
                className={`flex-1 py-3 rounded-xl border flex items-center justify-center space-x-2 transition-all ${
                  localProfile.buttonIconPosition === 'left' 
                    ? 'bg-blue-500/10 border-blue-500 text-blue-400' 
                    : 'bg-black border-gray-800 text-gray-400 hover:bg-gray-900'
                }`}
              >
                <div className="flex items-center bg-current w-4 h-4 rounded-sm opacity-50"></div>
                <div className="h-1 w-8 bg-current rounded-full"></div>
              </button>
              <button
                onClick={() => handleChange('buttonIconPosition', 'right')}
                className={`flex-1 py-3 rounded-xl border flex items-center justify-center space-x-2 transition-all ${
                  localProfile.buttonIconPosition === 'right' 
                    ? 'bg-blue-500/10 border-blue-500 text-blue-400' 
                    : 'bg-black border-gray-800 text-gray-400 hover:bg-gray-900'
                }`}
              >
                <div className="h-1 w-8 bg-current rounded-full"></div>
                <div className="flex items-center bg-current w-4 h-4 rounded-sm opacity-50"></div>
              </button>
            </div>
          </div>

          {/* Style Grid */}
          <div>
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wide block mb-3">Button Style</label>
            <div className="grid grid-cols-3 gap-4">
              {/* Row 1: Solid */}
              {renderButtonStyleOption('fill-square')}
              {renderButtonStyleOption('fill-rounded')}
              {renderButtonStyleOption('fill-pill')}
              
              {/* Row 2: Outline */}
              {renderButtonStyleOption('outline-square')}
              {renderButtonStyleOption('outline-rounded')}
              {renderButtonStyleOption('outline-pill')}

              {/* Row 3: Hard Shadow */}
              {renderButtonStyleOption('hard-shadow-square')}
              {renderButtonStyleOption('hard-shadow-rounded')}
              {renderButtonStyleOption('hard-shadow-pill')}
            </div>
          </div>
        </div>

        {/* Appearance / Colors */}
        <div className="bg-[#111] border border-gray-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-lg font-semibold text-gray-200 flex items-center space-x-2">
            <Palette size={18} />
            <span>Appearance</span>
          </h3>
          
          <div className="grid grid-cols-1 gap-6">
            {/* Text Color */}
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Text Color</label>
              <div className="flex items-center space-x-3">
                <span className="text-xs text-gray-500 font-mono">{localProfile.textColor}</span>
                <input 
                  type="color" 
                  value={localProfile.textColor}
                  onChange={(e) => handleChange('textColor', e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer bg-transparent border-none"
                />
              </div>
            </div>

            {/* Card Background */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Profile Card Background</label>
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-gray-500 font-mono">{localProfile.cardBackgroundColor}</span>
                  <input 
                    type="color" 
                    value={localProfile.cardBackgroundColor}
                    onChange={(e) => handleChange('cardBackgroundColor', e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer bg-transparent border-none"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-3">
                 <span className="text-xs text-gray-500 w-12">Opacity</span>
                 <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={localProfile.cardOpacity}
                  onChange={(e) => handleChange('cardOpacity', parseInt(e.target.value))}
                  className="flex-1 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                 />
                 <span className="text-xs text-gray-500 w-8 text-right">{localProfile.cardOpacity}%</span>
              </div>
            </div>

             {/* Button Color (Primary) */}
             <div className="flex items-center justify-between border-t border-gray-800 pt-4">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Primary Button</label>
              <div className="flex space-x-6">
                <div className="flex flex-col items-end space-y-1">
                   <span className="text-[10px] text-gray-600">Background</span>
                   <input 
                    type="color" 
                    value={localProfile.buttonColor}
                    onChange={(e) => handleChange('buttonColor', e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer bg-transparent border-none"
                  />
                </div>
                 <div className="flex flex-col items-end space-y-1">
                   <span className="text-[10px] text-gray-600">Text</span>
                   <input 
                    type="color" 
                    value={localProfile.buttonTextColor}
                    onChange={(e) => handleChange('buttonTextColor', e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer bg-transparent border-none"
                  />
                </div>
              </div>
            </div>

            {/* Link Color */}
             <div className="space-y-2 border-t border-gray-800 pt-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Link Buttons</label>
                <div className="flex space-x-6">
                   <div className="flex flex-col items-end space-y-1">
                    <span className="text-[10px] text-gray-600">Main Color</span>
                    <input 
                      type="color" 
                      value={localProfile.linkColor}
                      onChange={(e) => handleChange('linkColor', e.target.value)}
                      className="w-6 h-6 rounded cursor-pointer bg-transparent border-none"
                    />
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                     <span className="text-[10px] text-gray-600">Text</span>
                     <input 
                      type="color" 
                      value={localProfile.linkTextColor}
                      onChange={(e) => handleChange('linkTextColor', e.target.value)}
                      className="w-6 h-6 rounded cursor-pointer bg-transparent border-none"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                 <span className="text-xs text-gray-500 w-12">Opacity</span>
                 <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={localProfile.linkOpacity}
                  onChange={(e) => handleChange('linkOpacity', parseInt(e.target.value))}
                  className="flex-1 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                 />
                 <span className="text-xs text-gray-500 w-8 text-right">{localProfile.linkOpacity}%</span>
              </div>
            </div>

          </div>
        </div>

        {/* Profile Photo */}
        <div className="bg-[#111] border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-200">Profile Photo</h3>
          <div className="flex items-center space-x-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-700 bg-gray-800">
                <img src={localProfile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex flex-col space-y-2">
               <input 
                type="file" 
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e, 'avatar')}
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors border border-gray-700"
              >
                <Upload size={16} />
                <span>Upload Photo</span>
              </button>
              <p className="text-xs text-gray-500">Square image, at least 400x400px recommended.</p>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-[#111] border border-gray-800 rounded-2xl p-6 space-y-5">
          <h3 className="text-lg font-semibold mb-4 text-gray-200">Basic Information</h3>
          
          {/* Username / Handle Input */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Username / Handle</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <span className="text-gray-500 font-mono text-sm">goatunit.com/</span>
              </div>
              <input 
                type="text"
                value={localProfile.username || ''}
                onChange={(e) => handleChange('username', e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                className="w-full bg-black border border-gray-800 rounded-lg pl-[115px] pr-4 py-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-mono"
                placeholder="username"
              />
            </div>
             <p className="text-xs text-gray-500 mt-2">This is your unique profile URL.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Display Name</label>
              <input 
                type="text"
                value={localProfile.displayName}
                onChange={(e) => handleChange('displayName', e.target.value)}
                className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                placeholder="e.g. McClary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Job Headline</label>
              <input 
                type="text"
                value={localProfile.headline}
                onChange={(e) => handleChange('headline', e.target.value)}
                className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                placeholder="e.g. International Photographer"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Bio</label>
            <textarea 
              rows={4}
              value={localProfile.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none"
              placeholder="Tell your story..."
            />
            <p className="text-xs text-gray-500 mt-2">
              Tip: Use emojis to make it pop! 📸 🌍 🚀
            </p>
          </div>
        </div>

        {/* Featured Video Section */}
        <div className="bg-[#111] border border-gray-800 rounded-2xl p-6 space-y-5">
          <h3 className="text-lg font-semibold text-gray-200 flex items-center space-x-2">
            <Youtube size={18} className="text-red-500" />
            <span>Featured Video</span>
          </h3>
          
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">YouTube URL</label>
            <input 
              type="text"
              value={localProfile.featuredVideoUrl || ''}
              onChange={(e) => handleChange('featuredVideoUrl', e.target.value.trim())}
              className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              placeholder="https://www.youtube.com/watch?v=..."
            />
            <p className="text-xs text-gray-500 mt-2">
              Paste a YouTube link (Shorts supported) to display an embedded video player on your card.
            </p>
          </div>
        </div>

        {/* Contact Details */}
        <div className="bg-[#111] border border-gray-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-200">Contact Details</h3>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400">Show on card</span>
              <button 
                onClick={() => handleChange('showContactInfo', !localProfile.showContactInfo)}
                className={`w-11 h-6 rounded-full transition-colors relative ${localProfile.showContactInfo ? 'bg-blue-600' : 'bg-gray-700'}`}
              >
                <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${localProfile.showContactInfo ? 'translate-x-5' : ''}`} />
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {localProfile.contactMethods.map((method, index) => (
              <div key={method.id} className="flex items-center space-x-3 group">
                <div className="w-32 flex-shrink-0">
                  <select 
                    value={method.type}
                    onChange={(e) => updateContactMethod(method.id, 'type', e.target.value as ContactType)}
                    className="w-full bg-black border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="phone">Phone</option>
                    <option value="email">Email</option>
                    <option value="website">Website</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="x">X (Twitter)</option>
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                  </select>
                </div>
                <div className="flex-1">
                  <input 
                    type="text"
                    value={method.value}
                    onChange={(e) => updateContactMethod(method.id, 'value', e.target.value)}
                    className="w-full bg-black border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none placeholder-gray-700"
                    placeholder={method.type === 'phone' ? '+1 555...' : method.type === 'email' ? 'you@example.com' : 'Username or URL'}
                  />
                </div>
                <button 
                  onClick={() => removeContactMethod(method.id)}
                  className="p-2 text-gray-600 hover:text-red-400 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            
            <button 
              onClick={addContactMethod}
              className="flex items-center space-x-2 text-sm text-blue-400 hover:text-blue-300 transition-colors mt-2"
            >
              <span className="text-lg font-bold">+</span>
              <span>Add Contact Method</span>
            </button>
          </div>
        </div>

        {/* Background Settings */}
        <div className="bg-[#111] border border-gray-800 rounded-2xl p-6 space-y-5">
          <h3 className="text-lg font-semibold text-gray-200">Card Background</h3>
          
          <div className="flex flex-col space-y-4">
            {/* Background Preview */}
            {localProfile.backgroundUrl ? (
              <div className="relative w-full h-40 rounded-xl overflow-hidden border border-gray-700 group">
                <img src={localProfile.backgroundUrl} alt="BG Preview" className="w-full h-full object-cover" />
                <button 
                  onClick={() => handleChange('backgroundUrl', null)}
                  className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="w-full h-40 rounded-xl border-2 border-dashed border-gray-800 flex flex-col items-center justify-center bg-black/30">
                <span className="text-gray-500 text-sm">Default Night Sky Gradient Active</span>
              </div>
            )}

            <input 
                type="file" 
                ref={bgInputRef}
                accept="image/png, image/jpeg, image/gif"
                className="hidden"
                onChange={(e) => handleImageUpload(e, 'background')}
              />
            <button 
              onClick={() => bgInputRef.current?.click()}
              className="w-full flex items-center justify-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded-lg text-sm transition-colors border border-gray-700"
            >
              <Upload size={16} />
              <span>Upload Image or GIF</span>
            </button>

            {/* AI Generator Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#111] px-2 text-gray-500">Or Generate with AI</span>
              </div>
            </div>

            {/* AI Generator */}
            <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/20 rounded-xl p-4 space-y-3">
              <div className="flex items-center space-x-2 text-purple-300 mb-1">
                <Sparkles size={16} />
                <span className="text-sm font-semibold">AI Background Generator</span>
              </div>
              
              <div className="flex space-x-2">
                <input 
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. Neon cityscape, dark marble texture..."
                  className="flex-1 bg-black/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate()}
                />
                <button 
                  onClick={handleAiGenerate}
                  disabled={isGeneratingAi || !aiPrompt.trim()}
                  className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
                >
                  {isGeneratingAi ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
                  <span className="hidden sm:inline">Generate</span>
                </button>
              </div>

              {/* Generated Image Preview */}
              {generatedBgPreview && (
                <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2">
                  <div className="w-full h-48 rounded-lg overflow-hidden border border-purple-500/30 relative">
                    <img src={generatedBgPreview} alt="AI Generated" className="w-full h-full object-cover" />
                  </div>
                  <button 
                    onClick={applyGeneratedBg}
                    className="w-full bg-white text-black font-bold py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                  >
                    Use this Background
                  </button>
                </div>
              )}
            </div>

            <p className="text-xs text-gray-500">Supports JPG, PNG, GIF, and AI Generation.</p>
          </div>
        </div>

        {/* Custom Button Text */}
        <div className="bg-[#111] border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-200">Action Button</h3>
           <div>
               <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Primary Button Text</label>
               <input 
                type="text"
                value={localProfile.primaryButtonText}
                onChange={(e) => handleChange('primaryButtonText', e.target.value)}
                className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                placeholder="Save Contact"
              />
            </div>
        </div>

      </div>

      {/* CROP MODAL */}
      {showCropModal && cropImageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111] border border-gray-800 rounded-2xl w-full max-w-md p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Crop Photo</h3>
              <button onClick={() => setShowCropModal(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Crop Area */}
            <div className="relative w-full h-64 bg-black border border-gray-800 rounded-xl overflow-hidden cursor-move mb-4 select-none touch-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* Image to Crop */}
              <div 
                className="absolute top-1/2 left-1/2 flex items-center justify-center w-full h-full pointer-events-none"
                style={{
                  transform: `translate(-50%, -50%) translate(${cropPosition.x}px, ${cropPosition.y}px) scale(${cropScale})`
                }}
              >
                <img 
                  ref={imageRef}
                  src={cropImageSrc} 
                  onLoad={handleImageLoad}
                  alt="Crop" 
                  className="max-w-none max-h-none"
                  draggable={false}
                />
              </div>

              {/* Circular Mask Overlay - w-48 = 192px */}
              <div className="absolute inset-0 pointer-events-none bg-black/50">
                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]"></div>
              </div>
              
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-[10px] text-white/50 bg-black/50 px-2 py-1 rounded-full pointer-events-none">
                <Move size={10} className="inline mr-1" /> Drag to move
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <ZoomOut size={16} className="text-gray-400" />
                <input 
                  type="range" 
                  min="0.05" 
                  max="5" 
                  step="0.05"
                  value={cropScale}
                  onChange={(e) => setCropScale(parseFloat(e.target.value))}
                  className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <ZoomIn size={16} className="text-gray-400" />
              </div>

              <button 
                onClick={performCrop}
                className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Save Crop
              </button>
            </div>
            
            {/* Hidden Canvas for processing */}
            <canvas ref={canvasRef} className="hidden"></canvas>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
