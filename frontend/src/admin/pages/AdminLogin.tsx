import { useState, FormEvent } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const { admin, login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary font-heading text-xl">Loading...</div>
      </div>
    );
  }

  if (admin) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login gagal. Periksa email dan password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex relative overflow-hidden">
      {/* Noise texture overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] z-50">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/>
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" opacity="1"/>
        </svg>
      </div>

      {/* Left Side - Premium Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-16 bg-background overflow-hidden">
        {/* Animated circuit pattern background */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="circuit-login" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                <path d="M 20 60 H 50 V 30 H 70 V 60 H 100" stroke="currentColor" fill="none" strokeWidth="0.5" />
                <path d="M 60 20 V 50 H 90 V 70 H 60 V 100" stroke="currentColor" fill="none" strokeWidth="0.5" />
                <circle cx="50" cy="60" r="2" fill="currentColor" />
                <circle cx="70" cy="60" r="2" fill="currentColor" />
                <circle cx="60" cy="50" r="2" fill="currentColor" />
                <circle cx="60" cy="70" r="2" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit-login)" className="text-foreground" />
          </svg>
        </div>

        {/* Top Content */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-3 mb-8">
            <div className="w-14 h-14 bg-card border border-border rounded-sm flex items-center justify-center">
              <div className="w-7 h-7 border-[3px] border-primary rounded-sm" />
            </div>
            <div>
              <h1 className="text-4xl font-heading font-bold text-foreground tracking-tight leading-none">
                RYNVLABS
              </h1>
            </div>
          </div>
          
          <div className="max-w-lg space-y-4">
            <h2 className="text-5xl font-heading font-bold text-foreground leading-[1.1] tracking-tight">
              Admin Dashboard
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed font-light">
              Kelola konten, proyek, dan semua aspek platform RYNVLABS dari satu tempat yang powerful.
            </p>
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="relative z-10">
          <p className="text-muted-foreground text-sm font-light tracking-wide">
            Menjembatani Logika Digital dengan Realitas Fisik
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16 relative bg-black">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-sm flex items-center justify-center border border-primary/20">
                <div className="w-5 h-5 border-2 border-primary rounded-sm" />
              </div>
              <h1 className="text-3xl font-heading font-bold text-foreground tracking-tight">
                RYNVLABS
              </h1>
            </div>
            <p className="text-muted-foreground text-sm">Admin Dashboard</p>
          </div>

          {/* Form Header */}
          <div className="mb-10">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-3 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-muted-foreground font-light">
              Masuk ke akun admin Anda
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-sm px-4 py-3.5 mb-8">
              <div className="flex items-start gap-3">
                <span className="text-destructive text-lg leading-none mt-0.5">⚠</span>
                <p className="text-destructive text-sm leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label 
                htmlFor="email" 
                className="block font-heading font-semibold text-foreground tracking-wide uppercase text-xs"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                className="w-full px-4 py-3.5 bg-card border border-border rounded-sm text-foreground
                  placeholder:text-muted-foreground/50
                  focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50
                  transition-all duration-200 font-body"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label 
                htmlFor="password" 
                className="block font-heading font-semibold text-foreground tracking-wide uppercase text-xs"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3.5 bg-card border border-border rounded-sm text-foreground
                  placeholder:text-muted-foreground/50
                  focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50
                  transition-all duration-200 font-body"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-primary-foreground py-4 rounded-sm
                font-heading font-semibold text-sm tracking-wide uppercase
                hover:bg-primary/90 
                focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                shadow-lg shadow-primary/20"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-muted-foreground/60 text-xs mt-10 font-light">
            &copy; {new Date().getFullYear()} Rynvlabs. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
