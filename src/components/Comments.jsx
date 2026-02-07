import { useEffect, useState } from "react";
import { fetchComments, addComment } from "../services/commentApi";

export default function Comments({ ticketId, token }) {
  const [comments, setComments] = useState([]); // ✅ default empty array
  const [text, setText] = useState("");

  const loadComments = async () => {
    try {
      const data = await fetchComments(ticketId, token);
      setComments(data || []); // ✅ fallback
    } catch (err) {
      console.error("Failed to load comments:", err);
      setComments([]);
    }
  };

  useEffect(() => {
    loadComments();
  }, [ticketId]); // ✅ reload if ticket changes

  const handleAdd = async () => {
    if (!text.trim()) return;

    try {
      const newComment = await addComment({ ticketId, text }, token);
      setComments((prev) => [...prev, newComment]); // ✅ instant add
      setText("");
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  return (
    <div className="mt-3 border-t pt-2">
      {/* comment list */}
      {comments.map((c) => (
        <div key={c._id} className="text-sm mb-1">
          <b>{c.userId?.name || "Unknown"}</b>{" "}
          <span className="text-gray-400 text-xs">
            {new Date(c.createdAt).toLocaleTimeString()}
          </span>
          : {c.text}
        </div>
      ))}

      {/* input */}
      <div className="flex gap-2 mt-2">
        <input
          className="border p-1 flex-1"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add comment..."
        />
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-3"
        >
          Send
        </button>
      </div>
    </div>
  );
}
