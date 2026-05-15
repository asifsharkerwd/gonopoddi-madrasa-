/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './lib/firebase';
import IftarHero from './components/IftarHero';
import RegistrationForm from './components/RegistrationForm';
import BatchMatesList from './components/BatchMatesList';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import { LayoutDashboard, LogOut, LogIn, X, Lock, Mail } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdminView, setIsAdminView] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const ADMIN_EMAIL = 'asifsharker2@gmail.com';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      // Mapping 'admin' username to a fixed internal email
      const email = loginEmail === 'admin' ? 'admin@ganopaddi.reunion' : loginEmail;
      await signInWithEmailAndPassword(auth, email, loginPassword);
      setShowLoginModal(false);
      setLoginEmail('');
      setLoginPassword('');
    } catch (error: any) {
      setLoginError('Invalid Credential. Please use "admin" and "sabbir123"');
      console.error('Login failed', error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsAdminView(false);
  };

  const isAdmin = user?.email === ADMIN_EMAIL;

  return (
    <div className="bg-primary min-h-screen selection:bg-accent selection:text-primary">
      {/* Thick External Border Effect */}
      <div className="fixed inset-0 border-[12px] border-border-dark pointer-events-none z-[100]" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-primary border-b border-border-dark">
        <div className="container mx-auto px-10 h-24 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-accent font-mono text-[10px] tracking-[0.3em] uppercase mb-1">সাবেক ছাত্র সংসদ</span>
            <div className="flex items-center gap-3">
              <span className="text-text font-black text-3xl tracking-tight uppercase leading-none">
                গণপদ্দী <span className="text-accent italic">মাদরাসা</span>
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-10">
            <div className="hidden md:flex items-center gap-8">
              <a href="#" className="text-text font-mono text-xs uppercase tracking-widest hover:text-accent transition-colors">Home</a>
              <a href="#register" className="text-text font-mono text-xs uppercase tracking-widest hover:text-accent transition-colors">Register</a>
              <a href="#details" className="text-text font-mono text-xs uppercase tracking-widest hover:text-accent transition-colors">Details</a>
              {isAdmin && (
                <button 
                  onClick={() => setIsAdminView(!isAdminView)}
                  className={`flex items-center gap-2 font-mono text-xs uppercase tracking-widest transition-colors ${isAdminView ? 'text-accent' : 'text-text/70'}`}
                >
                  <LayoutDashboard size={14} />
                  {isAdminView ? 'View Site' : 'Admin Panel'}
                </button>
              )}
            </div>
            
            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:block text-right">
                  <p className="text-[10px] font-mono text-accent uppercase">Admin Logged In</p>
                  <button onClick={handleLogout} className="text-[10px] text-text/40 uppercase hover:text-red-500 flex items-center gap-1 ml-auto">
                    <LogOut size={10} /> Logout
                  </button>
                </div>
                <div className="w-10 h-10 bg-accent text-primary flex items-center justify-center font-black">
                  A
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setShowLoginModal(true)}
                className="px-6 py-2 border-2 border-accent text-accent font-black uppercase tracking-widest text-[10px] hover:bg-accent hover:text-primary transition-all flex items-center gap-2"
              >
                <LogIn size={14} /> Admin Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLoginModal(false)}
              className="absolute inset-0 bg-primary/95 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-primary border-4 border-accent p-10 w-full max-w-md relative z-10"
            >
              <button 
                onClick={() => setShowLoginModal(false)}
                className="absolute top-4 right-4 text-text/40 hover:text-accent transition-colors"
              >
                <X size={24} />
              </button>
              
              <h3 className="text-3xl font-black text-text mb-8 uppercase tracking-tighter">Admin <span className="text-accent italic">Login</span></h3>
              
              <form onSubmit={handleEmailLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold text-accent uppercase tracking-[0.3em] block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text/30" size={16} />
                    <input 
                      required
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="ADMIN@EXAMPLE.COM"
                      className="w-full bg-border-dark/50 border-2 border-border-dark py-4 pl-12 pr-4 text-text placeholder:text-text/20 focus:outline-none focus:border-accent font-black uppercase text-sm transition-all"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold text-accent uppercase tracking-[0.3em] block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text/30" size={16} />
                    <input 
                      required
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-border-dark/50 border-2 border-border-dark py-4 pl-12 pr-4 text-text placeholder:text-text/20 focus:outline-none focus:border-accent font-black uppercase text-sm transition-all"
                    />
                  </div>
                </div>

                {loginError && (
                  <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">{loginError}</p>
                )}

                <button 
                  disabled={isLoggingIn}
                  type="submit"
                  className="w-full bg-accent text-primary font-black py-5 uppercase tracking-[0.3em] text-xs hover:bg-text transition-all flex items-center justify-center gap-3"
                >
                  {isLoggingIn ? 'Verifying...' : 'Login to Dashboard'}
                </button>

                <div className="pt-6 border-t border-border-dark">
                  <p className="text-[10px] text-text/30 uppercase text-center mb-4">Or use owner access</p>
                  <button 
                    type="button"
                    onClick={async () => {
                      const provider = new GoogleAuthProvider();
                      try {
                        await signInWithPopup(auth, provider);
                        setShowLoginModal(false);
                      } catch(e) { console.error(e); }
                    }}
                    className="w-full border-2 border-border-dark text-text/60 font-black py-4 uppercase tracking-[0.2em] text-[10px] hover:border-accent hover:text-accent transition-all flex items-center justify-center gap-2"
                  >
                    Login with Google (Owner Only)
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="relative pt-24">

        <AnimatePresence mode="wait">
          {isAdminView ? (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AdminPanel />
            </motion.div>
          ) : (
            <motion.div
              key="site"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="fixed top-24 right-10 opacity-[0.03] pointer-events-none z-0 overflow-hidden">
                <h2 className="text-[250px] font-black leading-none tracking-tighter uppercase whitespace-nowrap">
                  MADRASA<br/>REUNION
                </h2>
              </div>
              <IftarHero />
              
              <section id="details" className="py-32 border-y border-border-dark bg-primary relative z-10">
                <div className="container mx-auto px-10">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="relative text-left">
                      <div className="h-1 bg-accent w-24 mb-10"></div>
                      <span className="text-accent font-mono text-xs tracking-[0.4em] uppercase block mb-6">The Purpose</span>
                      <h2 className="text-5xl md:text-6xl font-black text-text mb-10 tracking-tighter uppercase leading-[0.9]">
                        স্মৃতিচারণ ও<br/><span className="text-accent italic">দোয়া মাহফিল</span>
                      </h2>
                      <p className="text-text/70 text-xl leading-relaxed mb-10 max-w-lg">
                        আমাদের প্রিয় উস্তাদে মুহতারাম মরহুম হাফেজ শফিকুল ইসলাম ও শাহজাহান হুজুর এর কর্মময় জীবন ও স্মৃতিচারণ নিয়ে আলোচনা এবং তাঁদের রূহের মাগফিরাত কামনায় বিশেষ দোয়া।
                      </p>
                      <div className="grid grid-cols-2 gap-8">
                        {[
                          "দুপুরের খাবার",
                          "সম্মাননা স্মারক",
                          "উস্তাদদের হাদিয়া",
                          "স্মৃতিচারণ সভা"
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-4">
                            <div className="w-2 h-2 bg-accent rotate-45" />
                            <p className="text-text font-black uppercase text-sm tracking-wide">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="aspect-[4/5] overflow-hidden border-2 border-border-dark shadow-2xl relative z-10">
                        <img 
                          src="https://images.unsplash.com/photo-1542751110-97646af1f5c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
                          alt="Gathering" 
                          className="w-full h-full object-cover grayscale brightness-50"
                        />
                      </div>
                      <div className="absolute -bottom-8 -left-8 w-32 h-32 border-l-4 border-b-4 border-accent z-20" />
                    </div>
                  </div>
                </div>
              </section>

              <RegistrationForm />
              <BatchMatesList />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

