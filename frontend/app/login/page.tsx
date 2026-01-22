'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun, Mail, Lock, Palmtree, Plane, Waves, Umbrella, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login({ email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Credenciais inválidas');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-gradient-to-br from-[#0B7C8F] via-[#0d8fa5] to-[#4FB6C2]">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#F4A261]/20 rounded-full blur-3xl" />
          
          {/* Wave pattern at bottom */}
          <svg className="absolute bottom-0 left-0 right-0" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="rgba(255,255,255,0.1)" d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,181.3C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          </svg>
          <svg className="absolute bottom-0 left-0 right-0" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="rgba(255,255,255,0.05)" d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,90.7C672,85,768,107,864,128C960,149,1056,171,1152,165.3C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          </svg>
        </div>

        {/* Floating Icons */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[15%] left-[10%] animate-float-slow">
            <Palmtree size={64} className="text-white/30" />
          </div>
          <div className="absolute top-[25%] right-[15%] animate-float-medium">
            <Plane size={48} className="text-white/25 rotate-12" />
          </div>
          <div className="absolute bottom-[35%] left-[20%] animate-float-fast">
            <Umbrella size={40} className="text-[#F4A261]/40" />
          </div>
          <div className="absolute bottom-[25%] right-[25%] animate-float-slow">
            <Waves size={56} className="text-white/20" />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm mb-8 shadow-2xl">
              <Palmtree size={40} className="text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight tracking-tight">
              Gerencie suas<br />
              férias com<br />
              <span className="text-[#F4A261]">tranquilidade</span>
            </h1>
            <p className="text-xl text-white/80 max-w-md leading-relaxed">
              Simplifique a gestão de férias da sua equipa. 
              Solicite, aprove e acompanhe tudo num só lugar.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-5 mt-10">
            {['Calendário visual intuitivo', 'Aprovações em tempo real', 'Controlo total do saldo de dias'].map((feature, i) => (
              <div key={i} className="flex items-center gap-4 text-white/90">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-lg">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col bg-[var(--lbc-bg)]">
        {/* Theme Toggle */}
        <div className="flex justify-end p-8">
          <button
            onClick={toggleTheme}
            className="w-12 h-12 rounded-2xl bg-[var(--lbc-card)] border-2 border-[var(--lbc-border)] hover:border-[var(--lbc-primary)] flex items-center justify-center transition-all hover:scale-105 shadow-sm"
          >
            {theme === 'light' ? <Moon size={22} className="text-[var(--lbc-muted)]" /> : <Sun size={22} className="text-[var(--lbc-muted)]" />}
          </button>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center px-8 lg:px-16 pb-12">
          <div className="w-full max-w-[440px]">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-10">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[#0B7C8F] to-[#4FB6C2] mb-6 shadow-xl">
                <Palmtree size={36} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold text-[var(--lbc-text)]">VacationManager</h1>
            </div>

            {/* Welcome Text */}
            <div className="mb-10">
              <h2 className="text-4xl font-bold text-[var(--lbc-text)] mb-3 tracking-tight">
                Bem-vindo de volta
              </h2>
              <p className="text-lg text-[var(--lbc-muted)]">
                Insira as suas credenciais para continuar
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[var(--lbc-text)] uppercase tracking-wide">
                  Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 w-14 flex items-center justify-center pointer-events-none">
                    <div className="w-10 h-10 rounded-xl bg-[var(--lbc-primary)]/10 flex items-center justify-center group-focus-within:bg-[var(--lbc-primary)] transition-colors">
                      <Mail size={20} className="text-[var(--lbc-primary)] group-focus-within:text-white transition-colors" />
                    </div>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-16 pl-16 pr-5 text-lg bg-[var(--lbc-card)] text-[var(--lbc-text)] border-2 border-[var(--lbc-border)] rounded-2xl placeholder:text-[var(--lbc-muted-light)] transition-all duration-200 focus:outline-none focus:border-[var(--lbc-primary)] focus:shadow-lg focus:shadow-[var(--lbc-primary)]/10"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[var(--lbc-text)] uppercase tracking-wide">
                  Palavra-passe
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 w-14 flex items-center justify-center pointer-events-none">
                    <div className="w-10 h-10 rounded-xl bg-[var(--lbc-primary)]/10 flex items-center justify-center group-focus-within:bg-[var(--lbc-primary)] transition-colors">
                      <Lock size={20} className="text-[var(--lbc-primary)] group-focus-within:text-white transition-colors" />
                    </div>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-16 pl-16 pr-5 text-lg bg-[var(--lbc-card)] text-[var(--lbc-text)] border-2 border-[var(--lbc-border)] rounded-2xl placeholder:text-[var(--lbc-muted-light)] transition-all duration-200 focus:outline-none focus:border-[var(--lbc-primary)] focus:shadow-lg focus:shadow-[var(--lbc-primary)]/10"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-4 p-5 rounded-2xl bg-[var(--status-rejected)]/10 border-2 border-[var(--status-rejected)]/20">
                  <div className="w-10 h-10 rounded-xl bg-[var(--status-rejected)]/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[var(--status-rejected)]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-[var(--status-rejected)] font-medium">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-16 flex items-center justify-center gap-3 text-lg font-bold text-white bg-gradient-to-r from-[#0B7C8F] to-[#4FB6C2] rounded-2xl shadow-xl shadow-[#0B7C8F]/25 hover:shadow-2xl hover:shadow-[#0B7C8F]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Entrar
                    <ArrowRight size={22} />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-[var(--lbc-border)]" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-6 bg-[var(--lbc-bg)] text-[var(--lbc-muted)] font-semibold">
                  Novo por aqui?
                </span>
              </div>
            </div>

            {/* Sign Up Link */}
            <Link
              href="/signup"
              className="flex items-center justify-center gap-3 w-full h-16 text-lg font-bold rounded-2xl border-2 border-[var(--lbc-border)] text-[var(--lbc-text)] bg-[var(--lbc-card)] hover:bg-[var(--lbc-bg-secondary)] hover:border-[var(--lbc-primary)] hover:text-[var(--lbc-primary)] transition-all duration-200"
            >
              Criar uma conta
            </Link>

            {/* Footer */}
            <p className="text-center text-sm text-[var(--lbc-muted)] mt-10">
              © 2026 VacationManager · Desenvolvido por Elton Santos
            </p>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-5deg); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 4s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
