import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User as UserIcon, ShieldCheck, Phone } from 'lucide-react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface Registration {
  id: string;
  name: string;
  phone: string;
  batch: string;
  photo?: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function BatchMatesList() {
  const [mates, setMates] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'registrations'), 
      where('status', '==', 'approved'),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Registration[];
      setMates(data);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching mates:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <section className="py-32 bg-primary border-t border-border-dark">
      <div className="container mx-auto px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20 border-b-2 border-border-dark pb-12">
          <div>
            <span className="text-accent font-mono text-xs tracking-[0.4em] uppercase block mb-4">Community</span>
            <h2 className="text-5xl md:text-6xl font-black text-text tracking-tighter uppercase leading-[0.85]">
              কে কে<br/> <span className="text-accent italic">আসছেন?</span>
            </h2>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-accent font-black text-8xl leading-none">{mates.length}</span>
            <span className="text-text/40 font-mono text-[10px] uppercase tracking-widest">রেজিস্ট্রেশন সম্পূর্ণ</span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-10 h-10 border-4 border-accent border-t-transparent animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {mates.map((mate, index) => (
              <motion.div
                key={mate.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group relative bg-[#0d1a14] rounded-[48px] overflow-hidden border border-white/5 shadow-2xl flex flex-col items-center text-center transition-all duration-500 hover:border-accent/30 hover:-translate-y-2"
              >
                {/* Photo Area */}
                <div className="w-full aspect-[1/1.2] overflow-hidden relative">
                  {mate.photo ? (
                    <img 
                      src={mate.photo} 
                      alt={mate.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-border-dark text-accent/20">
                      <UserIcon size={48} />
                    </div>
                  )}
                </div>

                {/* Content Area - Dark Footer Style */}
                <div className="w-full px-4 py-8 bg-[#09140f] flex flex-col items-center">
                  <h4 className="text-xl md:text-2xl font-black text-white mb-2 tracking-tight">
                    {mate.name}
                  </h4>
                  <div className="text-accent font-black text-xs md:text-sm uppercase tracking-[0.15em] mb-3">
                    {mate.batch}
                  </div>
                  <div className="text-text/40 font-mono text-[10px] md:text-xs tracking-[0.2em]">
                    {mate.phone}
                  </div>
                </div>

                {/* Decorative Status pulse */}
                <div className="absolute top-4 right-4">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full shadow-[0_0_8px_#C9A35D]" />
                </div>
              </motion.div>
            ))}
            {mates.length === 0 && (
              <div className="col-span-full py-24 text-center border-2 border-dashed border-border-dark text-text/20 uppercase font-bold tracking-[0.3em] rounded-[40px]">
                No approved members yet
              </div>
            )}
          </div>
        )}

        <div className="mt-24 p-12 bg-border-dark flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <ShieldCheck size={200} />
          </div>
          <div className="w-20 h-20 bg-accent flex items-center justify-center text-primary shrink-0 rotate-45 group hover:rotate-12 transition-transform duration-500">
            <ShieldCheck size={40} className="-rotate-45" />
          </div>
          <div className="flex-1 z-10">
            <h4 className="text-2xl font-black text-text mb-2 uppercase tracking-tighter">নিরাপদ অংশগ্রহণ</h4>
            <p className="text-text/50 font-medium max-w-2xl leading-relaxed uppercase text-xs">
              রেজিস্ট্রেশন পরবর্তী ফি সংক্রান্ত তথ্যের জন্য আপনার ব্যাচ প্রতিনিধির সাথে যোগাযোগ করুন। অনুষ্ঠানস্থলে প্রবেশের জন্য রেজিস্ট্রেশন বাধ্যতামূলক।
            </p>
          </div>
          <button className="whitespace-nowrap px-10 py-5 bg-accent text-primary font-black uppercase tracking-[0.2em] text-xs hover:bg-text transition-all z-10 shadow-2xl">
            যোগাযোগ করুন
          </button>
        </div>
      </div>
    </section>
  );
}
