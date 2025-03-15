"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/utils/api";
import { AuthContext } from "@/context/AuthContext";

export default function EditPostPage() {
  const { id } = useParams();
  const router = useRouter();
  const auth = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await api.get(`/posts/${id}/`);
        setTitle(res.data.title);
        setContent(res.data.content);
      } catch (error) {
        setError("게시글을 불러오는 중 오류가 발생했습니다.");
      }
    }
    if (id) fetchPost();
  }, [id]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      await api.put(
        `/posts/${id}/`,
        { title, content },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      router.push(`/posts/${id}`); //  수정 후 해당 게시글로 이동
    } catch (err) {
      setError("게시글 수정 실패. 다시 시도해주세요.");
      console.error(err);
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4">게시글 수정</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full mb-4 rounded"
          required
        />
        <textarea
          placeholder="내용을 입력하세요..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-2 w-full mb-4 rounded"
          required
        />
        <button type="submit" className="bg-green-500 text-white p-2 w-full rounded">
          수정하기
        </button>
      </form>
    </div>
  );
}