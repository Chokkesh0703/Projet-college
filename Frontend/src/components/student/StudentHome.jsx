import React, { useState, useEffect } from "react";
import axios from "axios";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { FaRegCommentDots } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

import bgForChat from "../../assets/ChatDoodle3.png";

const API_BASE_URL = "http://localhost:8000";
const socket = io(API_BASE_URL);

const StudentHome = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState({});
  const [showComments, setShowComments] = useState({});

  const userId = sessionStorage.getItem("userId") || "";
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    fetchPosts();

    socket.on("newPost", (newPost) => {
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    });

    socket.on("postLiked", ({ postId, likes }) => {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, likes: Array(likes).fill(userId) } // Simplified - adjust if you store real user IDs
            : post
        )
      );
    });

    socket.on("commentAdded", ({ postId, comments }) => {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, comments } : post
        )
      );
    });

    socket.on("postDeleted", ({ postId }) => {
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    });

    socket.on("commentDeleted", ({ postId, commentId }) => {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                comments: post.comments?.filter((c) => c._id !== commentId) || [],
              }
            : post
        )
      );
    });

    return () => {
      socket.off("newPost");
      socket.off("postLiked");
      socket.off("commentAdded");
      socket.off("postDeleted");
      socket.off("commentDeleted");
    };
  }, [userId]);

  const fetchPosts = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/posts/all`);
      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleLike = async (postId) => {
    if (!token || !userId) return alert("Unauthorized! Please log in.");

    try {
      const { data } = await axios.put(
        `${API_BASE_URL}/api/posts/like/${postId}`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes: post.likes?.includes(userId)
                  ? post.likes.filter((id) => id !== userId)
                  : [...(post.likes || []), userId],
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error liking post:", error.response?.data || error.message);
    }
  };

  const handleCommentSubmit = async (postId) => {
    if (!commentText[postId]?.trim()) return alert("Comment cannot be empty");

    if (!token || !userId) {
      return alert("Unauthorized! Please log in.");
    }

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/posts/comment/${postId}`,
        { userId, text: commentText[postId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommentText((prev) => ({ ...prev, [postId]: "" }));

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                comments: data.comments || [],
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error adding comment:", error.response?.data || error.message);
      alert("Failed to add comment. Please try again.");
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    const userId = sessionStorage.getItem("userId");
    const Role = sessionStorage.getItem("role");

    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/posts/comment/${postId}/${commentId}`, {
        data: { userId, Role },
        headers: { Authorization: `Bearer ${token}` },
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                comments: post.comments?.filter((comment) => comment._id !== commentId) || [],
              }
            : post
        )
      );
    } catch (error) {
      alert("Cannot delete comment");
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-y-auto">
      <img
        src={bgForChat}
        alt="Banner"
        className="absolute w-full h-full object-cover opacity-10 z-0"
      />

      <div className="relative z-10">
        <div className="container mx-auto p-4 max-w-3xl">
          <div className="rounded-2xl p-4 text-black text-lg flex justify-between items-center bg-[#08415C]">
            <h1 className="text-xl font-semibold text-white">Announcements</h1>
          </div>

          <div className="mt-6 space-y-4 pb-20">
            {posts.length === 0 ? (
              <p className="text-center text-gray-500">No posts available.</p>
            ) : (
              posts.map((post) => (
                <div
                  key={post._id}
                  className="p-4 rounded-lg shadow-lg bg-white border-2 border-yellow-400"
                >
                  <p className="mb-2">{post.text}</p>

                  {post.mediaUrl && (
                    <div className="mt-2">
                      {post.mediaType === "image" ? (
                        <img
                          src={`${API_BASE_URL}/uploads/${post.mediaUrl}`}
                          alt="Post"
                          className="w-full rounded-lg"
                        />
                      ) : (
                        <video
                          src={`${API_BASE_URL}/uploads/${post.mediaUrl}`}
                          controls
                          className="w-full rounded-lg"
                        />
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4">
                    <button
                      onClick={() => handleLike(post._id)}
                      className="flex items-center space-x-2"
                    >
                      {post.likes?.includes(userId) ? (
                        <AiFillLike className="text-red-500" size={20} />
                      ) : (
                        <AiOutlineLike className="text-gray-600" size={20} />
                      )}
                      <span>{post.likes?.length || 0}</span>
                    </button>

                    <button
                      onClick={() =>
                        setShowComments({
                          ...showComments,
                          [post._id]: !showComments[post._id],
                        })
                      }
                      className="flex items-center space-x-2"
                    >
                      <FaRegCommentDots className="text-gray-600" size={20} />
                      <span>{post.comments?.length || 0}</span>
                    </button>
                  </div>

                  {showComments[post._id] && (
                    <div className="mt-4 p-2 bg-gray-100 rounded max-h-80 overflow-y-auto">
                      {post.comments?.map((comment, index) => (
                        <div
                          key={comment._id || index}
                          className="flex justify-between items-center p-2 border-b border-gray-300"
                        >
                          <p>
                            <strong>{comment.user?.name || "Anonymous"}:</strong>{" "}
                            {comment.text}
                          </p>
                          <button
                            onClick={() => handleDeleteComment(post._id, comment._id)}
                          >
                            <MdCancel className="text-red-500" />
                          </button>
                        </div>
                      ))}

                      <input
                        type="text"
                        value={commentText[post._id] || ""}
                        onChange={(e) =>
                          setCommentText({
                            ...commentText,
                            [post._id]: e.target.value,
                          })
                        }
                        className="w-full mt-2 p-2 border rounded"
                        placeholder="Write a comment..."
                      />
                      <button
                        onClick={() => handleCommentSubmit(post._id)}
                        className="bg-green-500 text-white px-3 py-1 rounded mt-2"
                      >
                        Add Comment
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHome;





