import { useState } from "react";
import axios from "axios";

export default function EditTicketModal({ ticket, token, onClose, onUpdated }) {
  const [form, setForm] = useState({
    title: ticket.title,
    description: ticket.description,
    priority: ticket.priority || "medium",
    status: ticket.status || "todo",
    assignee: ticket.assignee || "",
  });

  const handleSave = async () => {
    try {
      // ✅ Use full backend URL
      await axios.put(
        `http://localhost:5000/api/tickets/${ticket._id}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onUpdated(); // refresh tickets in parent
      onClose();   // close modal
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-4 w-96 rounded shadow-lg">

        <h2 className="font-bold mb-3">Edit Ticket</h2>

        <input
          className="border p-2 w-full mb-2 rounded"
          value={form.title}
          placeholder="Title"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          className="border p-2 w-full mb-2 rounded"
          value={form.description}
          placeholder="Description"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <select
          className="border p-2 w-full mb-2 rounded"
          value={form.priority}
          onChange={(e) => setForm({ ...form, priority: e.target.value })}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <div className="flex justify-end gap-2 mt-2">
          <button
            className="px-3 py-1 border rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded"
            onClick={handleSave}
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
}

