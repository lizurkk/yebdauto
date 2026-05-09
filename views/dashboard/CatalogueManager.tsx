
import { useState, useEffect } from 'react';
import { 
  getStore, updateBranding, updateHero, updatePageHeaders, updatePermis,
  updatePricing, updateSchool, updateProcess, updateFaq, updateTestimonials,
  updateValues, updateSocial, updateDossier, updateStats, updateResources, updatePlanning,
  updateShowPrices
} from '../../services/store';
import { 
  Save, Palette, Type, Layout, Star, Car, Zap, 
  ListChecks, MessageSquare, Award, Share2, Plus, 
  Trash2, Edit2, X, CheckCircle2, FileText, Info, Hash, Clock, Database, Copy, Terminal, Calendar
} from 'lucide-react';

const CatalogueManager: React.FC = () => {
  const [store, setStore] = useState(getStore());
  const [activeTab, setActiveTab] = useState<'hero' | 'headers' | 'permis' | 'pricing' | 'procedure' | 'faq' | 'testimonials' | 'agence' | 'planning' | 'db'>('hero');
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Modal State
  const [modalType, setModalType] = useState<'permis' | 'pricing' | 'procedure' | 'faq' | 'testimonial' | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formItem, setFormItem] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ key: string, index: number } | null>(null);

  useEffect(() => {
    const update = () => setStore(getStore());
    window.addEventListener('storage_update', update);
    return () => window.removeEventListener('storage_update', update);
  }, []);

  const handleSave = () => {
    updateBranding(store.branding);
    updateHero(store.hero);
    updatePageHeaders(store.pageHeaders);
    updatePermis(store.permis);
    updatePricing(store.pricing);
    updateSchool(store.school);
    updateProcess(store.process);
    updateFaq(store.faq);
    updateTestimonials(store.testimonials);
    updateValues(store.values);
    updateSocial(store.social);
    updateDossier(store.dossier);
    updateStats(store.stats);
    updateResources(store.resources);
    updatePlanning(store.planning);
    updateShowPrices(store.showPrices);
    
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  const sqlSchema = `-- Yebda Auto-École PostgreSQL Schema
CREATE TABLE instructors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  license_number TEXT UNIQUE,
  specialty TEXT CHECK (specialty IN ('Code', 'Pratique', 'Mixte')),
  phone TEXT,
  experience TEXT,
  avatar TEXT,
  availability TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  model TEXT NOT NULL,
  plate TEXT UNIQUE NOT NULL,
  fuel_type TEXT CHECK (fuel_type IN ('Essence', 'Diesel', 'GPL')),
  transmission TEXT DEFAULT 'Manuel',
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'maintenance', 'in_use')),
  last_maintenance DATE,
  insurance_expiry DATE,
  image TEXT
);

CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  cin TEXT UNIQUE NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  registration_date DATE DEFAULT CURRENT_DATE,
  formation TEXT,
  total_amount NUMERIC DEFAULT 45000,
  paid_amount NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'active'
);

CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id),
  instructor_id UUID REFERENCES instructors(id),
  vehicle_id UUID REFERENCES vehicles(id),
  type TEXT,
  day TEXT,
  time TEXT,
  week_offset INTEGER
);

CREATE TABLE finance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE DEFAULT CURRENT_DATE,
  student_id UUID REFERENCES students(id),
  person_name TEXT,
  category TEXT,
  amount NUMERIC NOT NULL,
  is_expense BOOLEAN DEFAULT FALSE
);`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openModal = (type: any, index: number | null = null) => {
    setModalType(type);
    setEditingIndex(index);
    const storeKey = type === 'procedure' ? 'process' : type === 'pricing' ? 'pricing' : type === 'permis' ? 'permis' : type === 'faq' ? 'faq' : 'testimonials';
    if (index !== null) {
      setFormItem({ ...store[storeKey][index] });
    } else {
      const defaults: any = {
        permis: { id: Date.now().toString(), title: '', subtitle: '', description: '', price: 0, specs: [] },
        pricing: { id: Date.now().toString(), title: '', subtitle: '', priceFull: 0, priceTranche: 0, tranchesCount: 2, features: [] },
        procedure: { title: '', description: '', details: [], proTip: '' },
        faq: { question: '', answer: '' },
        testimonial: { name: '', text: '', rating: 5, date: new Date().toLocaleDateString() }
      };
      setFormItem(defaults[type]);
    }
  };

  const closeModal = () => {
    setModalType(null);
    setEditingIndex(null);
    setFormItem(null);
  };

  const submitModal = (e: React.FormEvent) => {
    e.preventDefault();
    const storeKey = modalType === 'procedure' ? 'process' : modalType === 'pricing' ? 'pricing' : modalType === 'permis' ? 'permis' : modalType === 'faq' ? 'faq' : 'testimonials';
    const newList = [...store[storeKey]];
    if (editingIndex !== null) {
      newList[editingIndex] = formItem;
    } else {
      newList.push(formItem);
    }
    setStore({ ...store, [storeKey]: newList });
    closeModal();
  };

  const deleteItem = () => {
    if (!showDeleteConfirm) return;
    const { key, index } = showDeleteConfirm;
    const storeKey = key === 'process' ? 'process' : key === 'pricing' ? 'pricing' : key === 'permis' ? 'permis' : key === 'faq' ? 'faq' : 'testimonials';
    const newList = [...store[storeKey]];
    newList.splice(index, 1);
    setStore({ ...store, [storeKey]: newList });
    setShowDeleteConfirm(null);
  };

  const inputStyle = "w-full bg-slate-50 dark:bg-zinc-800 border-2 border-slate-100 dark:border-white/5 rounded-2xl px-6 py-4 text-base font-black text-slate-900 dark:text-white outline-none focus:border-brand transition-all shadow-sm ring-0";
  const labelStyle = "text-[11px] font-black uppercase text-brand mb-2 block tracking-widest pl-2";

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-32 px-4 md:px-0 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight text-slate-900 dark:text-white">CMS Site Public</h1>
          <p className="text-slate-500 font-bold mt-1">Personnalisez chaque pixel et chaque mot de votre école.</p>
        </div>
        <button 
          onClick={handleSave}
          className="w-full md:w-auto bg-brand text-white px-12 py-5 rounded-full flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all"
        >
          {success ? <CheckCircle2 size={18} /> : <Save size={18} />}
          {success ? 'Site Mis à Jour !' : 'Publier les changements'}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 bg-slate-100 dark:bg-white/5 p-2 rounded-[30px] border border-slate-200 dark:border-white/5 overflow-x-auto no-scrollbar">
        {[
          { id: 'hero', label: 'Accueil', icon: <Layout size={16}/> },
          { id: 'headers', label: 'Pages', icon: <Type size={16}/> },
          { id: 'permis', label: 'Permis', icon: <Car size={16}/> },
          { id: 'pricing', label: 'Tarifs', icon: <Zap size={16}/> },
          { id: 'procedure', label: 'Parcours', icon: <ListChecks size={16}/> },
          { id: 'agence', label: 'Infos', icon: <Share2 size={16}/> },
          { id: 'planning', label: 'Planning', icon: <Clock size={16}/> },
          { id: 'faq', label: 'FAQ', icon: <MessageSquare size={16}/> },
          { id: 'testimonials', label: 'Avis', icon: <Star size={16}/> },
          { id: 'db', label: 'Base de Données', icon: <Database size={16}/> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white dark:bg-zinc-800 text-brand shadow-lg border border-slate-200 dark:border-white/10' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {activeTab === 'db' && (
          <div className="bg-white dark:bg-[#111111] p-12 rounded-[50px] border border-slate-100 dark:border-white/5 shadow-sm space-y-12 max-w-5xl mx-auto">
             <div className="flex flex-col md:flex-row justify-between gap-8">
                <div className="space-y-4">
                  <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-900 dark:text-white flex items-center gap-4"><Database className="text-brand"/> Infrastructure SQL</h3>
                  <p className="text-slate-500 font-bold max-w-xl leading-relaxed">
                    Voici le schéma relationnel complet optimisé pour PostgreSQL. Utilisez ces commandes pour initialiser votre base de données sur Supabase ou un serveur privé.
                  </p>
                </div>
                <button 
                  onClick={copySql}
                  className="h-fit flex items-center gap-3 px-8 py-5 bg-brand/10 text-brand rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-brand hover:text-white transition-all border border-brand/20"
                >
                  {copied ? <CheckCircle2 size={16}/> : <Copy size={16} />}
                  {copied ? 'Copié !' : 'Copier le SQL'}
                </button>
             </div>

             <div className="space-y-6">
                <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 pl-4">
                   <Terminal size={16} className="text-brand"/> Script d'initialisation
                </div>
                <div className="bg-slate-950 rounded-[35px] p-10 font-mono text-sm text-brand overflow-x-auto shadow-2xl border border-white/5 leading-relaxed">
                   <pre>{sqlSchema}</pre>
                </div>
             </div>

             <div className="grid md:grid-cols-2 gap-8 pt-8">
                <div className="p-10 bg-slate-50 dark:bg-white/5 rounded-[40px] border border-slate-100 dark:border-white/5">
                   <h4 className="text-xl font-black uppercase tracking-tighter mb-4 text-slate-900 dark:text-white">Relations</h4>
                   <ul className="space-y-4 text-sm font-bold text-slate-500 list-disc pl-4">
                      <li>Les <span className="text-brand">Leçons</span> sont liées aux Élèves, Moniteurs et Véhicules.</li>
                      <li>La <span className="text-brand">Finance</span> suit les versements par ID Élève.</li>
                      <li>Les suppressions sont en mode <span className="text-brand">CASCADE</span> pour la sécurité des données.</li>
                   </ul>
                </div>
                <div className="p-10 bg-slate-50 dark:bg-white/5 rounded-[40px] border border-slate-100 dark:border-white/5">
                   <h4 className="text-xl font-black uppercase tracking-tighter mb-4 text-slate-900 dark:text-white">Types de Données</h4>
                   <ul className="space-y-4 text-sm font-bold text-slate-500 list-disc pl-4">
                      <li>Utilisation des <span className="text-brand">UUID</span> pour des IDs universels sécurisés.</li>
                      <li><span className="text-brand">JSONB</span> pour la flexibilité du contenu CMS.</li>
                      <li><span className="text-brand">NUMERIC</span> pour une précision financière parfaite.</li>
                   </ul>
                </div>
             </div>
          </div>
        )}

        {/* Existing tabs follow here... */}
        {activeTab === 'planning' && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-[#111111] p-10 rounded-[45px] border border-slate-100 dark:border-white/5 shadow-sm space-y-8">
              <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 dark:text-white flex items-center gap-4"><Clock className="text-brand"/> Créneaux Horaires</h3>
              <div className="space-y-4">
                {store.planning.timeSlots.map((slot: string, idx: number) => (
                  <div key={idx} className="grid grid-cols-[1fr_auto_auto] gap-4 items-center">
                    <input 
                      type="text" 
                      value={slot} 
                      onChange={e => {
                        const ns = [...store.planning.timeSlots];
                        ns[idx] = e.target.value;
                        setStore({...store, planning: {...store.planning, timeSlots: ns}});
                      }} 
                      className={`${inputStyle} h-12 text-sm font-bold`} 
                      placeholder="ex: 08:00"
                    />
                    <input
                      type="color"
                      value={store.planning.rowColors?.[idx] || '#F8FAFC'}
                      onChange={e => {
                        const colors = [...(store.planning.rowColors || [])];
                        colors[idx] = e.target.value;
                        setStore({...store, planning: {...store.planning, rowColors: colors}});
                      }}
                      className="w-14 h-12 rounded-2xl border border-slate-200 p-0"
                      title="Couleur de la ligne"
                    />
                    <button 
                      onClick={() => {
                        const ns = store.planning.timeSlots.filter((_:any, i:number) => i !== idx);
                        const colors = (store.planning.rowColors || []).filter((_: any, i: number) => i !== idx);
                        setStore({...store, planning: {...store.planning, timeSlots: ns, rowColors: colors}});
                      }} 
                      className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={16}/>
                    </button>
                  </div>
                ))}
                <button 
                  onClick={() => setStore({...store, planning: {...store.planning, timeSlots: [...store.planning.timeSlots, '00:00'], rowColors: [...(store.planning.rowColors || []), '#F8FAFC']}})} 
                  className="text-[10px] font-black uppercase text-brand flex items-center gap-2 pl-4"
                >
                  <Plus size={14}/> Ajouter un créneau
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-[#111111] p-10 rounded-[45px] border border-slate-100 dark:border-white/5 shadow-sm space-y-8">
              <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 dark:text-white flex items-center gap-4"><Calendar className="text-brand"/> Jours de Fermeture</h3>
              <div className="space-y-4">
                {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map(day => (
                  <button
                    key={day}
                    onClick={() => {
                      const closed = store.planning.closedDays.includes(day)
                        ? store.planning.closedDays.filter((d: string) => d !== day)
                        : [...store.planning.closedDays, day];
                      setStore({...store, planning: {...store.planning, closedDays: closed}});
                    }}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all font-black text-xs uppercase tracking-widest ${
                      store.planning.closedDays.includes(day)
                        ? 'bg-red-50 border-red-200 text-red-600'
                        : 'bg-slate-50 border-slate-100 text-slate-400'
                    }`}
                  >
                    {day}
                    {store.planning.closedDays.includes(day) ? <X size={16}/> : <CheckCircle2 size={16} className="opacity-20"/>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hero' && (
          <div className="bg-white dark:bg-[#111111] p-12 rounded-[50px] border border-slate-100 dark:border-white/5 shadow-sm space-y-10 max-w-4xl mx-auto">
            <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white flex items-center gap-4"><Layout className="text-brand"/> Section d'Accueil</h3>
            <div className="space-y-8">
              <div>
                <label className={labelStyle}>Titre de la Landing Page</label>
                <input type="text" value={store.hero.title} onChange={e => setStore({...store, hero: {...store.hero, title: e.target.value}})} className={inputStyle} />
              </div>
              <div>
                <label className={labelStyle}>Highlight</label>
                <input type="text" value={store.hero.highlight} onChange={e => setStore({...store, hero: {...store.hero, highlight: e.target.value}})} className={inputStyle} />
              </div>
              <div>
                <label className={labelStyle}>Paragraphe d'introduction</label>
                <textarea value={store.hero.subtitle} onChange={e => setStore({...store, hero: {...store.hero, subtitle: e.target.value}})} className={`${inputStyle} h-32 py-5`} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'headers' && (
          <>
            <div className="bg-white dark:bg-[#111111] p-10 rounded-[45px] border border-slate-100 dark:border-white/5 shadow-sm mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">Visibilité des prix</h3>
                  <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2">
                    Activez cette option pour afficher les prix sur la page formations, désactivez-la pour afficher « Prix sur demande ».
                  </p>
                </div>
                <button
                  onClick={() => setStore({...store, showPrices: !store.showPrices})}
                  className={`px-8 py-4 rounded-full font-black uppercase tracking-widest transition ${store.showPrices ? 'bg-brand text-white' : 'bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-slate-300'}`}
                >
                  {store.showPrices ? 'Prix visibles' : 'Prix cachés'}
                </button>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
            {Object.keys(store.pageHeaders).map((key) => (
              <div key={key} className="bg-white dark:bg-[#111111] p-10 rounded-[45px] border border-slate-100 dark:border-white/5 shadow-sm space-y-8">
                <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 dark:text-white flex items-center gap-4">
                  <Type className="text-brand"/> Page {key.charAt(0).toUpperCase() + key.slice(1)}
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className={labelStyle}>Titre de Page</label>
                    <input type="text" value={store.pageHeaders[key].title} onChange={e => setStore({...store, pageHeaders: {...store.pageHeaders, [key]: {...store.pageHeaders[key], title: e.target.value}}})} className={inputStyle} />
                  </div>
                  <div>
                    <label className={labelStyle}>Highlight</label>
                    <input type="text" value={store.pageHeaders[key].highlight} onChange={e => setStore({...store, pageHeaders: {...store.pageHeaders, [key]: {...store.pageHeaders[key], highlight: e.target.value}}})} className={inputStyle} />
                  </div>
                  <div>
                    <label className={labelStyle}>Sous-titre</label>
                    <textarea value={store.pageHeaders[key].subtitle} onChange={e => setStore({...store, pageHeaders: {...store.pageHeaders, [key]: {...store.pageHeaders[key], subtitle: e.target.value}}})} className={`${inputStyle} h-24 py-4`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
        )}

        {activeTab === 'permis' && (
          <div className="space-y-8">
            <div className="flex justify-end">
                <button onClick={() => openModal('permis')} className="bg-brand text-white px-8 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg"><Plus size={16}/> Ajouter un Permis</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {store.permis.map((p: any, idx: number) => (
                    <div key={idx} className="bg-white dark:bg-[#111111] p-8 rounded-[40px] border border-slate-100 dark:border-white/5 shadow-sm space-y-6 group relative">
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button onClick={() => openModal('permis', idx)} className="p-2 text-brand bg-brand/10 rounded-lg"><Edit2 size={14}/></button>
                           <button onClick={() => setShowDeleteConfirm({ key: 'permis', index: idx })} className="p-2 text-red-500 bg-red-500/10 rounded-lg"><Trash2 size={14}/></button>
                        </div>
                        <h4 className="text-xl font-black uppercase italic tracking-tight text-slate-900 dark:text-white">{p.title}</h4>
                        <div className="text-2xl font-black text-brand">{(p.price || 0).toLocaleString()} DA</div>
                        <p className="text-sm font-bold text-slate-500 leading-relaxed line-clamp-3 italic">"{p.description}"</p>
                    </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="space-y-8">
            <div className="flex justify-end">
                <button onClick={() => openModal('pricing')} className="bg-brand text-white px-8 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg"><Plus size={16}/> Nouveau Module</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {store.pricing.map((p: any, idx: number) => (
                    <div key={idx} className="bg-white dark:bg-[#111111] p-10 rounded-[45px] border border-slate-100 dark:border-white/5 shadow-lg space-y-8 group relative">
                        <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button onClick={() => openModal('pricing', idx)} className="p-2 text-brand bg-brand/10 rounded-lg"><Edit2 size={14}/></button>
                           <button onClick={() => setShowDeleteConfirm({ key: 'pricing', index: idx })} className="p-2 text-red-500 bg-red-500/10 rounded-lg"><Trash2 size={14}/></button>
                        </div>
                        <div>
                           <h4 className="text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">{p.title}</h4>
                           <p className="text-[10px] font-black uppercase text-slate-400 mt-1">{p.subtitle}</p>
                        </div>
                        <div className="space-y-1">
                           <div className="text-4xl font-black text-slate-900 dark:text-white">{(p.priceFull || 0).toLocaleString()} DA</div>
                           <div className="text-[10px] font-black uppercase text-brand">Tranches: {p.tranchesCount} x {(p.priceTranche || 0).toLocaleString()} DA</div>
                        </div>
                    </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === 'procedure' && (
          <div className="space-y-8">
            <div className="flex justify-end">
                <button onClick={() => openModal('procedure')} className="bg-brand text-white px-8 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg"><Plus size={16}/> Ajouter une Étape</button>
            </div>
            <div className="space-y-6">
                {store.process.map((step: any, idx: number) => (
                    <div key={idx} className="bg-white dark:bg-[#111111] p-10 rounded-[45px] border border-slate-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center group shadow-sm transition-all hover:border-brand/20">
                        <div className="space-y-4 max-w-2xl">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-brand/10 text-brand rounded-2xl flex items-center justify-center font-black text-xl">0{idx + 1}</div>
                              <h4 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white italic">{step.title}</h4>
                           </div>
                           <p className="text-slate-500 font-bold leading-relaxed">{step.description}</p>
                           {step.proTip && <div className="text-[10px] font-black text-brand uppercase tracking-widest bg-brand/5 p-3 rounded-xl border border-brand/10 italic">Conseil: {step.proTip}</div>}
                        </div>
                        <div className="flex gap-4 mt-6 md:mt-0">
                           <button onClick={() => openModal('procedure', idx)} className="p-4 text-brand bg-brand/10 rounded-2xl hover:bg-brand hover:text-white transition-all"><Edit2 size={20}/></button>
                           <button onClick={() => setShowDeleteConfirm({ key: 'process', index: idx })} className="p-4 text-red-500 bg-red-500/10 rounded-2xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={20}/></button>
                        </div>
                    </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="space-y-8">
             <div className="flex justify-end">
                <button onClick={() => openModal('faq')} className="bg-brand text-white px-8 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg"><Plus size={16}/> Nouvelle Question</button>
             </div>
             <div className="space-y-4">
                {store.faq.map((f: any, idx: number) => (
                  <div key={idx} className="bg-white dark:bg-[#111111] p-8 rounded-[35px] border border-slate-100 dark:border-white/5 flex justify-between items-center group shadow-sm hover:border-brand/20 transition-all">
                     <div className="pr-10">
                        <h4 className="font-black text-lg text-slate-900 dark:text-white">{f.question}</h4>
                        <p className="text-slate-500 text-sm mt-2 font-bold leading-relaxed italic line-clamp-2">{f.answer}</p>
                     </div>
                     <div className="flex gap-2">
                        <button onClick={() => openModal('faq', idx)} className="p-3 text-brand bg-brand/5 rounded-xl"><Edit2 size={18}/></button>
                        <button onClick={() => setShowDeleteConfirm({ key: 'faq', index: idx })} className="p-3 text-red-500 bg-red-500/5 rounded-xl"><Trash2 size={18}/></button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'testimonials' && (
          <div className="space-y-8">
             <div className="flex justify-end">
                <button onClick={() => openModal('testimonial')} className="bg-brand text-white px-8 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg"><Plus size={16}/> Ajouter un Avis</button>
             </div>
             <div className="grid md:grid-cols-2 gap-6">
                {store.testimonials.map((t: any, idx: number) => (
                  <div key={idx} className="bg-white dark:bg-[#111111] p-10 rounded-[40px] border border-slate-100 dark:border-white/5 shadow-sm relative group hover:border-brand/20 transition-all">
                     <div className="absolute top-8 right-8 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openModal('testimonial', idx)} className="p-2 text-brand bg-brand/10 rounded-lg"><Edit2 size={14}/></button>
                        <button onClick={() => setShowDeleteConfirm({ key: 'testimonials', index: idx })} className="p-2 text-red-500 bg-red-500/10 rounded-lg"><Trash2 size={14}/></button>
                     </div>
                     <div className="flex text-yellow-500 mb-4">
                        {[...Array(t.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor"/>)}
                     </div>
                     <p className="text-slate-600 dark:text-zinc-400 font-bold italic leading-relaxed mb-6 line-clamp-4">"{t.text}"</p>
                     <div className="flex items-center justify-between border-t border-slate-50 dark:border-white/5 pt-4">
                        <span className="text-sm font-black text-slate-900 dark:text-white uppercase">{t.name}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.date}</span>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'agence' && (
          <div className="grid md:grid-cols-2 gap-8">
             <div className="bg-white dark:bg-[#111111] p-10 rounded-[45px] border border-slate-100 dark:border-white/5 shadow-sm space-y-8">
                <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 dark:text-white flex items-center gap-4"><Share2 className="text-brand"/> Réseaux Sociaux</h3>
                <div className="space-y-6">
                   <div>
                      <label className={labelStyle}>Lien Facebook</label>
                      <input type="text" value={store.social.facebook} onChange={e => setStore({...store, social: {...store.social, facebook: e.target.value}})} className={inputStyle} />
                   </div>
                   <div>
                      <label className={labelStyle}>Lien Instagram</label>
                      <input type="text" value={store.social.instagram} onChange={e => setStore({...store, social: {...store.social, instagram: e.target.value}})} className={inputStyle} />
                   </div>
                   <div>
                      <label className={labelStyle}>WhatsApp (wa.me/...)</label>
                      <input type="text" value={store.social.whatsapp} onChange={e => setStore({...store, social: {...store.social, whatsapp: e.target.value}})} className={inputStyle} />
                   </div>
                </div>
             </div>
             
             <div className="bg-white dark:bg-[#111111] p-10 rounded-[45px] border border-slate-100 dark:border-white/5 shadow-sm space-y-8">
                <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 dark:text-white flex items-center gap-4"><FileText className="text-brand"/> Dossier d'Inscription</h3>
                <div className="space-y-4">
                   {store.dossier.map((item: string, idx: number) => (
                     <div key={idx} className="flex gap-4">
                        <input value={item} onChange={e => { const nd = [...store.dossier]; nd[idx] = e.target.value; setStore({...store, dossier: nd}); }} className={`${inputStyle} h-12 text-sm font-bold`} />
                        <button onClick={() => { const nd = [...store.dossier]; nd.splice(idx, 1); setStore({...store, dossier: nd}); }} className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"><Trash2 size={16}/></button>
                     </div>
                   ))}
                   <button onClick={() => setStore({...store, dossier: [...store.dossier, 'Nouveau document...']})} className="text-[10px] font-black uppercase text-brand flex items-center gap-2 pl-4"><Plus size={14}/> Ajouter une pièce</button>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* MODAL SYSTEM */}
      {modalType && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in zoom-in duration-300">
          <div className="bg-white dark:bg-[#111111] w-full max-w-xl p-10 lg:p-12 rounded-[55px] relative shadow-2xl overflow-y-auto max-h-[90vh] no-scrollbar border-4 border-slate-100 dark:border-white/5">
            <button onClick={closeModal} className="absolute top-10 right-10 text-slate-400 hover:text-brand transition-all"><X size={24}/></button>
            <h2 className="text-3xl font-black uppercase italic tracking-tight mb-10 text-slate-900 dark:text-white">
              {editingIndex !== null ? 'Modifier' : 'Nouveau'} {modalType}
            </h2>

            <form onSubmit={submitModal} className="space-y-8">
              
              {modalType === 'permis' && (
                <>
                  <div>
                    <label className={labelStyle}>Titre (ex: Permis B)</label>
                    <input required type="text" value={formItem.title} onChange={e => setFormItem({...formItem, title: e.target.value})} className={inputStyle} />
                  </div>
                  <div>
                    <label className={labelStyle}>Prix total (DA)</label>
                    <input 
                      required 
                      type="number" 
                      value={formItem.price} 
                      onChange={e => setFormItem({...formItem, price: Number(e.target.value)})} 
                      onWheel={e => e.currentTarget.blur()}
                      className={`${inputStyle} text-brand text-2xl font-black`} 
                    />
                  </div>
                  <div>
                    <label className={labelStyle}>Description Courte</label>
                    <textarea required value={formItem.description} onChange={e => setFormItem({...formItem, description: e.target.value})} className={`${inputStyle} h-32 py-5`} />
                  </div>
                </>
              )}

              {modalType === 'pricing' && (
                <>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className={labelStyle}>Titre</label>
                      <input required type="text" value={formItem.title} onChange={e => setFormItem({...formItem, title: e.target.value})} className={inputStyle} />
                    </div>
                    <div>
                      <label className={labelStyle}>Sous-titre</label>
                      <input required type="text" value={formItem.subtitle} onChange={e => setFormItem({...formItem, subtitle: e.target.value})} className={inputStyle} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className={labelStyle}>Prix Complet (DA)</label>
                      <input 
                        required 
                        type="number" 
                        value={formItem.priceFull} 
                        onChange={e => setFormItem({...formItem, priceFull: Number(e.target.value)})} 
                        onWheel={e => e.currentTarget.blur()}
                        className={inputStyle} 
                      />
                    </div>
                    <div>
                      <label className={labelStyle}>Prix par Tranche (DA)</label>
                      <input 
                        required 
                        type="number" 
                        value={formItem.priceTranche} 
                        onChange={e => setFormItem({...formItem, priceTranche: Number(e.target.value)})} 
                        onWheel={e => e.currentTarget.blur()}
                        className={inputStyle} 
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelStyle}>Nombre de Tranches</label>
                    <input 
                      required 
                      type="number" 
                      value={formItem.tranchesCount} 
                      onChange={e => setFormItem({...formItem, tranchesCount: Number(e.target.value)})} 
                      onWheel={e => e.currentTarget.blur()}
                      className={inputStyle} 
                      min="1"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className={labelStyle}>Points Forts / Caractéristiques</label>
                    {formItem.features.map((f: string, idx: number) => (
                      <div key={idx} className="flex gap-2">
                        <input value={f} onChange={e => { const nf = [...formItem.features]; nf[idx] = e.target.value; setFormItem({...formItem, features: nf}); }} className={`${inputStyle} py-3 text-sm`} />
                        <button type="button" onClick={() => setFormItem({...formItem, features: formItem.features.filter((_:any, i:number) => i !== idx)})} className="p-3 text-red-500"><Trash2 size={16}/></button>
                      </div>
                    ))}
                    <button type="button" onClick={() => setFormItem({...formItem, features: [...formItem.features, 'Nouvel avantage...']})} className="text-[10px] font-black uppercase text-brand flex items-center gap-2 pl-2"><Plus size={14}/> Ajouter un point</button>
                  </div>
                </>
              )}

              {modalType === 'procedure' && (
                <>
                  <div>
                    <label className={labelStyle}>Titre de l'étape</label>
                    <input required type="text" value={formItem.title} onChange={e => setFormItem({...formItem, title: e.target.value})} className={inputStyle} />
                  </div>
                  <div>
                    <label className={labelStyle}>Description</label>
                    <textarea required value={formItem.description} onChange={e => setFormItem({...formItem, description: e.target.value})} className={`${inputStyle} h-32 py-5`} />
                  </div>
                  <div>
                    <label className={labelStyle}>Conseil de moniteur (Pro Tip)</label>
                    <input type="text" value={formItem.proTip} onChange={e => setFormItem({...formItem, proTip: e.target.value})} className={inputStyle} />
                  </div>
                  <div className="space-y-4">
                    <label className={labelStyle}>Détails de l'étape</label>
                    {formItem.details.map((d: string, idx: number) => (
                      <div key={idx} className="flex gap-2">
                        <input value={d} onChange={e => { const nd = [...formItem.details]; nd[idx] = e.target.value; setFormItem({...formItem, details: nd}); }} className={`${inputStyle} py-3 text-sm font-bold`} />
                        <button type="button" onClick={() => setFormItem({...formItem, details: formItem.details.filter((_:any, i:number) => i !== idx)})} className="p-3 text-red-500"><Trash2 size={16}/></button>
                      </div>
                    ))}
                    <button type="button" onClick={() => setFormItem({...formItem, details: [...formItem.details, 'Nouveau détail...']})} className="text-[10px] font-black uppercase text-brand flex items-center gap-2 pl-2"><Plus size={14}/> Ajouter un détail</button>
                  </div>
                </>
              )}

              {modalType === 'faq' && (
                <>
                  <div>
                    <label className={labelStyle}>Question</label>
                    <input required type="text" value={formItem.question} onChange={e => setFormItem({...formItem, question: e.target.value})} className={inputStyle} />
                  </div>
                  <div>
                    <label className={labelStyle}>Réponse</label>
                    <textarea required value={formItem.answer} onChange={e => setFormItem({...formItem, answer: e.target.value})} className={`${inputStyle} h-40 py-5`} />
                  </div>
                </>
              )}

              {modalType === 'testimonial' && (
                <>
                  <div>
                    <label className={labelStyle}>Nom du Candidat</label>
                    <input required type="text" value={formItem.name} onChange={e => setFormItem({...formItem, name: e.target.value})} className={inputStyle} />
                  </div>
                  <div>
                    <label className={labelStyle}>Avis (Texte)</label>
                    <textarea required value={formItem.text} onChange={e => setFormItem({...formItem, text: e.target.value})} className={`${inputStyle} h-32 py-5`} />
                  </div>
                  <div>
                    <label className={labelStyle}>Note (1-5)</label>
                    <select value={formItem.rating} onChange={e => setFormItem({...formItem, rating: Number(e.target.value)})} className={inputStyle}>
                       {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Étoiles</option>)}
                    </select>
                  </div>
                </>
              )}

              <button type="submit" className="w-full bg-brand text-white py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-brand/20 hover:scale-[1.02] transition-all">
                Enregistrer les modifications
              </button>
            </form>
          </div>
        </div>
      )}
      {/* DELETE CONFIRM MODAL */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in zoom-in duration-300">
          <div className="bg-white dark:bg-[#111111] w-full max-w-md p-10 rounded-[45px] shadow-2xl text-center border-4 border-white/10">
            <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Trash2 size={32} />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight mb-4 text-slate-900 dark:text-white italic">Action Irréversible</h3>
            <p className="text-slate-500 font-bold mb-8 italic">Voulez-vous vraiment supprimer cet élément du catalogue ?</p>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setShowDeleteConfirm(null)}
                className="py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 border-slate-100 dark:border-white/5 text-slate-500 hover:bg-slate-50 transition-all shadow-sm"
              >
                Annuler
              </button>
              <button 
                onClick={deleteItem}
                className="py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-red-500 text-white shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all active:scale-95"
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

export default CatalogueManager;
