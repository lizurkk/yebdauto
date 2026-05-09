
import React, { useState, useEffect } from 'react';
import { getStore, updateLeads, updateStudents } from '../../services/store';
import { 
  Search, Mail, Phone, X, CheckCircle2, 
  Trash2, MessageSquare, Calendar, Loader2,
  UserCheck, UserMinus, Clock, Filter,
  ExternalLink
} from 'lucide-react';
import { Lead, Student, FormationType } from '../../types';

const LeadsList: React.FC = () => {
  const [store, setStore] = useState(getStore());
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showConfirm, setShowConfirm] = useState<{ id: string, type: 'delete' | 'convert', lead: Lead } | null>(null);

  const refreshData = () => {
    const s = getStore();
    setStore(s);
    setLeads(s.leads);
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    const update = () => refreshData();
    window.addEventListener('storage_update', update);
    return () => window.removeEventListener('storage_update', update);
  }, []);

  const updateLeadStatus = (id: string, status: Lead['status']) => {
    const newList = store.leads.map((l: { id: string; }) => l.id === id ? { ...l, status } : l);
    updateLeads(newList);
  };

  const deleteLead = (id: string) => {
    const newList = store.leads.filter((l: { id: string; }) => l.id !== id);
    updateLeads(newList);
    setShowConfirm(null);
  };

  const convertToStudent = (lead: Lead) => {
    
    const newStudent: Student = {
      id: `std_${Date.now()}`,
      name: lead.name,
      cin: '', // To be filled
      phone: lead.phone,
      email: lead.email || '',
      address: '',
      registrationDate: new Date().toISOString().split('T')[0],
      formation: lead.desiredFormation,
      transmission: 'Manuel',
      paidAmount: 0,
      totalAmount: 45000,
      status: 'active',
      age: 18
    };

    updateStudents([newStudent, ...store.students]);
    updateLeadStatus(lead.id, 'converted');
    setShowConfirm(null);
  };

  const filteredLeads = leads.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) || l.phone.includes(searchTerm);
    const matchesFilter = filterStatus === 'all' || l.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-brand" size={48}/></div>;

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Demandes d'Inscription</h1>
          <p className="text-zinc-500 font-bold mt-1.5">Gérez les prospects et transformez-les en candidats.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111111] border border-slate-100 dark:border-white/5 rounded-[45px] shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 flex flex-col md:flex-row gap-6 justify-between">
           <div className="relative w-full max-w-md">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input 
                type="text" 
                placeholder="Rechercher par Nom ou Téléphone..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white dark:bg-[#09090b] border border-slate-200 dark:border-white/5 rounded-2xl pl-16 pr-8 py-4 focus:outline-none focus:border-brand font-bold text-sm shadow-sm"
              />
           </div>
           <div className="flex gap-3">
              {['all', 'pending', 'contacted', 'converted'].map(s => (
                <button 
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${filterStatus === s ? 'bg-brand text-white border-brand shadow-lg' : 'bg-white dark:bg-white/5 text-slate-500 border-slate-100 dark:border-white/5'}`}
                >
                  {s === 'all' ? 'Tous' : s === 'pending' ? 'En attente' : s === 'contacted' ? 'Contacté' : 'Converti'}
                </button>
              ))}
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50 dark:border-white/5">
                <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Prospect</th>
                <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Formation</th>
                <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Date</th>
                <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Statut</th>
                <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-white/5">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                  <td className="px-10 py-8">
                    <div className="font-black text-slate-900 dark:text-white">{lead.name}</div>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1.5 text-brand text-[10px] font-black uppercase tracking-widest">
                        <Phone size={12} /> {lead.phone}
                      </div>
                      {lead.email && (
                        <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] font-black uppercase tracking-widest">
                          <Mail size={12} /> {lead.email}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className="text-[10px] font-black text-slate-700 dark:text-zinc-300 uppercase bg-slate-100 dark:bg-white/5 px-3 py-1 rounded-lg">{lead.desiredFormation}</span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                      <Clock size={14} /> {lead.date}
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      lead.status === 'pending' ? 'bg-amber-500/10 text-amber-600' :
                      lead.status === 'contacted' ? 'bg-blue-500/10 text-blue-600' :
                      lead.status === 'converted' ? 'bg-emerald-500/10 text-emerald-600' :
                      'bg-slate-100 text-slate-400'
                    }`}>
                      {lead.status === 'pending' ? 'En attente' : lead.status === 'contacted' ? 'Contacté' : lead.status === 'converted' ? 'Converti' : lead.status}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-2">
                       {lead.message && (
                         <button 
                           onClick={() => setSelectedLead(lead)}
                           className="p-3 bg-slate-50 dark:bg-white/5 text-zinc-400 hover:text-brand rounded-xl border border-slate-100 dark:border-white/5 transition-all"
                           title="Voir Message"
                         >
                           <MessageSquare size={16}/>
                         </button>
                       )}
                       {lead.status !== 'converted' && (
                         <>
                           <button 
                             onClick={() => updateLeadStatus(lead.id, 'contacted')}
                             className="p-3 bg-slate-50 dark:bg-white/5 text-zinc-400 hover:text-blue-500 rounded-xl border border-slate-100 dark:border-white/5 transition-all"
                             title="Marquer comme contacté"
                           >
                             <UserCheck size={16}/>
                           </button>
                           <button 
                             onClick={() => setShowConfirm({ id: lead.id, type: 'convert', lead })}
                             className="p-3 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-xl border border-emerald-500/20 transition-all"
                             title="Convertir en Candidat"
                           >
                             <CheckCircle2 size={16}/>
                           </button>
                         </>
                       )}
                       <button 
                         onClick={() => setShowConfirm({ id: lead.id, type: 'delete', lead })}
                         className="p-3 bg-slate-50 dark:bg-white/5 text-zinc-400 hover:text-red-500 rounded-xl border border-slate-100 dark:border-white/5 transition-all"
                         title="Supprimer"
                       >
                         <Trash2 size={16}/>
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MESSAGE MODAL */}
      {selectedLead && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in zoom-in duration-300">
          <div className="bg-white dark:bg-[#111111] w-full max-w-lg p-12 rounded-[55px] relative shadow-2xl">
            <button onClick={() => setSelectedLead(null)} className="absolute top-10 right-10 text-zinc-400 hover:text-brand transition-all"><X size={24}/></button>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center text-brand">
                <MessageSquare size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-black uppercase italic tracking-tight text-slate-900 dark:text-white">Message de {selectedLead.name}</h3>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">{selectedLead.phone}</p>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-white/5 p-8 rounded-3xl border border-slate-100 dark:border-white/5">
              <p className="text-slate-700 dark:text-zinc-300 font-bold leading-relaxed italic">
                "{selectedLead.message}"
              </p>
            </div>
            <button 
              onClick={() => setSelectedLead(null)}
              className="w-full mt-8 bg-slate-900 text-white font-black py-5 rounded-2xl uppercase tracking-widest text-[10px] hover:bg-brand transition-all"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
      {/* CONFIRMATION MODAL */}
      {showConfirm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in zoom-in duration-300">
          <div className="bg-white dark:bg-[#111111] w-full max-w-md p-10 rounded-[45px] shadow-2xl text-center">
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 ${showConfirm.type === 'delete' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-600'}`}>
              {showConfirm.type === 'delete' ? <Trash2 size={32} /> : <UserCheck size={32} />}
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight mb-4 text-slate-900 dark:text-white">
              {showConfirm.type === 'delete' ? 'Confirmer suppression' : 'Confirmer conversion'}
            </h3>
            <p className="text-slate-500 font-bold mb-8 italic">
              {showConfirm.type === 'delete' 
                ? `Voulez-vous vraiment supprimer la demande de ${showConfirm.lead.name} ?`
                : `Voulez-vous convertir ${showConfirm.lead.name} en candidat officiel et l'ajouter à la liste des élèves ?`}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setShowConfirm(null)}
                className="py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 border-slate-100 dark:border-white/5 text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
              >
                Annuler
              </button>
              <button 
                onClick={() => showConfirm.type === 'delete' ? deleteLead(showConfirm.id) : convertToStudent(showConfirm.lead)}
                className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg transition-all ${
                  showConfirm.type === 'delete' ? 'bg-red-500 shadow-red-500/20 hover:bg-red-600' : 'bg-emerald-500 shadow-emerald-500/20 hover:bg-emerald-600'
                }`}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsList;
