
import * as React from 'react';
import { useState } from 'react';
import { Search, Plus, Upload, Trash2, Edit2, CheckCircle2, HelpCircle } from 'lucide-react';

const TestsCode: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirm, setShowConfirm] = useState<{id: number, type: 'delete' | 'edit'} | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const [questions, setQuestions] = useState([
    { id: 1, text: "Devant un panneau STOP, je dois marquer l'arrêt :", options: ["Oui", "Non"], answer: "Oui", category: "Signalisation" },
    { id: 2, text: "La vitesse maximale autorisée sur autoroute par temps de pluie est :", options: ["110 km/h", "100 km/h", "90 km/h"], answer: "100 km/h", category: "Règles" },
    { id: 3, text: "Un piéton est engagé sur un passage clouté, je m'arrête :", options: ["Toujours", "Si j'ai le temps", "Seulement s'il y a un feu rouge"], answer: "Toujours", category: "Sécurité" },
  ]);

  const filteredQuestions = questions.filter(q => 
    q.text.toLowerCase().includes(searchTerm.toLowerCase()) || 
    q.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight text-[#EEEEEE]">Gestion des Tests</h1>
          <p className="text-zinc-500 font-bold mt-1">Gérez votre base de données de questions d'examen théorique.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => { setNotification("Fonctionnalité d'import CSV bientôt disponible."); setTimeout(() => setNotification(null), 3000); }} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#393E46] border border-[#EEEEEE]/5 text-[10px] font-black uppercase tracking-widest hover:bg-[#393E46]/80 transition-all shadow-xl text-[#EEEEEE]">
            <Upload size={18} /> Import CSV
          </button>
          <button onClick={() => { setNotification("Ouverture du formulaire de création de question..."); setTimeout(() => setNotification(null), 3000); }} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00ADB5] text-[#222831] font-black text-[10px] uppercase tracking-widest hover:bg-[#00ADB5]/90 transition-all shadow-xl shadow-[#00ADB5]/20">
            <Plus size={18} /> Nouvelle Question
          </button>
        </div>
      </div>

      <div className="bg-[#393E46] border border-[#EEEEEE]/5 p-6 rounded-2xl flex flex-wrap gap-6 items-center shadow-2xl">
        <div className="flex-grow relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher une question par mots-clés ou catégorie..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#222831] border border-[#EEEEEE]/5 rounded-xl pl-12 pr-6 py-3.5 focus:outline-none focus:border-[#00ADB5] transition-all font-medium text-sm text-[#EEEEEE]"
          />
        </div>
      </div>

      <div className="grid gap-6">
        {filteredQuestions.length > 0 ? filteredQuestions.map((q) => (
          <div key={q.id} className="bg-[#393E46] border border-[#EEEEEE]/5 p-10 rounded-[32px] hover:border-[#00ADB5]/30 transition-all group shadow-2xl">
            <div className="flex justify-between items-start mb-8">
              <div className="flex gap-6">
                <div className="w-14 h-14 rounded-2xl bg-[#222831] border border-[#EEEEEE]/5 flex items-center justify-center shrink-0 shadow-lg group-hover:border-[#00ADB5]/50 transition-all">
                  <HelpCircle className="text-[#00ADB5]" size={24} />
                </div>
                <div>
                  <div className="text-[10px] text-[#00ADB5] font-black uppercase tracking-[0.2em] mb-2">{q.category}</div>
                  <h3 className="font-bold text-xl text-[#EEEEEE] leading-tight">{q.text}</h3>
                </div>
              </div>
              <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-all">
                <button onClick={() => { setNotification("Modification de la question " + q.id); setTimeout(() => setNotification(null), 3000); }} className="p-3 bg-[#222831] text-zinc-500 hover:text-[#00ADB5] rounded-xl border border-zinc-800 transition-all"><Edit2 size={18}/></button>
                <button onClick={() => setShowConfirm({ id: q.id, type: 'delete' })} className="p-3 bg-[#222831] text-zinc-500 hover:text-red-500 rounded-xl border border-zinc-800 transition-all"><Trash2 size={18}/></button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ml-0 sm:ml-20">
              {q.options.map((opt, i) => (
                <div key={i} className={`px-6 py-4 rounded-xl border text-sm font-bold flex items-center justify-between transition-all ${opt === q.answer ? 'bg-green-500/10 border-green-500/30 text-green-500 shadow-lg shadow-green-500/5' : 'bg-[#222831] border-zinc-800 text-zinc-400'}`}>
                  {opt}
                  {opt === q.answer && <CheckCircle2 size={16} />}
                </div>
              ))}
            </div>
          </div>
        )) : (
          <div className="py-20 text-center text-zinc-500 font-black uppercase tracking-widest bg-[#393E46] border border-[#EEEEEE]/5 rounded-[40px]">
            Aucune question trouvée pour "{searchTerm}".
          </div>
        )}
      </div>
      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in zoom-in duration-300">
          <div className="bg-[#393E46] w-full max-w-md p-10 rounded-[40px] shadow-2xl text-center border border-[#EEEEEE]/10">
            <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Trash2 size={32} />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight mb-4 text-[#EEEEEE] italic">Supprimer Question ?</h3>
            <p className="text-zinc-400 font-bold mb-8 italic text-sm">Cette action supprimera définitivement cette question du catalogue théorique.</p>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setShowConfirm(null)}
                className="py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-[#222831] text-zinc-400 border border-zinc-800 hover:text-white transition-all"
              >
                Annuler
              </button>
              <button 
                onClick={() => {
                  if (showConfirm.type === 'delete') {
                    setQuestions(questions.filter(q => q.id !== showConfirm.id));
                    setNotification("Question supprimée avec succès.");
                    setTimeout(() => setNotification(null), 3000);
                  }
                  setShowConfirm(null);
                }}
                className="py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-red-500 text-white shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Notification */}
      {notification && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[110] animate-in slide-in-from-bottom-5 duration-300">
           <div className="bg-[#00ADB5] text-[#222831] px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl flex items-center gap-3 border border-[#00ADB5]/50">
              <CheckCircle2 size={16} />
              {notification}
           </div>
        </div>
      )}
    </div>
  );
};

export default TestsCode;
