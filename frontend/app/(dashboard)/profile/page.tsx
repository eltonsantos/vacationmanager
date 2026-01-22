"use client";

import { useState, useEffect } from "react";
import { User, Mail, Shield, Lock, Eye, EyeOff, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/contexts/AuthContext";
import { authApi } from "@/lib/api";
import { Role } from "@/lib/types";

export default function ProfilePage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Profile form
  const [name, setName] = useState("");

  // Password form
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    // Load profile from backend
    const loadProfile = async () => {
      try {
        const profile = await authApi.getProfile();
        setName(profile.fullName);
      } catch {
        // Fallback to email name if profile fetch fails
        if (user) {
          const emailName = user.email.split("@")[0];
          setName(emailName.charAt(0).toUpperCase() + emailName.slice(1));
        }
      }
    };
    
    if (user) {
      loadProfile();
    }
  }, [user]);

  const getRoleLabel = (role: Role) => {
    const labels: Record<Role, string> = {
      [Role.ADMIN]: "Administrador",
      [Role.MANAGER]: "Gestor",
      [Role.COLLABORATOR]: "Colaborador",
    };
    return labels[role] || role;
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const updatedProfile = await authApi.updateProfile({ fullName: name });
      setName(updatedProfile.fullName);
      setSuccess("Perfil atualizado com sucesso!");
    } catch {
      setError("Erro ao atualizar perfil");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (newPassword.length < 8) {
      setError("A nova senha deve ter pelo menos 8 caracteres");
      return;
    }

    setIsLoading(true);

    try {
      await authApi.changePassword({
        currentPassword,
        newPassword,
      });
      setSuccess("Senha alterada com sucesso!");
      setShowPasswordForm(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setError("Senha atual incorreta ou erro ao alterar senha");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Meu Perfil</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie suas informações pessoais
        </p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="p-4 rounded-lg bg-[hsl(var(--success))]/10 border border-[hsl(var(--success))]/20">
          <p className="text-sm text-[hsl(var(--success))]">{success}</p>
        </div>
      )}
      {error && (
        <div className="p-4 rounded-lg bg-[hsl(var(--destructive))]/10 border border-[hsl(var(--destructive))]/20">
          <p className="text-sm text-[hsl(var(--destructive))]">{error}</p>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary))]/80 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-2xl font-bold text-white border-4 border-white/30">
              {name.substring(0, 2).toUpperCase()}
            </div>
            <div className="text-white">
              <h2 className="text-xl font-semibold">{name}</h2>
              <p className="text-white/80">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSaveProfile} className="p-6 space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              Nome
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
            />
          </div>

          {/* Email (Read-only) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              Email
              <span className="text-xs text-muted-foreground">(não editável)</span>
            </label>
            <Input
              value={user.email}
              disabled
              className="bg-[hsl(var(--muted))] cursor-not-allowed"
            />
          </div>

          {/* Role (Read-only) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              Função
              <span className="text-xs text-muted-foreground">(não editável)</span>
            </label>
            <Input
              value={getRoleLabel(user.role)}
              disabled
              className="bg-[hsl(var(--muted))] cursor-not-allowed"
            />
          </div>

          {/* Save Button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Salvar Alterações
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Change Password Card */}
      <div className="bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] overflow-hidden">
        <div className="p-6 border-b border-[hsl(var(--border))]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--primary))]/10">
                <Lock className="h-5 w-5 text-[hsl(var(--primary))]" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Alterar Senha</h3>
                <p className="text-sm text-muted-foreground">
                  Atualize sua senha de acesso
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowPasswordForm(!showPasswordForm)}
            >
              {showPasswordForm ? "Cancelar" : "Alterar"}
            </Button>
          </div>
        </div>

        {showPasswordForm && (
          <form onSubmit={handleChangePassword} className="p-6 space-y-4">
            {/* Current Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Senha Atual
              </label>
              <div className="relative">
                <Input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Digite sua senha atual"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Nova Senha
              </label>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Confirmar Nova Senha
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a nova senha"
                required
              />
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Alterando...
                </>
              ) : (
                "Alterar Senha"
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
