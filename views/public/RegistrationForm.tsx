
import { useState, type FC, type FormEvent } from 'react';
import { Send, CheckCircle2, User, Phone, Mail, BookOpen, MessageSquare, Loader2, ChevronDown } from 'lucide-react';
import { FormationType, Lead } from '../../types';

const RegistrationForm: FC<{ variant?: 'default' | 'wix' }> = ({ variant = 'default' }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    formation: FormationType.COMPLET,
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate network
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newLead: Lead = {
      id: `lead_${Date.now()}`,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      desiredFormation: formData.formation,
      message: formData.message,
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    };

    updateLeads([newLead, ...store.leads]);
    
    setLoading(false);
    setSuccess(true);
    setFormData({
      name: '',
      phone: '',
      email: '',
      formation: FormationType.COMPLET,
      message: ''
    });
  };

  if (success) {
    if (variant === 'wix') {
      return (
        <div className="p-12 text-center space-y-8 animate-in zoom-in duration-500">
          <div className="w-20 h-20 bg-brand rounded-full flex items-center justify-center text-white mx-auto shadow-2xl shadow-brand/20">
            <CheckCircle2 size={40} />
          </div>
          <div className="space-y-4">
            <h3 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white">Reçu !</h3>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-sm max-w-xs mx-auto leading-relaxed">
              Nous avons reçu votre demande. On vous rappelle très vite !
            </p>
          </div>
          <button 
            onClick={() => setSuccess(false)}
            className="px-12 py-5 border-2 border-brand text-brand font-black rounded-full uppercase text-[10px] tracking-widest hover:bg-slate-900 dark:hover:bg-brand hover:text-white transition-all shadow-xl"
          >
            Nouveau message
          </button>
        </div>
      );
    }
    return (
      <div className="bg-white dark:bg-[#111111] p-12 rounded-[55px] border-4 border-emerald-500/20 text-center space-y-8 animate-in zoom-in duration-500 shadow-2xl">
        <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto shadow-xl shadow-emerald-500/30">
          <CheckCircle2 size={48} />
        </div>
        <div className="space-y-4">
          <h3 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white">Demande Envoyée !</h3>
          <p className="text-zinc-500 font-bold text-lg max-w-md mx-auto leading-relaxed">
            Merci pour votre confiance. Notre équipe vous contactera dans les plus brefs délais pour finaliser votre inscription.
          </p>
        </div>
        <button 
          onClick={() => setSuccess(false)}
          className="px-12 py-5 bg-slate-900 text-white font-black rounded-full uppercase text-[11px] tracking-widest hover:bg-brand transition-all"
        >
          Envoyer une autre demande
        </button>
      </div>
    );
  }

  if (variant === 'wix') {
    const inputClasses = "w-full bg-slate-50 dark:bg-white/5 border-2 border-slate-100 dark:border-white/10 rounded-2xl px-6 py-4 text-slate-900 dark:text-white font-bold text-sm outline-none focus:border-brand focus:bg-white dark:focus:bg-white/10 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 shadow-sm focus:shadow-xl focus:shadow-brand/5";
    const labelClasses = "block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-2 ml-4";

    return (
      <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="space-y-2">
            <label className={labelClasses}>Nom Complet</label>
            <div className="relative group/field">
               <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/field:text-brand transition-colors" size={16} />
               <input 
                 required 
                 type="text" 
                 placeholder="Votre nom et prénom"
                 value={formData.name}
                 onChange={e => setFormData({...formData, name: e.target.value})}
                 className={`${inputClasses} !pl-14`} 
               />
            </div>
          </div>
          <div className="space-y-2">
            <label className={labelClasses}>Téléphone</label>
            <div className="relative group/field">
               <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/field:text-brand transition-colors" size={16} />
               <input 
                 required 
                 type="tel" 
                 placeholder="05 50 00 00 00"
                 value={formData.phone}
                 onChange={e => setFormData({...formData, phone: e.target.value})}
                 className={`${inputClasses} !pl-14`} 
               />
            </div>
          </div>
          <div className="space-y-2">
            <label className={labelClasses}>Type de Permis</label>
            <div className="relative group/select">
              <BookOpen className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/select:text-brand transition-colors" size={16} />
              <select 
                value={formData.formation}
                onChange={e => setFormData({...formData, formation: e.target.value as FormationType})}
                className={`${inputClasses} appearance-none cursor-pointer !pl-14 !pr-12`}
              >
                {Object.values(FormationType).map(f => <option key={f} value={f} className="text-slate-900">{f}</option>)}
              </select>
              <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/select:text-brand pointer-events-none transition-colors" size={16} />
            </div>
          </div>
          <div className="space-y-2">
            <label className={labelClasses}>Email (Optionnel)</label>
            <div className="relative group/field">
               <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/field:text-brand transition-colors" size={16} />
               <input 
                 type="email" 
                 placeholder="votre@email.dz"
                 value={formData.email}
                 onChange={e => setFormData({...formData, email: e.target.value})}
                 className={`${inputClasses} !pl-14`} 
               />
            </div>
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className={labelClasses}>Message ou Question (Optionnel)</label>
            <div className="relative group/field">
               <MessageSquare className="absolute left-5 top-5 text-slate-400 group-focus-within/field:text-brand transition-colors" size={16} />
               <textarea 
                  rows={2}
                  placeholder="Dites-nous en plus sur vos besoins..."
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className={`${inputClasses} rounded-3xl resize-none py-4 !pl-14`} 
               />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button 
            disabled={loading}
            type="submit" 
            className="w-full md:w-auto px-12 bg-slate-900 dark:bg-brand text-white font-black py-5 rounded-full uppercase tracking-[0.4em] text-[10px] shadow-2xl shadow-slate-900/10 dark:shadow-brand/20 hover:bg-brand dark:hover:bg-white dark:hover:text-brand active:scale-[0.98] transition-all disabled:opacity-30 flex items-center justify-center gap-4 group/btn"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={16} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />}
            {loading ? 'Traitement...' : 'Envoyer ma demande'}
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="bg-white dark:bg-[#111111] p-8 md:p-16 rounded-[60px] border border-slate-100 dark:border-white/5 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/5 blur-[120px] -z-10 rounded-full group-hover:bg-brand/10 transition-colors duration-700" />
      
      <div className="space-y-12">
        <div className="space-y-4">
          <h3 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white leading-none">
            Inscrivez-vous <br/> <span className="text-brand not-italic">en 1 minute.</span>
          </h3>
          <p className="text-zinc-500 font-bold text-lg max-w-2xl leading-relaxed">Réservez votre place et commencez votre formation dès demain. Nous vous recontacterons pour finaliser votre dossier.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4 group/field">
              <label className="text-[11px] font-black text-brand uppercase tracking-[0.4em] pl-6 group-focus-within/field:translate-x-2 transition-transform">Nom Complet</label>
              <div className="relative">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within/field:text-brand transition-colors" size={20} />
                <input 
                   required 
                   type="text" 
                   placeholder="Nom et Prénom"
                   value={formData.name}
                   onChange={e => setFormData({...formData, name: e.target.value})}
                   className="w-full bg-slate-50 dark:bg-[#09090b] border-2 border-slate-100 dark:border-white/5 rounded-2xl lg:rounded-[30px] pl-16 pr-4 py-5 lg:py-7 font-black text-base lg:text-lg outline-none focus:border-brand focus:bg-white dark:focus:bg-[#111111] transition-all" 
                />
              </div>
            </div>
            <div className="space-y-4 group/field">
              <label className="text-[11px] font-black text-brand uppercase tracking-[0.4em] pl-6 group-focus-within/field:translate-x-2 transition-transform">Téléphone</label>
              <div className="relative">
                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within/field:text-brand transition-colors" size={20} />
                <input 
                   required 
                   type="tel" 
                   placeholder="05 50 00 00 00"
                   value={formData.phone}
                   onChange={e => setFormData({...formData, phone: e.target.value})}
                   className="w-full bg-slate-50 dark:bg-[#09090b] border-2 border-slate-100 dark:border-white/5 rounded-2xl lg:rounded-[30px] pl-16 pr-4 py-5 lg:py-7 font-black text-base lg:text-lg outline-none focus:border-brand focus:bg-white dark:focus:bg-[#111111] transition-all" 
                />
              </div>
            </div>
            <div className="space-y-4 group/field">
              <label className="text-[11px] font-black text-brand uppercase tracking-[0.4em] pl-6 group-focus-within/field:translate-x-2 transition-transform">Type de Permis</label>
              <div className="relative">
                <BookOpen className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within/field:text-brand transition-colors" size={20} />
                <select 
                   value={formData.formation}
                   onChange={e => setFormData({...formData, formation: e.target.value as FormationType})}
                   className="w-full bg-slate-50 dark:bg-[#09090b] border-2 border-slate-100 dark:border-white/5 rounded-2xl lg:rounded-[30px] pl-16 pr-10 py-5 lg:py-7 font-black text-base lg:text-lg outline-none focus:border-brand focus:bg-white dark:focus:bg-[#111111] appearance-none transition-all shadow-sm cursor-pointer focus:shadow-2xl focus:shadow-brand/10"
                >
                  {Object.values(FormationType).map(f => <option key={f} value={f}>{f}</option>)}
                </select>
                <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                   <ChevronDown size={18} />
                </div>
              </div>
            </div>
            <div className="space-y-4 group/field">
              <label className="text-[11px] font-black text-brand uppercase tracking-[0.4em] pl-6 group-focus-within/field:translate-x-2 transition-transform">Email (Optionnel)</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within/field:text-brand transition-colors" size={20} />
                <input 
                   type="email" 
                   placeholder="votre@email.com"
                   value={formData.email}
                   onChange={e => setFormData({...formData, email: e.target.value})}
                   className="w-full bg-slate-50 dark:bg-[#09090b] border-2 border-slate-100 dark:border-white/5 rounded-2xl lg:rounded-[30px] pl-16 pr-4 py-5 lg:py-7 font-black text-base lg:text-lg outline-none focus:border-brand focus:bg-white dark:focus:bg-[#111111] transition-all" 
                />
              </div>
            </div>
            <div className="md:col-span-2 space-y-4 group/field">
              <label className="text-[11px] font-black text-brand uppercase tracking-[0.4em] pl-6 group-focus-within/field:translate-x-2 transition-transform">Message ou Question (Optionnel)</label>
              <div className="relative">
                <MessageSquare className="absolute left-6 top-8 text-zinc-400 group-focus-within/field:text-brand transition-colors" size={20} />
                <textarea 
                   rows={3}
                   placeholder="Dites-nous en plus..."
                   value={formData.message}
                   onChange={e => setFormData({...formData, message: e.target.value})}
                   className="w-full bg-slate-50 dark:bg-[#09090b] border-2 border-slate-100 dark:border-white/5 rounded-2xl lg:rounded-[30px] pl-16 pr-4 py-6 lg:py-8 font-black text-base lg:text-lg outline-none focus:border-brand focus:bg-white dark:focus:bg-[#111111] transition-all resize-none" 
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <button 
              disabled={loading}
              type="submit" 
              className="w-full md:w-auto px-10 lg:px-20 bg-brand text-white font-black py-5 lg:py-8 rounded-full uppercase tracking-[0.2em] lg:tracking-[0.4em] text-[11px] lg:text-[13px] shadow-2xl shadow-brand/40 hover:bg-slate-900 transition-all flex items-center justify-center gap-4 lg:gap-6 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1 active:translate-y-0"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
              {loading ? 'Envoi en cours...' : 'Envoyer ma demande'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
