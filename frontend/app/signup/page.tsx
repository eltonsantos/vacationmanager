"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail, User } from "lucide-react";
import { z } from "zod";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { FormInput } from "@/components/auth/FormInput";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { PasswordStrength } from "@/components/auth/PasswordStrength";
import { RoleSelector } from "@/components/auth/RoleSelector";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { authApi, setAuthToken } from "@/lib/api";
import { Role } from "@/lib/types";

const signupSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
  confirmPassword: z.string(),
  role: z.nativeEnum(Role, { message: "Selecione um tipo de conta" }),
  acceptTerms: z.boolean().refine((val) => val === true, { message: "Você deve aceitar os termos" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: undefined,
      acceptTerms: false,
    },
  });

  const password = watch("password");
  const role = watch("role");
  const acceptTerms = watch("acceptTerms");

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await authApi.signUp({
        fullName: data.name,
        email: data.email,
        password: data.password,
        role: data.role as 'MANAGER' | 'COLLABORATOR',
      });
      setAuthToken(response.token);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar conta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Criar sua conta"
      subtitle="Preencha os dados abaixo para começar"
      altLink={{
        text: "Já tem uma conta?",
        linkText: "Entrar",
        href: "/login",
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
        noValidate
      >
        <div className="bg-amber-50 border border-amber-300 text-amber-800 px-4 py-3 rounded-lg flex items-start gap-2">
          <span className="text-lg">&#9888;</span>
          <p className="text-sm">
            <strong>Aviso:</strong> O registro de novas contas através desta página ainda não está disponível. 
            Por favor, contacte o administrador do sistema.
          </p>
        </div>

        <FormInput
          label="Nome completo"
          type="text"
          placeholder="Seu nome"
          autoComplete="name"
          required
          leftIcon={<User className="h-4 w-4" />}
          error={errors.name?.message}
          {...register("name")}
        />

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
          <Label htmlFor="signup-password" className="text-sm font-medium">
            Senha
            <span className="text-destructive ml-1">*</span>
          </Label>
          <PasswordInput
            id="signup-password"
            placeholder="Mínimo 8 caracteres"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
          <PasswordStrength password={password} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password" className="text-sm font-medium">
            Confirmar senha
            <span className="text-destructive ml-1">*</span>
          </Label>
          <PasswordInput
            id="confirm-password"
            placeholder="Repita a senha"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Tipo de conta
            <span className="text-destructive ml-1">*</span>
          </Label>
          <RoleSelector
            value={role}
            onChange={(value) => setValue("role", value, { shouldValidate: true })}
            error={errors.role?.message}
          />
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="accept-terms"
            checked={acceptTerms}
            onCheckedChange={(checked) => setValue("acceptTerms", checked === true, { shouldValidate: true })}
            className="mt-0.5"
          />
          <div className="grid gap-1.5 leading-none">
            <Label
              htmlFor="accept-terms"
              className="text-sm font-normal text-muted-foreground cursor-pointer"
            >
              Eu concordo com os{" "}
              <Link href="#" className="text-primary hover:underline">
                Termos de Uso
              </Link>{" "}
              e{" "}
              <Link href="#" className="text-primary hover:underline">
                Política de Privacidade
              </Link>
            </Label>
            {errors.acceptTerms && (
              <p className="text-sm text-destructive">{errors.acceptTerms.message}</p>
            )}
          </div>
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
              Criando conta...
            </>
          ) : (
            "Criar conta"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
