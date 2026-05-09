import { useState, useEffect } from 'react';
import { 
  Star, Download, CheckCircle2, ShieldCheck, Phone
} from 'lucide-react';
import { getStore } from '../services/store';
import { SCHOOL_INFO } from '../constants';
import PublicLayout from './public/PublicLayout';
import RegistrationForm from './public/RegistrationForm';

interface LandingPageProps {
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

const LandingPage = ({ theme, onToggleTheme }: LandingPageProps) => {
  const [store, setStore] = useState(getStore());

  useEffect(() => {
    const update = () => setStore(getStore());
    window.addEventListener('storage_update', update);
    return () => window.removeEventListener('storage_update', update);
  }, []);

  const { values, resources, hero, stats } = store;

  const renderTitle = () => {
    if (!hero.highlight || !hero.title.includes(hero.highlight)) {
      return <>{hero.title}</>;
    }
    const parts = hero.title.split(hero.highlight);
    return (
      <>
        {parts[0]} <span className="text-brand not-italic">{hero.highlight}</span> {parts.slice(1).join(hero.highlight)}
      </>
    );
  };

  return (
    <PublicLayout theme={theme} onToggleTheme={onToggleTheme}>

      {/* ── HERO SECTION ── */}
      <section className="relative pt-32 pb-32 lg:pt-52 lg:pb-52 px-6 text-center overflow-hidden">

        {/* Background photo */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1920&q=80')`
          }}
        />

        {/* Top half — sharp, bottom half — blurred */}
        <div className="absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-1/2" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 backdrop-blur-2xl" />
          {/* Smooth gradient transition between sharp and blurred */}
          <div
            className="absolute inset-x-0 top-[35%] h-[30%]"
            style={{
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              maskImage: 'linear-gradient(to bottom, transparent, black)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent, black)',
            }}
          />
        </div>

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto space-y-12">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <ShieldCheck size={16} className="text-brand" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Agrément d'État N°16-2024</span>
          </div>

          <h1 className="text-5xl md:text-8xl lg:text-9xl font-black leading-[0.85] tracking-tighter text-white uppercase italic drop-shadow-2xl">
            {renderTitle()}
          </h1>

          <p className="text-xl font-bold text-white/70 max-w-2xl mx-auto leading-relaxed">
            {hero.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a href="#register" className="px-12 py-6 bg-brand text-white font-black rounded-full uppercase text-[11px] tracking-widest shadow-2xl shadow-brand/40 hover:bg-white hover:text-brand transition-all hover:-translate-y-1 text-center">
              S'inscrire maintenant
            </a>
            <a
              href={resources.codeBookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-12 py-6 border-2 border-white/20 text-white font-black rounded-full uppercase text-[11px] tracking-widest hover:bg-white/10 backdrop-blur-sm transition-all flex items-center justify-center gap-4"
            >
              <Download size={18} />
              Code PDF
            </a>
          </div>

          <div className="flex items-center gap-6 pt-12 border-t border-white/10 justify-center">
            <div className="flex text-yellow-400">
              {[1,2,3,4,5].map(i => <Star key={i} size={18} fill="currentColor" />)}
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest text-white/60">
              Plus de 500 élèves formés
            </span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-slate-900 dark:bg-[#0c0c0e] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-16 text-center">
            {stats.map((stat: any, i: number) => (
              <div key={i} className="space-y-4">
                <div className="text-6xl md:text-8xl font-black text-white italic tracking-tighter leading-none">{stat.value}</div>
                <div className="text-[10px] font-black text-brand uppercase tracking-[0.4em]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-32 px-6 bg-white dark:bg-[#09090b]">
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-7xl font-black italic tracking-tighter text-slate-900 dark:text-white uppercase leading-none">
              Pourquoi nous <span className="text-brand not-italic">choisir ?</span>
            </h2>
            <p className="text-xl font-bold text-slate-500 dark:text-zinc-400">Une méthode prouvée pour une réussite garantie.</p>
          </div>
          <div className="flex flex-col md:flex-row justify-center gap-12 lg:gap-24">
            {values.map((val: any, i: number) => (
              <div key={i} className="max-w-xs space-y-4">
                <div className="flex items-center gap-4 text-brand">
                  <CheckCircle2 size={24} className="shrink-0" />
                  <h4 className="text-2xl font-black italic uppercase tracking-tight text-slate-900 dark:text-white">{val.title}</h4>
                </div>
                <p className="text-base font-bold text-slate-500 dark:text-zinc-400 leading-relaxed pl-10">{val.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section id="register" className="py-32 px-6 bg-brand/5 relative overflow-hidden border-y border-brand/10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />
        <div className="max-w-6xl mx-auto space-y-20 relative z-10">
          <div className="text-center space-y-6">
            <h2 className="text-4xl md:text-8xl font-black italic tracking-tighter text-slate-900 dark:text-white uppercase leading-none">
              C'est parti <br/> <span className="text-brand not-italic">pour le permis.</span>
            </h2>
            <p className="text-xl font-bold text-slate-500 dark:text-zinc-400 max-w-xl mx-auto">
              Remplissez le formulaire en moins de 60 secondes.
            </p>
          </div>
          <RegistrationForm />
        </div>
      </section>

    </PublicLayout>
  );
};

export default LandingPage;
