"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Calendar } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  altLink: {
    text: string;
    linkText: string;
    href: string;
  };
}

export function AuthLayout({ children, title, subtitle, altLink }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Column - Form */}
      <main className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:w-1/2 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:max-w-md animate-fade-in">
          {/* Logo */}
          <header className="mb-8">
            <Link
              href="/"
              className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
            >
              <Calendar className="h-8 w-8" />
              <span className="text-xl font-semibold">VacationManager</span>
            </Link>

            <h1 className="mt-8 text-3xl font-semibold tracking-tight text-foreground">
              {title}
            </h1>
            <p className="mt-2 text-muted-foreground">{subtitle}</p>
          </header>

          {/* Form */}
          <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
            {children}
          </div>

          {/* Alt Link */}
          <p className="hidden mt-8 text-center text-sm text-muted-foreground">
            {altLink.text}{" "}
            <Link
              href={altLink.href}
              className="font-medium text-primary hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
            >
              {altLink.linkText}
            </Link>
          </p>
        </div>
      </main>

      {/* Right Column - Visual with Gradient Background */}
      <aside
        className="hidden lg:flex lg:flex-1 relative overflow-hidden"
        aria-hidden="true"
      >
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B7C8F] via-[#0d8fa5] to-[#4FB6C2]" />
        
        {/* Decorative Waves */}
        <svg
          className="absolute bottom-0 left-0 right-0 text-white/10"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          style={{ height: "40%" }}
        >
          <path
            fill="currentColor"
            d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
        <svg
          className="absolute bottom-0 left-0 right-0 text-white/5"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          style={{ height: "50%" }}
        >
          <path
            fill="currentColor"
            d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,106.7C672,117,768,171,864,181.3C960,192,1056,160,1152,144C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>

        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-40 right-20 w-48 h-48 bg-white/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/5 rounded-full blur-lg animate-pulse" style={{ animationDelay: "2s" }} />

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center w-full p-12">
          <div className="max-w-md text-center text-white animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="mx-auto w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-8">
              <Calendar className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Gerencie as férias da sua equipe
            </h2>
            <p className="text-white/80 text-lg leading-relaxed">
              Simplifique o processo de solicitação e aprovação de férias.
              Acompanhe períodos e mantenha tudo organizado.
            </p>

            {/* Feature Cards */}
            <div className="mt-10 grid grid-cols-3 gap-4">
              {[
                { label: "Solicitações", value: "Fáceis" },
                { label: "Aprovações", value: "Rápidas" },
                { label: "Relatórios", value: "Claros" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                >
                  <div className="text-xl font-bold text-white">{item.value}</div>
                  <div className="text-sm text-white/70">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
