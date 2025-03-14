"use client";

import { useState, useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import { api } from "@/utils/api";
import { useRouter } from "next/navigation";

export default function NewPostPage() {
  const auth = useContext(AuthContext);
  const router = useRouter();

  // useEffect를 사용하여 리디렉트 실행
  useEffect(() => {
    if (!auth?.token) {
      router.push("/login");
    }
  }, [auth?.token, router]);

  if (!auth?.token) return null; //  렌더링 방지

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      await api.post(
        "/posts/",
        { title, content },
        { headers: {
            "Content-Type": "multipart/form-data", // 이미지타입 포함
            Authorization: `Bearer ${auth.token}` } }
      );
      router.push("/posts");
    } catch (err) {
      setError("게시글 작성 실패. 다시 시도해주세요.");
      console.error(err);
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4">새 게시글 작성</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full mb-4 rounded"
        />
        <textarea
          placeholder="내용을 입력하세요..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-2 w-full mb-4 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded">
          게시글 작성
        </button>
      </form>
    </div>
  );
}