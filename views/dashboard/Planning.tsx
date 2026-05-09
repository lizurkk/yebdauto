import { useState, useMemo, useEffect, useRef, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';import { getStore, updateStudents } from '../../services/store';import { 
  ChevronLeft, ChevronRight, Plus, Clock, User, Car, X,
  CheckCircle2, BookOpen, Calendar, Maximize2, Minimize2, 
  ParkingCircle, Award, LayoutDashboard, Info, Edit2, Trash2, Phone, UserPlus
} from 'lucide-react';
import { Lesson } from '../../types';

const TYPE_COLORS: Record<string, { bg: string; border: string; icon: string }> = {
  Conduite:         { bg: '#a6eac6', border: '#6EE7B7', icon: '#065F46' },
  Code:             { bg: '#E0F2FE', border: '#BAE6FD', icon: '#0369A1' },
  Créneau:          { bg: '#FEF3C7', border: '#FDE68A', icon: '#92400E' },
  Perfectionnement: { bg: '#c35a95', border: '#FBCFE8', icon: '#9D174D' },
};

const getTypeColor = (type: string) => TYPE_COLORS[type] || TYPE_COLORS['Conduite'];

const Planning = () => {
  const navigate = useNavigate();
  const [store, setStore] = useState(getStore());

  useEffect(() => {
    const update = () => setStore(getStore());
    window.addEventListener('storage_update', update);
    return () => window.removeEventListener('storage_update', update);
  }, []);

  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [isNewStudent, setIsNewStudent] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentPhone, setNewStudentPhone] = useState('');

  // ── Student search states ──
  const [studentSearch, setStudentSearch] = useState('');
  const [studentDropdownOpen, setStudentDropdownOpen] = useState(false);
  const studentSearchRef = useRef<HTMLDivElement>(null);

  const [lessons, setLessons] = useState<Lesson[]>(() => {
    const saved = localStorage.getItem('yebda_lessons');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    const today = new Date();
    const isoToday = today.toISOString().split('T')[0];
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const isoTomorrow = tomorrow.toISOString().split('T')[0];
    return [
      { id: '1', studentId: '1', instructorId: '1', type: 'Conduite',         day: isoToday,    time: '09:00', weekOffset: 0 },
      { id: '2', studentId: '2', instructorId: '2', type: 'Code',              day: isoToday,    time: '11:00', weekOffset: 0 },
      { id: '3', studentId: '3', instructorId: '1', type: 'Perfectionnement',  day: isoTomorrow, time: '14:00', weekOffset: 0 },
      { id: '4', studentId: '4', instructorId: '2', type: 'Créneau',           day: isoTomorrow, time: '10:00', weekOffset: 0 },
    ];
  });

  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const [formLesson, setFormLesson] = useState<Partial<Lesson>>({
    studentId: '',
    instructorId: store.instructors[0]?.id || '',
    type: 'Conduite',
    day: new Date().toISOString().split('T')[0],
    time: store.planning.timeSlots[0] || '08:00',
    weekOffset: 0
  });

  const timeSlots = store.planning.timeSlots;
  const rowColors = store.planning.rowColors || [];
  const closedDays = store.planning.closedDays;

  const blockedTimeSlots: Record<string, string[]> = {
    Mardi: ['07:45', '08:30', '09:15', '10:00', '10:45', '11:30', '12:15', '13:00'],
    Jeudi: ['13:45', '14:30', '15:15', '16:00', '16:45', '17:30', '18:15', '19:00']
  };

  useEffect(() => {
    localStorage.setItem('yebda_lessons', JSON.stringify(lessons));
  }, [lessons]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('planning_fullscreen', { detail: isFullScreen }));
    return () => {
      window.dispatchEvent(new CustomEvent('planning_fullscreen', { detail: false }));
    };
  }, [isFullScreen]);

  useEffect(() => {
  }, []);

  // ── Close student dropdown on outside click ──
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (studentSearchRef.current && !studentSearchRef.current.contains(e.target as Node)) {
        setStudentDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const weekDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    const currentDay = today.getDay();
    const diffToSaturday = currentDay === 6 ? 0 : -(currentDay + 1);
    const startOfPeriod = new Date(today);
    startOfPeriod.setDate(today.getDate() + diffToSaturday + currentWeekOffset * 7);
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfPeriod);
      date.setDate(startOfPeriod.getDate() + i);
      const nativeDayName = date.toLocaleDateString('fr-FR', { weekday: 'long' });
      const capitalizedDayName = nativeDayName.charAt(0).toUpperCase() + nativeDayName.slice(1);
      const fullDateStr = date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
      dates.push({
        name: capitalizedDayName,
        fullDate: date.toISOString().split('T')[0],
        formatted: date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
        fullFormatted: `${capitalizedDayName} ${fullDateStr}`,
        isToday: date.toDateString() === new Date().toDateString()
      });
    }
    return dates;
  }, [currentWeekOffset]);

  const getDayNameFromDate = (dateStr: string) => weekDates.find(d => d.fullDate === dateStr)?.name || '';
  const isSlotClosed = (dayName: string, time: string) => closedDays.includes(dayName) || (blockedTimeSlots[dayName]?.includes(time) ?? false);

  const currentWeekLabel = useMemo(() => {
    if (!weekDates.length) return '';
    const start = new Date(weekDates[0].fullDate);
    const end = new Date(weekDates[6].fullDate);
    return `${start.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })} – ${end.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}`;
  }, [weekDates]);

  const getTypeIcon = (type: string, size = 14): ReactNode => {
    switch (type) {
      case 'Code':             return <BookOpen size={size} />;
      case 'Créneau':          return <ParkingCircle size={size} />;
      case 'Perfectionnement': return <Award size={size} />;
      default:                 return <Car size={size} />;
    }
  };

  const closeAddModal = () => {
    setShowAddLesson(false);
    setIsNewStudent(false);
    setNewStudentName('');
    setNewStudentPhone('');
    setStudentSearch('');
    setStudentDropdownOpen(false);
  };

  const handleAddLesson = (e: React.FormEvent) => {
    e.preventDefault();
    let studentId = formLesson.studentId;

    if (isNewStudent) {
      if (!newStudentName.trim()) return;
      const newStudent = {
        id: Date.now().toString(),
        name: newStudentName.trim(),
        phone: newStudentPhone.trim(),
        cin: '', email: '', address: '',
        registration_date: new Date().toISOString().split('T')[0],
        formation: formLesson.type || 'Conduite',
        total_amount: 45000, paid_amount: 0, status: 'active'
      };
      const updatedStudents = [...store.students, newStudent];
      updateStudents(updatedStudents);
      setStore({ ...store, students: updatedStudents });
      studentId = newStudent.id;
    }

    if (!studentId || !formLesson.instructorId || !formLesson.day) return;

    const selectedDayName = getDayNameFromDate(formLesson.day);
    if (isSlotClosed(selectedDayName, formLesson.time || '')) {
      setNotification({ message: 'Ce créneau est fermé, choisissez une autre heure.', type: 'error' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    const newLesson: Lesson = {
      id: Date.now().toString(),
      studentId: studentId!,
      instructorId: formLesson.instructorId!,
      type: formLesson.type as any,
      day: formLesson.day!,
      time: formLesson.time!,
      weekOffset: currentWeekOffset
    };

    setLessons([...lessons, newLesson]);
    const displayName = isNewStudent ? newStudentName : studentSearch;
    closeAddModal();
    setNotification({ message: isNewStudent ? `"${displayName}" ajouté et séance créée !` : 'Séance ajoutée !', type: 'success' });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleEditLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLesson) return;

    const selectedDayName = getDayNameFromDate(editingLesson.day);
    if (isSlotClosed(selectedDayName, editingLesson.time || '')) {
      setNotification({ message: 'Ce créneau est fermé, choisissez une autre heure.', type: 'error' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    setLessons(lessons.map(l => l.id === editingLesson.id ? editingLesson : l));
    setEditingLesson(null);
    setSelectedLesson(null);
    setNotification({ message: 'Séance modifiée avec succès !', type: 'success' });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeleteLesson = (id: string) => {
    setLessons(lessons.filter(l => l.id !== id));
    setSelectedLesson(null);
    setNotification({ message: 'Séance supprimée.', type: 'success' });
    setTimeout(() => setNotification(null), 3000);
  };

  const getStudentName = (id: string) => store.students.find((s: any) => s.id === id)?.name || 'Élève inconnu';
  const getInstructorName = (id: string) => store.instructors.find((i: any) => i.id === id)?.name || 'Moniteur inconnu';
  const getStudentPhone = (id: string) => store.students.find((s: any) => s.id === id)?.phone || null;

  const filteredStudents = store.students.filter((s: any) =>
    s.name.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const planningContent = (
    <div className={`flex flex-col h-full bg-white dark:bg-black transition-all duration-500 ${isFullScreen ? 'p-0' : 'w-full max-w-7xl mx-auto'}`}>

      {/* Header */}
      <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${isFullScreen ? 'p-4 bg-white dark:bg-black border-b border-slate-200 dark:border-white/10' : 'mb-8'}`}>
        <div className="flex items-center gap-4">
          {!isFullScreen && (
            <button onClick={() => navigate('/dashboard')} className="p-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[20px] text-slate-500 dark:text-white hover:text-brand transition-all shadow-sm">
              <LayoutDashboard size={20} />
            </button>
          )}
          <div className="w-12 h-12 bg-brand/10 text-brand rounded-[20px] flex items-center justify-center">
            <Calendar size={24} />
          </div>
          <div>
            <h1 className={`${isFullScreen ? 'text-xl' : 'text-4xl'} font-black uppercase tracking-tight text-slate-900 dark:text-white italic leading-none`}>
              {isFullScreen ? 'Planning Pro' : 'Planning'}
            </h1>
            {!isFullScreen && <p className="text-slate-500 dark:text-zinc-400 font-bold mt-1 uppercase text-[10px] tracking-[0.2em]">Gestion des séances • Bab Azzouar</p>}
          </div>
        </div>

        {/* Legend */}
        <div className="hidden md:flex items-center gap-2">
          {Object.entries(TYPE_COLORS).map(([type, c]) => (
            <div key={type} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.border }} />
              <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">{type}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-1 shadow-sm">
            <button onClick={() => setCurrentWeekOffset(prev => prev - 1)} className="p-1 hover:bg-slate-100 dark:hover:bg-white/10 rounded-md transition-colors text-slate-500 dark:text-white"><ChevronLeft size={14} /></button>
            <button onClick={() => setCurrentWeekOffset(0)} className="px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-500/10 rounded-md transition-colors">{currentWeekLabel}</button>
            <button onClick={() => setCurrentWeekOffset(prev => prev + 1)} className="p-1 hover:bg-slate-100 dark:hover:bg-white/10 rounded-md transition-colors text-slate-500 dark:text-white"><ChevronRight size={14} /></button>
          </div>
          <button onClick={() => setIsFullScreen(!isFullScreen)} className="p-1.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-slate-500 dark:text-white hover:text-brand transition-colors shadow-sm">
            {isFullScreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <button
            onClick={() => {
              setFormLesson({ ...formLesson, weekOffset: currentWeekOffset, day: weekDates[0].fullDate });
              setIsNewStudent(false);
              setStudentSearch('');
              setShowAddLesson(true);
            }}
            className="flex-grow md:flex-grow-0 flex items-center justify-center gap-1.5 bg-yellow-500 text-white px-3 py-1.5 rounded-lg font-black text-[8px] uppercase tracking-widest shadow-lg shadow-yellow-500/20 hover:scale-105 transition-all"
          >
            <Plus size={12} /> Nouvelle Séance
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className={`flex-grow ${isFullScreen ? 'overflow-hidden' : 'overflow-auto'} no-scrollbar bg-slate-950 ${isFullScreen ? '' : 'rounded-[45px] border border-slate-800 shadow-sm'}`}>
        <div className={`grid ${isFullScreen ? 'h-full w-full' : 'min-w-[1000px]'} grid-cols-[90px_repeat(7,1fr)]`} style={{ gridTemplateRows: 'auto 1fr' }}>

          <div className="sticky top-0 left-0 z-50 p-3 border-r border-b border-slate-700 flex items-center justify-center bg-slate-900">
            <Clock size={18} className="text-brand opacity-50" />
          </div>

          {weekDates.map(date => {
            const dayLessons = lessons.filter(l => l.day === date.fullDate);
            const isFull = dayLessons.length >= timeSlots.length;
            const isClosed = closedDays.includes(date.name);
            let headerBg = 'bg-green-500 text-white';
            if (isClosed) headerBg = 'bg-slate-400 text-white';
            if (isFull) headerBg = 'bg-red-500 text-white';
            if (date.isToday && !isFull && !isClosed) headerBg = 'bg-green-600 text-white ring-2 ring-yellow-400 ring-inset';
            return (
              <div key={date.fullDate} className={`sticky top-0 z-40 py-3 px-2 text-center border-r border-b border-slate-700 last:border-r-0 ${headerBg}`}>
                <div className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-80">{date.name}</div>
                <div className="text-base font-black leading-tight">{date.formatted}</div>
              </div>
            );
          })}

          {/* Time column */}
          <div className={`sticky left-0 z-30 bg-slate-900 border-r border-slate-700 ${isFullScreen ? 'flex flex-col' : ''}`}>
            {timeSlots.map((time: string, idx: number) => {
              const rowBg = rowColors[idx] || (idx % 2 === 0 ? '#2a3a4a' : '#1f2937');
              return (
                <div key={time} className={`${isFullScreen ? 'flex-1' : 'h-20'} border-b border-slate-700 flex items-center justify-center`} style={{ backgroundColor: rowBg }}>
                  <span className="text-sm font-black text-white italic">{time}</span>
                </div>
              );
            })}
          </div>

          {/* Day columns */}
          {weekDates.map(date => {
            const isClosed = closedDays.includes(date.name);
            return (
              <div key={date.fullDate} className={`border-r border-slate-700 last:border-r-0 ${isFullScreen ? 'flex flex-col' : ''}`}>
                {timeSlots.map((time: string, idx: number) => {
                  const rowBg = rowColors[idx] || (idx % 2 === 0 ? '#2a3a4a' : '#1f2937');
                  const slotLessons = lessons.filter(l => l.day === date.fullDate && l.time === time);
                  const firstLesson = slotLessons[0];
                  const colors = firstLesson ? getTypeColor(firstLesson.type) : null;
                  const isUnavailable = isClosed || isSlotClosed(date.name, time);
                  return (
                    <div
                      key={time}
                      className={`${isFullScreen ? 'flex-1' : 'h-20'} border-b border-slate-700 relative group`}
                      style={{ backgroundColor: isUnavailable ? '#1f2937' : rowBg }}
                    >
                      {isUnavailable ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[13px] font-black uppercase tracking-widest text-slate-500 rotate-45">Fermé</span>
                        </div>
                      ) : (
                        <>
                          {slotLessons.length > 0 && (
                            <div className="absolute inset-1.5 flex flex-col gap-1 overflow-hidden">
                              {slotLessons.slice(0, 2).map((lesson) => {
                                const lessonColor = getTypeColor(lesson.type);
                                return (
                                  <button
                                    key={lesson.id}
                                    type="button"
                                    onClick={() => setSelectedLesson(lesson)}
                                    className="w-full rounded-2xl px-2 py-1 text-left flex items-center gap-2 shadow-sm"
                                    style={{ backgroundColor: lessonColor.bg, border: `1px solid ${lessonColor.border}`, color: lessonColor.icon }}
                                  >
                                    <span className="text-[10px] font-black uppercase tracking-widest">{lesson.type}</span>
                                    <span className="text-[10px] truncate">{getStudentName(lesson.studentId)}</span>
                                  </button>
                                );
                              })}
                              {slotLessons.length > 2 && (
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                                  +{slotLessons.length - 2} autres
                                </div>
                              )}
                            </div>
                          )}
                          <button
                            onClick={() => {
                              setFormLesson({ ...formLesson, day: date.fullDate, time, weekOffset: currentWeekOffset });
                              setIsNewStudent(false);
                              setStudentSearch('');
                              setShowAddLesson(true);
                            }}
                            className="absolute inset-1.5 rounded-xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all border-2 border-dashed border-green-400/40 bg-green-500/10 hover:bg-green-500/20 hover:border-green-400"
                          >
                            <Plus size={isFullScreen ? 14 : 18} className="text-green-400" />
                          </button>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isFullScreen ? (
        <div className="fixed inset-0 z-[10000] bg-white dark:bg-black h-screen w-screen overflow-hidden">{planningContent}</div>
      ) : planningContent}

      {/* LESSON DETAIL POPUP */}
      {selectedLesson && !editingLesson && (
        <div className="fixed inset-0 z-[20000] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-[40px] shadow-2xl border border-slate-100 dark:border-white/10 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 pb-6" style={{ backgroundColor: getTypeColor(selectedLesson.type).bg }}>
              <div className="flex justify-between items-start">
                <div className="p-2 rounded-xl bg-black/10" style={{ color: getTypeColor(selectedLesson.type).icon }}>
                  {getTypeIcon(selectedLesson.type, 22)}
                </div>
                <button onClick={() => setSelectedLesson(null)} className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-all" style={{ color: getTypeColor(selectedLesson.type).icon }}>
                  <X size={16} />
                </button>
              </div>
              <div className="mt-4">
                <div className="text-[10px] font-black uppercase tracking-widest opacity-60" style={{ color: getTypeColor(selectedLesson.type).icon }}>{selectedLesson.type}</div>
                <h2 className="text-2xl font-black uppercase tracking-tight mt-1 leading-tight" style={{ color: getTypeColor(selectedLesson.type).icon }}>
                  {getStudentName(selectedLesson.studentId)}
                </h2>
              </div>
            </div>
            <div className="p-8 space-y-3">
              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl">
                <Clock size={18} className="text-brand shrink-0" />
                <div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Heure</div>
                  <div className="text-sm font-black text-slate-900 dark:text-white">{selectedLesson.time}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl">
                <Calendar size={18} className="text-brand shrink-0" />
                <div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Date</div>
                  <div className="text-sm font-black text-slate-900 dark:text-white">
                    {new Date(selectedLesson.day).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl">
                <User size={18} className="text-brand shrink-0" />
                <div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Moniteur</div>
                  <div className="text-sm font-black text-slate-900 dark:text-white">{getInstructorName(selectedLesson.instructorId)}</div>
                </div>
              </div>
              {getStudentPhone(selectedLesson.studentId) && (
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl">
                  <Phone size={18} className="text-brand shrink-0" />
                  <div>
                    <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Téléphone</div>
                    <div className="text-sm font-black text-slate-900 dark:text-white tracking-widest">{getStudentPhone(selectedLesson.studentId)}</div>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <button onClick={() => setSelectedLesson(null)} className="py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest border-2 border-slate-100 dark:border-white/10 text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                  Fermer
                </button>
                <button onClick={() => setEditingLesson({ ...selectedLesson })} className="py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest bg-brand/10 text-brand hover:bg-brand hover:text-white transition-all flex items-center justify-center gap-1">
                  <Edit2 size={12} /> Modifier
                </button>
                <button onClick={() => handleDeleteLesson(selectedLesson.id)} className="py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-1">
                  <Trash2 size={12} /> Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT LESSON MODAL */}
      {editingLesson && (
        <div className="fixed inset-0 z-[20001] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 w-full max-w-2xl p-10 rounded-[40px] relative shadow-2xl border border-slate-700 animate-in zoom-in-95 duration-200">
            <button onClick={() => setEditingLesson(null)} className="absolute top-6 right-6 text-slate-400 hover:text-yellow-500 transition-colors"><X size={24} /></button>
            <h2 className="text-2xl font-black uppercase italic tracking-tight mb-6 text-white">Modifier la séance</h2>
            <form onSubmit={handleEditLesson} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-green-400 uppercase tracking-widest ml-2">Élève</label>
                <select required value={editingLesson.studentId} onChange={e => setEditingLesson({ ...editingLesson, studentId: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-600 rounded-2xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-green-500 appearance-none cursor-pointer">
                  {store.students.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-green-400 uppercase tracking-widest ml-2">Moniteur</label>
                <select required value={editingLesson.instructorId} onChange={e => setEditingLesson({ ...editingLesson, instructorId: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-600 rounded-2xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-green-500 appearance-none cursor-pointer">
                  {store.instructors.map((i: any) => <option key={i.id} value={i.id}>{i.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-green-400 uppercase tracking-widest ml-2">Type de séance</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(TYPE_COLORS).map(([t, c]) => (
                    <button key={t} type="button" onClick={() => setEditingLesson({ ...editingLesson, type: t as any })}
                      className="py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center justify-center gap-2"
                      style={editingLesson.type === t
                        ? { backgroundColor: c.bg, borderColor: c.border, color: c.icon }
                        : { backgroundColor: '#1e293b', borderColor: '#475569', color: '#94a3b8' }}>
                      <span style={{ color: editingLesson.type === t ? c.icon : '#94a3b8' }}>{getTypeIcon(t, 12)}</span>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-green-400 uppercase tracking-widest ml-2">Jour</label>
                  <select value={editingLesson.day} onChange={e => setEditingLesson({ ...editingLesson, day: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-600 rounded-2xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-green-500">
                    {weekDates.map(d => <option key={d.fullDate} value={d.fullDate}>{d.fullFormatted}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-green-400 uppercase tracking-widest ml-2">Heure</label>
                  <select value={editingLesson.time} onChange={e => setEditingLesson({ ...editingLesson, time: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-600 rounded-2xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-green-500">
                    {timeSlots.map((t: string) => {
                      const editDayName = getDayNameFromDate(editingLesson.day || '');
                      const blocked = isSlotClosed(editDayName, t);
                      return (
                        <option key={t} value={t} disabled={blocked}>
                          {t}{blocked ? ' — Fermé' : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-yellow-500 text-white font-black py-4 rounded-2xl uppercase tracking-[0.2em] text-xs shadow-lg shadow-yellow-500/20 hover:bg-green-600 transition-all flex items-center justify-center gap-2">
                Enregistrer <CheckCircle2 size={18} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADD LESSON MODAL */}
      {showAddLesson && (
        <div className="fixed inset-0 z-[20000] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-slate-900 w-full max-w-2xl p-10 rounded-[40px] relative shadow-2xl border border-slate-700 max-h-[90vh] overflow-y-auto no-scrollbar">
            <button onClick={closeAddModal} className="absolute top-6 right-6 text-slate-400 hover:text-yellow-500 transition-colors"><X size={24} /></button>
            <h2 className="text-2xl font-black uppercase italic tracking-tight mb-6 text-white">Programmer une séance</h2>
            <form onSubmit={handleAddLesson} className="space-y-6">

              {/* ── ÉLÈVE ── */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-green-400 uppercase tracking-widest ml-2">Élève</label>
                  <button
                    type="button"
                    onClick={() => { setIsNewStudent(!isNewStudent); setNewStudentName(''); setNewStudentPhone(''); setStudentSearch(''); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${isNewStudent ? 'bg-yellow-500 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
                  >
                    <UserPlus size={12} />
                    {isNewStudent ? 'Choisir existant' : 'Nouvel élève'}
                  </button>
                </div>

                {isNewStudent ? (
                  <div className="space-y-3 p-4 bg-white/5 rounded-2xl border border-white/10 animate-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-yellow-400 mb-2">
                      <UserPlus size={12} /> Nouveau candidat — sera ajouté à la base de données
                    </div>
                    <input required type="text" placeholder="Nom complet *" value={newStudentName} onChange={e => setNewStudentName(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-600 rounded-2xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-yellow-500 placeholder:text-slate-500" />
                    <input type="tel" placeholder="Téléphone (optionnel)" value={newStudentPhone} onChange={e => setNewStudentPhone(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-600 rounded-2xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-yellow-500 placeholder:text-slate-500" />
                  </div>
                ) : (
                  /* ── SEARCHABLE STUDENT INPUT ── */
                  <div className="relative" ref={studentSearchRef}>
                    <input
                      type="text"
                      placeholder="Rechercher un élève..."
                      value={studentSearch}
                      onChange={e => {
                        setStudentSearch(e.target.value);
                        setStudentDropdownOpen(true);
                        setFormLesson({ ...formLesson, studentId: '' });
                      }}
                      onFocus={() => setStudentDropdownOpen(true)}
                      className="w-full bg-slate-800 border border-slate-600 rounded-2xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-green-500 placeholder:text-slate-500"
                    />

                    {/* Hidden input to enforce required validation */}
                    <input
                      type="text"
                      required
                      value={formLesson.studentId || ''}
                      onChange={() => {}}
                      className="sr-only"
                      tabIndex={-1}
                    />

                    {studentDropdownOpen && (
                      <div className="absolute z-50 mt-2 w-full bg-slate-800 border border-slate-600 rounded-2xl overflow-hidden shadow-2xl max-h-52 overflow-y-auto no-scrollbar">
                        {filteredStudents.length === 0 ? (
                          <div className="px-4 py-4 text-[11px] font-bold text-slate-400 text-center">
                            Aucun élève trouvé
                          </div>
                        ) : (
                          filteredStudents.map((s: any) => (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => {
                                setFormLesson({ ...formLesson, studentId: s.id });
                                setStudentSearch(s.name);
                                setStudentDropdownOpen(false);
                              }}
                              className={`w-full text-left px-4 py-3 text-sm font-bold transition-colors flex items-center gap-3
                                ${formLesson.studentId === s.id
                                  ? 'bg-green-500/20 text-green-400'
                                  : 'text-white hover:bg-white/10'
                                }`}
                            >
                              <div className="w-7 h-7 rounded-full bg-brand/20 text-brand flex items-center justify-center text-[10px] font-black shrink-0">
                                {s.name.charAt(0).toUpperCase()}
                              </div>
                              {s.name}
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ── MONITEUR ── */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-green-400 uppercase tracking-widest ml-2">Moniteur</label>
                <select required value={formLesson.instructorId} onChange={e => setFormLesson({ ...formLesson, instructorId: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-600 rounded-2xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-green-500 appearance-none cursor-pointer">
                  {store.instructors.map((i: any) => <option key={i.id} value={i.id}>{i.name}</option>)}
                </select>
              </div>

              {/* ── TYPE DE SÉANCE ── */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-green-400 uppercase tracking-widest ml-2">Type de séance</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(TYPE_COLORS).map(([t, c]) => (
                    <button key={t} type="button" onClick={() => setFormLesson({ ...formLesson, type: t as any })}
                      className="py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center justify-center gap-2"
                      style={formLesson.type === t
                        ? { backgroundColor: c.bg, borderColor: c.border, color: c.icon }
                        : { backgroundColor: '#1e293b', borderColor: '#475569', color: '#94a3b8' }}>
                      <span style={{ color: formLesson.type === t ? c.icon : '#94a3b8' }}>{getTypeIcon(t, 12)}</span>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── JOUR & HEURE ── */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-green-400 uppercase tracking-widest ml-2">Jour</label>
                  <select value={formLesson.day} onChange={e => setFormLesson({ ...formLesson, day: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-600 rounded-2xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-green-500">
                    {weekDates.map(d => <option key={d.fullDate} value={d.fullDate}>{d.fullFormatted}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-green-400 uppercase tracking-widest ml-2">Heure</label>
                  <select value={formLesson.time} onChange={e => setFormLesson({ ...formLesson, time: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-600 rounded-2xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-green-500">
                  {timeSlots.map((t: string) => {
                    const dayName = getDayNameFromDate(formLesson.day || '');
                    const blocked = isSlotClosed(dayName, t);
                    return (
                      <option key={t} value={t} disabled={blocked}>
                        {t}{blocked ? ' — Fermé' : ''}
                      </option>
                    );
                  })}
                  </select>
                </div>
              </div>

              <button type="submit" className="w-full bg-yellow-500 text-white font-black py-4 rounded-2xl uppercase tracking-[0.2em] text-xs shadow-lg shadow-yellow-500/20 hover:bg-green-600 transition-all flex items-center justify-center gap-2">
                Confirmer <CheckCircle2 size={18} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* NOTIFICATION */}
      {notification && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[30000] animate-in slide-in-from-bottom-5 duration-300">
          <div className={`px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl flex items-center gap-3 border ${
            notification.type === 'success' ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-red-500 text-white border-red-400'
          }`}>
            {notification.type === 'success' ? <CheckCircle2 size={16} /> : <X size={16} />}
            {notification.message}
          </div>
        </div>
      )}
    </>
  );
};

export default Planning;