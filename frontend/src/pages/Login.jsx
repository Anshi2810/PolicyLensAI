import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { API_BASE } from '../lib/utils';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (emailStr) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email format.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok && data.access_token) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('role', data.user.role);
        navigate('/dashboard');
      } else if (data.code === 'USER_NOT_FOUND') {
        navigate('/signup', { state: { email } });
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[15%] left-[10%] w-72 h-72 rounded-full bg-indigo-500/10 dark:bg-indigo-500/15 blur-[100px] animate-drift" />
        <div className="absolute bottom-[20%] right-[10%] w-96 h-96 rounded-full bg-teal-400/10 dark:bg-teal-500/15 blur-[120px] animate-drift-delay" />
        <div className="absolute top-[40%] left-[45%] w-80 h-80 rounded-full bg-purple-500/5 dark:bg-purple-500/10 blur-[90px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8 md:p-10 shadow-2xl border border-white/20 dark:border-slate-800/50">
          <div className="flex flex-col items-center mb-8">
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.05 }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-teal-400 flex items-center justify-center shadow-glow mb-4"
            >
              <Shield className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-2xl md:text-3xl font-extrabold font-heading bg-gradient-to-r from-indigo-500 via-purple-500 to-teal-500 bg-clip-text text-transparent">PolicyLens AI</h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">Secure Portal Authentication</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3.5 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-xl text-xs text-rose-600 dark:text-rose-400 text-center font-bold"
              >
                {error}
              </motion.div>
            )}
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-sm"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-sm"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Secure Access'}
              {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </motion.button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200/40 dark:border-slate-800/40 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">
              Don't have an account?{' '}
              <Link to="/signup" className="text-indigo-500 hover:text-indigo-600 font-bold hover:underline transition-colors">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
