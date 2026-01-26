"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/types";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchProfile = async (): Promise<User | null> => {
    try {
      const { data } = await api.get<User>("/auth/profile");
      setUser(data);
      return data;
    } catch (error) {
      console.error("Failed to fetch profile", error);
      logout();
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchProfile();
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (token: string) => {
    localStorage.setItem("token", token);
    // Set cookie for middleware
    document.cookie = `token=${token}; path=/; max-age=86400`; // 1 day
    const currentUser = await fetchProfile();
    const path = (currentUser?.role === "ADMIN" || currentUser?.role === "EMPLOYEE") ? "/admin" : "/dashboard";
    window.location.href = path; // Force full page reload to ensure user state is loaded
    toast.success("Zalogowano pomyślnie!");
  };

  const logout = () => {
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setUser(null);
    router.push("/login");
    toast.info("Wylogowano.");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};