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
          <p className="mt-8 text-center text-sm text-muted-foreground">
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

      {/* Right Column - Visual */}
      <aside
        className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 items-center justify-center p-12"
        aria-hidden="true"
      >
        <div className="max-w-lg text-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8">
            <Calendar className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Gerencie as férias da sua equipe
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Simplifique o processo de solicitação e aprovação de férias.
            Acompanhe períodos, gerencie equipes e mantenha tudo organizado
            em um só lugar.
          </p>

          {/* Feature Cards */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { label: "Solicitações", value: "Fáceis" },
              { label: "Aprovações", value: "Rápidas" },
              { label: "Relatórios", value: "Claros" },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-card rounded-lg p-4 shadow-sm border border-border"
              >
                <div className="text-lg font-semibold text-primary">{item.value}</div>
                <div className="text-sm text-muted-foreground">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
