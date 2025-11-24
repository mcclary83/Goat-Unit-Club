import React, { useState } from 'react';
import { ArrowRight, Lock, Mail, Loader2, User } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
  onSignup: (username: string) => void;
}

const GoatHeadVector: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
    <path d="M12 2C8 2 8 5 8 5C8 5 5.5 6 5.5 9.5C5.5 11.5 7 12 7 12L8 14C8 14 8.5 16 6.5 17.5C4.5 19 5.5 21 5.5 21H18.5C18.5 21 19.5 19 17.5 17.5C15.5 16 16 14 16 14L17 12C17 12 18.5 11.5 18.5 9.5C18.5 6 16 5 16 5C16 5 16 2 12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 17V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M15 9L16.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M9 9L7.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 13L12 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const Login: React.FC<LoginProps> = ({ onLogin, onSignup }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Simulate network request / authentication
    setTimeout(() => {
      if (isLogin) {
        // LOGIN FLOW
        if (email && password) {
          setIsLoading(false);
          onLogin();
        } else {
          setIsLoading(false);
          setError('Please enter a valid email and password.');
        }
      } else {
        // SIGNUP FLOW
        if (email && password && username) {
          if (username.length < 3) {
             setIsLoading(false);
             setError('Username must be at least 3 characters.');
             return;
          }
          setIsLoading(false);
          onSignup(username);
        } else {
          setIsLoading(false);
          setError('Please fill in all fields to create an account.');
        }
      }
    }, 1500);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setEmail('');
    setPassword('');
    setUsername('');
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#111] border border-gray-800 p-8 rounded-3xl shadow-2xl relative z-10">
        
        {/* Logo Area */}
        <div className="flex flex-col items-center justify-center mb-8 space-y-4">
          <div className="w-28 h-28 bg-black border border-gray-800 rounded-2xl flex items-center justify-center p-6 shadow-lg relative overflow-hidden group">
             <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors duration-500"></div>
             <GoatHeadVector />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {isLogin ? 'Sign in to manage your Goat Unit Hub' : 'Claim your link-in-bio handle today'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            
            {/* Username Field (Signup Only) */}
            {!isLogin && (
              <div className="relative group animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                   <span className="text-gray-500 text-sm font-medium">goatunit.com/</span>
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                  required={!isLogin}
                  className="block w-full pl-[125px] pr-4 py-3.5 bg-black border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  placeholder="username"
                />
              </div>
            )}

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full pl-11 pr-4 py-3.5 bg-black border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                placeholder="Email address"
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full pl-11 pr-4 py-3.5 bg-black border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                placeholder="Password"
              />
            </div>
          </div>

          {isLogin && (
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-blue-600 focus:ring-offset-black focus:ring-blue-500" />
                <span className="text-gray-500 group-hover:text-gray-400">Remember me</span>
              </label>
              <a href="#" className="text-blue-500 hover:text-blue-400 font-medium">Forgot password?</a>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 bg-white text-black hover:bg-gray-200 font-bold py-3.5 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              <>
                <span>{isLogin ? 'Sign In to Dashboard' : 'Create Account'}</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button 
              onClick={toggleMode} 
              className="text-blue-400 hover:text-white transition-colors font-medium ml-1 underline-offset-2 hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
      
      <div className="absolute bottom-6 text-center w-full pointer-events-none">
         <p className="text-[10px] text-gray-700 uppercase tracking-[0.2em]">Powered by Goat Unit</p>
      </div>
    </div>
  );
};

export default Login;