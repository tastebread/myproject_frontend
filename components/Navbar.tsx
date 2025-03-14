"use client"; // Next.js App Router에서는 필수

import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext"; //  AuthContext를 가져옴

export default function Navbar() {
  const auth = useContext(AuthContext);
  if (!auth) return null; //  auth가 null이면 렌더링 중지

  const { user, logout } = auth;

  return (
    <nav className="bg-gray-900 text-white p-4">
      <div className="container mx-auto flex justify-between">
        <Link href="/">
          <span className="text-lg font-bold cursor-pointer">게시판</span>
        </Link>
        <div>
          {user ? ( 
            <div className="flex gap-4">
                <Link href="/posts">
                    <span className="bg-gray-500 px-4 py-2 rounded cursor-pointer text-white">
                        게시글 목록
                        </span>
                </Link>
                <Link href="/posts/new">
                    <span className="bg-green-500 px-4 py-2 rounded cursor-pointer">
                        글쓰기
                    </span>
                </Link>
              <span className="text-sm">👤 {user.username}</span>
              <button onClick={logout} className="bg-red-500 px-4 py-2 rounded">
                로그아웃
              </button>
            </div>
          ) : (
            <Link href="/login">
              <span className="bg-blue-500 px-4 py-2 rounded cursor-pointer">
                로그인
              </span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}