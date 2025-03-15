"use client";

import { useEffect, useState,useContext } from "react";
import { api } from "@/utils/api";
import { AuthContext } from "@/context/AuthContext";
import Link from "next/link"; // 추가

// post 타입 정의
interface Post {
    id: number;
    title: string;
    content: string;
    likes_count: number;
    bookmarks_count: number;
    author_id: number;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const auth = useContext(AuthContext);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const headers = auth?.token ? { Authorization: `Bearer ${auth.token}` } : {};
        const res = await api.get("/posts/", { headers });
        setPosts(res.data);
      } catch (error) {
        console.error(" 게시글 불러오기 실패:", error);
      }
    }
    fetchPosts();
  }, [auth?.token]);

  async function handleLike(postId: number) {
    if (!auth?.token) return alert("로그인이 필요합니다.");

    try {
      const res = await api.post(`/posts/${postId}/like/`, {}, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likes_count: res.data.likes_count } : post
        )
      );
    } catch (error) {
      console.error(" 좋아요 실패:", error);
    }
  }
  
  async function handleBookmark(postId: number) {
    if (!auth?.token) return alert("로그인이 필요합니다.");

    try {
      const res = await api.post(`/posts/${postId}/bookmark/`, {}, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, bookmarks_count: res.data.bookmarks_count } : post
        )
      );
    } catch (error) {
      console.error("북마크 실패:", error);
    }
  }

  async function handleDelete(postId: number) {
    if (!auth?.token) return alert("로그인이 필요합니다.");
    const confirmDelete = confirm("정말 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/posts/${postId}/`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });

      // 삭제 후 목록 갱신
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("게시글 삭제 실패:", error);
    }
  }
  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4">게시글 목록</h1>
      {posts.length === 0 ? (
        <p>게시글이 없습니다.</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="border-b py-4">
            <Link href={`/posts/${post.id}`} className="block cursor-pointer hover:bg-gray-100">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-gray-600">{post.content}</p>
            </Link>
            <div className="flex justify-between items-center mt-2">
              <button
                onClick={() => handleLike(post.id)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                ❤️ {post.likes_count}
              </button>

              <button
                onClick={() => handleBookmark(post.id)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                ⭐ {post.bookmarks_count}
              </button>

              {auth?.user?.id && auth?.user.id === post.author_id && (
                <button
                  onClick={() => handleDelete(post.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  🗑️ 삭제
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}