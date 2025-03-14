"use client"; // ✅ App Router에서 context 사용하려면 필요

import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/utils/api";

interface AuthContextType {
  user: {id: number} | null;
  token: string | null;
  login: (email: string, password: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    }
  }, []);

  async function fetchUser(token: string) {
    try {
      console.log("사용자 정보 요청: /accounts/profile/");
      const res = await api.get("/accounts/profile/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("사용자 정보 응답:", res.data);
      setUser(res.data);
    } catch (error) {
      console.error("사용자 정보를 불러오지 못했습니다.", error);
    }
  }

  async function login(email: string, password: string) {
    try {
      const res = await api.post("/accounts/login/", { email, password });
      localStorage.setItem("token", res.data.access);
      setToken(res.data.access);
      fetchUser(res.data.access);
      router.push("/");
    } catch (error) {
      console.error("로그인 실패", error);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    router.push("/login");
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}