
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStore } from '../../services/store';
import { 
  Users, Banknote, ArrowUpRight,
  Car, AlertTriangle, CheckCircle2
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';

const data = [
  { name: 'Jan', revenue: 150000 },
  { name: 'Fév', revenue: 190000 },
  { name: 'Mar', revenue: 175000 },
  { name: 'Avr', revenue: 230000 },
  { name: 'Mai', revenue: 210000 },
  { name: 'Juin', revenue: 260000 },
];

const Overview: React.FC = () => {
  const [store, setStore] = useState(getStore());
  const navigate = useNavigate();

  useEffect(() => {
    const update = () => setStore(getStore());
    window.addEventListener('storage_update', update);
    return () => window.removeEventListener('storage_update', update);
  }, []);
  
  const totalStudents = store.students?.length || 0;
  const activeVehicles = store.vehicles?.filter((v: any) => v.status === 'available').length || 0;
  const transactions = store.finance?.transactions || [];
  const totalRevenue = transactions.reduce((acc: number, t: any) => acc + (Number(t.numeric) || 0), 0);
  const pendingPayments = store.students?.filter((s: any) => (Number(s.totalAmount) || 0) > (Number(s.paidAmount) || 0)).length || 0;

  const stats = [
    { label: 'Total Élèves', value: totalStudents.toString(), change: '+12%', icon: <Users size={20} />, color: 'text-[#00ADB5]', path: '/dashboard/students' },
    { label: 'Revenus (DA)', value: `${Math.round(totalRevenue || 0).toLocaleString()} DA`, change: '+8%', icon: <Banknote size={20} />, color: 'text-emerald-500', path: '/dashboard/finance' },
    { label: 'Impayés', value: pendingPayments.toString(), change: 'Action requise', icon: <AlertTriangle size={20} />, color: 'text-orange-500', path: '/dashboard/finance' },
    { label: 'Véhicules Prêts', value: activeVehicles.toString(), change: 'Stable', icon: <Car size={20} />, color: 'text-blue-400', path: '/dashboard/vehicles' },
  ];

  return (
    <div className="space-y-8 lg:space-y-12 animate-in fade-in duration-700 max-w-7xl mx-auto px-4 lg:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl lg:text-5xl font-black uppercase tracking-tighter text-slate-900 dark:text-white italic">Mission Control</h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Gestion administrative Yebda Auto-École</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            onClick={() => navigate(stat.path)}
            className="bg-white dark:bg-[#111111] border border-slate-100 dark:border-white/5 p-6 lg:p-8 rounded-3xl lg:rounded-[40px] relative overflow-hidden group hover:border-[#00ADB5]/40 hover:shadow-2xl transition-all cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-brand/10 transition-colors" />
            <div className="flex justify-between items-start mb-6 lg:mb-10 relative z-10">
              <div className={`p-3 lg:p-4 rounded-2xl bg-slate-50 dark:bg-[#09090b] ${stat.color} border border-slate-100 dark:border-white/10 group-hover:scale-110 transition-transform`}>{stat.icon}</div>
              <div className={`text-[9px] font-black px-3 py-1.5 rounded-full flex items-center gap-1 uppercase tracking-widest ${stat.color.includes('orange') ? 'bg-orange-500/10 text-orange-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                {stat.change}
              </div>
            </div>
            <div className="text-3xl lg:text-5xl font-black mb-2 text-slate-900 dark:text-white tracking-tighter italic">{stat.value}</div>
            <div className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
        <div className="lg:col-span-2 bg-white dark:bg-[#111111] border border-slate-100 dark:border-white/5 rounded-[50px] p-8 lg:p-12 shadow-sm overflow-hidden flex flex-col min-h-[500px] relative group">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12 relative z-10">
            <div className="space-y-1">
              <h3 className="font-black text-xl uppercase tracking-tighter text-slate-900 dark:text-white italic">Recettes Mensuelles</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Performance financière (DZD)</p>
            </div>
            <div className="flex gap-2">
               <div className="w-3 h-3 bg-brand rounded-full animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-widest text-brand">Live Data</span>
            </div>
          </div>
          
          <div className="w-full flex-grow min-h-[350px] relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ADB5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#00ADB5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.03} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} fontWeight="900" tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#64748b" fontSize={10} fontWeight="900" tickLine={false} axisLine={false} tickFormatter={(value) => `${Math.round(value/1000)}k`} dx={-10} />
                <Tooltip 
                  cursor={{ stroke: '#00ADB5', strokeWidth: 1, strokeDasharray: '4 4' }}
                  contentStyle={{ backgroundColor: '#111111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}
                  itemStyle={{ color: '#00ADB5', fontWeight: '900', fontSize: '12px', textTransform: 'uppercase' }}
                  labelStyle={{ color: '#64748b', fontWeight: '900', fontSize: '10px', textTransform: 'uppercase', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#00ADB5" fillOpacity={1} fill="url(#colorRev)" strokeWidth={4} dot={{ r: 4, fill: '#00ADB5', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111111] border border-slate-100 dark:border-white/5 rounded-[50px] p-8 lg:p-12 flex flex-col shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
          <h3 className="font-black text-xl mb-12 uppercase tracking-tighter text-slate-900 dark:text-white italic relative z-10">Alertes Système</h3>
          <div className="space-y-6 flex-grow relative z-10">
            <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-[30px] flex gap-5 items-start group hover:bg-emerald-500/10 transition-all">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 shrink-0 group-hover:scale-110 transition-transform">
                  <CheckCircle2 size={24}/>
                </div>
                <div>
                  <div className="text-[11px] font-black uppercase text-emerald-500 tracking-widest">Sauvegarde Cloud</div>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Dernière synchro: Il y a 2m</p>
                </div>
            </div>
            {store.leads?.filter((l: any) => l.status === 'pending').length > 0 && (
               <div 
                 onClick={() => navigate('/dashboard/leads')}
                 className="p-4 bg-brand/10 border border-brand/20 rounded-2xl flex gap-4 items-start cursor-pointer hover:bg-brand/20 transition-all"
               >
                  <ArrowUpRight className="text-brand shrink-0" size={20}/>
                  <div>
                    <div className="text-[11px] font-black uppercase text-brand">{store.leads.filter((l: any) => l.status === 'pending').length} Nouvelles Demandes</div>
                  </div>
               </div>
            )}
            {store.vehicles?.some((v:any) => new Date(v.insuranceExpiry) < new Date(Date.now() + 15*24*60*60*1000)) && (
               <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex gap-4 items-start">
                  <AlertTriangle className="text-red-500 shrink-0" size={20}/>
                  <div>
                    <div className="text-[11px] font-black uppercase text-red-500">Assurance Expire Bientôt</div>
                  </div>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
