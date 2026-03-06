import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { setToken } from '@/lib/token';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/auth/login', { email, password });
      const { accessToken, refreshToken } = response.data;
      setToken(accessToken, refreshToken);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during login.');
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background-dark min-h-screen flex flex-col relative overflow-hidden text-white">
      {/* Navbar Minimal */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-[#4b2020] bg-[#240f0f]/90 backdrop-blur-md px-6 lg:px-10 py-3">
        <Link to="/" className="flex items-center gap-2 text-white group hover:text-primary transition-colors">
            <div className="size-6 text-primary group-hover:rotate-180 transition-transform duration-500">
                <span className="material-symbols-outlined !text-[24px]">sports_motorsports</span>
            </div>
            <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em] uppercase">MotoGear</h2>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-grow relative flex items-center justify-center min-h-screen pt-16 pb-12 px-4 sm:px-6">
        <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: "linear-gradient(rgba(13, 13, 13, 0.85), rgba(35, 15, 15, 0.9)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuDvBe7ZQ9ncA54xZEhxV0eid4T5sekeirUQLrC29t6jpxGzzULIsK3NuZW2NWvNe92a-IwCDCblHxsPlTQmx-ikai-n-PVWAHj6TPOx7Yel046tZePyvvLMx1SsL-rYXmkKf_KlRpvPSR2VZPxh8w92tmClnKKVex39ta_Pw1qNCFfjpDLuogfarqpGXjdPsCB29skihV5J7oDQ8_vTIcc0iJF5gilt4uZ-tHeveJRfBB804CfToFsOGsXZLovX_V7QTy4GTK-ybz0a')" }}></div>
        
        <div className="relative z-10 w-full max-w-[480px]">
          <div className="bg-[#1a1a1a]/95 backdrop-blur-xl border border-[#4b2020] shadow-2xl rounded-xl overflow-hidden">
            <div className="flex border-b border-[#333]">
              <button className="flex-1 py-5 text-center relative group">
                <span className="text-white font-bold tracking-wider text-sm uppercase">Login</span>
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary"></div>
              </button>
              <button className="flex-1 py-5 text-center relative group hover:bg-white/5 transition-colors">
                <span className="text-text-muted font-medium tracking-wider text-sm uppercase group-hover:text-white transition-colors">Sign Up</span>
              </button>
            </div>
            <div className="p-8 sm:p-10 flex flex-col gap-6">
              <div className="text-center mb-2">
                <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">RIDER ACCESS</h1>
                <p className="text-text-muted text-sm">Enter your credentials to hit the road.</p>
              </div>
              <form className="flex flex-col gap-5" onSubmit={handleLogin}>
                <div className="space-y-2 group">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider group-focus-within:text-primary transition-colors" htmlFor="email">Email Address</label>
                  <div className="relative">
                     <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 material-symbols-outlined text-[20px]">mail</span>
                    <input 
                      className="block w-full rounded-lg border border-[#333] bg-[#0d0d0d] pl-10 pr-3 py-3 text-white placeholder-gray-600 focus:border-primary focus:ring-1 focus:ring-primary focus:bg-[#151515] transition-all sm:text-sm" 
                      id="email" 
                      placeholder="rider@example.com" 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2 group">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider group-focus-within:text-primary transition-colors" htmlFor="password">Password</label>
                    <a className="text-xs text-text-muted hover:text-white transition-colors" href="#">Forgot?</a>
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 material-symbols-outlined text-[20px]">lock</span>
                    <input 
                      className="block w-full rounded-lg border border-[#333] bg-[#0d0d0d] pl-10 pr-10 py-3 text-white placeholder-gray-600 focus:border-primary focus:ring-1 focus:ring-primary focus:bg-[#151515] transition-all sm:text-sm" 
                      id="password" 
                      placeholder="••••••••" 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-900/50 border border-red-500/50 text-red-300 text-xs rounded-lg p-3 text-center">
                    {error}
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="mt-4 w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold py-3.5 px-4 rounded-lg uppercase tracking-widest shadow-[0_0_15px_rgba(230,0,0,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Ignition</span> <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </>
                  )}
                </button>
              </form>
              <div className="relative flex py-2 items-center"><div className="flex-grow border-t border-[#333]"></div><span className="flex-shrink-0 mx-4 text-gray-600 text-xs uppercase font-medium">Or continue with</span><div className="flex-grow border-t border-[#333]"></div></div>
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 bg-[#2a2a2a] hover:bg-[#333] border border-[#333] text-white py-2.5 px-4 rounded-lg transition-all text-sm font-medium">Google</button>
                <button className="flex items-center justify-center gap-2 bg-[#2a2a2a] hover:bg-[#333] border border-[#333] text-white py-2.5 px-4 rounded-lg transition-all text-sm font-medium">Apple</button>
              </div>
            </div>
            <div className="flex h-1.5 w-full bg-[#0d0d0d]">
                <div className="w-[30%] bg-green-500 animate-pulse"></div><div className="w-[10%] bg-[#0d0d0d]"></div><div className="w-[40%] bg-primary"></div><div className="w-[5%] bg-[#0d0d0d]"></div><div className="w-[15%] bg-yellow-500"></div>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t border-[#4b2020] bg-[#240f0f] py-6 text-center text-sm text-gray-500">
        <p>© 2024 MotoGear. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Login;