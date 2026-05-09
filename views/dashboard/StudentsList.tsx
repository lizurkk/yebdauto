
import { useState, useEffect, useMemo, type FormEvent } from 'react';
import { 
  Search, Plus, FileText, 
  Mail, Phone, X, Send, MapPin,
  Edit2, Trash2, ChevronRight, CreditCard, 
  CheckCircle2, Users, FileCheck, Upload, Zap, Settings2, Car, BookOpen, Award, RefreshCw,
  Target, CheckCircle, Circle, BarChart3
} from 'lucide-react';
import { getStore, updateStudents } from '../../services/store';
import { Student, FormationType, ProgressSkill } from '../../types';

const DEFAULT_SKILLS: ProgressSkill[] = [
  { id: '1', label: 'Installation au poste de conduite', completed: false, category: 'Bases' },
  { id: '2', label: 'Démarrage et arrêt', completed: false, category: 'Bases' },
  { id: '3', label: 'Utilisation de la boîte de vitesses', completed: false, category: 'Bases' },
  { id: '4', label: 'Direction et trajectoire', completed: false, category: 'Bases' },
  { id: '5', label: 'Marche arrière en ligne droite', completed: false, category: 'Manoeuvres' },
  { id: '6', label: 'Rangement en bataille', completed: false, category: 'Manoeuvres' },
  { id: '7', label: 'Créneau', completed: false, category: 'Manoeuvres' },
  { id: '8', label: 'Demi-tour', completed: false, category: 'Manoeuvres' },
  { id: '9', label: 'Insertion dans la circulation', completed: false, category: 'Circulation' },
  { id: '10', label: 'Changement de direction', completed: false, category: 'Circulation' },
  { id: '11', label: 'Ronds-points et intersections', completed: false, category: 'Circulation' },
  { id: '12', label: 'Conduite sur voie rapide', completed: false, category: 'Circulation' },
  { id: '13', label: 'Conduite autonome', completed: false, category: 'Avancé' },
  { id: '14', label: 'Conduite économique', completed: false, category: 'Avancé' },
  { id: '15', label: 'Freinage d\'urgence', completed: false, category: 'Avancé' },
];

const StudentsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [store, setStore] = useState(getStore());
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const refreshData = (isInitial = false) => {
    if (isInitial) setLoading(true);
    const s = getStore();
    setStore(s);
    setStudents(s.students);
    if (isInitial) setLoading(false);
  };

  useEffect(() => {
    refreshData(true);
  }, []);

  useEffect(() => {
    const update = () => refreshData();
    window.addEventListener('storage_update', update);
    return () => window.removeEventListener('storage_update', update);
  }, []);

  const [formData, setFormData] = useState({ 
    name: '', cin: '', phone: '', email: '', 
    address: '', formation: FormationType.COMPLET, 
    transmission: 'Manuel' as const,
    totalAmount: 45000, status: 'active' as any
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let newList: Student[];
    if (editingStudent) {
      newList = students.map(s => s.id === editingStudent.id ? { ...s, ...formData } : s);
    } else {
      const student: Student = {
        id: `std_${Date.now()}`,
        ...formData,
        age: 18,
        registrationDate: new Date().toISOString().split('T')[0],
        paidAmount: 0
      };
      newList = [student, ...students];
    }
    setStudents(newList);
    updateStudents(newList);
    setShowAddModal(false);
    setEditingStudent(null);
    setFormData({ 
      name: '', cin: '', phone: '', email: '', 
      address: '', formation: FormationType.COMPLET, 
      transmission: 'Manuel',
      totalAmount: 45000, status: 'active' 
    });
  };

  const handleDelete = (id: string) => {
    const newList = students.filter(s => s.id !== id);
    setStudents(newList);
    updateStudents(newList);
    setShowDeleteConfirm(null);
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.cin.includes(searchTerm)
  );

  if (loading) return <div className="h-96 flex items-center justify-center"><RefreshCw className="animate-spin text-brand" size={48}/></div>;

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Gestion des Candidats</h1>
          <p className="text-zinc-500 font-bold mt-1.5">Tableau de bord des inscriptions et suivi administratif.</p>
        </div>
        <button 
          onClick={() => { setEditingStudent(null); setFormData({ name: '', cin: '', phone: '', email: '', address: '', formation: FormationType.COMPLET, transmission: 'Manuel', totalAmount: 45000, status: 'active' }); setShowAddModal(true); }}
          className="flex items-center gap-3 px-6 lg:px-10 py-3.5 lg:py-5 rounded-2xl bg-brand text-white font-black text-[10px] lg:text-[11px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-2xl shadow-brand/20"
        >
          <Plus size={18} /> Nouvelle Inscription
        </button>
      </div>

      <div className="bg-white dark:bg-[#111111] border border-slate-100 dark:border-white/5 rounded-[45px] shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
           <div className="relative w-full max-w-md">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input 
                type="text" 
                placeholder="Rechercher par Nom ou CIN..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white dark:bg-[#09090b] border border-slate-200 dark:border-white/5 rounded-2xl pl-16 pr-8 py-3.5 lg:py-4 focus:outline-none focus:border-brand font-bold text-sm shadow-sm"
              />
           </div>
        </div>

        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50 dark:border-white/5">
                <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Candidat</th>
                <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Formation</th>
                <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Statut</th>
                <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Finances</th>
                <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-white/5">
              {filteredStudents.map((student) => {
                const paid = Number(student.paidAmount) || 0;
                const total = Number(student.totalAmount) || 1;
                const percent = Math.min((paid / total) * 100, 100);
                
                return (
                  <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-10 py-8">
                      <div className="font-black text-slate-900 dark:text-white">{student.name}</div>
                      <div className="text-brand text-[10px] mt-1 font-black uppercase tracking-widest">CIN: {student.cin || '---'}</div>
                    </td>
                    <td className="px-10 py-8">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-brand/10 rounded-lg flex items-center justify-center text-brand">
                             {student.formation === FormationType.CODE ? <BookOpen size={14}/> : student.formation === FormationType.PERFECTIONNEMENT ? <Award size={14}/> : <Car size={14}/>}
                          </div>
                          <span className="text-[10px] font-black text-slate-700 dark:text-zinc-300 uppercase">{student.formation}</span>
                       </div>
                    </td>
                    <td className="px-10 py-8">
                       <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${student.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-slate-100 text-slate-400 dark:bg-white/5'}`}>
                          {student.status === 'active' ? 'En Cours' : 'Clôturé'}
                       </span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="text-sm font-black text-slate-900 dark:text-white">{paid.toLocaleString()} DA / {total.toLocaleString()} DA</div>
                      <div className="h-1.5 w-32 bg-slate-100 dark:bg-white/5 rounded-full mt-2.5 overflow-hidden">
                         <div className="h-full bg-brand transition-all duration-700" style={{ width: `${percent}%` }}></div>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex items-center justify-end gap-3">
                         <button 
                           onClick={() => setShowProgressModal(student)} 
                           className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-xl border border-emerald-500/20 transition-all text-[10px] font-black uppercase tracking-widest"
                         >
                           <Target size={14}/>
                           <span>Suivi</span>
                         </button>
                         <button 
                           onClick={() => { setEditingStudent(student); setFormData({ ...student }); setShowAddModal(true); }} 
                           className="flex items-center gap-2 px-4 py-2.5 bg-brand/10 text-brand hover:bg-brand hover:text-white rounded-xl border border-brand/20 transition-all text-[10px] font-black uppercase tracking-widest"
                         >
                           <Edit2 size={14}/>
                           <span>Modifier</span>
                         </button>
                         <button 
                           onClick={() => setShowDeleteConfirm(student.id)} 
                           className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl border border-red-500/20 transition-all text-[10px] font-black uppercase tracking-widest"
                         >
                           <Trash2 size={14}/>
                           <span>Supprimer</span>
                         </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden divide-y divide-slate-50 dark:divide-white/5">
          {filteredStudents.map((student) => {
            const paid = Number(student.paidAmount) || 0;
            const total = Number(student.totalAmount) || 1;
            const percent = Math.min((paid / total) * 100, 100);
            
            return (
              <div key={student.id} className="p-6 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-black text-lg text-slate-900 dark:text-white">{student.name}</div>
                    <div className="text-brand text-[10px] mt-1 font-black uppercase tracking-widest">CIN: {student.cin || '---'}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${student.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-slate-100 text-slate-400 dark:bg-white/5'}`}>
                    {student.status === 'active' ? 'En Cours' : 'Clôturé'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Formation</div>
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 bg-brand/10 rounded-lg flex items-center justify-center text-brand">
                          {student.formation === FormationType.CODE ? <BookOpen size={12}/> : student.formation === FormationType.PERFECTIONNEMENT ? <Award size={12}/> : <Car size={12}/>}
                       </div>
                       <span className="text-[9px] font-black text-slate-700 dark:text-zinc-300 uppercase">{student.formation}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Paiement</div>
                    <div className="text-[10px] font-black text-slate-900 dark:text-white">{percent.toFixed(0)}% ({paid.toLocaleString()} DA)</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button 
                    onClick={() => setShowProgressModal(student)} 
                    className="flex-grow flex items-center justify-center gap-2 py-3 bg-emerald-500/10 text-emerald-600 rounded-xl border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest"
                  >
                    <Target size={14}/> Suivi
                  </button>
                  <button 
                    onClick={() => { setEditingStudent(student); setFormData({ ...student }); setShowAddModal(true); }} 
                    className="flex-grow flex items-center justify-center gap-2 py-3 bg-brand/10 text-brand rounded-xl border border-brand/20 text-[9px] font-black uppercase tracking-widest"
                  >
                    <Edit2 size={14}/> Edit
                  </button>
                  <button 
                    onClick={() => setShowDeleteConfirm(student.id)} 
                    className="p-3 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20"
                  >
                    <Trash2 size={14}/>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PROGRESS MODAL */}
      {showProgressModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in zoom-in duration-300">
          <div className="bg-white dark:bg-[#111111] w-full max-w-4xl p-12 rounded-[55px] relative shadow-2xl overflow-y-auto max-h-[90vh] no-scrollbar">
            <button onClick={() => setShowProgressModal(null)} className="absolute top-10 right-10 text-zinc-400 hover:text-brand transition-all"><X size={24}/></button>
            
            <div className="flex items-center gap-6 mb-10">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-[25px] flex items-center justify-center text-emerald-600">
                <BarChart3 size={40} />
              </div>
              <div>
                <h2 className="text-3xl font-black uppercase italic tracking-tight text-slate-900 dark:text-white">
                  Suivi de Progression
                </h2>
                <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest mt-1">Candidat: {showProgressModal.name}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {(['Bases', 'Manoeuvres', 'Circulation', 'Avancé'] as const).map(category => {
                const skills = (showProgressModal.progress || DEFAULT_SKILLS).filter(s => s.category === category);
                const completedCount = skills.filter(s => s.completed).length;
                const totalCount = skills.length;
                const percent = Math.round((completedCount / totalCount) * 100);

                return (
                  <div key={category} className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-black uppercase tracking-tighter text-slate-900 dark:text-white flex items-center gap-3">
                        <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
                        {category}
                      </h3>
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-widest">
                        {percent}%
                      </span>
                    </div>

                    <div className="space-y-3">
                      {skills.map(skill => (
                        <button
                          key={skill.id}
                          onClick={() => {
                            const newProgress = (showProgressModal.progress || DEFAULT_SKILLS).map(s => 
                              s.id === skill.id ? { ...s, completed: !s.completed } : s
                            );
                            const updatedStudent = { ...showProgressModal, progress: newProgress };
                            const newList = students.map(s => s.id === showProgressModal.id ? updatedStudent : s);
                            setStudents(newList);
                            updateStudents(newList);
                            setShowProgressModal(updatedStudent);
                          }}
                          className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left group ${
                            skill.completed 
                              ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-700 dark:text-emerald-400' 
                              : 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 text-slate-500 hover:border-brand/30'
                          }`}
                        >
                          {skill.completed ? (
                            <CheckCircle size={20} className="text-emerald-500 shrink-0" />
                          ) : (
                            <Circle size={20} className="text-slate-300 dark:text-white/10 shrink-0 group-hover:text-brand" />
                          )}
                          <span className="text-xs font-black uppercase tracking-tight">{skill.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 pt-8 border-t border-slate-100 dark:border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progression Totale</div>
                <div className="h-2 w-48 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-1000" 
                    style={{ width: `${Math.round(((showProgressModal.progress || DEFAULT_SKILLS).filter(s => s.completed).length / (showProgressModal.progress || DEFAULT_SKILLS).length) * 100)}%` }}
                  ></div>
                </div>
              </div>
              <button 
                onClick={() => setShowProgressModal(null)}
                className="bg-slate-900 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand transition-all"
              >
                Fermer le suivi
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in zoom-in duration-300">
          <div className="bg-white dark:bg-[#111111] w-full max-w-2xl p-12 rounded-[55px] relative shadow-2xl overflow-y-auto max-h-[90vh] no-scrollbar">
            <button onClick={() => setShowAddModal(false)} className="absolute top-10 right-10 text-zinc-400 hover:text-brand transition-all"><X size={24}/></button>
            <h2 className="text-3xl font-black uppercase italic tracking-tight mb-8 text-slate-900 dark:text-white">
              {editingStudent ? 'Modifier Dossier' : 'Nouveau Candidat'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-brand uppercase tracking-widest pl-4">Type de Formation</label>
                <div className="flex flex-wrap gap-3">
                  {Object.values(FormationType).map((f) => (
                    <button 
                      key={f}
                      type="button"
                      onClick={() => {
                        let price = 45000;
                        if(f === FormationType.CODE) price = 15000;
                        if(f === FormationType.PERFECTIONNEMENT) price = 20000;
                        setFormData({...formData, formation: f, totalAmount: price});
                      }}
                      className={`px-6 py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest border-2 transition-all flex items-center gap-3 ${formData.formation === f ? 'bg-brand text-white border-brand shadow-lg scale-105' : 'bg-slate-50 dark:bg-white/5 text-slate-500 border-slate-100 dark:border-white/5'}`}
                    >
                      {f === FormationType.CODE ? <BookOpen size={16}/> : f === FormationType.PERFECTIONNEMENT ? <Award size={16}/> : <Car size={16}/>}
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-brand uppercase tracking-widest pl-4">Nom et Prénom</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 dark:bg-[#09090b] border-2 border-slate-100 dark:border-white/5 rounded-2xl px-6 py-4 font-black outline-none focus:border-brand" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-brand uppercase tracking-widest pl-4">N° C.I.N</label>
                  <input required type="text" value={formData.cin} onChange={e => setFormData({...formData, cin: e.target.value})} className="w-full bg-slate-50 dark:bg-[#09090b] border-2 border-slate-100 dark:border-white/5 rounded-2xl px-6 py-4 font-black outline-none focus:border-brand" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-brand uppercase tracking-widest pl-4">Téléphone Mobile</label>
                  <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-50 dark:bg-[#09090b] border-2 border-slate-100 dark:border-white/5 rounded-2xl px-6 py-4 font-black outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-brand uppercase tracking-widest pl-4">Boîte de vitesse</label>
                  <div className="w-full bg-slate-100 dark:bg-white/5 text-brand px-6 py-4 rounded-2xl font-black text-xs uppercase flex items-center gap-3">
                     <Settings2 size={16}/> Manuel Uniquement (BVM)
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-brand uppercase tracking-widest pl-4">Montant Total de la formation (DZD)</label>
                <input 
                  required 
                  type="number" 
                  value={formData.totalAmount} 
                  onChange={e => setFormData({...formData, totalAmount: Number(e.target.value)})} 
                  onWheel={e => e.currentTarget.blur()}
                  className="w-full bg-slate-50 dark:bg-[#09090b] border-2 border-slate-100 dark:border-white/5 rounded-3xl px-8 py-6 text-3xl font-black text-brand outline-none focus:border-brand" 
                />
              </div>

              <button type="submit" className="w-full bg-brand text-white font-black py-8 rounded-[35px] uppercase tracking-widest text-[11px] shadow-2xl shadow-brand/30 hover:bg-slate-900 transition-all flex items-center justify-center gap-3">
                {editingStudent ? 'Mettre à jour le dossier' : 'Finaliser l\'inscription'} <CheckCircle2 size={18} />
              </button>
            </form>
          </div>
        </div>
      )}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in zoom-in duration-300">
          <div className="bg-white dark:bg-[#111111] w-full max-w-md p-10 rounded-[45px] shadow-2xl text-center">
            <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Trash2 size={32} />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight mb-4 text-slate-900 dark:text-white">Confirmer la suppression</h3>
            <p className="text-slate-500 font-bold mb-8">Voulez-vous vraiment supprimer ce dossier candidat ? Cette action est irréversible.</p>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setShowDeleteConfirm(null)}
                className="py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 border-slate-100 dark:border-white/5 text-slate-500 hover:bg-slate-50 transition-all"
              >
                Annuler
              </button>
              <button 
                onClick={() => handleDelete(showDeleteConfirm)}
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

export default StudentsList;
