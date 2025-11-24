import React from 'react';
import { LinkItem } from '../types';
import { Plus, Trash2, GripVertical, ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';

interface LinksManagerProps {
  links: LinkItem[];
  setLinks: React.Dispatch<React.SetStateAction<LinkItem[]>>;
}

const LinksManager: React.FC<LinksManagerProps> = ({ links, setLinks }) => {
  
  const addLink = () => {
    const newLink: LinkItem = {
      id: Date.now().toString(),
      label: 'New Link',
      url: 'https://',
      isActive: true,
    };
    setLinks([newLink, ...links]);
  };

  const updateLink = (id: string, field: keyof LinkItem, value: any) => {
    setLinks(links.map(link => link.id === id ? { ...link, [field]: value } : link));
  };

  const deleteLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
  };

  const moveLink = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === links.length - 1) return;

    const newLinks = [...links];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newLinks[index], newLinks[targetIndex]] = [newLinks[targetIndex], newLinks[index]];
    setLinks(newLinks);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-8 border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
        <h2 className="text-3xl font-bold text-white mb-2">Links</h2>
        <p className="text-gray-400 text-sm">Add buttons that link to your website, social media, store, or booking page.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-8 pb-24">
        
        <button 
          onClick={addLink}
          className="w-full py-4 rounded-xl border-2 border-dashed border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 hover:bg-gray-900 transition-all flex items-center justify-center space-x-2 mb-8 group"
        >
          <Plus size={20} className="group-hover:scale-110 transition-transform" />
          <span className="font-medium">Add New Link</span>
        </button>

        <div className="space-y-4">
          {links.map((link, index) => (
            <div key={link.id} className="bg-[#111] border border-gray-800 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center group transition-colors hover:border-gray-700">
              
              {/* Drag/Order Controls */}
              <div className="flex flex-col space-y-1 text-gray-600 sm:pr-2">
                <button 
                  onClick={() => moveLink(index, 'up')}
                  disabled={index === 0}
                  className="hover:text-white disabled:opacity-30 transition-colors"
                >
                  <ArrowUp size={16} />
                </button>
                <GripVertical size={16} className="cursor-grab active:cursor-grabbing opacity-50" />
                <button 
                   onClick={() => moveLink(index, 'down')}
                   disabled={index === links.length - 1}
                   className="hover:text-white disabled:opacity-30 transition-colors"
                >
                  <ArrowDown size={16} />
                </button>
              </div>

              {/* Inputs */}
              <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Label</label>
                  <input 
                    type="text" 
                    value={link.label}
                    onChange={(e) => updateLink(link.id, 'label', e.target.value)}
                    className="w-full bg-black border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                 <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">URL</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={link.url}
                      onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                      className="w-full bg-black border border-gray-800 rounded-lg pl-3 pr-8 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                    />
                    <a href={link.url} target="_blank" rel="noreferrer" className="absolute right-2 top-2 text-gray-600 hover:text-gray-300">
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between w-full sm:w-auto sm:flex-col sm:space-y-2 md:flex-row md:space-y-0 md:space-x-4 border-t sm:border-t-0 border-gray-800 pt-3 sm:pt-0 mt-2 sm:mt-0">
                <div className="flex items-center space-x-2">
                  <span className={`text-xs font-medium ${link.isActive ? 'text-green-400' : 'text-gray-500'}`}>
                    {link.isActive ? 'Visible' : 'Hidden'}
                  </span>
                  <button 
                    onClick={() => updateLink(link.id, 'isActive', !link.isActive)}
                    className={`w-10 h-5 rounded-full transition-colors relative ${link.isActive ? 'bg-green-500/20' : 'bg-gray-800'}`}
                  >
                    <span className={`absolute top-1 left-1 w-3 h-3 rounded-full transition-all duration-200 ${link.isActive ? 'bg-green-500 translate-x-5' : 'bg-gray-500'}`} />
                  </button>
                </div>
                
                <button 
                  onClick={() => deleteLink(link.id)}
                  className="text-gray-500 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-500/10"
                  title="Delete Link"
                >
                  <Trash2 size={18} />
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LinksManager;
