import React, { useState, useEffect } from "react";
import axios from "axios";
import { AiFillLike, AiOutlineLike, AiOutlineDelete } from "react-icons/ai";
import { FaRegCommentDots, FaSignOutAlt } from "react-icons/fa";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import BgStudent3 from "../../assets/ChatDoodle3.png";

const API_BASE_URL = "http://localhost:8000";

const AdminPost = () => {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState({});
  const [showComments, setShowComments] = useState({});
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userId = sessionStorage.getItem("userId") || "";
  const token = sessionStorage.getItem("token") || "";
  const Role = sessionStorage.getItem("role") || "";

  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
    const socket = io(API_BASE_URL);

    socket.on("postUpdated", (updatedPost) => {
      setPosts((prev) =>
        prev.map((post) => (post._id === updatedPost._id ? updatedPost : post))
      );
    });

    socket.on("commentAdded", ({ postId, comments }) => {
      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId ? { ...post, comments } : post
        )
      );
    });

    socket.on("postDeleted", ({ postId }) => {
      setPosts((prev) => prev.filter((post) => post._id !== postId));
    });

    socket.on("commentDeleted", ({ postId, commentId }) => {
      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? {
                ...post,
                comments: post.comments?.filter((c) => c._id !== commentId),
              }
            : post
        )
      );
    });

    return () => socket.disconnect();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/posts/all`);
      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!token) return alert("Unauthorized! Please log in.");

    try {
      const formData = new FormData();
      formData.append("text", text);
      if (file) {
        formData.append("file", file);
        formData.append(
          "mediaType",
          file.type.startsWith("image") ? "image" : "video"
        );
      } else {
        formData.append("mediaType", "none");
      }

      await axios.post(`${API_BASE_URL}/api/posts/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Role,
          "Content-Type": "multipart/form-data",
        },
      });

      setText("");
      setFile(null);
      fetchPosts();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleLike = async (postId) => {
    if (!token || !userId) return alert("Unauthorized! Please log in.");

    try {
      await axios.put(
        `${API_BASE_URL}/api/posts/like/${postId}`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes: post.likes.includes(userId)
                  ? post.likes.filter((id) => id !== userId)
                  : [...post.likes, userId],
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
    if (!token || !userId) return alert("Unauthorized! Please log in.");

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/posts/comment/${postId}`,
        { userId, text: commentText[postId] },
        { headers: { Authorization: `Bearer ${token}`, Role } }
      );

      const newComment = {
        _id: data.commentId,
        user: { _id: userId, name: "You" },
        text: commentText[postId],
        createdAt: new Date().toISOString(),
      };

      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? { ...post, comments: [...post.comments, newComment] }
            : post
        )
      );

      setCommentText((prev) => ({ ...prev, [postId]: "" }));
    } catch (error) {
      console.error("Error adding comment:", error.response?.data || error.message);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    if (!token) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/posts/delete/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/posts/comment/${postId}/${commentId}`, {
        data: { userId, Role },
        headers: { Authorization: `Bearer ${token}` },
      });

      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? {
                ...post,
                comments: post.comments.filter((c) => c._id !== commentId),
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const confirmLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div
      className="min-h-screen bg-cover bg-no-repeat bg-center"
      style={{ backgroundImage: `url(${BgStudent3})` }}
    >
      <header className="bg-[#08415C] text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Announcements</h1>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Upload Form */}
        <form onSubmit={handlePostSubmit} className="bg-white p-4 rounded-lg shadow-md space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full border rounded p-2 resize-none"
            rows={3}
            placeholder="What's on your mind?"
            required
          />
          <input
            type="file"
            accept="image/*, video/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="block"
          />
          <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded">
            Post
          </button>
        </form>

        {/* Posts */}
        <section className="mt-6 space-y-6">
          {loading ? (
            <p className="text-center text-gray-500">Loading posts...</p>
          ) : posts.length === 0 ? (
            <p className="text-center text-gray-500">No posts available.</p>
          ) : (
            posts.map((post) => (
              <article
                key={post._id}
                className="bg-white p-4 rounded-lg shadow-md space-y-2"
              >
                <p>{post.text}</p>

                {post.mediaUrl && (
                  <div>
                    {post.mediaType === "image" ? (
                      <img
                        src={`${API_BASE_URL}/uploads/${post.mediaUrl}`}
                        alt="Post media"
                        className="w-full rounded"
                      />
                    ) : (
                      <video
                        controls
                        src={`${API_BASE_URL}/uploads/${post.mediaUrl}`}
                        className="w-full rounded"
                      />
                    )}
                  </div>
                )}

                {/* Like and Comment Buttons */}
                <div className="flex items-center gap-4 mt-2">
                  <button onClick={() => handleLike(post._id)} aria-label="Like">
                    {post.likes?.includes(userId) ? (
                      <AiFillLike size={24} className="text-blue-600" />
                    ) : (
                      <AiOutlineLike size={24} />
                    )}
                  </button>
                  <span>{post.likes?.length || 0}</span>

                  <button
                    onClick={() =>
                      setShowComments((prev) => ({
                        ...prev,
                        [post._id]: !prev[post._id],
                      }))
                    }
                    className="flex items-center gap-1"
                    aria-label="Toggle comments"
                  >
                    <FaRegCommentDots size={20} />
                    <span>{post.comments?.length || 0}</span>
                  </button>

                  <button
                    onClick={() => handleDelete(post._id)}
                    className="text-red-500 ml-auto"
                    aria-label="Delete Post"
                  >
                    <AiOutlineDelete size={22} />
                  </button>
                </div>

                {/* Comments Section */}
                {showComments[post._id] && (
                  <div className="mt-2 border-t pt-2 space-y-3">
                    {post.comments?.map((comment) => (
                      <div key={comment._id} className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-semibold">
                            {comment.user?.name || "Anonymous"}
                          </p>
                          <p className="text-sm">{comment.text}</p>
                        </div>
                        {(comment.user?._id === userId || Role === "admin") && (
                          <button
                            onClick={() => handleDeleteComment(post._id, comment._id)}
                            className="text-red-500"
                            aria-label="Delete Comment"
                          >
                            <AiOutlineDelete size={18} />
                          </button>
                        )}
                      </div>
                    ))}

                    {/* Add Comment Input */}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Write a comment..."
                        value={commentText[post._id] || ""}
                        onChange={(e) =>
                          setCommentText((prev) => ({
                            ...prev,
                            [post._id]: e.target.value,
                          }))
                        }
                        className="flex-grow p-2 border rounded"
                      />
                      <button
                        onClick={() => handleCommentSubmit(post._id)}
                        className="bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                )}
              </article>
            ))
          )}
        </section>

        {/* Mobile Logout Menu */}
        <div className="fixed bottom-4 right-4 z-50">
          <button
            className="bg-yellow-400 p-3 rounded-full shadow-md"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <FaSignOutAlt size={24} />
          </button>

          {mobileMenuOpen && (
            <div className="absolute bottom-14 right-0 bg-white shadow-lg rounded p-3 space-y-2 w-44">
              <button
                className="text-red-600 font-semibold w-full hover:bg-red-50 py-2 rounded"
                onClick={() => setShowLogoutConfirm(true)}
              >
                Logout
              </button>
              <button
                className="w-full hover:bg-gray-100 py-2 rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Logout Confirmation */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-lg w-80">
              <p className="text-center mb-4 font-semibold">Confirm Logout?</p>
              <div className="flex justify-around">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 rounded border hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Yes, Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPost;

