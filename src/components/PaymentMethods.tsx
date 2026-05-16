import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Check } from 'lucide-react';

export default function PaymentMethods() {
  const phoneNumber = "01836973038";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(phoneNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-10 md:py-32 bg-primary border-t border-border-dark relative overflow-hidden">
      <div className="container mx-auto px-5 md:px-10 relative z-10">
        <div className="max-w-4xl mx-auto bg-[#081a12] border-4 md:border-8 border-border-dark rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 shadow-2xl">
          
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-accent tracking-tighter uppercase mb-4">পেমেন্ট পদ্ধতি</h2>
            <div className="h-1 bg-accent/20 w-24 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* bKash Card */}
            <div className="bg-primary/40 border-2 border-border-dark rounded-3xl p-6 flex flex-col items-center group transition-all hover:border-accent/40">
              <div className="w-full aspect-square bg-white rounded-2xl overflow-hidden mb-6 relative">
                <img 
                  src="https://i.ibb.co.com/7dzy2Qr6/Folder-1.png" 
                  alt="bKash QR" 
                  className="w-full h-full object-contain p-2"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-accent font-black text-xs md:text-sm tracking-[0.2em] mb-3 uppercase">BKASH (SEND MONEY)</h3>
              <button 
                onClick={handleCopy}
                className="relative flex items-center gap-3 text-text font-black text-xl md:text-2xl tracking-widest hover:text-accent transition-colors"
              >
                {phoneNumber}
                <Copy size={18} className="opacity-40" />
                
                <AnimatePresence>
                  {copied && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: -40 }}
                      exit={{ opacity: 0 }}
                      className="absolute left-1/2 -translate-x-1/2 bg-accent text-primary px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest whitespace-nowrap"
                    >
                      Copied!
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>

            {/* Nagad Card */}
            <div className="bg-primary/40 border-2 border-border-dark rounded-3xl p-6 flex flex-col items-center group transition-all hover:border-accent/40">
              <div className="w-full aspect-square bg-white rounded-2xl overflow-hidden mb-6">
                <img 
                  src="https://i.ibb.co.com/CpSSrXxf/Folder-1-1.png" 
                  alt="Nagad QR" 
                  className="w-full h-full object-contain p-2"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-accent font-black text-xs md:text-sm tracking-[0.2em] mb-3 uppercase">NAGAD (SEND MONEY)</h3>
              <button 
                onClick={handleCopy}
                className="relative flex items-center gap-3 text-text font-black text-xl md:text-2xl tracking-widest hover:text-accent transition-colors"
              >
                {phoneNumber}
                <Copy size={18} className="opacity-40" />
              </button>
            </div>
          </div>

          <div className="mt-12 md:mt-16 bg-[#1a0d0d] border border-red-900/30 p-6 md:p-8 rounded-2xl text-center">
            <p className="text-red-400 font-bold text-sm md:text-base leading-relaxed">
              <span className="text-accent">বিঃ দ্রঃ</span> সেন্ড মানি করার সময় অবশ্যই আপনার নাম দিবেন এবং ৫ টাকা ক্যাশ আউট ফী যোগ করবেন।
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
