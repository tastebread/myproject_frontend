"use client";

import { useEffect, useState,useContext } from "react";
import { api } from "@/utils/api";
import { useParams,useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";

// 게시글 타입 정의
interface Post {
  id: number;
  title: string;
  content: string;
  author?: { id: number; username: string };
  author_name: string;
}

// 댓글 타입 정의
interface Comment {
    id: number;
    content: string;
    author: {id: number; username: string};
    author_name: string;
}

export default function PostDetailPage() {
  const { id } = useParams(); // URL에서 id 가져오기
  const router = useRouter();
  const auth = useContext(AuthContext);
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
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

    async function fetchComments() {
        try {
          const res = await api.get(`/posts/${id}/comments/`);
          console.log("📥 댓글 데이터:", res.data); // ← API 응답 확인
          setComments(res.data);
        } catch (error) {
          console.error("❌ 댓글 불러오기 실패:", error);
        }
      }

    if (id) {
        fetchPost();
        fetchComments();
    }
  }, [id]);

  async function handleCommentSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!auth?.token) return alert("로그인이 필요합니다.");
    
    console.log("📝 댓글 내용:", newComment); //로그추가
    if (newComment.trim() === "") {
        alert("댓글 내용을 입력하세요.");
        return;
      }

    try {
      const res = await api.post(
        `/posts/${id}/comments/`,
        { content: newComment},
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      setComments([...comments, res.data]);
      setNewComment("");
    } catch (error: any) {
      console.error("❌ 댓글 작성 실패:", error.response?.data || error.message);
      alert(`댓글 작성 실패: ${error.response?.data?.error || "서버 오류"}`);
    }
  }


  async function handleDeleteComment(commentId: number) {
    if (!auth?.token) return alert("로그인이 필요합니다.");

    try {
      await api.delete(`/comments/${commentId}/`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error(" 댓글 삭제 실패:", error);
    }
  }

  if (error) return <p className="text-red-500">{error}</p>;
  if (!post) return <p>게시글을 불러오는 중...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-600">{post.content}</p>

      {auth?.user?.id === post.author?.id && (
        <button
          onClick={() => router.push(`/posts/${post.id}/edit`)}
          className="bg-gray-500 text-white px-3 py-1 mt-4 rounded"
        >
          ✏️ 수정
        </button>
      )}
      {/* 댓글 섹션 */}
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-2">댓글</h2>
      {comments.length === 0 ? (
        <p className="text-gray-500">댓글이 없습니다.</p>
      ) : (
        comments.map((comment) => (
          <div key={comment.id} className="border-b py-2 flex justify-between">
            <p>
              <strong>{comment.author_name}:</strong> {comment.content}
            </p>
            {auth?.user?.id === comment.author.id && (
              <button
                onClick={() => handleDeleteComment(comment.id)}
                className="text-red-500"
              >
                삭제
              </button>
            )}
          </div>
        ))
      )}
    </div>
    {/*  댓글 작성 폼 추가 */}
    {auth?.token && (
      <form onSubmit={handleCommentSubmit} className="mt-4">
        <textarea
          placeholder="댓글을 입력하세요..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 mt-2 w-full rounded">
          댓글 작성
        </button>
      </form>
    )}
    </div>
  );
}