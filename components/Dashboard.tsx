
import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Link as LinkIcon, TrendingUp, Activity, Zap, Copy, Check, Share2, ExternalLink } from 'lucide-react';
import { LinkItem, Profile } from '../types';

interface DashboardProps {
  profile: Profile;
  activeLinksCount: number;
}

const Dashboard: React.FC<DashboardProps> = ({ profile, activeLinksCount }) => {
  // Simulation State
  const [views, setViews] = useState(12420);
  const [leads, setLeads] = useState(843);
  const [liveUsers, setLiveUsers] = useState(18);
  const [copied, setCopied] = useState(false);

  const publicUrl = `goatunit.com/${profile.username}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    // Simulate View Counter increasing (every 2-5 seconds)
    const viewInterval = setInterval(() => {
      setViews(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 3000);

    // Simulate Live Users fluctuating (every 1.5 seconds)
    const liveInterval = setInterval(() => {
      setLiveUsers(prev => {
        const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const newValue = prev + change;
        return newValue < 5 ? 5 : newValue; // Min 5 users
      });
    }, 1500);

    // Simulate New Lead (rare event, every 15-30 seconds)
    const leadInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setLeads(prev => prev + 1);
      }
    }, 8000);

    return () => {
      clearInterval(viewInterval);
      clearInterval(liveInterval);
      clearInterval(leadInterval);
    };
  }, []);

  return (
    <div className="h-full flex flex-col p-8 overflow-y-auto">
      
      {/* Welcome & Public Link Header */}
      <div className="mb-10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
             <h2 className="text-3xl font-bold text-white">Dashboard</h2>
             <p className="text-gray-400 mt-1">Welcome back, {profile.displayName}</p>
           </div>
           <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-full">
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </div>
            <span className="text-red-400 text-xs font-bold tracking-wide uppercase">{liveUsers} Live Visitors</span>
          </div>
        </div>

        {/* Public Link Card */}
        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none"></div>
           
           <div className="flex items-center space-x-4 z-10">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400">
                <Share2 size={24} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-1">Your Public Link</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-xl text-white font-mono">{publicUrl}</span>
                  <a href="#" target="_blank" className="text-gray-500 hover:text-white transition-colors">
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
           </div>

           <button 
            onClick={handleCopyLink}
            className="flex items-center space-x-2 bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all active:scale-95 z-10 min-w-[140px] justify-center"
           >
             {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
             <span>{copied ? 'Copied!' : 'Copy Link'}</span>
           </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        {/* Stat Card 1: Views */}
        <div className="bg-[#111] border border-gray-800 p-6 rounded-2xl relative overflow-hidden group hover:border-gray-700 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity size={80} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center space-x-2 text-gray-400 mb-2">
              <BarChart3 size={18} />
              <span className="text-sm font-medium">Total Views</span>
            </div>
            <div className="text-4xl font-bold text-white tabular-nums transition-all">{views.toLocaleString()}</div>
            <div className="text-xs text-green-400 mt-2 flex items-center">
              <TrendingUp size={12} className="mr-1" />
              Live updating
            </div>
          </div>
        </div>

        {/* Stat Card 2: Leads */}
        <div className="bg-[#111] border border-gray-800 p-6 rounded-2xl relative overflow-hidden group hover:border-gray-700 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users size={80} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center space-x-2 text-gray-400 mb-2">
              <Users size={18} />
              <span className="text-sm font-medium">Total Leads</span>
            </div>
            <div className="text-4xl font-bold text-white tabular-nums">{leads.toLocaleString()}</div>
            <div className="text-xs text-green-400 mt-2 flex items-center">
              <Zap size={12} className="mr-1" />
              +5 new today
            </div>
          </div>
        </div>

        {/* Stat Card 3: Active Links */}
        <div className="bg-[#111] border border-gray-800 p-6 rounded-2xl relative overflow-hidden group hover:border-gray-700 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <LinkIcon size={80} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center space-x-2 text-gray-400 mb-2">
              <LinkIcon size={18} />
              <span className="text-sm font-medium">Active Links</span>
            </div>
            <div className="text-4xl font-bold text-white">{activeLinksCount}</div>
            <div className="text-xs text-gray-500 mt-2">
              Visible on your card
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder content for "Recent Activity" */}
      <div className="flex-1 bg-[#111] border border-gray-800 rounded-2xl p-6 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Live Activity Feed</h3>
          <span className="text-xs text-gray-500 uppercase tracking-wider">Real-time</span>
        </div>
        
        <div className="space-y-4 overflow-hidden relative">
           {/* Simulated feed items */}
           <div className="flex items-center space-x-3 text-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
             <div className="w-2 h-2 rounded-full bg-green-500"></div>
             <span className="text-gray-400"><span className="text-white font-medium">New visitor</span> from Los Angeles, USA</span>
             <span className="text-gray-600 text-xs ml-auto">Just now</span>
           </div>
           <div className="flex items-center space-x-3 text-sm opacity-80">
             <div className="w-2 h-2 rounded-full bg-blue-500"></div>
             <span className="text-gray-400"><span className="text-white font-medium">Clicked Link</span> "Instagram"</span>
             <span className="text-gray-600 text-xs ml-auto">2s ago</span>
           </div>
           <div className="flex items-center space-x-3 text-sm opacity-60">
             <div className="w-2 h-2 rounded-full bg-green-500"></div>
             <span className="text-gray-400"><span className="text-white font-medium">New visitor</span> from London, UK</span>
             <span className="text-gray-600 text-xs ml-auto">5s ago</span>
           </div>
           <div className="flex items-center space-x-3 text-sm opacity-40">
             <div className="w-2 h-2 rounded-full bg-purple-500"></div>
             <span className="text-gray-400"><span className="text-white font-medium">Lead Capture</span> "Bob Smith"</span>
             <span className="text-gray-600 text-xs ml-auto">12s ago</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
