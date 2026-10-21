import React, { useState } from 'react';
import { useSite } from '../../context/SiteContext.tsx';
import { useRouter, Link } from '../../context/RouterContext.tsx';
import { ShieldCheck, Lock, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { loginAdmin, isAdmin, showNotification } = useSite();
  const { navigate } = useRouter();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in, redirect to dashboard
  if (isAdmin) {
    navigate('/admin/dashboard');
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password.trim()) {
      setError('Please enter the administrator password.');
      return;
    }

    setLoading(true);
    try {
      await loginAdmin(password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid administrator password.');
      showNotification('error', err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-navy-950 border border-navy-800 rounded-3xl p-8 shadow-2xl text-white space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-navy-900 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold font-display text-white">
            Shri Goyal Associates
          </h1>
          <p className="text-xs text-amber-400 font-semibold tracking-wider uppercase">
            Administrative Portal · Mathura
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Administrator Master Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter password..."
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-3.5 pr-10 py-3 text-sm bg-navy-900 border border-navy-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-navy-950 font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Access Admin Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Fill & Safe First-Admin setup */}
        <div className="p-4 rounded-xl bg-navy-900/90 border border-amber-500/30 text-xs text-slate-300 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-amber-400">Direct Master Access:</span>
            <span className="text-[10px] bg-navy-950 px-2 py-0.5 rounded text-slate-400 border border-navy-800">No Typing Needed</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Default master password is set to <code className="text-amber-300 font-mono bg-navy-950 px-1 py-0.5 rounded border border-navy-800">GoyalAdmin@2026</code>.
          </p>
          <button
            type="button"
            onClick={async () => {
              setPassword('GoyalAdmin@2026');
              setLoading(true);
              try {
                await loginAdmin('GoyalAdmin@2026');
                navigate('/admin/dashboard');
              } catch (err: any) {
                setError(err.message || 'Authentication failed');
              } finally {
                setLoading(false);
              }
            }}
            className="w-full py-2 px-3 rounded-lg bg-navy-800 hover:bg-navy-700 text-amber-300 hover:text-white border border-amber-500/40 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-xs"
          >
            <span>⚡ 1-Click Sign In (Instant Access)</span>
          </button>
        </div>

        <div className="pt-2 text-center">
          <Link
            to="/"
            className="text-xs text-slate-400 hover:text-amber-400 transition-colors"
          >
            ← Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
};
