import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useSearchParams } from "react-router-dom";
import KanbanBoard from "../components/KanbanBoard";

export default function Tickets() {
  const { projectId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // ================= TOKEN =================
  const token = localStorage.getItem("token");

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

  // ================= FILTERS (PERSISTENT) =================
  const [filters, setFilters] = useState({
    status: searchParams.get("status") || "",
    priority: searchParams.get("priority") || "",
    assignee: searchParams.get("assignee") || "",
    search: searchParams.get("search") || "",
  });

  // ================= FETCH TICKETS =================
  const fetchTickets = async () => {
    const query = new URLSearchParams(filters).toString();

    const res = await axios.get(
      `http://localhost:5000/api/tickets/project/${projectId}?${query}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setTickets(res.data || []);
  };

  // ================= SYNC FILTERS → URL =================
  useEffect(() => {
    setSearchParams(filters);
  }, [filters]);

  // ================= AUTO FETCH =================
  useEffect(() => {
    fetchTickets();
  }, [projectId]);

  // ================= CREATE TICKET =================
  const createTicket = async (e) => {
    e.preventDefault();

    await axios.post(
      "http://localhost:5000/api/tickets",
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
  };

  // ================= DELETE =================
  const deleteTicket = async (id) => {
    await axios.delete(
      `http://localhost:5000/api/tickets/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchTickets();
  };

  // ================= UPDATE STATUS =================
  const updateStatus = async (id, status) => {
    await axios.put(
      `http://localhost:5000/api/tickets/${id}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchTickets();
  };

  // ================= UI =================
  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      <h1 className="text-2xl font-semibold">Project Tickets</h1>

      {/* ================= FILTER FORM ================= */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <select
          className="border p-1"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All Status</option>
          <option value="todo">To Do</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <select
          className="border p-1"
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
        >
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <input
          className="border p-1"
          placeholder="Assignee email"
          value={filters.assignee}
          onChange={(e) => setFilters({ ...filters, assignee: e.target.value })}
        />

        <input
          className="border p-1 flex-1"
          placeholder="Search tickets..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />

        <button
          className="bg-blue-500 text-white px-3"
          onClick={fetchTickets}
        >
          Apply
        </button>
      </div>

      {/* ================= CREATE FORM ================= */}
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
            onChange={(e) => setForm({ ...form, description: e.target.value })}
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
      />
    </div>
  );
}
