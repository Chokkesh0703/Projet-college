import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { MessageCircle, ThumbsUp } from "lucide-react";

const socket = io("http://localhost:8000");

export default function StudentHome({ user }) {
  const [posts, setPosts] = useState([]);
  const [comment, setComment] = useState({});

  useEffect(() => {
    if (!user) return;

    socket.on("newPost", (post) => {
      setPosts((prevPosts) => {
        const updatedPosts = [post, ...prevPosts];
        return updatedPosts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      });
    });

    socket.on("updatePostLikes", ({ postId, likes }) => {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, likes } : post
        )
      );
    });

    socket.on("updatePostComments", ({ postId, comments }) => {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, comments } : post
        )
      );
      setComment((prev) => ({ ...prev, [postId]: "" }));
    });

    return () => {
      socket.off("newPost");
      socket.off("updatePostLikes");
      socket.off("updatePostComments");
    };
  }, [user]);

  const likePost = (postId) => {
    socket.emit("likePost", { postId, userId: user._id });
  };

  const commentOnPost = (postId) => {
    if (!comment[postId]?.trim()) return;

    socket.emit("addComment", {
      postId,
      userId: user._id,
      text: comment[postId],
    });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">📢 Admin Posts</h2>
        {posts.length === 0 ? (
          <p className="text-center text-gray-500">No posts available</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="border p-4 rounded-md mb-4">
              <p>{post.content}</p>
              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() => likePost(post._id)}
                  className="flex items-center bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition duration-200"
                >
                  <ThumbsUp size={16} className="mr-1" /> {post.likes}
                </button>
                <div className="flex items-center text-gray-600">
                  <MessageCircle size={16} className="mr-1" /> {post.comments.length} Comments
                </div>
              </div>
              <div className="mt-2">
                {post.comments.map((c, index) => (
                  <p key={index} className="text-sm border-b p-1">{c.text}</p>
                ))}
                <div className="flex gap-2 mt-2">
                  <input
                    value={comment[post._id] || ""}
                    onChange={(e) => setComment({ ...comment, [post._id]: e.target.value })}
                    placeholder="Add a comment..."
                    className="flex-1 p-2 border rounded-md"
                  />
                  <button
                    onClick={() => commentOnPost(post._id)}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
