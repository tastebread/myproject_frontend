"use client";

import { useEffect, useState } from "react";
import { fetchMyPosts, fetchMyComments, fetchLikedPosts, fetchBookmarkedPosts } from "@/lib/api";

export default function MyPage() {
  const [myPosts, setMyPosts] = useState([]);
  const [myComments, setMyComments] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token"); // 로컬 스토리지에서 JWT 토큰 가져오기
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    async function loadData() {
      try {
        const [posts, comments, liked, bookmarked] = await Promise.all([
          fetchMyPosts(token),
          fetchMyComments(token),
          fetchLikedPosts(token),
          fetchBookmarkedPosts(token)
        ]);
        setMyPosts(posts);
        setMyComments(comments);
        setLikedPosts(liked);
        setBookmarkedPosts(bookmarked);
      } catch (error) {
        console.error("데이터를 불러오는 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) return <p>로딩 중...</p>;

  return (
    <div>
      <h1>마이페이지</h1>

      <section>
        <h2>내가 작성한 게시글</h2>
        {myPosts.length === 0 ? <p>작성한 게시글이 없습니다.</p> : (
          <ul>
            {myPosts.map((post) => (
              <li key={post.id}>{post.title}</li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>내가 작성한 댓글</h2>
        {myComments.length === 0 ? <p>작성한 댓글이 없습니다.</p> : (
          <ul>
            {myComments.map((comment) => (
              <li key={comment.id}>{comment.content}</li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>좋아요한 게시글</h2>
        {likedPosts.length === 0 ? <p>좋아요한 게시글이 없습니다.</p> : (
          <ul>
            {likedPosts.map((post) => (
              <li key={post.id}>{post.title}</li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>북마크한 게시글</h2>
        {bookmarkedPosts.length === 0 ? <p>북마크한 게시글이 없습니다.</p> : (
          <ul>
            {bookmarkedPosts.map((post) => (
              <li key={post.id}>{post.title}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}