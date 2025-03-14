"use client"; //  App Router에서는 필수

import { useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export default function LoginPage() {
  const auth = useContext(AuthContext);
  if (!auth) return null; //  auth가 null이면 렌더링 중지

  const { login } = auth;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    login(email, password);
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">로그인</h2>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full mb-4 rounded"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full mb-4 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded">
          로그인
        </button>
      </form>
    </div>
  );
}