import { useState, useMemo, useEffect } from 'react';
import { 
  Plus, X, Printer, CheckCircle2, 
  ArrowUpCircle, ArrowDownCircle, Trash2,
  BookOpen, Car, CreditCard, ClipboardCheck, Wallet,
  Search, Filter, Calendar, Edit2, Award
} from 'lucide-react';
import { getStore, updateStudents, updateFinance } from '../../services/store';

const ReceiptModal: React.FC<{ transaction: any, onClose: () => void }> = ({ transaction, onClose }) => {
  const handlePrint = () => {
  window.print(); };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-sm">
      <div className="bg-white text-slate-900 w-full max-w-xl p-12 rounded-3xl relative shadow-2xl border border-slate-100 print:shadow-none print:border-0">
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-400 print:hidden"><X/></button>
        <div className="space-y-10">
          <div className="flex justify-between items-start border-b pb-8">
            <div>
              <div className="text-2xl font-black uppercase text-brand">YEBDA AUTO-ÉCOLE</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase mt-1 italic">Bab Azzouar, Alger • 0559 06 74 41</div>
            </div>
            <div className="text-right">
              <div className="text-xl font-black">QUITTANCE N° {transaction?.id?.slice(-5).toUpperCase() || '---'}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase mt-1">Date: {transaction?.date || '---'}</div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-10">
               <div>
                 <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Reçu de :</div>
                 <div className="text-lg font-black">{transaction?.person || '---'}</div>
               </div>
               <div>
                 <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Mode :</div>
                 <div className="text-lg font-black">{transaction?.method || '---'}</div>
               </div>
            </div>
            <div>
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Motif & Mode de Paiement :</div>
              <div className="text-lg font-black">Module {transaction?.type || '---'} — <span className="text-brand uppercase italic font-black">{transaction?.paymentMode === 'Plein' ? 'Paiement Intégral' : 'Paiement par Tranche'}</span></div>
            </div>
          </div>
          <div className="bg-slate-50 p-8 rounded-2xl flex justify-between items-center border border-slate-100">
             <div className="text-xl font-black uppercase tracking-tight">Montant Perçu :</div>
             <div className="text-4xl font-black text-brand">{(Number(transaction?.numeric) || 0).toLocaleString()} DA</div>
          </div>
        </div>
        <button onClick={handlePrint} className="w-full mt-10 bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 print:hidden shadow-xl">
          <Printer size={18}/> Imprimer la quittance
        </button>
      </div>
    </div>
  );
};

const FinanceTracker: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'transactions' | 'expenses'>('transactions');
  const [showAddModal, setShowAddModal] = useState<'payment' | 'expense' | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{id: string, type: string} | null>(null);
  
  const [filterText, setFilterText] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterDate, setFilterDate] = useState('');

  const [formData, setFormData] = useState({ 
    person: '', studentId: '', type: 'Code', 
    paymentMode: 'Plein' as 'Plein' | 'Tranche',
    amount: '', method: 'Cash' as any 
  });
  const [store, setStore] = useState(getStore());

  useEffect(() => {
    const update = () => setStore(getStore());
    window.addEventListener('storage_update', update);
    return () => window.removeEventListener('storage_update', update);
  }, []);

  const { finance, students } = store;

  const paymentModules = ["Code", "Créneau", "Conduite", "Perfectionnement"];
  const expenseCategories = ["Carburant", "Entretien", "Loyer", "Salaires", "Publicité", "Autre"];
  const paymentMethods = ["Cash"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseInt(formData.amount) || 0;
    const dateStr = editingItem?.date || new Date().toLocaleDateString('fr-FR');
    
    const operation = {
      id: editingItem?.id || `trx_${Date.now()}`,
      date: dateStr,
      person: formData.person,
      studentId: formData.studentId,
      type: formData.type,
      paymentMode: formData.paymentMode,
      method: formData.method,
      numeric: numericAmount,
      amount: `${numericAmount.toLocaleString()} DA`
    };

    const updatedFinance = { ...store.finance };
    if (showAddModal === 'payment') {
      if (editingItem) {
        updatedFinance.transactions = updatedFinance.transactions.map((t: any) => t.id === editingItem.id ? operation : t);
      } else {
        updatedFinance.transactions = [operation, ...updatedFinance.transactions];
        if (formData.studentId) {
          const updatedStudentsList = store.students.map((s: any) => {
             if (s.id === formData.studentId) return { ...s, paidAmount: (Number(s.paidAmount) || 0) + numericAmount };
             return s;
          });
          updateStudents(updatedStudentsList);
        }
      }
    } else {
      if (editingItem) {
        updatedFinance.expenses = updatedFinance.expenses.map((e: any) => e.id === editingItem.id ? operation : e);
      } else {
        updatedFinance.expenses = [operation, ...updatedFinance.expenses];
      }
    }

    updateFinance(updatedFinance);
    setShowAddModal(null);
    setEditingItem(null);
    setFormData({ person: '', studentId: '', type: 'Code', paymentMode: 'Plein', amount: '', method: 'Cash' });
  };

  // ✅ FIXED: proper DD/MM/YYYY vs YYYY-MM-DD comparison
  const filteredData = useMemo(() => {
    const list = activeTab === 'transactions' ? finance.transactions : finance.expenses;
    return list.filter((item: any) => {
      const matchesSearch = item.person.toLowerCase().includes(filterText.toLowerCase()) || item.type.toLowerCase().includes(filterText.toLowerCase());
      const matchesCategory = filterCategory === 'All' || item.type === filterCategory;
      const matchesDate = !filterDate || (() => {
        const [y, m, d] = filterDate.split('-');
        return item.date === `${d}/${m}/${y}`;
      })();
      return matchesSearch && matchesCategory && matchesDate;
    });
  }, [finance, activeTab, filterText, filterCategory, filterDate]);

  const handleEdit = (item: any, mode: 'payment' | 'expense') => {
    setEditingItem(item);
    setFormData({
      person: item.person,
      studentId: item.studentId || '',
      type: item.type,
      paymentMode: item.paymentMode,
      amount: item.numeric.toString(),
      method: item.method
    });
    setShowAddModal(mode);
  };

  const handleDelete = (id: string, type: string) => {
    updateFinance({...finance, [type]: (finance as any)[type].filter((x:any)=>x.id!==id)});
    setShowDeleteConfirm(null);
  };

  const getModuleIcon = (type: string) => {
    switch (type) {
      case 'Code': return <BookOpen size={16}/>;
      case 'Créneau': return <ClipboardCheck size={16}/>;
      case 'Conduite': return <Car size={16}/>;
      case 'Perfectionnement': return <Award size={16}/>;
      default: return <CreditCard size={16}/>;
    }
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tight text-slate-900 dark:text-white font-display">Recettes & Flux</h1>
          <p className="text-slate-500 font-bold mt-1">Saisie flexible : Paiement Intégral ou par Tranches.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setShowAddModal('expense')} className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-8 py-5 rounded-2xl flex items-center gap-3 text-[11px] font-black uppercase tracking-widest shadow-xl">
            <Plus size={18} /> Nouvelle Dépense
          </button>
          <button onClick={() => setShowAddModal('payment')} className="bg-brand text-white px-8 py-5 rounded-2xl flex items-center gap-3 text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-brand/20">
            <Plus size={18} /> Nouveau Versement
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 bg-slate-100 dark:bg-white/5 p-2 rounded-[25px] border border-slate-200 dark:border-white/5">
        <button onClick={() => {setActiveTab('transactions'); setFilterCategory('All');}} className={`px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'transactions' ? 'bg-white dark:bg-[#111111] text-brand shadow-sm' : 'text-slate-500'}`}>Recettes (Candidats)</button>
        <button onClick={() => {setActiveTab('expenses'); setFilterCategory('All');}} className={`px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'expenses' ? 'bg-white dark:bg-[#111111] text-brand shadow-sm' : 'text-slate-500'}`}>Dépenses (Exploitation)</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white dark:bg-[#111111] p-6 rounded-[35px] border border-slate-100 dark:border-white/5 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher..." 
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#09090b] border border-slate-200 dark:border-white/10 rounded-2xl pl-12 pr-6 py-3 font-bold text-sm outline-none focus:border-brand text-slate-900 dark:text-white"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#09090b] border border-slate-200 dark:border-white/10 rounded-2xl pl-12 pr-6 py-3 font-bold text-sm outline-none appearance-none text-slate-900 dark:text-white"
          >
            <option value="All">Toutes catégories</option>
            {activeTab === 'transactions' 
              ? paymentModules.map(m => <option key={m} value={m}>{m}</option>)
              : expenseCategories.map(c => <option key={c} value={c}>{c}</option>)
            }
          </select>
        </div>
        {/* ✅ FIXED: date input with proper text color */}
        <div className="relative">
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" size={18} />
          <input 
            type="date" 
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#09090b] border border-slate-200 dark:border-white/10 rounded-2xl pl-12 pr-6 py-3 font-bold text-sm outline-none focus:border-brand text-slate-900 dark:text-white [color-scheme:light] dark:[color-scheme:dark]"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-[#111111] border border-slate-100 dark:border-white/5 rounded-[45px] shadow-sm p-8 space-y-4">
          {filteredData.length > 0 ? filteredData.map((t: any) => {
            const student = t.studentId ? students.find((s: any) => s.id === t.studentId) : null;
            const progress = student ? Math.min((student.paidAmount / student.totalAmount) * 100, 100) : 0;
            
            return (
              <div key={t.id} className="flex flex-col p-8 bg-slate-50 dark:bg-[#09090b] rounded-[35px] border border-transparent hover:border-brand/30 transition-all shadow-sm group space-y-4">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-8">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${activeTab === 'transactions' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {activeTab === 'transactions' ? <ArrowUpCircle size={22}/> : <ArrowDownCircle size={22}/>}
                    </div>
                    <div>
                      <div className="font-black text-xl text-slate-900 dark:text-white">{t.person}</div>
                      <div className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mt-1.5 flex items-center gap-2">
                        {t.date} • {t.type} {activeTab === 'transactions' && <>• <span className="text-brand italic font-black">{t.paymentMode === 'Plein' ? 'Intégral' : 'Tranche'}</span></>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 lg:gap-8">
                    <div className={`text-2xl font-black ${activeTab === 'transactions' ? 'text-green-500' : 'text-red-500'}`}>{(Number(t.numeric) || 0).toLocaleString()} DA</div>
                    <div className="flex items-center gap-2">
                      {activeTab === 'transactions' && (
                        <button onClick={() => setSelectedReceipt(t)} className="p-3 bg-white dark:bg-white/5 text-slate-400 hover:text-brand rounded-xl border border-slate-100 dark:border-white/5 transition-all"><Printer size={18}/></button>
                      )}
                      <button onClick={() => handleEdit(t, activeTab === 'transactions' ? 'payment' : 'expense')} className="p-3 bg-white dark:bg-white/5 text-slate-400 hover:text-brand rounded-xl border border-slate-100 dark:border-white/5 transition-all"><Edit2 size={18}/></button>
                      <button onClick={() => setShowDeleteConfirm({id: t.id, type: activeTab})} className="p-3 text-zinc-400 hover:text-red-500 transition-all"><Trash2 size={18}/></button>
                    </div>
                  </div>
                </div>
                
                {activeTab === 'transactions' && t.paymentMode === 'Tranche' && student && (
                  <div className="pt-2 border-t border-slate-200 dark:border-white/5">
                    <div className="flex justify-between items-center mb-1">
                       <span className="text-[10px] font-black uppercase text-slate-400">Progression Paiement Élève</span>
                       <span className="text-[10px] font-black text-brand">{student.paidAmount.toLocaleString()} / {student.totalAmount.toLocaleString()} DA ({Math.round(progress)}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-white/5 h-1.5 rounded-full overflow-hidden">
                       <div className="bg-brand h-full transition-all duration-500" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                )}
              </div>
            );
          }) : (
            <div className="text-center py-20 text-slate-400 font-black uppercase tracking-widest italic">Aucun élément trouvé.</div>
          )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in zoom-in duration-300">
           <div className="bg-white dark:bg-[#111111] w-full max-w-xl p-12 rounded-[55px] relative shadow-2xl overflow-y-auto max-h-[90vh] no-scrollbar">
              <button onClick={() => {setShowAddModal(null); setEditingItem(null);}} className="absolute top-10 right-10 text-zinc-400 hover:text-brand transition-all"><X size={24}/></button>
              <h2 className="text-3xl font-black italic uppercase tracking-tight mb-4 text-slate-900 dark:text-white">{editingItem ? 'Modifier' : 'Saisie'} {showAddModal === 'payment' ? 'Recette' : 'Dépense'}</h2>
              
              <form onSubmit={handleSubmit} className="space-y-10">
                {showAddModal === 'payment' ? (
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-brand uppercase tracking-widest pl-4">Candidat concerné</label>
                    <select required value={formData.studentId} onChange={e => {
                      const s = students.find((x:any) => x.id === e.target.value);
                      setFormData({...formData, studentId: e.target.value, person: s?.name || ''});
                    }} className="w-full bg-slate-50 dark:bg-[#09090b] border border-slate-200 dark:border-white/10 rounded-3xl px-8 py-5 font-black outline-none appearance-none cursor-pointer text-slate-900 dark:text-white">
                      <option value="">-- Sélectionner l'élève --</option>
                      {students.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-brand uppercase tracking-widest pl-4">Bénéficiaire / Description</label>
                    <input required type="text" value={formData.person} onChange={e => setFormData({...formData, person: e.target.value})} className="w-full bg-slate-50 dark:bg-[#09090b] border border-slate-200 dark:border-white/10 rounded-3xl px-8 py-5 font-black outline-none text-slate-900 dark:text-white" placeholder="Ex: Naftal, Loyer, Nom Moniteur..." />
                  </div>
                )}

                {showAddModal === 'payment' && (
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-brand uppercase tracking-widest pl-4">Option de Règlement</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, paymentMode: 'Plein'})}
                        className={`py-5 rounded-3xl text-[10px] font-black uppercase tracking-widest border transition-all flex flex-col items-center gap-2 ${formData.paymentMode === 'Plein' ? 'bg-slate-900 text-white border-slate-900 shadow-xl' : 'bg-slate-50 dark:bg-white/5 text-slate-500 border-slate-100 dark:border-white/5'}`}
                      >
                        <CheckCircle2 size={16}/> Module Intégral
                      </button>
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, paymentMode: 'Tranche'})}
                        className={`py-5 rounded-3xl text-[10px] font-black uppercase tracking-widest border transition-all flex flex-col items-center gap-2 ${formData.paymentMode === 'Tranche' ? 'bg-brand text-white border-brand shadow-xl' : 'bg-slate-50 dark:bg-white/5 text-slate-500 border-slate-100 dark:border-white/5'}`}
                      >
                        <Wallet size={16}/> Par Tranche
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-brand uppercase tracking-widest pl-4">Catégorie / Motif</label>
                  <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
                    {(showAddModal === 'payment' ? paymentModules : expenseCategories).map((m) => (
                      <button 
                        key={m}
                        type="button"
                        onClick={() => setFormData({...formData, type: m})}
                        className={`shrink-0 px-8 py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-3 ${formData.type === m ? 'bg-brand/10 text-brand border-brand shadow-md' : 'bg-slate-50 dark:bg-white/5 text-slate-400 border-slate-200 dark:border-white/5'}`}
                      >
                        {getModuleIcon(m)} {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 text-center">
                  <label className="text-[10px] font-black text-brand uppercase tracking-widest">Montant (DZD)</label>
                  <input 
                    required 
                    type="number" 
                    value={formData.amount} 
                    onChange={e => setFormData({...formData, amount: e.target.value})} 
                    onWheel={e => e.currentTarget.blur()}
                    className="w-full bg-slate-50 dark:bg-[#09090b] border border-slate-200 dark:border-white/10 rounded-[40px] px-8 py-12 font-black text-6xl text-brand text-center outline-none focus:ring-4 focus:ring-brand/10 transition-all" 
                    placeholder="0" 
                  />
                </div>

                <button type="submit" className="w-full bg-brand text-white font-black py-8 rounded-[35px] uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-brand/30 hover:bg-slate-900 transition-all">
                  {editingItem ? 'Mettre à jour' : 'Valider l\'opération'}
                </button>
              </form>
           </div>
        </div>
      )}

      {selectedReceipt && <ReceiptModal transaction={selectedReceipt} onClose={() => setSelectedReceipt(null)} />}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in zoom-in duration-300">
          <div className="bg-white dark:bg-[#111111] w-full max-w-md p-10 rounded-[45px] shadow-2xl text-center">
            <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Trash2 size={32} />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight mb-4 text-slate-900 dark:text-white">Confirmer la suppression</h3>
            <p className="text-slate-500 font-bold mb-8">Voulez-vous vraiment supprimer cet élément ? Cette action est irréversible.</p>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setShowDeleteConfirm(null)}
                className="py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 border-slate-100 dark:border-white/5 text-slate-500 hover:bg-slate-50 transition-all"
              >
                Annuler
              </button>
              <button 
                onClick={() => handleDelete(showDeleteConfirm.id, showDeleteConfirm.type)}
                className="py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-red-500 text-white shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceTracker;
