import { useState } from "react";
import axios from "axios";
import EditTicketModal from "./EditTicketModal";
import { API_URL } from "../config"; // ✅ import live API URL

export default function TicketCard({ ticket, token, user, fetchTickets }) {
  const [showEdit, setShowEdit] = useState(false);

  // ================= DELETE =================
  const handleDelete = async () => {
    if (!window.confirm("Delete this ticket?")) return;

    try {
      await axios.delete(`${API_URL}/tickets/${ticket._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchTickets(); // refresh
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  // ================= PERMISSION CHECK (SAFE) =================
  const isOwner = ticket.createdBy?.toString() === user?.id; // ✅ use user.id

  // ================= UI =================
  return (
    <div className="bg-white p-3 rounded shadow mb-2 border space-y-2">
      <h4 className="font-semibold">{ticket.title}</h4>

      <p className="text-sm text-gray-600">{ticket.description}</p>

      <div className="text-xs">Priority: {ticket.priority}</div>

      {/* ONLY OWNER CAN EDIT/DELETE */}
      {isOwner && (
        <div className="flex gap-3 mt-2">
          <button
            className="text-blue-600 text-sm"
            onClick={() => setShowEdit(true)}
          >
            Edit
          </button>

          <button className="text-red-600 text-sm" onClick={handleDelete}>
            Delete
          </button>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEdit && (
        <EditTicketModal
          ticket={ticket}
          token={token}
          onClose={() => setShowEdit(false)}
          onUpdated={fetchTickets}
        />
      )}
    </div>
  );
}
