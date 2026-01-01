"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores";
import { LoadingScreen } from "@/components/ui";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, setLoading } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    setLoading(false);
  }, [setLoading]);

  useEffect(() => {
    if (isHydrated && !isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isHydrated, isLoading, isAuthenticated, router]);

  if (!isHydrated || isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
