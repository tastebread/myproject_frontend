"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { useParams } from "next/navigation";

// 게시글 타입 정의
interface Post {
  id: number;
  title: string;
  content: string;
}

export default function PostDetailPage() {
  const { id } = useParams(); // URL에서 id 가져오기
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await api.get(`/posts/${id}/`);
        setPost(res.data);
      } catch (error) {
        setError("게시글을 불러오는 중 오류가 발생했습니다.");
        console.error(" 게시글 불러오기 실패:", error);
      }
    }
    if (id) fetchPost();
  }, [id]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!post) return <p>게시글을 불러오는 중...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-600">{post.content}</p>
    </div>
  );
}