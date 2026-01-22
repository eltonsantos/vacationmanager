"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Loader2, Mail } from "lucide-react";
import { z } from "zod";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { FormInput } from "@/components/auth/FormInput";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const rememberMe = watch("rememberMe");

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError("");

    try {
      await login({ email: data.email, password: data.password });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Credenciais inválidas");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Bem-vindo de volta"
      subtitle="Entre com sua conta para acessar o sistema"
      altLink={{
        text: "Não tem uma conta?",
        linkText: "Criar conta",
        href: "/signup",
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
        noValidate
      >
        <FormInput
          label="Email"
          type="email"
          placeholder="seu@email.com"
          autoComplete="email"
          required
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register("email")}
        />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium">
              Senha
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Link
              href="#"
              className="text-sm text-primary hover:text-primary/80"
            >
              Esqueceu a senha?
            </Link>
          </div>
          <PasswordInput
            id="password"
            placeholder="••••••••"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember-me"
            checked={rememberMe}
            onCheckedChange={(checked) => setValue("rememberMe", checked === true)}
          />
          <Label
            htmlFor="remember-me"
            className="text-sm font-normal text-muted-foreground cursor-pointer"
          >
            Lembrar-me por 30 dias
          </Label>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Entrando...
            </>
          ) : (
            "Entrar"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
