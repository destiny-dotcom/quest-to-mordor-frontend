"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Input } from "@/components/ui";
import { registerSchema, type RegisterFormData } from "@/schemas";
import { register } from "@/lib/api";
import { useAuthStore, useUIStore } from "@/stores";

export function RegisterForm() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const addToast = useUIStore((state) => state.addToast);

  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    display_name: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof RegisterFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof RegisterFormData, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof RegisterFormData;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await register({
        email: formData.email,
        password: formData.password,
        display_name: formData.display_name,
      });
      setAuth(response.user, response.token);
      addToast({ type: "success", message: "Welcome to the fellowship!" });
      router.push("/");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Registration failed";
      addToast({ type: "error", message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Display Name"
        name="display_name"
        type="text"
        placeholder="Frodo Baggins"
        value={formData.display_name}
        onChange={handleChange}
        error={errors.display_name}
        autoComplete="name"
      />

      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="frodo@shire.com"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        autoComplete="email"
      />

      <Input
        label="Password"
        name="password"
        type="password"
        placeholder="Create a strong password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        autoComplete="new-password"
      />

      <Input
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        placeholder="Confirm your password"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        autoComplete="new-password"
      />

      <Button type="submit" className="w-full" isLoading={isLoading}>
        Join the Fellowship
      </Button>

      <p className="text-center text-sm text-text-secondary">
        Already a member?{" "}
        <Link href="/login" className="text-gold hover:text-gold-hover">
          Continue your journey
        </Link>
      </p>
    </form>
  );
}
