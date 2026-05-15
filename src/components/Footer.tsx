import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-20 bg-primary border-t border-border-dark relative z-10">
      <div className="container mx-auto px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <h2 className="text-4xl font-black text-text mb-6 uppercase tracking-tighter">গনপদ্দী <span className="text-accent italic">মাদরাসা</span></h2>
            <p className="text-text/50 max-w-sm leading-relaxed mb-8 uppercase text-xs font-bold tracking-widest">
              সাবেক ছাত্র ও উস্তাদবৃন্দের পুনর্মিলনী ২০২৬। আমাদের মাদরাসা, আমাদের অহংকার।
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 rounded-none bg-border-dark flex items-center justify-center text-text/70 hover:bg-accent hover:text-primary transition-all">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-12 h-12 rounded-none bg-border-dark flex items-center justify-center text-text/70 hover:bg-accent hover:text-primary transition-all">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-12 h-12 rounded-none bg-border-dark flex items-center justify-center text-text/70 hover:bg-accent hover:text-primary transition-all">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-accent font-mono text-[10px] tracking-[0.3em] uppercase mb-8">Navigation</h4>
            <ul className="space-y-4 text-text/50 font-black uppercase text-xs tracking-widest">
              <li><a href="#" className="hover:text-accent transition-colors">Home</a></li>
              <li><a href="#register" className="hover:text-accent transition-colors">Registration</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Venue Map</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Batch Gallery</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-accent font-mono text-[10px] tracking-[0.3em] uppercase mb-8">Contact</h4>
            <ul className="space-y-4 text-text/50 font-black uppercase text-xs tracking-widest">
              <li className="flex items-center gap-3">
                <Mail size={14} className="text-accent" />
                <span>REUNION@SCHOOL.EDU</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={14} className="text-accent" />
                <span>+880 1234-567890</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={14} className="text-accent" />
                <span>DHAKA, BANGLADESH</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border-dark flex flex-col md:flex-row justify-between items-center gap-4 text-text/30 text-[10px] font-mono uppercase tracking-[0.2em]">
          <p>© 2026 IFTAR BATCH REUNION. ALL RIGHTS RESERVED.</p>
          <p>DESIGNED FOR BATCH MATES</p>
        </div>
      </div>
    </footer>
  );
}
