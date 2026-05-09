import { useState, useEffect, type FC } from 'react';
import { 
  Phone, Facebook, Instagram, 
  CheckCircle2, Clock, MapPin
} from 'lucide-react';
import PublicLayout from './PublicLayout';
import RegistrationForm from './RegistrationForm';
import { getStore } from '../../services/store';

const MAPS_API_KEY = 'AIzaSyBvyalRsepqtAFyT7fXVI1Ps91vXLPowJk';

const ContactView: FC<{ theme?: 'light' | 'dark', onToggleTheme?: () => void }> = ({ theme, onToggleTheme }) => {
  const [store, setStore] = useState(getStore());

  useEffect(() => {
    const update = () => setStore(getStore());
    window.addEventListener('storage_update', update);
    return () => window.removeEventListener('storage_update', update);
  }, []);

  const { school, social, dossier } = store;

  return (
    <PublicLayout theme={theme} onToggleTheme={onToggleTheme}>
      <div className="min-h-[calc(100vh-64px)] bg-white dark:bg-[#09090b] flex flex-col lg:flex-row relative items-center justify-center p-4 md:p-10 lg:p-12 gap-10 lg:gap-14 overflow-hidden">
        
        {/* Background accents */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand/5 blur-[250px] -z-0 pointer-events-none rounded-full translate-x-1/4 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand/5 blur-[220px] -z-0 pointer-events-none rounded-full -translate-x-1/4 translate-y-1/4" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-slate-100 dark:bg-brand/5 blur-[280px] -z-0 pointer-events-none rounded-full" />

        {/* Left Side */}
        <section className="w-full lg:w-[50%] xl:w-[45%] flex flex-col justify-center relative z-20">
          <div className="w-full space-y-6 relative z-10">
            <div className="space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-brand/5 border border-brand/10 rounded-full">
                <span className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-brand uppercase tracking-[0.2em]">Ouvert : 08H - 18H</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-[0.9] italic select-none font-outfit">
                Contactez <br/> <span className="text-brand">L'École</span>
              </h1>

              <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400 leading-relaxed max-w-sm mx-auto lg:mx-0">
                Votre parcours vers le permis de conduire commence ici. Remplissez le formulaire et un conseiller vous recontactera.
              </p>
            </div>

            <div className="pt-2 max-w-2xl lg:max-w-3xl mx-auto lg:mx-0">
              <RegistrationForm variant="wix" />
            </div>

            <div className="flex items-center gap-4 pt-6 border-t border-slate-100 dark:border-white/5 justify-center lg:justify-start">
              <a href={social.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl flex items-center justify-center text-slate-400 hover:text-brand hover:border-brand transition-all">
                <Facebook size={18} />
              </a>
              <a href={social.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl flex items-center justify-center text-slate-400 hover:text-brand hover:border-brand transition-all">
                <Instagram size={18} />
              </a>
            </div>
          </div>
        </section>

        {/* Right Side */}
        <section className="w-full lg:w-[40%] xl:w-[35%] space-y-8 relative z-20">
          
          {/* Google Maps Embed */}
          <div className="relative group rounded-[24px] overflow-hidden border-[4px] border-white dark:border-slate-800 shadow-xl h-[220px] lg:h-[280px]">
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=${MAPS_API_KEY}&q=Auto+Ecole+YEBDA+Bab+Azzouar+Alger`}
              className="w-full h-full"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            {/* Click overlay to open in Google Maps */}
            <a
              href={school.gmaps || 'https://maps.google.com/?q=Auto+Ecole+Yebda+Bab+Azzouar+Alger'}
              target="_blank"
              rel="noreferrer"
              className="absolute bottom-3 right-3 flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-slate-100 dark:border-white/10 text-[9px] font-black uppercase tracking-widest text-slate-700 dark:text-white hover:bg-brand hover:text-white hover:border-brand transition-all"
            >
              <MapPin size={12} className="text-brand" />
              Ouvrir GPS
            </a>
          </div>

          {/* Quick Contact Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-slate-100/50 dark:border-white/10 backdrop-blur-md shadow-sm hover:border-brand/20 transition-all">
              <Phone className="text-brand mb-2" size={16} />
              <span className="block text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Téléphone</span>
              <span className="text-[11px] font-black text-slate-900 dark:text-white tracking-widest">{school.phone}</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-slate-100/50 dark:border-white/10 backdrop-blur-md shadow-sm hover:border-brand/20 transition-all">
              <Clock className="text-brand mb-2" size={16} />
              <span className="block text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Samedi - Jeudi</span>
              <span className="text-[11px] font-black text-slate-900 dark:text-white tracking-widest">08H - 18H</span>
            </div>
          </div>

          {/* Requirements Checklist */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-black text-brand uppercase tracking-[0.4em] whitespace-nowrap">Dossier d'inscription</span>
              <div className="h-[1px] w-full bg-slate-100 dark:bg-white/5" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {dossier.map((item: string, i: number) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/50 dark:bg-white/5 border border-transparent hover:border-brand/10 transition-all shadow-sm">
                  <CheckCircle2 size={14} className="text-brand mt-0.5 shrink-0" />
                  <span className="text-[10px] font-bold text-slate-600 dark:text-zinc-400 leading-tight">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
};

export default ContactView;