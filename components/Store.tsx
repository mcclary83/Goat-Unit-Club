
import React, { useRef } from 'react';
import { ShoppingBag, CreditCard, Camera, Upload, Link as LinkIcon } from 'lucide-react';
import { Profile } from '../types';

interface StoreProps {
  profile: Profile;
  onUpdateProfile: (updated: Profile) => void;
}

const Store: React.FC<StoreProps> = ({ profile, onUpdateProfile }) => {
  const product1InputRef = useRef<HTMLInputElement>(null);
  const product2InputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, product: 'product1' | 'product2') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (product === 'product1') {
        onUpdateProfile({ ...profile, product1ImageUrl: result });
      } else {
        onUpdateProfile({ ...profile, product2ImageUrl: result });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUrlChange = (value: string, productKey: 'product1' | 'product2') => {
    if (productKey === 'product1') {
      onUpdateProfile({ ...profile, product1SquareUrl: value });
    } else {
      onUpdateProfile({ ...profile, product2SquareUrl: value });
    }
  };

  const products = [
    {
      id: 'combo',
      title: 'GOAT Unit NFC Card + Keyfob Combo',
      price: '$30.00',
      description: 'GOAT UNIT — Tap Into Greatness. Includes one NFC business card + one NFC keyfob.',
      imageUrl: profile.product1ImageUrl,
      checkoutUrl: profile.product1SquareUrl,
      inputRef: product1InputRef,
      productKey: 'product1' as const
    },
    {
      id: 'card',
      title: 'GOAT Unit NFC Card',
      price: '$20.00',
      description: 'GOAT UNIT — Tap Into Greatness. NFC business card only.',
      imageUrl: profile.product2ImageUrl,
      checkoutUrl: profile.product2SquareUrl,
      inputRef: product2InputRef,
      productKey: 'product2' as const
    }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-8 border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
        <div>
          <h2 className="text-3xl font-bold text-white">Store</h2>
          <p className="text-gray-400 text-sm mt-1">Purchase official Goat Unit hardware.</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-8 overflow-y-auto flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-[#111] border border-gray-800 rounded-2xl overflow-hidden flex flex-col group hover:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/10">
              
              {/* Image Area */}
              <div className="w-full h-64 overflow-hidden bg-gray-900 relative group/image">
                <img 
                  src={product.imageUrl} 
                  alt={product.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent opacity-80"></div>
                
                {/* Price Tag */}
                <div className="absolute bottom-4 left-4 pointer-events-none">
                  <span className="bg-white text-black font-bold px-3 py-1 rounded-full text-sm shadow-lg">
                    {product.price}
                  </span>
                </div>

                {/* Upload Overlay (Admin Edit) */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm cursor-pointer"
                     onClick={() => product.inputRef.current?.click()}>
                  <div className="flex flex-col items-center text-white space-y-2">
                    <Camera size={32} className="text-white" />
                    <span className="text-xs font-bold uppercase tracking-widest">Change Thumbnail</span>
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={product.inputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, product.productKey)}
                />
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-2">{product.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">
                  {product.description}
                </p>

                {/* Customer View Button */}
                <a 
                  href={product.checkoutUrl || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`w-full py-3.5 rounded-xl font-bold text-center flex items-center justify-center space-x-2 transition-all mb-6 ${
                    product.checkoutUrl 
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg hover:shadow-blue-500/25' 
                      : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  }`}
                >
                   <CreditCard size={18} />
                   <span>{product.checkoutUrl ? 'Buy Now' : 'Unavailable'}</span>
                </a>
                
                {/* Admin Configuration */}
                <div className="border-t border-gray-800 pt-4 mt-auto">
                    <label className="flex items-center space-x-2 text-[10px] font-bold text-yellow-500 uppercase mb-2">
                        <LinkIcon size={12} />
                        <span>Admin: Square Checkout Link</span>
                    </label>
                    <input
                        type="text"
                        value={product.checkoutUrl}
                        onChange={(e) => handleUrlChange(e.target.value, product.productKey)}
                        placeholder="Paste Square payment link..."
                        className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:border-yellow-500 focus:outline-none transition-colors placeholder-gray-700"
                    />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>Payments are securely processed via Square.</p>
        </div>
      </div>
    </div>
  );
};

export default Store;
