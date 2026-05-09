
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Zap, ArrowRight, ShieldCheck, ChevronDown, Phone, Star, Bike, Car, Award, MapPin, Clock } from 'lucide-react';
import { SCHOOL_INFO } from '../../constants';
import PublicLayout from './PublicLayout';
import { getStore } from '../../services/store';

const PricingView: React.FC<{ theme?: 'light' | 'dark', onToggleTheme?: () => void }> = ({ theme, onToggleTheme }) => {
  const [globalMode, setGlobalMode] = useState<'full' | 'tranche'>('full');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [store, setStore] = useState(getStore());

  useEffect(() => {
    const update = () => setStore(getStore());
    window.addEventListener('storage_update', update);
    return () => window.removeEventListener('storage_update', update);
  }, []);

  const { pricing, pageHeaders, faq, permis, showPrices } = store;

  const renderTitle = () => {
    const { title, highlight } = pageHeaders.tarifs;
    if (!highlight || !title.includes(highlight)) return <>{title}</>;
    const parts = title.split(highlight);
    return (
      <>{parts[0]} <span className="text-brand not-italic">Formations</span> {parts[1]}</>
    );
  };

  return (
    <PublicLayout theme={theme} onToggleTheme={onToggleTheme}>
      <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto pb-48 space-y-32">
        {/* Header */}
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-3 bg-brand/10 text-brand px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-brand/20">
            Liberté & Réussite
          </div>
          <h1 className="text-4xl lg:text-8xl font-black italic tracking-tighter text-slate-900 dark:text-white leading-none uppercase">
            Nos <span className="text-brand not-italic">Formations</span> & Tarifs
          </h1>
          <p className="text-xl font-bold text-slate-500 max-w-2xl mx-auto">
            Découvrez nos programmes de permis et nos solutions de financement flexibles adaptées à chaque candidat.
          </p>
        </div>

        {/* Section 1: Les Permis (Catalog) */}
        <div className="space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="text-[10px] font-black text-brand uppercase tracking-[0.3em]">Formations Certifiées</div>
              <h2 className="text-4xl lg:text-6xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white leading-none">
                Packs <span className="text-brand not-italic">Complets</span>
              </h2>
            </div>
            <p className="text-slate-500 font-bold max-w-md italic">
              Trajets illimités, accompagnement total et réussite garantie avec nos formules tout inclus.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {permis.map((p: any) => (
              <div key={p.id} className="group bg-white dark:bg-[#111111] border border-slate-100 dark:border-white/5 rounded-[50px] p-10 flex flex-col h-full hover:border-brand/40 hover:shadow-2xl transition-all duration-500 shadow-xl">
                <div className="flex-grow space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-[64px] h-[64px] min-w-[64px] min-h-[64px] flex-none bg-brand text-white rounded-[24px] flex items-center justify-center shadow-2xl shadow-brand/40 ring-1 ring-brand/20 group-hover:scale-110 transition-transform duration-500">
                      {p.id.includes('moto') ? <Bike size={32} /> : p.id.includes('perfectionnement') ? <Award size={32} /> : <Car size={32} />}
                    </div>
                    <div className="min-w-0 text-left">
                      <div className="text-[9px] font-black uppercase tracking-widest text-brand mb-1">{p.subtitle}</div>
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic leading-none break-words">{p.title.split('(')[0]}</h2>
                    </div>
                  </div>

                  <p className="text-base text-slate-500 dark:text-zinc-400 font-bold leading-relaxed">
                    {p.description}
                  </p>

                  <div className="grid grid-cols-1 gap-3">
                    {p.specs?.map((spec: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-[20px] border border-slate-100 dark:border-white/5 shadow-sm">
                         <div className="text-brand shrink-0">
                            {spec.label.includes('Boîte') ? <Zap size={16}/> : spec.label.includes('Plateau') ? <MapPin size={16}/> : spec.label.includes('Horaire') ? <Clock size={16}/> : <Star size={16} />}
                         </div>
                         <span className="text-[9px] font-black uppercase tracking-widest text-slate-700 dark:text-zinc-300">{spec.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-10 mt-10 border-t border-slate-100 dark:border-white/5 space-y-8">
                   <div className="space-y-2 text-center">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Investissement</div>
                      <div className="text-2xl font-black text-slate-900 dark:text-white italic">Prix sur demande</div>
                   </div>
                   <Link to="/contact" className="w-full py-5 bg-slate-900 dark:bg-brand text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl hover:bg-brand dark:hover:bg-white dark:hover:text-brand transition-all flex items-center justify-center gap-3">
                      Contacter <ArrowRight size={16}/>
                   </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Modules & Paiements */}
        <div className="space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="text-[10px] font-black text-brand uppercase tracking-[0.3em]">Flexibilité Maximale</div>
              <h2 className="text-4xl lg:text-6xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white leading-none">
                Paiement <span className="text-brand not-italic">À la Carte</span>
              </h2>
            </div>
            <div className="bg-slate-100 dark:bg-white/5 p-1.5 rounded-2xl flex gap-1 border border-slate-200 dark:border-white/5">
              <button 
                onClick={() => setGlobalMode('full')}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${globalMode === 'full' ? 'bg-white dark:bg-[#111111] text-brand shadow-xl' : 'text-slate-400'}`}
              >
                Par Module
              </button>
              <button 
                onClick={() => setGlobalMode('tranche')}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${globalMode === 'tranche' ? 'bg-brand text-white shadow-xl' : 'text-slate-400'}`}
              >
                Par Tranche
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pricing.map((module: any) => (
              <div 
                key={module.id} 
                className={`group bg-white dark:bg-[#111111] rounded-[50px] border border-slate-100 dark:border-white/5 p-10 flex flex-col h-full transition-all duration-500 hover:scale-[1.02] hover:border-brand/40 shadow-xl ${module.highlight ? 'ring-4 ring-brand/10' : ''}`}
              >
                <div className="flex-grow space-y-8">
                  <div className="space-y-2 min-w-0">
                    <h3 className="text-xl font-black italic uppercase tracking-tight text-slate-900 dark:text-white break-words">{module.title}</h3>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">{module.subtitle}</p>
                  </div>

                  <div className="pt-6 border-t border-slate-100 dark:border-white/5">
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 text-center">
                      {globalMode === 'full' ? 'Montant Fixe' : 'Dépôt Initial'}
                    </div>
                    {showPrices ? (
                      <div className="flex items-end justify-center gap-1">
                        <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic">
                          {globalMode === 'full' 
                            ? (Number(module.priceFull) || 0).toLocaleString() 
                            : (Number(module.priceTranche) || 0).toLocaleString()}
                        </span>
                        <span className="text-brand text-xs font-black mb-1 font-sans">DA</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <span className="text-2xl font-black text-slate-900 dark:text-white italic">Prix sur demande</span>
                      </div>
                    )}
                  </div>

                  <ul className="space-y-4">
                    {module.features?.slice(0, 3).map((f: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 text-[11px] font-bold text-slate-600 dark:text-zinc-400 leading-tight">
                        <CheckCircle2 size={12} className="text-brand shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-10 pt-6 border-t border-slate-100 dark:border-white/5">
                  {globalMode === 'tranche' ? (
                     <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand/10 text-brand rounded-full text-[9px] font-black uppercase tracking-widest">
                       <Zap size={10}/> {module.tranchesCount || 2} Tranches
                     </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-50 dark:bg-white/5 text-slate-400 rounded-full text-[9px] font-bold uppercase tracking-widest border border-slate-100 dark:border-white/5">
                       <ShieldCheck size={10}/> Inclus
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mt-48 max-w-4xl mx-auto space-y-20">
           <div className="text-center space-y-6">
              <h2 className="text-4xl lg:text-7xl font-black italic tracking-tighter text-slate-900 dark:text-white leading-none uppercase">Questions <span className="text-brand not-italic">Fréquentes</span></h2>
              <p className="text-xl font-bold text-slate-500">Tout ce que vous devez savoir sur nos formations.</p>
           </div>
           
           <div className="grid gap-6">
              {faq.map((item: any, i: number) => (
                 <div 
                   key={i} 
                   className="group bg-white dark:bg-[#111111] border border-slate-100 dark:border-white/5 rounded-[40px] overflow-hidden transition-all duration-300 hover:border-brand/30 shadow-sm"
                 >
                    <button 
                      onClick={() => setOpenFaq(openFaq === i ? null : i)} 
                      className="w-full p-8 flex items-center justify-between text-left"
                    >
                       <span className="text-lg font-black italic uppercase tracking-tight text-slate-800 dark:text-zinc-200">{item.question}</span>
                       <div className={`w-10 h-10 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-brand transition-transform ${openFaq === i ? 'rotate-180' : ''}`}>
                         <ChevronDown size={20} />
                       </div>
                    </button>
                    {openFaq === i && (
                      <div className="px-8 pb-8 text-base font-bold text-slate-500 dark:text-zinc-400 leading-relaxed animate-in slide-in-from-top-4 duration-300 lowercase first-letter:uppercase">
                         {item.answer}
                      </div>
                    )}
                 </div>
              ))}
           </div>

           <div className="p-16 bg-slate-900 rounded-[60px] text-center space-y-8 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-brand/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
               <p className="text-xl font-bold text-slate-300 relative z-10">Une question spécifique ? Appelez-nous directement.</p>
               <a href={`tel:${SCHOOL_INFO.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-6 text-4xl lg:text-6xl font-black italic tracking-tighter text-brand hover:scale-105 transition-transform relative z-10">
                   <Phone size={48} />
                   <span>{SCHOOL_INFO.phone}</span>
               </a>
           </div>
        </section>
      </section>
    </PublicLayout>
  );
};

export default PricingView;
