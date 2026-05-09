import { useState, useEffect } from 'react';
import { Plus, X, Trash2, Edit2, Wrench, Shield, Fuel, Loader2, CheckCircle2, Settings2, AlertTriangle, FileCheck } from 'lucide-react';
import { db } from '../../services/db';
import { Vehicle } from '../../types';
import { ImageUploader } from '../../components/ImageUploader';

const VehiclesList: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    model: '', plate: '', fuelType: 'Essence' as any,
    transmission: 'Manuel' as const, lastMaintenance: '',
    nextMaintenanceDate: '', insuranceExpiry: '',
    technicalControlExpiry: '', status: 'available' as any, image: ''
  });

  const getAlertStatus = (dateStr: string) => {
    if (!dateStr) return 'none';
    const targetDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return 'critical';
    if (diffDays <= 7) return 'warning';
    return 'safe';
  };

  const refreshData = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    const data = await db.getVehicles();
    setVehicles(data);
    if (isInitial) setLoading(false);
  };

  useEffect(() => {
    refreshData(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingVehicle) {
        await db.updateVehicle({ ...editingVehicle, ...formData });
      } else {
        await db.addVehicle({ id: `veh_${Date.now()}`, ...formData });
      }
      await refreshData();
      setShowAddModal(false);
      setEditingVehicle(null);
    } finally {}
  };

  const handleDelete = async (id: string) => {
    await db.deleteVehicle(id);
    await refreshData();
    setShowDeleteConfirm(null);
  };

  if (loading) return (
    <div className="h-96 flex items-center justify-center">
      <Loader2 className="animate-spin text-brand" size={48} />
    </div>
  );

  return (
    <div className="space-y-12 max-w-7xl mx-auto animate-in fade-in duration-500 pb-12">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight text-slate-900 dark:text-[#EEEEEE]">Parc Automobile</h1>
          <p className="text-zinc-500 font-bold mt-1.5">Gestion technique de la flotte 100% Manuelle.</p>
        </div>
        <button
          onClick={() => {
            setFormData({ model: '', plate: '', fuelType: 'Essence', transmission: 'Manuel', lastMaintenance: '', nextMaintenanceDate: '', insuranceExpiry: '', technicalControlExpiry: '', status: 'available', image: '' });
            setEditingVehicle(null);
            setShowAddModal(true);
          }}
          className="bg-brand text-white px-10 py-5 rounded-[22px] flex items-center gap-3 text-[11px] font-black uppercase tracking-widest shadow-2xl hover:bg-slate-900 transition-all"
        >
          <Plus size={18} /> Ajouter un Véhicule
        </button>
      </div>

      {/* Vehicle Cards Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="relative rounded-[45px] overflow-hidden shadow-lg group min-h-[340px] flex flex-col justify-between"
            style={{
              backgroundImage: `url(${vehicle.image || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800&auto=format&fit=crop'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

            {/* Top row: status + action buttons */}
            <div className="relative z-10 p-6 flex justify-between items-start">
              <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-xl ${
                vehicle.status === 'available'   ? 'bg-green-500 text-white border-green-400' :
                vehicle.status === 'maintenance' ? 'bg-orange-500 text-white border-orange-400' :
                                                   'bg-red-500 text-white border-red-400'
              }`}>
                {vehicle.status === 'available' ? 'Disponible' : vehicle.status === 'maintenance' ? 'Maintenance' : 'En Mission'}
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => { setEditingVehicle(vehicle); setFormData({...vehicle}); setShowAddModal(true); }}
                  className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-brand text-white flex items-center justify-center transition-all border border-white/20"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(vehicle.id)}
                  className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-red-500 text-white flex items-center justify-center transition-all border border-white/20"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Bottom: alerts + name + details */}
            <div className="relative z-10 p-6 pb-8 space-y-4">

              {/* Alerts — only warning/critical */}
              <div className="space-y-2">
                {[
                  { label: 'Assurance',      date: vehicle.insuranceExpiry,        icon: Shield    },
                  { label: 'Entretien',      date: vehicle.nextMaintenanceDate,     icon: Wrench    },
                  { label: 'Contrôle Tech.', date: vehicle.technicalControlExpiry,  icon: FileCheck }
                ].map((alert, idx) => {
                  const status = getAlertStatus(alert.date);
                  if (status === 'none' || status === 'safe') return null;
                  return (
                    <div key={idx} className={`flex items-center justify-between px-4 py-2.5 rounded-2xl border-2 backdrop-blur-md text-[11px] font-black uppercase tracking-widest ${
                      status === 'critical'
                        ? 'bg-red-500/40 border-red-400/60 text-white'
                        : 'bg-amber-500/40 border-amber-400/60 text-white'
                    }`}>
                      <div className="flex items-center gap-2.5">
                        <alert.icon size={14} />
                        <span>{alert.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-black tracking-widest">{alert.date}</span>
                        <AlertTriangle size={13} className="animate-pulse" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Name + plate + fuel */}
              <div className="flex items-end justify-between">
                <div>
                  <h3 className="text-3xl font-black uppercase tracking-tight text-white leading-none drop-shadow-lg">
                    {vehicle.model}
                  </h3>
                  <div className="text-[13px] font-black text-white/80 tracking-widest mt-1.5 uppercase italic drop-shadow">
                    {vehicle.plate} • {vehicle.fuelType}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/15 backdrop-blur-sm border border-white/30">
                  <Fuel size={18} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD / EDIT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in zoom-in duration-300">
          <div className="bg-white dark:bg-[#111111] w-full max-w-xl p-12 rounded-[55px] relative shadow-2xl overflow-y-auto max-h-[90vh] no-scrollbar">
            <button onClick={() => setShowAddModal(false)} className="absolute top-10 right-10 text-zinc-400 hover:text-brand transition-all"><X size={24} /></button>
            <h2 className="text-3xl font-black uppercase italic tracking-tight mb-8 text-slate-900 dark:text-white">Détails Véhicule</h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              <ImageUploader
                label="Photo du véhicule"
                currentImage={formData.image}
                onImageUpload={(base64: any) => setFormData({...formData, image: base64})}
              />

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-brand uppercase tracking-widest pl-4">Modèle</label>
                  <input required type="text" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-[#09090b] border-2 border-slate-100 dark:border-white/5 rounded-2xl px-6 py-4 font-black outline-none focus:border-brand" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-brand uppercase tracking-widest pl-4">Plaque d'immatriculation</label>
                  <input required type="text" value={formData.plate} onChange={e => setFormData({...formData, plate: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-[#09090b] border-2 border-slate-100 dark:border-white/5 rounded-2xl px-6 py-4 font-black outline-none focus:border-brand" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-brand uppercase tracking-widest pl-4">Assurance Expire le</label>
                  <input required type="date" value={formData.insuranceExpiry} onChange={e => setFormData({...formData, insuranceExpiry: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-[#09090b] border-2 border-slate-100 dark:border-white/5 rounded-2xl px-6 py-4 font-black outline-none focus:border-brand" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-brand uppercase tracking-widest pl-4">Contrôle Technique Expire le</label>
                  <input required type="date" value={formData.technicalControlExpiry} onChange={e => setFormData({...formData, technicalControlExpiry: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-[#09090b] border-2 border-slate-100 dark:border-white/5 rounded-2xl px-6 py-4 font-black outline-none focus:border-brand" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-brand uppercase tracking-widest pl-4">Dernier Entretien</label>
                  <input required type="date" value={formData.lastMaintenance} onChange={e => setFormData({...formData, lastMaintenance: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-[#09090b] border-2 border-slate-100 dark:border-white/5 rounded-2xl px-6 py-4 font-black outline-none focus:border-brand" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-brand uppercase tracking-widest pl-4">Prochain Entretien</label>
                  <input required type="date" value={formData.nextMaintenanceDate} onChange={e => setFormData({...formData, nextMaintenanceDate: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-[#09090b] border-2 border-slate-100 dark:border-white/5 rounded-2xl px-6 py-4 font-black outline-none focus:border-brand" />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-brand uppercase tracking-widest pl-4">Type de carburant</label>
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar snap-x">
                  {['Essence', 'Diesel', 'GPL'].map((fuel) => (
                    <button key={fuel} type="button" onClick={() => setFormData({...formData, fuelType: fuel as any})}
                      className={`snap-center shrink-0 px-8 py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest border-2 transition-all flex items-center gap-2 ${
                        formData.fuelType === fuel ? 'bg-brand text-white border-brand shadow-lg' : 'bg-slate-50 dark:bg-white/5 text-slate-500 border-slate-100 dark:border-white/5'
                      }`}>
                      <Fuel size={14} /> {fuel}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-brand uppercase tracking-widest pl-4">Transmission</label>
                <div className="w-full bg-slate-100 dark:bg-white/5 text-brand px-6 py-5 rounded-2xl font-black text-xs uppercase flex items-center gap-3">
                  <Settings2 size={18} /> Manuel Uniquement (BVM)
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-brand uppercase tracking-widest pl-4">Statut Actuel</label>
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar snap-x">
                  {[
                    { id: 'available',   label: 'Disponible'     },
                    { id: 'maintenance', label: 'En Maintenance' },
                    { id: 'in_use',      label: 'En Leçon'       }
                  ].map((stat) => (
                    <button key={stat.id} type="button" onClick={() => setFormData({...formData, status: stat.id as any})}
                      className={`snap-center shrink-0 px-8 py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                        formData.status === stat.id ? 'bg-slate-900 dark:bg-brand text-white border-slate-900 dark:border-brand shadow-lg' : 'bg-slate-50 dark:bg-white/5 text-slate-500 border-slate-100 dark:border-white/5'
                      }`}>
                      {stat.label}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="w-full bg-brand text-white font-black py-8 rounded-[35px] uppercase tracking-widest text-[11px] shadow-2xl shadow-brand/30 mt-4 flex items-center justify-center gap-3">
                <CheckCircle2 size={18} /> Enregistrer le véhicule
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in zoom-in duration-300">
          <div className="bg-white dark:bg-[#111111] w-full max-w-md p-10 rounded-[45px] shadow-2xl text-center">
            <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Trash2 size={32} />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight mb-4 text-slate-900 dark:text-white">Confirmer la suppression</h3>
            <p className="text-slate-500 font-bold mb-8">Voulez-vous vraiment retirer ce véhicule du parc ? Cette action est irréversible.</p>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setShowDeleteConfirm(null)}
                className="py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 border-slate-100 dark:border-white/5 text-slate-500 hover:bg-slate-50 transition-all">
                Annuler
              </button>
              <button onClick={() => handleDelete(showDeleteConfirm)}
                className="py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-red-500 text-white shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehiclesList;