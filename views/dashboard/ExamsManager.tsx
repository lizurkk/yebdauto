
import { useState, useEffect, type FormEvent, type FC } from 'react';
import { getStore, updateStudents } from '../../services/store';
// Added Edit2 to the imports from lucide-react
import { Calendar, Plus, FileText, CheckCircle, Trash2, ChevronRight, X, Send, MapPin, Users, CheckCircle2, Award, Search, Edit2 } from 'lucide-react';
import { Student } from '../../types';

const ExamsManager: FC = () => {
  const [store, setStore] = useState(getStore());
  const [students, setStudents] = useState<Student[]>(store.students);
  const [examResults, setExamResults] = useState([
    { id: 'res1', studentId: '1', type: 'Code', result: 'Réussi', score: '38/40', date: '2024-02-15' },
    { id: 'res2', studentId: '2', type: 'Parking', result: 'Réussi', score: 'N/A', date: '2024-02-20' },
  ]);

  const [showProgramModal, setShowProgramModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [sessionForm, setSessionForm] = useState({ date: '', type: 'Code Théorique', location: 'Salle 1' });
  const [resultForm, setResultForm] = useState({ studentId: '', type: 'Code', result: 'Réussi' as any, score: '' });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setStore(getStore());
    window.addEventListener('storage_update', update);
    return () => window.removeEventListener('storage_update', update);
  }, []);

  const handleProgramSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSuccessMessage(`Session de ${sessionForm.type} programmée pour le ${sessionForm.date}.`);
    setTimeout(() => setSuccessMessage(null), 4000);
    setShowProgramModal(false);
  };

  const handleAddResult = (e: FormEvent) => {
    e.preventDefault();
    if (!resultForm.studentId) return;

    const newResult = {
      id: Math.random().toString(36).substr(2, 9),
      studentId: resultForm.studentId,
      type: resultForm.type,
      result: resultForm.result,
      score: resultForm.score || 'N/A',
      date: new Date().toISOString().split('T')[0]
    };

    setExamResults([newResult, ...examResults]);

    // LOGIQUE AUTOMATIQUE : Si c'est l'examen final (Conduite) et qu'il est réussi
    if (resultForm.type === 'Conduite' && resultForm.result === 'Réussi') {
      const updatedStudents = students.map(s => {
        if (s.id === resultForm.studentId) {
          return { ...s, status: 'graduated' as const };
        }
        return s;
      });
      setStudents(updatedStudents);
      updateStudents(updatedStudents);
    }

    setShowResultModal(false);
    setResultForm({ studentId: '', type: 'Code', result: 'Réussi', score: '' });
  };

  const toggleResultStatus = (id: string) => {
    setExamResults(examResults.map(res => {
      if (res.id === id) {
        const nextResult = res.result === 'Réussi' ? 'Échoué' : 'Réussi';
        
        // Si on change manuellement un résultat de conduite réussi en échoué, on remet l'élève en actif
        if (res.type === 'Conduite' && nextResult === 'Échoué') {
           const updatedStudents = students.map(s => s.id === res.studentId ? { ...s, status: 'active' as const } : s);
           setStudents(updatedStudents);
           updateStudents(updatedStudents);
        } else if (res.type === 'Conduite' && nextResult === 'Réussi') {
           const updatedStudents = students.map(s => s.id === res.studentId ? { ...s, status: 'graduated' as const } : s);
           setStudents(updatedStudents);
           updateStudents(updatedStudents);
        }

        return { ...res, result: nextResult as any };
      }
      return res;
    }));
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto animate-in fade-in duration-500 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Examens & PV</h1>
          <p className="text-zinc-500 font-bold mt-1">Gérez les sessions et automatisez les diplômes de vos élèves.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowResultModal(true)}
            className="bg-slate-900 text-white px-8 py-4 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-[#00ADB5] transition-all"
          >
            <CheckCircle2 size={18} /> Saisir un Résultat
          </button>
          <button 
            onClick={() => setShowProgramModal(true)}
            className="bg-[#00ADB5] text-white px-8 py-4 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-[#00ADB5]/20"
          >
            <Plus size={18} /> Programmer Session
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Recent Results */}
        <div className="bg-white dark:bg-[#111111] border border-slate-100 dark:border-white/5 rounded-[50px] p-12 shadow-sm relative overflow-hidden">
          <h3 className="text-2xl font-black mb-12 flex items-center gap-4 uppercase tracking-widest">
            <Award className="text-[#00ADB5]" /> Derniers Résultats
          </h3>
          <div className="space-y-5">
             {examResults.map((res) => {
               const student = students.find(s => s.id === res.studentId);
               return (
               <div key={res.id} className="flex items-center justify-between p-8 bg-slate-50 dark:bg-[#09090b] rounded-[32px] border border-transparent group hover:border-[#00ADB5]/30 transition-all shadow-sm">
                 <div className="flex items-center gap-6">
                   <div className={`w-3 h-3 rounded-full ${res.result === 'Réussi' ? 'bg-green-500 shadow-lg shadow-green-500/50' : 'bg-red-500'}`} />
                   <div>
                     <div className="font-black text-xl text-slate-900 dark:text-white">{student?.name || 'Inconnu'}</div>
                     <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-2 flex items-center gap-2">
                        {res.type} <ChevronRight size={10} /> <span className={res.result === 'Réussi' ? 'text-green-500' : 'text-red-500'}>{res.score}</span>
                     </div>
                   </div>
                 </div>
                 <button onClick={() => toggleResultStatus(res.id)} className="p-3 bg-white dark:bg-white/5 text-zinc-400 hover:text-[#00ADB5] rounded-xl opacity-0 group-hover:opacity-100 transition-all">
                    <Edit2 size={18} />
                 </button>
               </div>
             )})}
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="bg-white dark:bg-[#111111] border border-slate-100 dark:border-white/5 rounded-[50px] p-12 shadow-sm">
           <h3 className="text-2xl font-black mb-12 flex items-center gap-4 uppercase tracking-widest">
            <Calendar className="text-[#00ADB5]" /> Calendrier d'Examens
          </h3>
          <div className="space-y-6">
            {[
              { date: '15 Mars 2024', type: 'Code Théorique', location: 'Salle de Code Agence' },
              { date: '22 Mars 2024', type: 'Pratique (Parking)', location: 'Circuit Bab Azzouar' },
            ].map((session, i) => (
              <div key={i} className="bg-slate-50 dark:bg-[#09090b] p-8 rounded-[32px] border border-transparent hover:border-[#00ADB5]/20 transition-all flex justify-between items-center group shadow-sm">
                <div>
                  <div className="text-[#00ADB5] text-[10px] font-black uppercase tracking-[0.3em] mb-3">{session.date}</div>
                  <div className="font-black text-xl">{session.type}</div>
                  <div className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-2 flex items-center gap-2">
                    <MapPin size={12} className="text-[#00ADB5]" /> {session.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Result Entry Modal */}
      {showResultModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white dark:bg-[#111111] w-full max-w-lg p-12 rounded-[50px] relative shadow-2xl border border-slate-100 dark:border-white/5">
              <button onClick={() => setShowResultModal(false)} className="absolute top-10 right-10 text-zinc-400 hover:text-[#00ADB5] transition-all"><X size={24}/></button>
              <h2 className="text-3xl font-black uppercase tracking-tight mb-10">Saisir Résultat Examen</h2>
              <form onSubmit={handleAddResult} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#00ADB5] uppercase tracking-widest pl-2">Sélectionner Élève</label>
                    <select required value={resultForm.studentId} onChange={e => setResultForm({...resultForm, studentId: e.target.value})} className="w-full bg-slate-50 dark:bg-[#09090b] border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4.5 font-bold focus:border-[#00ADB5] outline-none appearance-none">
                       <option value="">-- Choisir un candidat --</option>
                       {students.filter(s => s.status === 'active').map(s => (
                         <option key={s.id} value={s.id}>{s.name}</option>
                       ))}
                    </select>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-[#00ADB5] uppercase tracking-widest pl-2">Épreuve</label>
                       <select value={resultForm.type} onChange={e => setResultForm({...resultForm, type: e.target.value as any})} className="w-full bg-slate-50 dark:bg-[#09090b] border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4.5 font-bold focus:border-[#00ADB5] outline-none">
                          <option value="Code">Code</option>
                          <option value="Parking">Manoeuvre (Parking)</option>
                          <option value="Conduite">Conduite (Circulation)</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-[#00ADB5] uppercase tracking-widest pl-2">Résultat</label>
                       <select value={resultForm.result} onChange={e => setResultForm({...resultForm, result: e.target.value as any})} className="w-full bg-slate-50 dark:bg-[#09090b] border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4.5 font-bold focus:border-[#00ADB5] outline-none">
                          <option value="Réussi">Réussi ✅</option>
                          <option value="Échoué">Échoué ❌</option>
                       </select>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#00ADB5] uppercase tracking-widest pl-2">Score ou Note (Optionnel)</label>
                    <input type="text" value={resultForm.score} onChange={e => setResultForm({...resultForm, score: e.target.value})} className="w-full bg-slate-50 dark:bg-[#09090b] border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4.5 font-bold focus:border-[#00ADB5] outline-none" placeholder="Ex: 39/40 ou TB" />
                 </div>
                 <button type="submit" className="w-full bg-[#00ADB5] text-white font-black py-6 rounded-2xl uppercase tracking-widest text-[10px] shadow-2xl mt-4 flex items-center justify-center gap-3">
                   Enregistrer le PV <CheckCircle2 size={18} />
                 </button>
              </form>
           </div>
        </div>
      )}

      {/* Program Modal remains simple as before... */}
      {showProgramModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white dark:bg-[#111111] w-full max-w-lg p-12 rounded-[50px] relative shadow-2xl border border-slate-100 dark:border-white/5">
              <button onClick={() => setShowProgramModal(false)} className="absolute top-10 right-10 text-zinc-400 hover:text-[#00ADB5] transition-all"><X size={24}/></button>
              <h2 className="text-3xl font-black uppercase tracking-tight mb-10">Programmer Session</h2>
              <form onSubmit={handleProgramSubmit} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#00ADB5] uppercase tracking-widest">Type d'examen</label>
                    <select value={sessionForm.type} onChange={e => setSessionForm({...sessionForm, type: e.target.value})} className="w-full bg-slate-50 dark:bg-[#09090b] border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-5 font-bold focus:border-[#00ADB5] outline-none">
                       <option>Code Théorique</option>
                       <option>Manoeuvre (Parking)</option>
                       <option>Circulation (Conduite)</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#00ADB5] uppercase tracking-widest">Date</label>
                    <input required type="date" value={sessionForm.date} onChange={e => setSessionForm({...sessionForm, date: e.target.value})} className="w-full bg-slate-50 dark:bg-[#09090b] border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-5 font-bold focus:border-[#00ADB5] outline-none" />
                 </div>
                 <button type="submit" className="w-full bg-[#00ADB5] text-white font-black py-6 rounded-2xl uppercase tracking-widest text-[10px] shadow-xl mt-6">Valider</button>
              </form>
           </div>
        </div>
      )}
      {/* Success Message */}
      {successMessage && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[150] animate-in slide-in-from-bottom-5 duration-300">
           <div className="bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl flex items-center gap-3 border border-emerald-400">
              <CheckCircle2 size={16} />
              {successMessage}
           </div>
        </div>
      )}
    </div>
  );
};

export default ExamsManager;
