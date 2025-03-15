import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 사용자 마이페이지 데이터 가져오기
export const fetchMyPosts = async (token) => {
  const response = await api.get("mypage/posts/", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const fetchMyComments = async (token) => {
  const response = await api.get("mypage/comments/", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const fetchLikedPosts = async (token) => {
  const response = await api.get("mypage/liked-posts/", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const fetchBookmarkedPosts = async (token) => {
  const response = await api.get("mypage/bookmarked-posts/", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};