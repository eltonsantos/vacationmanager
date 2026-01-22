'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { authApi, setAuthToken } from '@/lib/api';
import { ApiError } from '@/lib/types';
import { Moon, Sun, Mail, Lock, User, Users, Palmtree, Plane, Waves, Umbrella, ArrowLeft, ArrowRight } from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'MANAGER' | 'COLLABORATOR'>('COLLABORATOR');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As palavras-passe não coincidem');
      return;
    }

    if (password.length < 8) {
      setError('A palavra-passe deve ter pelo menos 8 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.signUp({
        fullName,
        email,
        password,
        role,
      });
      setAuthToken(response.token);
      router.push('/');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Erro ao criar conta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex lg:w-[50%] relative overflow-hidden bg-gradient-to-br from-[#F4A261] via-[#e8944f] to-[#0B7C8F]">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#0B7C8F]/30 rounded-full blur-3xl" />
          
          <svg className="absolute bottom-0 left-0 right-0" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="rgba(255,255,255,0.1)" d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,218.7C672,203,768,149,864,138.7C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          </svg>
        </div>

        {/* Floating Icons */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[15%] right-[10%] animate-float-slow">
            <Palmtree size={64} className="text-white/30" />
          </div>
          <div className="absolute top-[30%] left-[15%] animate-float-medium">
            <Plane size={48} className="text-white/25 -rotate-12" />
          </div>
          <div className="absolute bottom-[30%] right-[20%] animate-float-fast">
            <Umbrella size={40} className="text-white/30" />
          </div>
          <div className="absolute bottom-[40%] left-[25%] animate-float-slow">
            <Waves size={56} className="text-white/20" />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm mb-8 shadow-2xl">
              <Users size={40} className="text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight tracking-tight">
              Junte-se à<br />
              nossa<br />
              <span className="text-[#0B7C8F]">equipa</span>
            </h1>
            <p className="text-xl text-white/80 max-w-md leading-relaxed">
              Crie a sua conta e comece a gerir as suas férias 
              de forma simples e organizada.
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-5 mt-10">
            {['Registo gratuito e imediato', '22 dias de férias incluídos', 'Acesso completo às funcionalidades'].map((feature, i) => (
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

      {/* Right Side - Sign Up Form */}
      <div className="flex-1 flex flex-col bg-[var(--lbc-bg)] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 lg:p-8">
          <Link
            href="/login"
            className="flex items-center gap-2 text-sm font-semibold text-[var(--lbc-muted)] hover:text-[var(--lbc-primary)] transition-colors"
          >
            <ArrowLeft size={18} />
            Voltar ao login
          </Link>
          <button
            onClick={toggleTheme}
            className="w-12 h-12 rounded-2xl bg-[var(--lbc-card)] border-2 border-[var(--lbc-border)] hover:border-[var(--lbc-primary)] flex items-center justify-center transition-all hover:scale-105 shadow-sm"
          >
            {theme === 'light' ? <Moon size={22} className="text-[var(--lbc-muted)]" /> : <Sun size={22} className="text-[var(--lbc-muted)]" />}
          </button>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center px-6 lg:px-12 pb-12">
          <div className="w-full max-w-[480px]">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F4A261] to-[#0B7C8F] mb-4 shadow-xl">
                <Palmtree size={32} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-[var(--lbc-text)]">VacationManager</h1>
            </div>

            {/* Welcome Text */}
            <div className="mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-[var(--lbc-text)] mb-3 tracking-tight">
                Criar conta
              </h2>
              <p className="text-lg text-[var(--lbc-muted)]">
                Preencha os dados abaixo para começar
              </p>
            </div>

            {/* Sign Up Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[var(--lbc-text)] uppercase tracking-wide">
                  Nome completo
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 w-14 flex items-center justify-center pointer-events-none">
                    <div className="w-10 h-10 rounded-xl bg-[var(--lbc-primary)]/10 flex items-center justify-center group-focus-within:bg-[var(--lbc-primary)] transition-colors">
                      <User size={20} className="text-[var(--lbc-primary)] group-focus-within:text-white transition-colors" />
                    </div>
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full h-14 pl-16 pr-5 text-base bg-[var(--lbc-card)] text-[var(--lbc-text)] border-2 border-[var(--lbc-border)] rounded-2xl placeholder:text-[var(--lbc-muted-light)] transition-all duration-200 focus:outline-none focus:border-[var(--lbc-primary)] focus:shadow-lg focus:shadow-[var(--lbc-primary)]/10"
                    placeholder="João Silva"
                    required
                  />
                </div>
              </div>

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
                    className="w-full h-14 pl-16 pr-5 text-base bg-[var(--lbc-card)] text-[var(--lbc-text)] border-2 border-[var(--lbc-border)] rounded-2xl placeholder:text-[var(--lbc-muted-light)] transition-all duration-200 focus:outline-none focus:border-[var(--lbc-primary)] focus:shadow-lg focus:shadow-[var(--lbc-primary)]/10"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[var(--lbc-text)] uppercase tracking-wide">
                  Tipo de conta
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRole('COLLABORATOR')}
                    className={`relative p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                      role === 'COLLABORATOR'
                        ? 'border-[var(--lbc-primary)] bg-[var(--lbc-primary)]/5 shadow-lg shadow-[var(--lbc-primary)]/10'
                        : 'border-[var(--lbc-border)] bg-[var(--lbc-card)] hover:border-[var(--lbc-muted)]'
                    }`}
                  >
                    {role === 'COLLABORATOR' && (
                      <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[var(--lbc-primary)] flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    <div className={`w-12 h-12 rounded-xl mb-3 flex items-center justify-center ${
                      role === 'COLLABORATOR' ? 'bg-[var(--lbc-primary)]' : 'bg-[var(--lbc-bg-secondary)]'
                    }`}>
                      <User size={24} className={role === 'COLLABORATOR' ? 'text-white' : 'text-[var(--lbc-muted)]'} />
                    </div>
                    <p className="font-bold text-[var(--lbc-text)]">Colaborador</p>
                    <p className="text-sm text-[var(--lbc-muted)] mt-1">Solicitar férias</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('MANAGER')}
                    className={`relative p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                      role === 'MANAGER'
                        ? 'border-[var(--lbc-primary)] bg-[var(--lbc-primary)]/5 shadow-lg shadow-[var(--lbc-primary)]/10'
                        : 'border-[var(--lbc-border)] bg-[var(--lbc-card)] hover:border-[var(--lbc-muted)]'
                    }`}
                  >
                    {role === 'MANAGER' && (
                      <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[var(--lbc-primary)] flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    <div className={`w-12 h-12 rounded-xl mb-3 flex items-center justify-center ${
                      role === 'MANAGER' ? 'bg-[var(--lbc-primary)]' : 'bg-[var(--lbc-bg-secondary)]'
                    }`}>
                      <Users size={24} className={role === 'MANAGER' ? 'text-white' : 'text-[var(--lbc-muted)]'} />
                    </div>
                    <p className="font-bold text-[var(--lbc-text)]">Gestor</p>
                    <p className="text-sm text-[var(--lbc-muted)] mt-1">Gerir equipa</p>
                  </button>
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[var(--lbc-text)] uppercase tracking-wide">
                    Palavra-passe
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center pointer-events-none">
                      <div className="w-8 h-8 rounded-lg bg-[var(--lbc-primary)]/10 flex items-center justify-center group-focus-within:bg-[var(--lbc-primary)] transition-colors">
                        <Lock size={16} className="text-[var(--lbc-primary)] group-focus-within:text-white transition-colors" />
                      </div>
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-14 pl-14 pr-4 text-base bg-[var(--lbc-card)] text-[var(--lbc-text)] border-2 border-[var(--lbc-border)] rounded-2xl placeholder:text-[var(--lbc-muted-light)] transition-all duration-200 focus:outline-none focus:border-[var(--lbc-primary)] focus:shadow-lg focus:shadow-[var(--lbc-primary)]/10"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[var(--lbc-text)] uppercase tracking-wide">
                    Confirmar
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center pointer-events-none">
                      <div className="w-8 h-8 rounded-lg bg-[var(--lbc-primary)]/10 flex items-center justify-center group-focus-within:bg-[var(--lbc-primary)] transition-colors">
                        <Lock size={16} className="text-[var(--lbc-primary)] group-focus-within:text-white transition-colors" />
                      </div>
                    </div>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full h-14 pl-14 pr-4 text-base bg-[var(--lbc-card)] text-[var(--lbc-text)] border-2 border-[var(--lbc-border)] rounded-2xl placeholder:text-[var(--lbc-muted-light)] transition-all duration-200 focus:outline-none focus:border-[var(--lbc-primary)] focus:shadow-lg focus:shadow-[var(--lbc-primary)]/10"
                      placeholder="••••••••"
                      required
                    />
                  </div>
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
                className="w-full h-16 flex items-center justify-center gap-3 text-lg font-bold text-white bg-gradient-to-r from-[#F4A261] to-[#0B7C8F] rounded-2xl shadow-xl shadow-[#F4A261]/25 hover:shadow-2xl hover:shadow-[#F4A261]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Criar conta
                    <ArrowRight size={22} />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <p className="text-center text-sm text-[var(--lbc-muted)] mt-8">
              Ao criar uma conta, você concorda com os nossos termos de serviço.
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
