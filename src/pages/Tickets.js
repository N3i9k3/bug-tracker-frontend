import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function Tickets() {
  const { projectId } = useParams();
  const token = localStorage.getItem("token");

  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    assignee: "",
  });

  // ================= FETCH =================
  const fetchTickets = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/tickets/project/${projectId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setTickets(res.data || []);
  };

  // ================= CREATE =================
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
      `http://localhost:5000/api/tickets/${id}`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchTickets();
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const statusColors = {
    todo: "bg-gray-200 text-gray-800",
    inprogress: "bg-yellow-200 text-yellow-800",
    done: "bg-green-200 text-green-800",
  };

  const priorityColors = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-indigo-100 text-indigo-800",
    high: "bg-red-100 text-red-800",
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      <h1 className="text-2xl font-semibold">Project Tickets</h1>

      {/* ================= CREATE FORM ================= */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="font-medium mb-4">Create New Ticket</h2>

        <form onSubmit={createTicket} className="grid md:grid-cols-3 gap-4">
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

          <div className="flex gap-2">
            <select
              className="border rounded-lg p-2"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <input
              className="border rounded-lg p-2 flex-1"
              placeholder="Assignee"
              value={form.assignee}
              onChange={(e) => setForm({ ...form, assignee: e.target.value })}
            />

            <button className="bg-blue-600 text-white px-4 rounded">
              + Add
            </button>
          </div>
        </form>
      </div>

      {/* ================= TICKETS ================= */}
      {tickets.length === 0 ? (
        <div className="text-center text-gray-400 py-16">
          No tickets yet
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((t) => (
            <div
              key={t._id}
              className="relative bg-white rounded-2xl shadow p-5 border hover:shadow-lg"
            >
              {/* DELETE BUTTON */}
              <button
                onClick={() => deleteTicket(t._id)}
                className="absolute top-3 right-3 text-red-500 hover:text-red-700"
              >
                ❌
              </button>

              <h3 className="font-semibold text-lg mb-2">{t.title}</h3>
              <p className="text-gray-600 text-sm mb-4">
                {t.description || "No description"}
              </p>

              <div className="flex flex-wrap gap-2 text-xs items-center">
                {/* STATUS DROPDOWN */}
                <select
                  value={t.status || "todo"}
                  onChange={(e) => updateStatus(t._id, e.target.value)}
                  className={`px-2 py-1 rounded ${statusColors[t.status || "todo"]}`}
                >
                  <option value="todo">Todo</option>
                  <option value="inprogress">In Progress</option>
                  <option value="done">Done</option>
                </select>

                <span
                  className={`px-2 py-1 rounded ${priorityColors[t.priority]}`}
                >
                  {t.priority}
                </span>

                <span className="px-2 py-1 rounded bg-gray-100">
                  {t.assignee || "Unassigned"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
