import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_URL } from "../config"; // ✅ Use live backend URL

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const token = localStorage.getItem("token");

  // ===== Fetch Projects =====
  const fetchProjects = useCallback(async () => {
    if (!token) return;

    try {
      const res = await axios.get(`${API_URL}/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data || []);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  }, [token]);

  // ===== Create Project =====
  const createProject = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    try {
      await axios.post(
        `${API_URL}/projects`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setForm({ title: "", description: "" });
      fetchProjects();
    } catch (err) {
      console.error("Error creating project:", err);
    }
  };

  // ===== Delete Project =====
  const deleteProject = async (id) => {
    const confirmDelete = window.confirm("Delete this project?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  // ===== useEffect to fetch projects =====
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-gray-500 text-sm">
            Manage and organize your workspaces efficiently
          </p>
        </div>

        {/* Create Project */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Create New Project</h2>

          <form onSubmit={createProject} className="grid md:grid-cols-3 gap-4">
            <input
              className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none w-full"
              placeholder="Project Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <input
              className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none w-full"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <button
              type="submit"
              className="bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition px-6 py-3"
            >
              + Create
            </button>
          </form>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center text-gray-400 py-16">
            No projects yet. Create one to get started.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-2xl shadow hover:shadow-xl p-5 border border-gray-200 flex flex-col justify-between"
              >
                <Link to={`/projects/${p._id}`}>
                  <h2 className="font-semibold text-lg mb-2">{p.title}</h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {p.description || "No description provided"}
                  </p>

                  <div className="text-xs text-gray-500 mb-4">
                    👥{" "}
                    {p.teamMembers?.length
                      ? p.teamMembers.map((m) => m.name || m.email).join(", ")
                      : "No members"}
                  </div>
                </Link>

                {/* Delete Button */}
                <button
                  onClick={() => deleteProject(p._id)}
                  className="text-red-500 text-sm hover:text-red-700 self-end"
                >
                  🗑 Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
