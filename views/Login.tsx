import { useState, type FC, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowRight, Loader2, User, Lock } from 'lucide-react';
import { Logo } from '../components/Logo';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';

interface LoginProps {
  onLogin: (status: boolean) => void;
}

const Login: FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const email = `${username.trim().toLowerCase()}@yebda.local`;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin(true);
      navigate('/dashboard');
    } catch (err: any) {
      setError('Identifiants incorrects. Veuillez réessayer.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#222831]">
      <div className="max-w-md w-full bg-[#393E46] border border-[#EEEEEE]/5 p-12 rounded-xl shadow-2xl">
        <div className="text-center mb-12">
          <Logo className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-3xl font-black uppercase text-[#EEEEEE]">Espace Pro</h1>
          <p className="text-zinc-500 font-bold mt-2">Administration Yebda Auto-École</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-md text-red-500 text-xs font-black flex items-center gap-2 uppercase tracking-tight">
              <ShieldAlert size={16} /> {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#00ADB5] uppercase tracking-widest px-1">Nom d'utilisateur</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#222831] border border-[#EEEEEE]/5 rounded-md pl-11 pr-5 py-4 focus:outline-none focus:border-[#00ADB5] transition-all font-bold text-[#EEEEEE] placeholder:text-zinc-600"
                placeholder="admin"
                required
                autoComplete="username"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#00ADB5] uppercase tracking-widest px-1">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#222831] border border-[#EEEEEE]/5 rounded-md pl-11 pr-5 py-4 focus:outline-none focus:border-[#00ADB5] transition-all font-bold text-[#EEEEEE] placeholder:text-zinc-600"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00ADB5] hover:bg-[#00ADB5]/90 text-[#222831] font-black py-5 rounded-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 uppercase tracking-[0.2em]"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <>Connexion <ArrowRight size={18} /></>}
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-[#222831] text-center">
          <a href="/" className="text-zinc-500 hover:text-[#00ADB5] text-xs font-black uppercase tracking-widest transition-colors">
            Retour au Site Public
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
