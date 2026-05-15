import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Check, X, Trash2, Clock, Phone, User as UserIcon } from 'lucide-react';

interface Registration {
  id: string;
  name: string;
  phone: string;
  batch: string;
  photo?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Timestamp;
}

export default function AdminPanel() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'registrations'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Registration[];
      setRegistrations(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'registrations');
    });

    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (id: string, newStatus: 'approved' | 'rejected') => {
    try {
      await updateDoc(doc(db, 'registrations', id), {
        status: newStatus
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `registrations/${id}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this registration?')) return;
    try {
      await deleteDoc(doc(db, 'registrations', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `registrations/${id}`);
    }
  };

  const stats = {
    total: registrations.length,
    pending: registrations.filter(r => r.status === 'pending').length,
    approved: registrations.filter(r => r.status === 'approved').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-10 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12 border-b border-border-dark pb-12">
        <div>
          <span className="text-accent font-mono text-xs tracking-[0.4em] uppercase block mb-4">Management</span>
          <h2 className="text-6xl font-black text-text tracking-tighter uppercase leading-none">
            Admin <span className="text-accent italic">Panel</span>
          </h2>
        </div>
        <div className="flex gap-8">
          <div className="text-right">
            <p className="text-[10px] font-mono text-accent uppercase mb-1">Pending</p>
            <p className="text-4xl font-black text-text">{stats.pending}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-mono text-accent uppercase mb-1">Approved</p>
            <p className="text-4xl font-black text-text">{stats.approved}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {registrations.map((reg) => (
            <motion.div
              layout
              key={reg.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="group bg-primary border-2 border-border-dark p-6 flex flex-col md:flex-row items-center gap-8 hover:border-accent transition-all"
            >
              <div className="w-20 h-20 bg-border-dark shrink-0 overflow-hidden border border-border-dark">
                {reg.photo ? (
                  <img src={reg.photo} alt={reg.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text/20">
                    <UserIcon size={32} />
                  </div>
                )}
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                  <h4 className="text-2xl font-black text-text uppercase tracking-tight">{reg.name}</h4>
                  <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                    reg.status === 'approved' ? 'bg-green-500/20 text-green-500' : 
                    reg.status === 'rejected' ? 'bg-red-500/20 text-red-500' : 
                    'bg-accent/20 text-accent'
                  }`}>
                    {reg.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-text/50 font-mono text-xs">
                  <span className="flex items-center gap-2"><Phone size={12} /> {reg.phone}</span>
                  <span className="flex items-center gap-2">Batch: {reg.batch}</span>
                  <span className="flex items-center gap-2"><Clock size={12} /> {reg.createdAt?.toDate().toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {reg.status !== 'approved' && (
                  <button 
                    onClick={() => handleStatusChange(reg.id, 'approved')}
                    className="w-12 h-12 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all flex items-center justify-center"
                    title="Approve"
                  >
                    <Check size={20} />
                  </button>
                )}
                {reg.status !== 'rejected' && (
                  <button 
                    onClick={() => handleStatusChange(reg.id, 'rejected')}
                    className="w-12 h-12 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                    title="Reject"
                  >
                    <X size={20} />
                  </button>
                )}
                <button 
                  onClick={() => handleDelete(reg.id)}
                  className="w-12 h-12 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                  title="Delete"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </motion.div>
          ))}
          {registrations.length === 0 && (
            <div className="text-center py-24 border-2 border-dashed border-border-dark text-text/20 uppercase font-black tracking-widest">
              No registrations found
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
