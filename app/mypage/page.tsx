"use client"; // 클라이언트 컴포넌트에서 실행
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext"; // AuthContext 가져오기
import { useRouter } from "next/navigation";
import { api } from "@/utils/api";
import axios from "axios";
export default function MyPage() {
  const auth = useContext(AuthContext);
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // 로딩 상태 추카

  // 로그인되지 않은 경우 로그인 페이지로 이동
  useEffect(() => {
    if (!auth?.user) {
      router.push("/login");
    } else {
        fetchMyPosts(); // 로그인 후 내 게시글 가져오기
    }
  }, [auth?.user, router]);
  // 내가 작성한 글 가져오는 함수
  const fetchMyPosts = async () => {
    try {
        const res = await api.get("mypage/posts/", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPosts(res.data.posts); // API에서 받아온 게시글 목록 저장
    } catch (error) {
      console.error("내가 쓴 글 가져오기 실패:", error);
    } finally {
      setLoading(false); // 로딩 상태 해제
    }
  };

  

  if (!auth?.user) {
    return <p>로그인 중...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">마이페이지</h1>
      <div className="bg-white shadow-md rounded p-6">
        <p className="text-lg">👤 사용자명: {auth.user.username}</p>
        <p className="text-lg">📧 이메일: {auth.user.email}</p>
        <p className="text-lg">📆 가입일: {new Date(auth.user.created_at).toLocaleDateString()}</p>
      </div>
      {/*  내가 작성한 글 목록 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">내가 쓴 글</h2>
      {loading ? (
        <p>게시글 불러오는 중...</p>
      ) : posts.length === 0 ? (
        <p>작성한 게시글이 없습니다.</p>
      ) : (
        <ul className="space-y-3">
          {posts.map((post: any) => (
            <li key={post.id} className="p-3 border rounded bg-gray-100">
              <Link href={`/posts/${post.id}`} className="text-blue-600 hover:underline">
                {post.title}
              </Link>
              <p className="text-sm text-gray-500">{new Date(post.created_at).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}