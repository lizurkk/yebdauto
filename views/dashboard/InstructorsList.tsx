import { FC, useState, useEffect, useMemo, memo } from 'react';
import {
  UserPlus, Edit2, Trash2, X, Zap,
  Loader2, CheckCircle2, Clock, Star, Award,
  TrendingUp, Users, Search, User, Phone
} from 'lucide-react';
import { db } from '../../services/db';
import { Instructor } from '../../types';
import { ImageUploader } from '../../components/ImageUploader';

const InstructorStats = memo(({ successRate, rating }: {
  successRate: number;
  rating: number;
}) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-4 text-center">
        <div className="text-lg font-black text-emerald-500">{successRate}%</div>
        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Réussite</div>
      </div>
      <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-4 text-center">
        <div className="text-lg font-black text-amber-400 flex items-center justify-center gap-1">
          {rating} <Star size={12} fill="currentColor" />
        </div>
        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Note</div>
      </div>
    </div>
  );
});

const InstructorsList: FC = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);
  const [showProfileModal, setShowProfileModal] = useState<Instructor | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState<string>('Tous');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    specialty: 'Pratique' as 'Code' | 'Pratique' | 'Mixte',
    experience: '',
    avatar: '',
    licenseNumber: '',
    availability: 'Matin',
    rating: 5,
    successRate: 0,
    bio: '',
    email: '',
    address: '',
  });

  const refreshData = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    const data = await db.getInstructors();
    setInstructors(data);
    if (isInitial) setLoading(false);
  };

  useEffect(() => {
    refreshData(true);
    const handler = () => refreshData(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing('saving');
    try {
      if (editingInstructor) {
        await db.updateInstructor({ ...editingInstructor, ...formData });
      } else {
        await db.addInstructor({
          id: `inst_${Date.now()}`,
          assignedStudents: [],
          ...formData,
          avatar: formData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`
        });
      }
      await refreshData();
      setShowAddModal(false);
      setEditingInstructor(null);
      setFormData({ name: '', phone: '', specialty: 'Pratique', experience: '', avatar: '', licenseNumber: '', availability: 'Matin', rating: 5, successRate: 0, bio: '', email: '', address: '' });
    } finally {
      setProcessing(null);
    }
  };

  const handleDelete = async (id: string) => {
    setProcessing('deleting');
    try {
      await db.deleteInstructor(id);
      await refreshData();
      setShowDeleteConfirm(null);
    } finally {
      setProcessing(null);
    }
  };

  const filtered = useMemo(() => {
    return instructors.filter(i => {
      const matchSearch = i.name.toLowerCase().includes(searchQuery.toLowerCase()) || i.phone.includes(searchQuery);
      const matchFilter = filterSpecialty === 'Tous' || i.specialty === filterSpecialty;
      return matchSearch && matchFilter;
    });
  }, [instructors, searchQuery, filterSpecialty]);

  const totalInstructors = instructors.length;
  const avgSuccess = instructors.length
    ? Math.round(instructors.reduce((acc, i) => acc + (i.successRate ?? 0), 0) / instructors.length)
    : 0;

  if (loading) return (
    <div className="h-96 flex items-center justify-center">
      <Loader2 className="animate-spin text-brand" size={48} />
    </div>
  );

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-12">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight text-slate-900 dark:text-[#EEEEEE]">Équipe Pédagogique</h1>
          <p className="text-zinc-500 font-bold mt-1.5">Auto-École <span className="text-brand">Hamid Yebda</span> — Gestion des moniteurs.</p>
        </div>
        <button
          onClick={() => {
            setFormData({ name: '', phone: '', specialty: 'Pratique', experience: '', avatar: '', licenseNumber: '', availability: 'Matin', rating: 5, successRate: 0, bio: '', email: '', address: '' });
            setEditingInstructor(null);
            setShowAddModal(true);
          }}
          className="bg-brand text-white px-10 py-5 rounded-[22px] flex items-center gap-3 text-[11px] font-black uppercase tracking-widest shadow-2xl hover:bg-slate-900 transition-colors"
        >
          <UserPlus size={18} /> Nouveau Moniteur
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 gap-6">
        {[
          { label: 'Moniteurs actifs', value: totalInstructors, icon: Users, color: 'text-brand' },
          { label: 'Taux de réussite moy.', value: `${avgSuccess}%`, icon: TrendingUp, color: 'text-violet-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-[#111111] border border-slate-100 dark:border-white/5 rounded-[30px] p-7 flex items-center gap-5 shadow-sm">
            <div className={`w-14 h-14 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher un moniteur..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-[#111111] border border-slate-100 dark:border-white/5 rounded-2xl pl-12 pr-6 py-4 font-bold text-sm outline-none focus:border-brand transition-colors shadow-sm"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['Tous', 'Code', 'Pratique', 'Mixte'].map(f => (
            <button key={f} onClick={() => setFilterSpecialty(f)}
              className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-colors ${
                filterSpecialty === f ? 'bg-brand text-white border-brand shadow-lg' : 'bg-white dark:bg-[#111111] text-slate-500 border-slate-100 dark:border-white/5'
              }`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="flex flex-row overflow-x-auto pb-4 gap-8 no-scrollbar snap-x">
        {filtered.map((instructor) => (
          <div key={instructor.id} className="min-w-[360px] snap-center bg-white dark:bg-[#111111] border border-slate-100 dark:border-white/5 rounded-[45px] p-10 hover:border-brand/30 transition-colors flex flex-col gap-6 shadow-sm">

            <div className="flex justify-between items-start">
              <div className="relative">
                <img src={instructor.avatar || undefined} alt={instructor.name}
                  className="w-24 h-24 rounded-[32px] object-cover border-4 border-white dark:border-[#222831] shadow-xl" />
                <div className="absolute -bottom-2 -right-2 bg-brand text-white text-[8px] font-black px-3 py-1 rounded-xl uppercase tracking-widest shadow-xl">
                  {instructor.specialty}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => setShowProfileModal(instructor)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-brand/10 text-brand hover:bg-brand hover:text-white rounded-xl border border-brand/20 transition-colors text-[10px] font-black uppercase tracking-widest">
                  <User size={14} /> Profil
                </button>
                <button onClick={() => {
                  setEditingInstructor(instructor);
                  setFormData({
                    name: instructor.name,
                    phone: instructor.phone,
                    specialty: instructor.specialty,
                    experience: instructor.experience,
                    avatar: instructor.avatar,
                    licenseNumber: instructor.licenseNumber,
                    availability: instructor.availability,
                    rating: instructor.rating ?? 5,
                    successRate: instructor.successRate ?? 0,
                    bio: instructor.bio ?? '',
                    email: instructor.email ?? '',
                    address: instructor.address ?? ''
                  });
                  setShowAddModal(true);
                }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-900 hover:text-white rounded-xl border border-slate-200 dark:border-white/10 transition-colors text-[10px] font-black uppercase tracking-widest">
                  <Edit2 size={14} /> Modifier
                </button>
                <button onClick={() => setShowDeleteConfirm(instructor.id)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl border border-red-500/20 transition-colors text-[10px] font-black uppercase tracking-widest">
                  <Trash2 size={14} /> Supprimer
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">{instructor.name}</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
                {instructor.availability} • {instructor.experience || 'N/A'}
              </p>
              {instructor.bio && (
                <p className="text-xs text-slate-500 mt-3 leading-relaxed line-clamp-2">{instructor.bio}</p>
              )}
            </div>

            <InstructorStats
              successRate={instructor.successRate ?? 0}
              rating={instructor.rating ?? 5}
            />

            <div className="flex items-center gap-2 bg-slate-50 dark:bg-white/5 rounded-2xl px-5 py-3">
              <Clock size={14} className="text-brand" />
              <span className="text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">{instructor.availability}</span>
              {instructor.licenseNumber && (
                <>
                  <span className="text-slate-300 dark:text-white/10">•</span>
                  <Award size={14} className="text-violet-400" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">N° {instructor.licenseNumber}</span>
                </>
              )}
            </div>

            <a href={`tel:${instructor.phone}`}
              className="w-full bg-slate-900 dark:bg-white/10 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-brand transition-colors shadow-lg">
              <Phone size={14} /> Appeler {instructor.phone}
            </a>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="w-full text-center py-24 text-slate-400 font-black uppercase tracking-widest">
            Aucun moniteur trouvé.
          </div>
        )}
      </div>

      {/* PROFILE MODAL */}
      {showProfileModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white dark:bg-[#111111] w-full max-w-md p-10 rounded-[50px] relative shadow-2xl overflow-y-auto max-h-[90vh] no-scrollbar">
            <button onClick={() => setShowProfileModal(null)} className="absolute top-8 right-8 text-zinc-400 hover:text-brand transition-colors"><X size={24} /></button>
            <div className="flex flex-col items-center text-center space-y-6 pt-4">
              <img src={showProfileModal.avatar || undefined} className="w-32 h-32 rounded-[40px] shadow-2xl object-cover border-4 border-white dark:border-white/10" alt="" />
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">{showProfileModal.name}</h2>
                <p className="text-brand font-black text-xs uppercase tracking-[0.3em] mt-2">{showProfileModal.specialty}</p>
                {showProfileModal.bio && <p className="text-sm text-slate-500 mt-3 leading-relaxed">{showProfileModal.bio}</p>}
              </div>
              <InstructorStats
                successRate={showProfileModal.successRate ?? 0}
                rating={showProfileModal.rating ?? 5}
              />
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="bg-slate-50 dark:bg-white/5 p-5 rounded-[24px] border border-slate-100 dark:border-white/5">
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Expérience</div>
                  <div className="text-sm font-black text-slate-900 dark:text-white">{showProfileModal.experience || '—'}</div>
                </div>
                <div className="bg-slate-50 dark:bg-white/5 p-5 rounded-[24px] border border-slate-100 dark:border-white/5">
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Horaire</div>
                  <div className="text-sm font-black text-slate-900 dark:text-white">{showProfileModal.availability}</div>
                </div>
              </div>
              {showProfileModal.licenseNumber && (
                <div className="w-full bg-slate-50 dark:bg-white/5 p-5 rounded-[24px] border border-slate-100 dark:border-white/5 text-left">
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">N° Agrément</div>
                  <div className="text-sm font-black text-slate-900 dark:text-white">{showProfileModal.licenseNumber}</div>
                </div>
              )}
              <div className="w-full bg-slate-50 dark:bg-white/5 p-5 rounded-[24px] border border-slate-100 dark:border-white/5 text-left">
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Téléphone</div>
                <div className="text-lg font-black text-slate-900 dark:text-white">{showProfileModal.phone}</div>
              </div>
              {showProfileModal.email && (
                <div className="w-full bg-slate-50 dark:bg-white/5 p-5 rounded-[24px] border border-slate-100 dark:border-white/5 text-left">
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Email</div>
                  <div className="text-sm font-black text-slate-900 dark:text-white">{showProfileModal.email}</div>
                </div>
              )}
              <button
                onClick={() => {
                  setEditingInstructor(showProfileModal);
                  setFormData({
                    name: showProfileModal.name,
                    phone: showProfileModal.phone,
                    specialty: showProfileModal.specialty,
                    experience: showProfileModal.experience,
                    avatar: showProfileModal.avatar,
                    licenseNumber: showProfileModal.licenseNumber,
                    availability: showProfileModal.availability,
                    rating: showProfileModal.rating ?? 5,
                    successRate: showProfileModal.successRate ?? 0,
                    bio: showProfileModal.bio ?? '',
                    email: showProfileModal.email ?? '',
                    address: showProfileModal.address ?? ''
                  });
                  setShowProfileModal(null);
                  setShowAddModal(true);
                }}
                className="w-full bg-brand text-white py-5 rounded-3xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-slate-900 transition-colors">
                Modifier les informations
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white dark:bg-[#111111] w-full max-w-xl p-12 rounded-[55px] relative shadow-2xl overflow-y-auto max-h-[90vh] no-scrollbar">
            <button onClick={() => setShowAddModal(false)} className="absolute top-10 right-10 text-zinc-400 hover:text-brand transition-colors"><X size={24} /></button>
            <h2 className="text-3xl font-black uppercase italic tracking-tight mb-8 text-slate-900 dark:text-white">
              {editingInstructor ? 'Modifier Moniteur' : 'Nouveau Moniteur'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              <ImageUploader label="Photo de profil" currentImage={formData.avatar} onImageUpload={(base64: string) => setFormData({ ...formData, avatar: base64 })} />

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-brand uppercase tracking-widest pl-4">Nom Complet</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#09090b] border-2 border-slate-100 dark:border-white/5 rounded-2xl px-6 py-4 font-black outline-none focus:border-brand" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-brand uppercase tracking-widest pl-4">Téléphone</label>
                  <input required type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#09090b] border-2 border-slate-100 dark:border-white/5 rounded-2xl px-6 py-4 font-black outline-none focus:border-brand" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-brand uppercase tracking-widest pl-4">Email</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#09090b] border-2 border-slate-100 dark:border-white/5 rounded-2xl px-6 py-4 font-black outline-none focus:border-brand" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-brand uppercase tracking-widest pl-4">N° Agrément</label>
                  <input type="text" value={formData.licenseNumber} onChange={e => setFormData({ ...formData, licenseNumber: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#09090b] border-2 border-slate-100 dark:border-white/5 rounded-2xl px-6 py-4 font-black outline-none focus:border-brand" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-brand uppercase tracking-widest pl-4">Années d'expérience</label>
                  <input type="text" placeholder="ex: 3 ans" value={formData.experience} onChange={e => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#09090b] border-2 border-slate-100 dark:border-white/5 rounded-2xl px-6 py-4 font-black outline-none focus:border-brand" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-brand uppercase tracking-widest pl-4">Adresse</label>
                  <input type="text" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#09090b] border-2 border-slate-100 dark:border-white/5 rounded-2xl px-6 py-4 font-black outline-none focus:border-brand" />
                </div>
              </div>

              {/* Réussite % — button selector */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-brand uppercase tracking-widest pl-4">Réussite %</label>
                <div className="flex gap-2 flex-wrap">
                  {[0, 25, 50, 60, 70, 75, 80, 90, 100].map((val) => (
                    <button key={val} type="button" onClick={() => setFormData({ ...formData, successRate: val })}
                      className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-colors ${
                        formData.successRate === val
                          ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg'
                          : 'bg-slate-50 dark:bg-white/5 text-slate-500 border-slate-100 dark:border-white/5 hover:border-emerald-400/40'
                      }`}>
                      {val}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Note / 5 — button selector */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-brand uppercase tracking-widest pl-4">Note / 5</label>
                <div className="flex gap-2 flex-wrap">
                  {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((val) => (
                    <button key={val} type="button" onClick={() => setFormData({ ...formData, rating: val })}
                      className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-colors flex items-center gap-1 ${
                        formData.rating === val
                          ? 'bg-amber-400 text-white border-amber-400 shadow-lg'
                          : 'bg-slate-50 dark:bg-white/5 text-slate-500 border-slate-100 dark:border-white/5 hover:border-amber-300/40'
                      }`}>
                      <Star size={10} fill={formData.rating === val ? 'currentColor' : 'none'} /> {val}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-brand uppercase tracking-widest pl-4">Biographie courte</label>
                <textarea rows={3} value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Ex: Moniteur spécialisé dans la conduite urbaine..."
                  className="w-full bg-slate-50 dark:bg-[#09090b] border-2 border-slate-100 dark:border-white/5 rounded-2xl px-6 py-4 font-black outline-none focus:border-brand resize-none" />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-brand uppercase tracking-widest pl-4">Spécialité</label>
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar snap-x">
                  {(['Code', 'Pratique', 'Mixte'] as const).map((spec) => (
                    <button key={spec} type="button" onClick={() => setFormData({ ...formData, specialty: spec })}
                      className={`snap-center shrink-0 px-8 py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest border-2 transition-colors flex items-center gap-2 ${
                        formData.specialty === spec ? 'bg-brand text-white border-brand shadow-lg' : 'bg-slate-50 dark:bg-white/5 text-slate-500 border-slate-100 dark:border-white/5'
                      }`}>
                      <Zap size={14} /> {spec}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-brand uppercase tracking-widest pl-4">Disponibilité</label>
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar snap-x">
                  {['Matin', 'Après-midi', 'Soir', 'Temps Plein'].map((avail) => (
                    <button key={avail} type="button" onClick={() => setFormData({ ...formData, availability: avail })}
                      className={`snap-center shrink-0 px-8 py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest border-2 transition-colors flex items-center gap-2 ${
                        formData.availability === avail ? 'bg-slate-900 dark:bg-brand text-white border-slate-900 dark:border-brand shadow-lg' : 'bg-slate-50 dark:bg-white/5 text-slate-500 border-slate-100 dark:border-white/5'
                      }`}>
                      <Clock size={14} /> {avail}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={processing === 'saving'}
                className="w-full bg-brand text-white font-black py-8 rounded-[35px] uppercase tracking-widest text-[11px] shadow-2xl shadow-brand/30 mt-4 flex items-center justify-center gap-3">
                {processing === 'saving' ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                Enregistrer le profil
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white dark:bg-[#111111] w-full max-w-md p-10 rounded-[45px] shadow-2xl text-center">
            <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Trash2 size={32} />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight mb-4 text-slate-900 dark:text-white">Confirmer la suppression</h3>
            <p className="text-slate-500 font-bold mb-8">Voulez-vous vraiment supprimer ce moniteur ? Cette action est irréversible.</p>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setShowDeleteConfirm(null)}
                className="py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 border-slate-100 dark:border-white/5 text-slate-500 hover:bg-slate-50 transition-colors">
                Annuler
              </button>
              <button onClick={() => handleDelete(showDeleteConfirm)} disabled={processing === 'deleting'}
                className="py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-red-500 text-white shadow-lg shadow-red-500/20 hover:bg-red-600 transition-colors flex items-center justify-center gap-2">
                {processing === 'deleting' ? <Loader2 className="animate-spin" size={14} /> : null}
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorsList;