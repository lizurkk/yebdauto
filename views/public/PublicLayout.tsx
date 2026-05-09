import { useState, useEffect, type ReactNode, type FC } from 'react';
import { Link } from 'react-router-dom';
import { 
  Menu, X, Sun, Moon, Facebook, Instagram, MessageCircle,
  UserLock
} from 'lucide-react';
import { getStore } from '../../services/store';
import { Logo } from '../../components/Logo';

interface PublicLayoutProps {
  children: ReactNode;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

const PublicLayout: FC<PublicLayoutProps> = ({ children, theme, onToggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [store, setStore] = useState(getStore());

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const update = () => setStore(getStore());
    window.addEventListener('storage_update', update);
    return () => window.removeEventListener('storage_update', update);
  }, []);

  const { school, social, branding } = store;

  const navLinks = [
    { label: 'Formations', path: '/formations' },
    { label: 'Parcours', path: '/procedure' },
    { label: 'Contact', path: '/contact' },
  ];

  const dynamicStyles = `
    :root {
      --brand: ${branding.primaryColor};
    }
    body {
      font-family: ${branding.fontFamily}, sans-serif;
    }
    .btn-brand {
      background-color: var(--brand);
      border-radius: ${branding.buttonShape === 'rounded-full' ? '9999px' : branding.buttonShape === 'rounded-2xl' ? '1rem' : '0'};
    }
    .card-brand {
      border-radius: ${branding.cardShape};
    }
    .text-brand {
      color: var(--brand) !important;
    }
    .bg-brand {
      background-color: var(--brand) !important;
    }
    .border-brand {
      border-color: var(--brand) !important;
    }
    .focus-border-brand:focus {
      border-color: var(--brand) !important;
    }
  `;

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#09090b] text-slate-900 dark:text-zinc-100 font-sans transition-colors duration-500 w-full overflow-x-hidden">
      <style>{dynamicStyles}</style>
      
      <header 
        className={`sticky top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          scrolled 
            ? 'bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-md shadow-sm py-1 lg:py-2 border-b border-slate-100 dark:border-white/5' 
            : 'bg-white dark:bg-[#09090b] py-2 lg:py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center h-10 lg:h-12">
          <Link to="/" className="flex items-center gap-2.5 transition-transform hover:scale-105 shrink-0">
             <Logo className="w-7 h-7 lg:w-9 lg:h-9 text-brand" />
             <div className="flex flex-col leading-none">
                <span className="text-lg lg:text-2xl font-black font-display tracking-tighter text-brand uppercase italic">{school.name.split(' ')[0]}</span>
             </div>
          </Link>

          <div className="hidden lg:flex gap-10 items-center">
            {navLinks.map((link) => (
              <Link 
                key={link.label} 
                to={link.path}
                className="text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-zinc-300 hover:text-brand transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* ✅ REMOVED: Accès Pro button — only theme toggle remains */}
          <div className="hidden lg:flex items-center gap-5">
            <button onClick={onToggleTheme} className="text-slate-400 hover:text-brand transition-colors">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          <button className="lg:hidden p-2 text-slate-900 dark:text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 z-[110] bg-white dark:bg-[#09090b] transition-all duration-500 transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 flex flex-col h-full">
           <div className="flex justify-between items-center mb-16">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3">
                 <Logo className="w-8 h-8" />
                 <span className="text-xl font-black uppercase italic tracking-tighter text-brand">{school.name.split(' ')[0]}</span>
              </Link>
              <button onClick={() => setIsMenuOpen(false)}><X size={28}/></button>
           </div>
           <nav className="flex flex-col gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.label} 
                  to={link.path} 
                  onClick={() => setIsMenuOpen(false)} 
                  className="text-3xl font-black uppercase tracking-tighter hover:text-brand transition-colors"
                >
                  {link.label}
                </Link>
              ))}
           </nav>
        </div>
      </div>

      <main className="flex-grow">{children}</main>

      <footer className="bg-[#0c0c0e] text-white pt-10 pb-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <Logo className="w-8 h-8" />
              <span className="text-xl font-black italic text-brand uppercase">{school.name.split(' ')[0]}</span>
            </Link>
            <p className="text-slate-500 text-xs font-medium leading-relaxed max-w-[200px]">
              Formation de qualité supérieure agréée par l'État Algérien. 
            </p>
          </div>
          
          <div>
            <h5 className="font-black uppercase tracking-[0.2em] text-[10px] text-brand mb-6">Menu</h5>
            <ul className="space-y-3 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
              <li><Link to="/formations" className="hover:text-white transition-colors">Nos Formations</Link></li>
              <li><Link to="/procedure" className="hover:text-white transition-colors">Parcours Candidat</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-black uppercase tracking-[0.2em] text-[10px] text-brand mb-6">Support</h5>
            <ul className="space-y-3 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
              <li className="text-white">{school.phone}</li>
              <li className="text-slate-500">{school.location}</li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Aide en ligne</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h5 className="font-black uppercase tracking-[0.2em] text-[10px] text-brand mb-6">Social Connect</h5>
            <div className="flex gap-3">
               <a href={social.facebook} className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center hover:bg-brand hover:text-white transition-all"><Facebook size={16} /></a>
               <a href={social.instagram} className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center hover:bg-brand hover:text-white transition-all"><Instagram size={16} /></a>
               <a href={social.whatsapp} className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center hover:bg-brand hover:text-white transition-all"><MessageCircle size={16} /></a>
            </div>
          </div>
        </div>
        
        {/* ✅ Footer bottom bar — tiny discrete login link */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-8 border-t border-white/5 text-[9px] font-black uppercase tracking-[0.4em] text-slate-600 flex flex-col md:flex-row justify-between gap-4">
          <span>© {new Date().getFullYear()} {school.name} - Bab Azzouar.</span>
          <div className="flex items-center gap-6">
            <span className="text-brand">Alger, Algérie</span>
            {/* Discrete admin link — very small, blends into footer */}
         <Link 
  to="/login" 
  className="text-slate-70 hover:text-brand transition-colors opacity-100 hover:opacity-100"
>
  <UserLock size={40} />
</Link>

          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
