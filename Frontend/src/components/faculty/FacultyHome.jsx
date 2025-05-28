import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AiFillLike, AiOutlineLike, AiOutlineDelete } from "react-icons/ai";
import { FaRegCommentDots, FaSignOutAlt } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { io } from "socket.io-client";
import Footer from "../common/Footer";
import BgStudent3 from '../../assets/ChatDoodle3.png'
import { BsFilterCircle } from "react-icons/bs";

const API_BASE_URL = "http://localhost:8000"  // Ensure backend is running
const socket = io(API_BASE_URL);

const FacultyHome = () => {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState({});
  const [showComments, setShowComments] = useState({});
  const userId = sessionStorage.getItem("userId") || "";
  const token = sessionStorage.getItem("token");
  const Role = sessionStorage.getItem("role");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
    socket.on("postUpdated", (updatedPost) => {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === updatedPost._id ? updatedPost : post
        )
      );
    });

    return () => socket.off("postUpdated");
  }, []);

  // Fetch all posts
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



  // Handle post submission
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");
    if (!token) return alert("Unauthorized! Please log in.");

    try {
      const formData = new FormData();
      formData.append("text", text);
      if (file) {
        formData.append("file", file);
        formData.append("mediaType", file.type.startsWith("image") ? "image" : "video");
      } else {
        formData.append("mediaType", "none");
      }

      await axios.post(`${API_BASE_URL}/api/posts/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Role: `${Role}`,
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

  // Handle like/unlike post
  const handleLike = async (postId) => {
    const token = sessionStorage.getItem("token");
    const userId = sessionStorage.getItem("userId");

    if (!token || !userId) return alert("Unauthorized! Please log in.");

    try {
      const { data } = await axios.put(
        `${API_BASE_URL}/api/posts/like/${postId}`,
        { userId },
        { headers: { Authorization: `Bearer ${token}`, } }
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, likes: post.likes.includes(userId) ? post.likes.filter((id) => id !== userId) : [...post.likes, userId] }
            : post
        )
      ); console.log(data);
    } catch (error) {
      console.error("Error liking post:", error.response?.data || error.message);
    }
  };


  // Handle comment submission
  const handleCommentSubmit = async (postId) => {
    if (!commentText[postId]?.trim()) return alert("Comment cannot be empty");

    const token = sessionStorage.getItem("token");
    const userId = sessionStorage.getItem("userId");

    if (!token || !userId) {
      return alert("Unauthorized! Please log in.");
    }

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/posts/comment/${postId}`,
        { userId, text: commentText[postId] },
        { headers: { Authorization: `Bearer ${token}`, Role: `${Role}`, } }
      );

      const newComment = {
        _id: data.commentId, // Assume API returns the new comment's ID
        user: { _id: userId, }, // Show the commenter's name immediately
        text: commentText[postId],
        createdAt: new Date().toISOString(),
      };

      // Update posts state directly to reflect the new comment
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, comments: [...post.comments, newComment] }
            : post
        )
      );

      setCommentText((prev) => ({ ...prev, [postId]: "" })); // Ensure proper state update

    } catch (error) {
      console.error("Error adding comment:", error.response?.data || error.message);
      alert("Failed to add comment. Please try again.");
    }
  };


  // Handle delete post
  const handleDelete = async (postId) => {
    const token = sessionStorage.getItem("token");
    const Role = sessionStorage.getItem("role");
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    if (!token) {
      console.error("User not authenticated");
      return;
    }

    try {
      await axios.delete(`http://localhost:8000/api/posts/delete/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Post deleted successfully");
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error.response?.data || error.message);
    }
  };

  // Handle delete comment with confirmation
  const handleDeleteComment = async (postId, commentId) => {
    const userId = sessionStorage.getItem("userId");
    const Role = sessionStorage.getItem("role");
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/posts/comment/${postId}/${commentId}`, {
        data: { userId, Role }, //  Move data outside headers
        headers: { Authorization: `Bearer ${token}` }, //  Only token in headers
      });
      // Update posts state directly to remove the comment
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, comments: post.comments.filter((comment) => comment._id !== commentId) }
            : post
        )
      );

      console.log("Comment deleted successfully");
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="">
      <div className="" style={{
        backgroundImage: `url(${BgStudent3})`,
        backdropFilter: 'blur(40px)'
      }}>
        {/* <Header /> */}
        <div className="p-4 text-black text-lg flex justify-between items-center bg-[#08415C]">
          <h1 className="text-xl font-semibold text-white">Announcements</h1>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="p-3 rounded-full flex items-center gap-2 bg-white hover:bg-gray-100 transition-colors"
          >
            <FaSignOutAlt className="text-xl" />
            <span className="hidden lg:inline">Logout</span>
          </button>
        </div>

        <div className="container mx-auto mt-2 p-4 max-w-3xl">

          {/* Post Upload Form */}
          <form onSubmit={handlePostSubmit} className="bg-gray-100 p-4 rounded-lg shadow-lg">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Write something..."
              required
            />
            <input type="file" accept="image/*, video/*" onChange={(e) => setFile(e.target.files[0])} className="my-2 block w-full" />
            <button type="submit" className="bg-yellow-400 text-zinc-950 px-4 py-2 rounded w-full">
              Post
            </button>
          </form>

          {/* Display Posts */}
          <div className="mt-6 space-y-4">
            {loading ? (
              <p className="text-center text-gray-500">Loading posts...</p>
            ) : posts.length === 0 ? (
              <p className="text-center text-gray-500">No posts available.</p>
            ) : (
              posts.map((post) => (
                <div key={post._id} className="bg-white p-4 rounded-lg shadow-lg">
                  <p className="mb-2">{post.text}</p>

                  {/* Display Media */}
                  {post.mediaUrl && (
                    <div className="mt-2">
                      {post.mediaType === "image" ? (
                        <img src={`${API_BASE_URL}/uploads/${post.mediaUrl}`} alt="Post" className="w-full rounded-lg" />
                      ) : (
                        <video src={`${API_BASE_URL}/uploads/${post.mediaUrl}`} controls className="w-full rounded-lg" />
                      )}
                    </div>
                  )}

                  {/* Like & Comment Actions */}
                  <div className="flex items-center justify-between mt-4">
                    <button onClick={() => handleLike(post._id)} className="flex items-center space-x-2">
                      {post.likes.includes(userId) ? <AiFillLike className="text-red-500" size={20} /> : <AiOutlineLike className="text-gray-600" size={20} />}
                      <span>{post.likes.length}</span>
                    </button>

                    <button onClick={() => setShowComments({ ...showComments, [post._id]: !showComments[post._id] })} className="flex items-center space-x-2">
                      <FaRegCommentDots className="text-gray-600" size={20} />
                      <span>{post.comments.length}</span>
                    </button>

                    <button onClick={() => handleDelete(post._id)}>
                      <AiOutlineDelete className="text-red-500" size={20} />
                    </button>
                  </div>

                  {/* Comment Section */}
                  {showComments[post._id] && (
                    <div className="mt-4 p-2 bg-gray-100 rounded">
                      {post.comments.map((comment) => (
                        <div key={comment._id} className="flex justify-between items-center p-2">
                          <p>
                            <strong>{comment.user?.name || "Anonymous"}:</strong> {comment.text}
                          </p>
                          <button onClick={() => { console.log(comment._id); handleDeleteComment(post._id, comment._id) }}>
                            <MdCancel className="text-red-500" />
                          </button>
                        </div>
                      ))}
                      <input type="text" value={commentText[post._id] || ""} onChange={(e) => setCommentText({ ...commentText, [post._id]: e.target.value })} className="w-full mt-2 p-2 border rounded" />
                      <button onClick={() => handleCommentSubmit(post._id)} className="bg-green-500 text-white px-3 py-1 rounded mt-2">
                        Add Comment
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        <div className="sticky mr-6 w-15 bottom-5 left-full bg-blue-500 p-4 rounded-full cursor-pointer">
          <BsFilterCircle
            size={30}
            className="text-white"
            onClick={() => navigate("/Facultychatlist")}
          />
        </div>
        <Footer />
      </div>
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-yellow-400 p-4 shadow-md">
          <div className="flex flex-col gap-4">
            <button
              onClick={() => {
                setShowLogoutConfirm(true);
                setMobileMenuOpen(false);
              }}
              className="w-full px-4 py-2 rounded-full flex items-center gap-2 bg-white hover:bg-gray-100 transition-colors"
            >
              <FaSignOutAlt className="text-xl" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-11/12 sm:w-auto">
            <h3 className="text-xl font-bold mb-4">Confirm Logout</h3>
            <p className="mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => navigate("/")}
                className="px-4 py-2 bg-[#ffc13b] rounded hover:bg-[#e6ac35] transition-colors"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyHome;
