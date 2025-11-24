
import React from 'react';
import { 
  LayoutDashboard, 
  UserPen, 
  Link as LinkIcon, 
  UserPlus,
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  ShoppingBag,
  Globe,
  Pin,
  X
} from 'lucide-react';
import { ViewState, Profile } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  profile: Profile;
  onLogout?: () => void;
  onClose?: () => void; // Added for mobile menu
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, profile, onLogout, onClose }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'store', label: 'Store', icon: ShoppingBag },
    { id: 'community', label: 'Global Network', icon: Globe },
    { id: 'bulletin', label: 'Community Board', icon: Pin },
    { id: 'edit-profile', label: 'Edit Profile', icon: UserPen },
    { id: 'links', label: 'Links', icon: LinkIcon },
    { id: 'leads', label: 'Leads', icon: UserPlus },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'options', label: 'Card Options', icon: Settings },
  ];

  return (
    <div className="w-64 bg-[#0a0a0a] border-r border-gray-800 flex flex-col h-full flex-shrink-0 z-50">
      {/* Mobile Close Button */}
      <div className="absolute top-4 right-4 md:hidden">
        <button onClick={onClose} className="p-2 text-gray-400 hover:text-white">
          <X size={24} />
        </button>
      </div>

      {/* Logo Area */}
      <div className="p-8 flex flex-col items-center border-b border-gray-900 min-h-[160px] justify-center">
        <img 
          src={profile.dashboardLogoUrl || "https://placehold.co/400x400/0a0a0a/ffffff.png?text=GOAT+UNIT"} 
          alt="Dashboard Logo" 
          className="w-full max-w-[160px] h-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onChangeView(item.id as ViewState);
                if (onClose) onClose();
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-white text-black shadow-lg shadow-white/10' 
                  : 'text-gray-400 hover:bg-gray-900 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-gray-900">
        <button 
          onClick={onLogout}
          className="flex items-center space-x-3 text-red-400 hover:text-red-300 transition-colors w-full px-4 py-2"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
