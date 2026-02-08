import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams, useSearchParams } from "react-router-dom";
import KanbanBoard from "../components/KanbanBoard";
import { API_URL } from "../config"; // ✅ import live backend URL

export default function Tickets() {
  const { projectId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // ================= AUTH =================
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // ================= STATE =================
  const [tickets, setTickets] = useState([]);

  // ================= CREATE FORM =================
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    assignee: "",
    status: "todo",
  });

  // ================= FILTERS =================
  const [filters, setFilters] = useState({
    status: searchParams.get("status") || "",
    priority: searchParams.get("priority") || "",
    assignee: searchParams.get("assignee") || "",
    search: searchParams.get("search") || "",
  });

  // Draft filters for inputs (changes before Apply)
  const [draftFilters, setDraftFilters] = useState(filters);

  // ================= FETCH =================
  const fetchTickets = useCallback(async () => {
    try {
      const query = new URLSearchParams(filters).toString();

      const res = await axios.get(
        `${API_URL}/tickets/project/${projectId}?${query}`, // ✅ use live backend
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTickets(res.data || []);
    } catch (err) {
      console.error("Error fetching tickets:", err);
    }
  }, [filters, projectId, token]);

  // ================= SYNC FILTERS → URL =================
  useEffect(() => {
    setSearchParams(filters);
  }, [filters, setSearchParams]);

  // ================= AUTO FETCH =================
  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // ================= CREATE =================
  const createTicket = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${API_URL}/tickets`,
        { ...form, projectId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setForm({
        title: "",
        description: "",
        priority: "medium",
        assignee: "",
        status: "todo",
      });

      fetchTickets();
    } catch (err) {
      console.error("Error creating ticket:", err);
    }
  };

  // ================= UPDATE STATUS (Drag & Drop) =================
  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `${API_URL}/tickets/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchTickets();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // ================= UI =================
  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      <h1 className="text-2xl font-semibold">Project Tickets</h1>

      {/* ================= FILTERS ================= */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <select
          className="border p-1"
          value={draftFilters.status}
          onChange={(e) =>
            setDraftFilters({ ...draftFilters, status: e.target.value })
          }
        >
          <option value="">All Status</option>
          <option value="todo">To Do</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <select
          className="border p-1"
          value={draftFilters.priority}
          onChange={(e) =>
            setDraftFilters({ ...draftFilters, priority: e.target.value })
          }
        >
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <input
          className="border p-1"
          placeholder="Assignee email"
          value={draftFilters.assignee}
          onChange={(e) =>
            setDraftFilters({ ...draftFilters, assignee: e.target.value })
          }
        />

        <input
          className="border p-1 flex-1"
          placeholder="Search tickets..."
          value={draftFilters.search}
          onChange={(e) =>
            setDraftFilters({ ...draftFilters, search: e.target.value })
          }
        />

        <button
          className="bg-blue-500 text-white px-3"
          onClick={() => setFilters(draftFilters)}
        >
          Apply
        </button>
      </div>

      {/* ================= CREATE ================= */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="font-medium mb-4">Create New Ticket</h2>

        <form onSubmit={createTicket} className="grid md:grid-cols-4 gap-4">
          <input
            className="border rounded-lg p-2"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
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

          <select
            className="border rounded-lg p-2"
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <select
            className="border rounded-lg p-2"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="todo">To Do</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
          </select>

          <input
            className="border rounded-lg p-2"
            placeholder="Assignee"
            value={form.assignee}
            onChange={(e) => setForm({ ...form, assignee: e.target.value })}
          />

          <button className="bg-blue-600 text-white px-4 rounded">
            + Add
          </button>
        </form>
      </div>

      {/* ================= KANBAN ================= */}
      <KanbanBoard
        tickets={tickets}
        updateStatus={updateStatus}
        token={token}
        user={user}
        fetchTickets={fetchTickets}
      />
    </div>
  );
}
