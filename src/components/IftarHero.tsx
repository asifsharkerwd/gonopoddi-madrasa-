import React from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, Clock, Users, ChevronRight } from 'lucide-react';

interface EventDetailProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const EventDetail = ({ icon, label, value }: EventDetailProps) => (
  <div className="flex flex-col p-6 rounded-none bg-primary border border-border-dark relative group overflow-hidden">
    <div className="absolute top-0 right-0 p-2 opacity-10 text-accent group-hover:scale-150 transition-transform duration-700">
      {icon}
    </div>
    <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-accent mb-3">{label}</p>
    <p className="text-xl font-black text-text uppercase tracking-tight leading-none">{value}</p>
  </div>
);

export default function IftarHero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-32 pb-20">
      {/* Background with Heavy Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1563823251941-b9989d1e8d97?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80" 
          alt="Ramadan Background" 
          className="w-full h-full object-cover grayscale brightness-[0.2]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-primary/60" />
      </div>

      <div className="container mx-auto px-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-6xl mx-auto"
        >
          <div className="flex flex-col items-start text-left">
            <span className="text-accent font-mono text-sm tracking-[0.4em] uppercase mb-8 block">
              ﷽ • Reunion 2026
            </span>
            
            <h1 className="text-[7vw] md:text-[6vw] font-black text-text mb-12 tracking-tighter uppercase leading-[0.9] mix-blend-difference">
              সাবেক ছাত্র<br />
              <span className="text-accent italic translate-x-12 block">পুনর্মিলনী ও দোয়া মাহফিল</span>
            </h1>
            
            <div className="flex flex-col lg:flex-row items-end gap-12 w-full mt-10">
               <div className="flex-1">
                <p className="text-xl md:text-2xl text-text opacity-70 leading-relaxed font-medium max-w-2xl">
                  গণপদ্দী খালেদা আহমেদ নূরানিয়া হাফিজিয়া মাদরাসা এর সাবেক সকল ছাত্র ও সম্মানিত উস্তাদগণের এক ঐতিহ্যবাহী মিলনমেলা।
                </p>
               </div>

               <div className="flex flex-col sm:flex-row items-center gap-6">
                <a 
                  href="#register" 
                  className="px-12 py-5 bg-accent text-primary font-black uppercase tracking-[0.2em] text-sm hover:bg-text transition-all shadow-2xl"
                >
                  রেজিস্ট্রেশন করুন
                </a>
                <a 
                  href="#details" 
                  className="px-12 py-5 bg-transparent border-2 border-border-dark text-text font-black uppercase tracking-[0.2em] text-sm hover:border-accent transition-all"
                >
                  বিস্তারিত জানুন
                </a>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 mt-24 border-t border-l border-border-dark">
            <div className="border-r border-b border-border-dark">
              <EventDetail 
                icon={<Calendar size={20} />} 
                label="Date" 
                value="৩০ মে ২০২৬" 
              />
            </div>
            <div className="border-r border-b border-border-dark">
              <EventDetail 
                icon={<Clock size={20} />} 
                label="Time" 
                value="১০:০০ AM" 
              />
            </div>
            <div className="border-r border-b border-border-dark">
              <EventDetail 
                icon={<MapPin size={20} />} 
                label="Venue" 
                value="গণপদ্দী মাদরাসা" 
              />
            </div>
            <div className="border-r border-b border-border-dark">
              <EventDetail 
                icon={<Users size={20} />} 
                label="Fee" 
                value="৫০০ BDT" 
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Structured Elements */}
      <div className="absolute left-0 bottom-[10%] w-2 h-40 bg-accent" />
      <div className="absolute right-0 top-[30%] w-2 h-20 bg-border-dark" />
    </section>
  );
}
