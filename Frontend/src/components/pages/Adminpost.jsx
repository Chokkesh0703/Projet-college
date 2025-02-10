import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminPost = () => {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = "http://localhost:8000"; // Ensure backend is running

  // Fetch posts from API
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const {data}  = await axios.get(`${API_BASE_URL}/api/posts/all`);
      console.log("Fetched Posts:", data);

      if (Array.isArray(data)) {
        setPosts(data);
      } else {
        console.error("Unexpected API response:", data);
        setPosts([]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

   
  useEffect(() => {
    fetchPosts(); //  Fetch posts on mount
  }, []);

  // Handle post submission
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");// Get token
    const userId = sessionStorage.getItem("userId"); // Get user ID

    try {
      const formData = new FormData();
      formData.append("text", text);
      if (file) {
        formData.append("file", file); //  Append actual file
        formData.append("mediaType", file.type.startsWith("image") ? "image" : "video"); //  Detect file type
      } else {
        formData.append("mediaType", "none");
      }
  
      const response = await axios.post(
        `${API_BASE_URL}/api/posts/create`,
        formData,
          {
            headers: {
              Authorization: `Bearer ${token}`, //  Add auth header
              "X-User-Id": userId, //  Ensure user ID is sent
              "Content-Type": "multipart/form-data",
            },
          }
        );
  
      console.log("Post created:", response.data);
  
      setText("");
      setFile(null);
      fetchPosts();
    } catch (error) {
      console.error("Error creating post:", error);
      if (error.response) {
        console.error("Response Data:", error.response.data);
      }
    }
  };
  

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Posts</h2>

      {/* Post Upload Form */}
      <form
        onSubmit={handlePostSubmit}
        className="bg-gray-100 p-4 rounded-lg shadow-lg"
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Write something..."
          required
        />
        <input
          type="file"
          accept="image/*, video/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="my-2 block w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Post
        </button>
      </form>

      {/* Display Posts */}
      <div className="mt-4">
        {loading ? (
          <p className="text-center text-gray-500">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-500">No posts available.</p>
        ) : (
          posts.map((posts) => (
            <div
              key={posts._id}
              className="bg-white p-4 rounded-lg shadow-lg mb-4"
            >
              <p className="mb-2">{posts.text}</p>

              {/* Handle Media Display */}
              {posts.mediaUrl && (
                <>
                  {posts.mediaType === "image" && (
                    <img
                      src={`http://localhost:8000/uploads/${posts.mediaUrl}`}
                      alt="Post"
                      className="w-full rounded-lg"
                    />
                  )}
                  {posts.mediaType === "video" && (
                    <video
                      src={`http://localhost:8000/uploads/${posts.mediaUrl}`}
                      controls
                      className="w-full rounded-lg"
                    />
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminPost;
