import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Check, X, Trash2, Clock, Phone, User as UserIcon, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    const q = query(collection(db, 'registrations'), orderBy('createdAt', 'asc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Registration[];
      setRegistrations(data);
      setLoading(false);
    }, (err) => {
      console.error('Firestore error:', err);
      setError(err.message || 'ডাটা লোড করতে সমস্যা হচ্ছে। ফায়ারবেস রুলস চেক করুন।');
      setLoading(false);
      try {
        handleFirestoreError(err, OperationType.LIST, 'registrations');
      } catch (e) {
        // Already handled
      }
    });

    return () => unsubscribe();
  }, []);

  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleStatusChange = async (id: string, newStatus: 'approved' | 'rejected') => {
    setLoadingAction(id);
    try {
      await updateDoc(doc(db, 'registrations', id), {
        status: newStatus
      });
    } catch (error) {
      console.error('Update failed:', error);
      alert('স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে।');
      handleFirestoreError(error, OperationType.UPDATE, `registrations/${id}`);
    } finally {
      setLoadingAction(null);
    }
  };

  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (confirmDelete !== id) {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000); // Reset after 3s
      return;
    }
    
    setLoadingAction(id);
    try {
      await deleteDoc(doc(db, 'registrations', id));
      setConfirmDelete(null);
    } catch (error) {
      console.error('Delete failed:', error);
      handleFirestoreError(error, OperationType.DELETE, `registrations/${id}`);
    } finally {
      setLoadingAction(null);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('Registration List - Reunion 2026', 14, 22);
    
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    
    const tableData = registrations.map((reg, index) => [
      index + 1,
      reg.name,
      reg.phone,
      reg.batch,
      reg.status.toUpperCase(),
      reg.createdAt?.toDate().toLocaleDateString() || 'N/A'
    ]);

    autoTable(doc, {
      head: [['SL', 'Name', 'Phone', 'Batch', 'Status', 'Date']],
      body: tableData,
      startY: 40,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [15, 15, 15] }
    });

    doc.save('registrations-reunion-2026.pdf');
  };

  const stats = {
    total: registrations.length,
    pending: registrations.filter(r => r.status === 'pending').length,
    approved: registrations.filter(r => r.status === 'approved').length,
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent animate-spin" />
        <p className="text-accent/50 font-mono text-[10px] uppercase tracking-widest">Loading Records...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-10 py-24 text-center">
        <div className="max-w-md mx-auto bg-red-500/10 border-2 border-red-500/20 p-10">
          <X className="text-red-500 mx-auto mb-6" size={48} />
          <h2 className="text-2xl font-black text-text uppercase mb-4">Error Detected</h2>
          <p className="text-text/60 text-sm mb-8">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-red-500 text-white font-black py-4 uppercase tracking-widest text-xs hover:bg-red-600 transition-colors"
          >
            Retry Connection
          </button>
        </div>
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
          <button 
            onClick={downloadPDF}
            className="mt-6 flex items-center gap-2 bg-accent text-primary px-6 py-3 font-black uppercase text-xs tracking-widest hover:bg-opacity-90 transition-all border border-transparent active:scale-95"
          >
            <Download size={16} />
            Download PDF Report
          </button>
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
                  <span className="flex items-center gap-2">{reg.batch}</span>
                  <span className="flex items-center gap-2"><Clock size={12} /> {reg.createdAt?.toDate().toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {reg.status !== 'approved' && (
                  <button 
                    disabled={loadingAction === reg.id}
                    onClick={() => handleStatusChange(reg.id, 'approved')}
                    className="w-12 h-12 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Approve"
                  >
                    <Check size={20} className={loadingAction === reg.id ? 'animate-pulse' : ''} />
                  </button>
                )}
                {reg.status !== 'rejected' && (
                  <button 
                    disabled={loadingAction === reg.id}
                    onClick={() => handleStatusChange(reg.id, 'rejected')}
                    className="w-12 h-12 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Reject"
                  >
                    <X size={20} className={loadingAction === reg.id ? 'animate-pulse' : ''} />
                  </button>
                )}
                <button 
                  disabled={loadingAction === reg.id}
                  onClick={() => handleDelete(reg.id)}
                  className={`w-12 h-12 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed ${
                    confirmDelete === reg.id 
                    ? 'bg-red-600 text-white animate-pulse' 
                    : 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white'
                  }`}
                  title={confirmDelete === reg.id ? "Click again to confirm" : "Delete"}
                >
                  {confirmDelete === reg.id ? <Trash2 size={20} className="animate-pulse" /> : <Trash2 size={20} className={loadingAction === reg.id ? 'animate-spin' : ''} />}
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
