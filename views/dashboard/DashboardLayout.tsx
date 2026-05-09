import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, UserCog, Car, 
  Calendar, CreditCard, LogOut, 
  Menu, X, Bell, Search, Sun, Moon,
  Cloud, Info, AlertTriangle,
  ChevronLeft, ChevronRight, FileEdit, Send,
  CheckCircle2
} from 'lucide-react';
import { Logo } from '../../components/Logo';
import { syncToFirebase } from '../../services/store';
import { getStore } from '../../services/store';

interface Notification {
  id: string;
  type: 'alert' | 'info' | 'success';
  title: string;
  message: string;
  time: string;
  read: boolean;
  path?: string;
}

interface DashboardLayoutProps {
  onLogout: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

const DashboardLayout = ({
  onLogout, theme, onToggleTheme }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [isPlanningFullScreen, setIsPlanningFullScreen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const navigate = useNavigate();

  const refreshNotifications = () => {
    const newNotifications: Notification[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const store = getStore();
    (store.vehicles || []).forEach((v: any) => {
      const checkExpiry = (dateStr: string, label: string) => {
        if (!dateStr) return;
        const expiry = new Date(dateStr);
        const diff = expiry.getTime() - today.getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        if (days <= 0) {
          newNotifications.push({
            id: `v-exp-${v.id}-${label}`,
            type: 'alert',
            title: `Expiration: ${v.model}`,
            message: `${label} a expiré le ${dateStr}.`,
            time: 'Maintenant',
            read: false,
            path: '/dashboard/vehicles'
          });
        } else if (days <= 7) {
          newNotifications.push({
            id: `v-warn-${v.id}-${label}`,
            type: 'alert',
            title: `Alerte: ${v.model}`,
            message: `${label} expire dans ${days} jours.`,
            time: 'Bientôt',
            read: false,
            path: '/dashboard/vehicles'
          });
        }
      };
      checkExpiry(v.insuranceExpiry, 'Assurance');
      checkExpiry(v.technicalControlExpiry, 'Contrôle Technique');
      checkExpiry(v.nextMaintenanceDate, 'Entretien');
    });

    (store.leads || []).forEach((l: any, idx: number) => {
      newNotifications.push({
        id: `lead-${idx}`,
        type: 'info',
        title: 'Nouveau Lead',
        message: `${l.name} a envoyé une demande (${l.formation}).`,
        time: 'Récent',
        read: false,
        path: '/dashboard/leads'
      });
    });

    setNotifications(newNotifications.filter(n => !dismissedIds.includes(n.id)));
  };

  const dismissNotification = (id: string) => setDismissedIds(prev => [...prev, id]);
  const markAllAsRead = () => setDismissedIds(notifications.map(n => n.id));
  const handleNotificationClick = (n: Notification) => {
    if (n.path) {
      navigate(n.path);
      setNotificationsOpen(false);
      dismissNotification(n.id);
    }
  };

  useEffect(() => { refreshNotifications(); }, [dismissedIds]);
  useEffect(() => {
  }, []);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  useEffect(() => {
    const handleFullScreen = (e: any) => {
      setIsPlanningFullScreen(e.detail);
      document.body.style.overflow = e.detail ? 'hidden' : 'auto';
    };
    window.addEventListener('planning_fullscreen', handleFullScreen);
    return () => {
      window.removeEventListener('planning_fullscreen', handleFullScreen);
      document.body.style.overflow = 'auto';
    };
  }, []);

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Tableau de Bord', path: '/dashboard' },
    { icon: <Users size={20} />, label: 'Élèves', path: '/dashboard/students' },
    { icon: <Send size={20} />, label: 'Demandes', path: '/dashboard/leads' },
    { icon: <UserCog size={20} />, label: 'Moniteurs', path: '/dashboard/instructors' },
    { icon: <Car size={20} />, label: 'Véhicules', path: '/dashboard/vehicles' },
    { icon: <FileEdit size={20} />, label: 'Catalogue & Prix', path: '/dashboard/catalogue' },
    { icon: <Calendar size={20} />, label: 'Planning', path: '/dashboard/planning' },
    { icon: <CreditCard size={20} />, label: 'Finance', path: '/dashboard/finance' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-[#EEEEEE] transition-colors duration-300 overflow-hidden">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 bg-white dark:bg-[#111111] border-r border-slate-100 dark:border-white/5 
        transform transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'w-24' : 'w-72'}
        ${isPlanningFullScreen ? 'hidden lg:hidden' : ''}
      `}>
        <div className="flex flex-col h-full relative">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex absolute -right-4 top-10 w-8 h-8 bg-brand text-white rounded-full items-center justify-center shadow-lg hover:scale-110 transition-transform z-[60] border-4 border-slate-50 dark:border-[#09090b]"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          <div className={`p-8 border-b border-slate-100 dark:border-white/5 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            <Link to="/" className="flex items-center gap-3">
              <div className="bg-[#00ADB5] p-2 rounded-xl shrink-0"><Logo className="w-6 h-6 text-white" /></div>
              {!isCollapsed && (
                <div className="flex flex-col">
                  <span className="font-black tracking-tighter text-lg uppercase text-slate-900 dark:text-white leading-none">Yebda</span>
                  <span className="text-[9px] text-[#00ADB5] font-black tracking-widest uppercase">Admin Pro</span>
                </div>
              )}
            </Link>
          </div>

          <nav className="flex-grow p-4 space-y-2 overflow-y-auto no-scrollbar">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-5 py-4 rounded-2xl transition-colors font-bold text-[13px] relative group
                  ${location.pathname === item.path
                    ? 'bg-[#00ADB5] text-white shadow-xl shadow-[#00ADB5]/20'
                    : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-[#00ADB5]'}
                  ${isCollapsed ? 'justify-center' : ''}
                `}
              >
                <div className="shrink-0">{item.icon}</div>
                {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
                {isCollapsed && (
                  <div className="absolute left-20 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                    {item.label}
                  </div>
                )}
              </Link>
            ))}
          </nav>

          {/* ── SIDEBAR FOOTER ── */}
          <div className="p-4 border-t border-slate-100 dark:border-white/5 space-y-2">
            <button
              onClick={onToggleTheme}
              className={`flex items-center w-full rounded-2xl text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors font-bold text-[13px]
                ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-5 py-4'}`}
            >
              <div className="shrink-0 w-[18px] h-[18px] flex items-center justify-center">
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </div>
              {!isCollapsed && <span>Mode {theme === 'dark' ? 'Clair' : 'Sombre'}</span>}
            </button>

            <button
              onClick={onLogout}
              className={`flex items-center w-full rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors font-bold text-[13px]
                ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-5 py-4'}`}
            >
              <div className="shrink-0 w-[18px] h-[18px] flex items-center justify-center">
                <LogOut size={18} />
              </div>
              {!isCollapsed && <span>Déconnexion</span>}
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-grow flex flex-col min-w-0 overflow-hidden relative">
        <header className={`h-20 border-b border-slate-100 dark:border-white/5 flex items-center justify-between px-6 lg:px-8 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-xl shrink-0 z-30 sticky top-0 ${isPlanningFullScreen ? 'hidden' : ''}`}>
          <div className="flex items-center gap-4 lg:gap-6">
            <button className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
            <div className="relative hidden lg:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" placeholder="Recherche rapide..." className="bg-slate-50 dark:bg-[#111111] border border-slate-100 dark:border-white/5 rounded-2xl pl-12 pr-6 py-2.5 text-xs w-80 focus:outline-none focus:border-brand/50 transition-colors" />
            </div>
          </div>
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className={`p-2.5 rounded-full border transition-colors relative ${notificationsOpen ? 'bg-brand text-white border-brand' : 'border-slate-100 dark:border-white/5 text-slate-400 bg-slate-50 dark:bg-[#09090b]'}`}
              >
                <Bell size={18} />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white dark:border-[#111111] rounded-full flex items-center justify-center text-[8px] font-black text-white">
                    {notifications.length}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-4 w-80 bg-white dark:bg-[#111111] border border-slate-100 dark:border-white/5 rounded-[32px] shadow-2xl overflow-hidden z-[100]">
                  <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
                    <h3 className="text-sm font-black uppercase tracking-widest">Notifications</h3>
                    <span className="text-[10px] font-black text-brand bg-brand/10 px-2 py-1 rounded-lg">{notifications.length} Nouvelles</span>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="p-12 text-center space-y-3">
                        <div className="w-12 h-12 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto text-slate-300">
                          <Bell size={24} />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aucune notification</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100 dark:divide-white/5">
                        {notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => handleNotificationClick(n)}
                            className="p-6 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer group relative"
                          >
                            <button
                              onClick={(e) => { e.stopPropagation(); dismissNotification(n.id); }}
                              className="absolute top-4 right-4 p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-colors"
                            >
                              <X size={14} />
                            </button>
                            <div className="flex gap-4">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                n.type === 'alert' ? 'bg-red-500/10 text-red-500' :
                                n.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' :
                                'bg-brand/10 text-brand'
                              }`}>
                                {n.type === 'alert' ? <AlertTriangle size={18} /> : n.type === 'success' ? <CheckCircle2 size={18} /> : <Info size={18} />}
                              </div>
                              <div className="space-y-1">
                                <div className="text-[11px] font-black uppercase tracking-tight leading-none group-hover:text-brand transition-colors">{n.title}</div>
                                <p className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 leading-relaxed">{n.message}</p>
                                <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest pt-1">{n.time}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="w-full p-4 bg-slate-50 dark:bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-brand transition-colors border-t border-slate-100 dark:border-white/5"
                    >
                      Tout marquer comme lu
                    </button>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => syncToFirebase().then(() => alert('Data synced to Firebase!')).catch(err => alert('Sync failed: ' + err.message))}
              className="p-2.5 rounded-full border transition-colors border-slate-100 dark:border-white/5 text-slate-400 bg-slate-50 dark:bg-[#09090b] hover:bg-brand hover:text-white"
              title="Sync to Firebase"
            >
              <Cloud size={18} />
            </button>
          </div>
        </header>

        <main
          key={location.pathname}
          className={`flex-grow overflow-y-auto no-scrollbar relative z-10 bg-slate-50 dark:bg-[#09090b] ${isPlanningFullScreen ? 'p-0' : 'p-4 lg:p-10'}`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
