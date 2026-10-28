import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ArrowLeft, ShieldCheck, Eye, EyeOff, LogIn } from 'lucide-react';
import { mockUsers } from '../mocks/data';
import '../components/public/Public.css';

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) {
      navigate('/dashboard');
    } else {
      setError('Invalid email or password.');
    }
  };

  const quickLogin = async (userEmail: string) => {
    setEmail(userEmail);
    setPassword('password');
    const ok = await login(userEmail, 'password');
    if (ok) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-[42%] bg-brand-900 flex-col justify-between p-10 login-media">
        <Link to="/" className="flex items-center gap-3 hover:opacity-90">
          <img className="w-10 h-10 rounded-lg object-contain" src="/media/samanvay-logo.png" alt="Samanvay" />
          <div>
            <p className="text-white font-bold">Samanvay</p>
            <p className="text-brand-300 text-xs">Integrated Complaint Monitoring</p>
          </div>
        </Link>

        <div>
          <h2 className="text-3xl font-bold text-white leading-snug mb-4">
            Integrated Complaint<br />Monitoring Dashboard
          </h2>
          <p className="text-brand-300 text-sm leading-relaxed mb-8">
            A single-window platform for authorised AICTE officials to track, coordinate, and resolve institution-related complaints across Regulation Bureau, PGRC, and Regional Offices.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              ['25+', 'Institutions'],
              ['200+', 'Complaints'],
              ['4', 'Overlap Groups'],
              ['3', 'Active Bureaus'],
            ].map(([val, label]) => (
              <div key={label} className="bg-brand-800 rounded-lg p-3">
                <p className="text-white text-2xl font-bold">{val}</p>
                <p className="text-brand-300 text-xs">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <Link to="/" className="inline-flex items-center gap-2 text-sm text-brand-300 hover:text-white">
          <ArrowLeft size={15} /> Back to the public website
        </Link>
      </div>

      {/* Right panel – login form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center justify-between mb-6">
            <span className="flex items-center gap-2">
              <ShieldCheck size={22} className="text-brand-700" />
              <span className="text-brand-700 font-bold">Samanvay</span>
            </span>
            <Link to="/" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand-700">
              <ArrowLeft size={15} /> Public website
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-slate-800 mb-1">Sign in</h1>
          <p className="text-sm text-slate-500 mb-6">Sign in with your authorized account</p>

          {error && (
            <div className="alert-banner-error mb-4" role="alert">
              {error}
            </div>
          )}

          <form id="login-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="form-label">Email address</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="officer@aicte.gov.in"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="login-password" className="form-label">Password</label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  id="btn-toggle-password"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              id="btn-login"
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center"
            >
              {loading ? (
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
              ) : (
                <LogIn size={15} />
              )}
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          {/* Quick login cards */}
          <div className="mt-6">
            <p className="text-xs font-medium text-slate-500 mb-3">Available accounts</p>
            <div className="space-y-2">
              {mockUsers.map((u) => (
                <button
                  key={u.id}
                  id={`quick-login-${u.id}`}
                  onClick={() => quickLogin(u.email)}
                  className="w-full text-left flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-brand-300 hover:bg-brand-50 transition-all group"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold text-sm shrink-0 group-hover:bg-brand-200 transition-colors">
                    {u.full_name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">{u.full_name}</p>
                    <p className="text-xs text-slate-400 truncate">{u.email}</p>
                  </div>
                  <span className="ml-auto text-2xs text-brand-600 font-medium shrink-0">
                    {u.role.replace('_', ' ')}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
