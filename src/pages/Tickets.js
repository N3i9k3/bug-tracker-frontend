import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import KanbanBoard from "../components/KanbanBoard";

export default function Tickets() {
  const { projectId } = useParams();

  // ================= TOKEN SAFETY =================
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token found. User not logged in.");
  }

  const [tickets, setTickets] = useState([]);

  // ✅ STEP 1 — add status here
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    assignee: "",
    status: "todo", // default column
  });

  // ================= FETCH =================
  const fetchTickets = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/tickets/project/${projectId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setTickets(res.data || []);
  };

  // ================= CREATE =================
  const createTicket = async (e) => {
    e.preventDefault();

    await axios.post(
      "http://localhost:5000/api/tickets",
      { ...form, projectId }, // ✅ status included automatically
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // ✅ STEP 4 — reset including status
    setForm({
      title: "",
      description: "",
      priority: "medium",
      assignee: "",
      status: "todo",
    });

    fetchTickets();
  };

  // ================= DELETE =================
  const deleteTicket = async (id) => {
    await axios.delete(
      `http://localhost:5000/api/tickets/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchTickets();
  };

  // ================= UPDATE STATUS (KANBAN DRAG) =================
  const updateStatus = async (id, status) => {
    await axios.put(
      `http://localhost:5000/api/tickets/${id}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchTickets();
  };

  // ================= AUTO REFRESH =================
  useEffect(() => {
    fetchTickets();
  }, [projectId]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      <h1 className="text-2xl font-semibold">Project Tickets</h1>

      {/* ================= CREATE FORM ================= */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="font-medium mb-4">Create New Ticket</h2>

        <form onSubmit={createTicket} className="grid md:grid-cols-4 gap-4">

          <input
            className="border rounded-lg p-2"
            placeholder="Title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            required
          />

          <input
            className="border rounded-lg p-2"
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          {/* Priority */}
          <select
            className="border rounded-lg p-2"
            value={form.priority}
            onChange={(e) =>
              setForm({ ...form, priority: e.target.value })
            }
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          {/* ✅ STEP 2 — NEW STATUS DROPDOWN */}
          <select
            className="border rounded-lg p-2"
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value })
            }
          >
            <option value="todo">To Do</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
          </select>

          <input
            className="border rounded-lg p-2"
            placeholder="Assignee"
            value={form.assignee}
            onChange={(e) =>
              setForm({ ...form, assignee: e.target.value })
            }
          />

          <button className="bg-blue-600 text-white px-4 rounded">
            + Add
          </button>
        </form>
      </div>

      {/* ================= KANBAN BOARD ================= */}
      <KanbanBoard
        tickets={tickets}
        updateStatus={updateStatus}
      />
    </div>
  );
}


