
import { FC, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, ArrowRight, BookOpen, 
  MapPin, ClipboardCheck, Landmark, GraduationCap,
  Lightbulb, CheckCircle2
} from 'lucide-react';
import PublicLayout from './PublicLayout';
import { getStore } from '../../services/store';

interface ProcedureViewProps {
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

const ProcedureView: FC<ProcedureViewProps> = ({ theme, onToggleTheme }) => {
  const [store, setStore] = useState(getStore());

  useEffect(() => {
    const update = () => setStore(getStore());
    window.addEventListener('storage_update', update);
    return () => window.removeEventListener('storage_update', update);
  }, []);

  const { process, school } = store;

  const getStepIcon = (index: number) => {
    const icons = [
      <FileText size={20}/>, 
      <BookOpen size={20}/>, 
      <Landmark size={20}/>, 
      <ClipboardCheck size={20}/>, 
      <MapPin size={20}/>, 
      <GraduationCap size={20}/>
    ];
    return icons[index % icons.length];
  };

  return (
    <PublicLayout theme={theme} onToggleTheme={onToggleTheme}>
      <section className="py-12 lg:py-24 px-6 lg:px-12 max-w-4xl mx-auto pb-32 relative">
        {/* Subtle Background Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 dark:bg-white/[0.01] -z-10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-brand/5 blur-[120px] -z-10 rotate-12" />

        {/* Narrative Header */}
        <div className="mb-24 lg:mb-32 space-y-8 text-center lg:text-left">
           <div className="space-y-3">
              <div className="text-[9px] font-black text-brand uppercase tracking-[0.5em] opacity-80">Méthode Yebda</div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white leading-none uppercase italic">
                 Le <span className="text-brand not-italic">Protocole.</span>
              </h1>
           </div>
           <p className="max-w-xl text-lg lg:text-xl font-medium text-slate-400 dark:text-zinc-500 leading-tight italic">
              Un parcours d'apprentissage en quatre dimensions pour une maîtrise absolue de la route.
           </p>
        </div>

        {/* The Roadmap Architecture */}
        <div className="relative">
           {/* The Spine */}
           <div className="absolute left-6 lg:left-8 top-0 bottom-0 w-[1px] bg-slate-200 dark:bg-white/10" />

           <div className="space-y-24 lg:space-y-32">
              {process.map((step: any, i: number) => (
                <div key={i} className="relative pl-16 lg:pl-28 group">
                   {/* Node */}
                   <div className="absolute left-0 top-0 w-12 lg:w-16 h-12 lg:h-16 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-2 border-slate-900 dark:border-brand rounded-full flex items-center justify-center -translate-x-1/2 -translate-y-1/3 z-10 transition-all duration-500 group-hover:scale-110 shadow-2xl overflow-hidden">
                      <span className="text-slate-900 dark:text-white font-black text-xl lg:text-2xl font-mono italic relative z-10">{i+1}</span>
                      {/* Scanning Line Effect */}
                      <div className="absolute inset-0 bg-brand/5 dark:bg-brand/10 opacity-0 group-hover:opacity-100 transition-opacity">
                         <div className="absolute top-0 left-0 w-full h-[1px] bg-brand/40 animate-[scan_2s_linear_infinite]" />
                      </div>
                      {/* Crosshair accents */}
                      <div className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-100 transition-opacity">
                         <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[1px] h-2 bg-brand" />
                         <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[1px] h-2 bg-brand" />
                         <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-[1px] bg-brand" />
                         <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-[1px] bg-brand" />
                      </div>
                   </div>

                   <div className="space-y-8">
                      <div className="space-y-4">
                         <div className="flex flex-wrap items-center gap-3 relative">
                            {/* Industrial Serial Tag */}
                            <div className="flex items-center bg-brand text-white px-2 py-0.5 rounded-[4px] gap-2 shadow-[0_4px_12px_rgba(0,173,181,0.2)]">
                               <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
                               <span className="text-[8px] font-black uppercase tracking-[0.2em] leading-none py-0.5">Protocol 0{i+1}</span>
                            </div>
                            
                            <div className="h-[1px] w-6 bg-slate-200 dark:bg-white/10" />
                            
                            <div className="flex items-center gap-2 border border-slate-200 dark:border-white/10 px-2 py-0.5 rounded-[4px]">
                               <span className="text-slate-400 text-[8px] font-mono tracking-widest uppercase">Phase 0{i+1}</span>
                            </div>

                            {step.duration && (
                               <div className="flex items-center gap-2 ml-2">
                                  <div className="w-1.5 h-1.5 rounded-full border border-brand/40 flex items-center justify-center">
                                     <div className="w-0.5 h-0.5 rounded-full bg-brand" />
                                  </div>
                                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mt-0.5">{step.duration}</span>
                               </div>
                            )}
                         </div>
                         <h2 className="text-4xl lg:text-7xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none transition-all duration-700 group-hover:text-brand group-hover:translate-x-6 group-hover:skew-x-[-12deg] relative">
                            <span className="relative z-10 block group-hover:drop-shadow-[0_0_15px_rgba(0,173,181,0.3)]">{step.title}</span>
                            {/* Elite Outline Layer */}
                            <span className="absolute -left-1 -top-1 text-slate-100 dark:text-white/[0.04] pointer-events-none select-none -z-10 transition-all duration-700 group-hover:translate-x-8 group-hover:translate-y-2 group-hover:text-brand/5 font-black opacity-50 block blur-[1px] group-hover:blur-none">
                               {step.title}
                            </span>
                            {/* Decorative Line Accent */}
                            <div className="absolute -bottom-2 lg:-bottom-4 left-0 w-24 h-1 bg-brand scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                         </h2>
                      </div>

                      <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
                         <div className="lg:col-span-3 space-y-6">
                            <p className="text-sm lg:text-lg text-slate-500 dark:text-zinc-400 font-semibold leading-relaxed">
                               {step.description}
                            </p>
                            
                            <div className="flex flex-wrap gap-x-8 gap-y-4">
                               {step.details.map((detail: string, j: number) => (
                                  <div key={j} className="flex items-center gap-3 group/detail">
                                     <div className="w-4 h-4 rounded-md bg-brand/5 border border-brand/10 flex items-center justify-center transition-all group-hover/detail:bg-brand group-hover/detail:border-brand">
                                        <div className="w-1 h-1 bg-brand rounded-full group-hover/detail:bg-white" />
                                     </div>
                                     <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em]">{detail}</span>
                                  </div>
                               ))}
                            </div>

                            {/* Technical Overview */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-white/5">
                               <div className="space-y-1">
                                  <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Intensité</span>
                                  <div className="h-1 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                     <div className="h-full bg-brand transition-all duration-1000" style={{ width: i === 0 ? '20%' : i === 1 ? '70%' : i === 2 ? '90%' : '100%' }} />
                                  </div>
                               </div>
                               <div className="space-y-1">
                                  <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Complexité</span>
                                  <div className="h-1 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                     <div className="h-full bg-slate-900 dark:bg-white transition-all duration-1000" style={{ width: i === 0 ? '10%' : i === 1 ? '50%' : i === 2 ? '80%' : '95%' }} />
                                  </div>
                               </div>
                               <div className="hidden sm:block space-y-1">
                                  <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Taux de réussite</span>
                                  <span className="block text-[10px] font-black text-slate-900 dark:text-white font-mono">{i === 0 ? '100%' : i === 1 ? '92%' : i === 2 ? '96%' : '94%'}</span>
                               </div>
                            </div>

                            {/* Conditional Dossier for Step 1 (Inscription) */}
                            {i === 0 && store.dossier && (
                               <div className="mt-8 bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 rounded-[24px] p-6 lg:p-8 space-y-6">
                                  <div className="flex items-center gap-3">
                                     <FileText className="text-brand" size={18} />
                                     <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Dossier Administratif</h4>
                                  </div>
                                  <div className="grid md:grid-cols-2 gap-4">
                                     {store.dossier.map((item: string, k: number) => (
                                        <div key={k} className="flex items-start gap-3 group/dossier">
                                           <CheckCircle2 size={12} className="text-brand mt-0.5 shrink-0 opacity-40 group-hover/dossier:opacity-100 transition-opacity" />
                                           <span className="text-[11px] font-bold text-slate-600 dark:text-zinc-300 leading-tight">{item}</span>
                                        </div>
                                     ))}
                                  </div>
                               </div>
                            )}
                         </div>

                         {step.proTip && (
                            <div className="lg:col-span-2 relative">
                               <div className="text-5xl font-black text-slate-100 dark:text-white/[0.02] absolute -top-8 -left-4 pointer-events-none select-none italic uppercase tracking-tighter">Conseil</div>
                               <div className="relative pt-2 space-y-4">
                                  <div className="w-8 h-8 bg-brand/5 text-brand rounded-lg flex items-center justify-center border border-brand/10">
                                     <Lightbulb size={16} />
                                  </div>
                                  <p className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 italic leading-relaxed border-l-[1px] border-brand/20 pl-4">
                                     "{step.proTip}"
                                  </p>
                                </div>
                             </div>
                          )}
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Technical Footer */}
         <div className="mt-32 border-t border-slate-200 dark:border-white/10 pt-16 space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
               <div className="space-y-3 max-w-sm">
                  <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter leading-none">
                     Validation <span className="text-brand">Finale.</span>
                  </h2>
                  <p className="text-xs font-bold text-slate-500 italic max-w-xs mx-auto md:mx-0">
                     Chaque protocole est validé par un moniteur certifié avant le passage au niveau suivant.
                  </p>
               </div>
               <Link to="/contact" className="group relative inline-block">
                  <div className="absolute inset-0 bg-brand blur-2xl opacity-10 group-hover:opacity-20 transition-opacity" />
                  <div className="relative bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 py-4 rounded-full font-black uppercase tracking-[0.3em] text-[10px] flex items-center gap-4 hover:scale-105 transition-all shadow-lg active:scale-95">
                     Commencer <ArrowRight size={16} />
                  </div>
               </Link>
            </div>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 opacity-40 font-mono text-[8px] uppercase tracking-[0.4em] text-slate-500">
               <span>ID: PROCED-2024</span>
               <span>LOC: ALGER</span>
               <div className="h-[1px] hidden lg:block flex-grow bg-slate-200 dark:bg-white/10" />
               <span>Yebda Elite Driving Method</span>
            </div>
         </div>
       </section>
    </PublicLayout>
  );
};

export default ProcedureView;
