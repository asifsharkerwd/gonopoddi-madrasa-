import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { User, Phone, CheckCircle2, Send, Camera, X } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

export default function RegistrationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    batch: '',
    photo: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024) { // 500KB limit for base64 prototype
        alert('Photo size is too large. Please use an image under 500KB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'registrations'), {
        ...formData,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setSubmitted(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'registrations');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <section className="py-32 bg-primary">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto p-12 text-center bg-primary border-4 border-accent"
        >
          <div className="w-20 h-20 bg-accent text-primary rounded-none flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h3 className="text-3xl font-black text-text mb-2 uppercase tracking-tight">Registration Submitted!</h3>
          <p className="text-text/60 mb-8 font-mono text-sm tracking-wide">JazakAllah Khayr! Your registration is pending approval. Once approved, you'll see your name in the list.</p>
          <button 
            onClick={() => {
              setSubmitted(false);
              setFormData({ name: '', phone: '', batch: '', photo: '' });
            }}
            className="text-accent font-black uppercase tracking-widest text-xs hover:underline transition-all"
          >
            Submit Another
          </button>
        </motion.div>
      </section>
    );
  }

  return (
    <section id="register" className="py-10 md:py-32 bg-primary relative overflow-hidden border-t border-border-dark">
      <div className="container mx-auto px-5 md:px-10 relative z-10">
        <div className="max-w-6xl mx-auto bg-primary border-4 md:border-8 border-border-dark flex flex-col md:flex-row overflow-hidden">
          
          <div className="md:w-1/3 bg-accent p-8 md:p-12 flex flex-col justify-between text-primary">
            <div>
              <span className="font-mono text-[8px] md:text-[10px] tracking-[0.4em] uppercase mb-4 block opacity-60">Step 01</span>
              <h2 className="text-3xl md:text-5xl font-black mb-4 md:mb-6 uppercase tracking-tighter leading-[0.85]">অংশগ্রহণ<br/>নিশ্চিত করুন</h2>
              <p className="font-bold opacity-80 leading-relaxed uppercase text-[10px] md:text-sm">
                রেজিস্ট্রেশনের শেষ তারিখ: ২৫ মে ২০২৬ ইং
              </p>
            </div>
            
            <div className="space-y-4 md:space-y-6 mt-8 md:mt-12 bg-primary/10 p-4 md:p-6">
              {[
                "রেজিস্ট্রেশন ফি: ৫০০ টাকা",
                "সম্মাননা স্মারক / স্মরণী",
                "আয়োজনে দুপুরের খাবার"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-primary rotate-45" />
                  <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="md:w-2/3 p-8 md:p-12 bg-[#0d2217]">
            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
              <div className="flex flex-col items-center mb-8">
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-32 h-32 border-4 border-dashed border-border-dark flex flex-col items-center justify-center text-accent hover:border-accent transition-all relative overflow-hidden group"
                >
                  {formData.photo ? (
                    <>
                      <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <X className="text-white" size={24} onClick={(e) => { e.stopPropagation(); setFormData(p => ({ ...p, photo: '' })); }} />
                      </div>
                    </>
                  ) : (
                    <>
                      <Camera size={32} className="mb-2" />
                      <span className="text-[10px] font-black uppercase">Add Photo</span>
                    </>
                  )}
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-mono font-bold text-accent uppercase tracking-[0.3em] block">Full Name (নাম)</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                    placeholder="E.G. ASIF AHMED"
                    className="w-full bg-primary/20 border-2 border-border-dark py-4 px-4 text-text placeholder:text-text/20 focus:outline-none focus:border-accent font-black uppercase text-sm transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-mono font-bold text-accent uppercase tracking-[0.3em] block">Phone Number (মোবাইল)</label>
                  <input 
                    required 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                    placeholder="E.G. 017XXXXXXXX"
                    className="w-full bg-primary/20 border-2 border-border-dark py-4 px-4 text-text placeholder:text-text/20 focus:outline-none focus:border-accent font-black uppercase text-sm transition-all"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-mono font-bold text-accent uppercase tracking-[0.3em] block">Your Year/Batch (সাল/ব্যাচ)</label>
                <input 
                  required 
                  type="text" 
                  value={formData.batch}
                  onChange={(e) => setFormData(p => ({ ...p, batch: e.target.value }))}
                  placeholder="WHICH YEAR?"
                  className="w-full bg-primary/20 border-2 border-border-dark py-4 px-4 text-text placeholder:text-text/20 focus:outline-none focus:border-accent font-black uppercase text-sm transition-all"
                />
              </div>

              <button 
                disabled={loading || !formData.photo}
                type="submit" 
                className="w-full bg-accent text-primary font-black py-5 uppercase tracking-[0.3em] text-xs hover:bg-text transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent animate-spin" />
                ) : (
                  <>
                    রেজিস্ট্রেশন কনফার্ম করুন <Send size={14} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
