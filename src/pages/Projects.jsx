import { useEffect, useState } from "react";
import api from "../services/api";

const emptyForm = {
  title: "",
  description: "",
  tech_stack: "",
  github_url: "",
  live_url: "",
  image_url: "",
};

const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

function Projects() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/projects/");
      setProjects(response.data);
    } catch (err) {
      console.error("PROJECTS GET ERROR:", err.response?.data || err);
      setError(
        err.response?.data?.detail || "Could not load projects."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setMessage("");
    setError("");
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    const payload = {
      ...form,
      description: form.description || null,
      tech_stack: form.tech_stack || null,
      github_url: form.github_url || null,
      live_url: form.live_url || null,
      image_url: form.image_url || null,
    };

    try {
      let response;

      if (editingId !== null) {
        response = await api.put(
          `/projects/${editingId}`,
          payload,
          authConfig()
        );

        setProjects((prev) =>
          prev.map((project) =>
            project.id === editingId ? response.data : project
          )
        );

        setMessage("Project updated successfully!");
      } else {
        response = await api.post(
          "/projects/",
          payload,
          authConfig()
        );

        setProjects((prev) => [...prev, response.data]);

        setMessage("Project added successfully!");
      }

      resetForm();
    } catch (err) {
      console.error(
        "PROJECT SAVE ERROR:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.detail || "Could not save project."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (project) => {
    setEditingId(project.id);

    setForm({
      title: project.title || "",
      description: project.description || "",
      tech_stack: project.tech_stack || "",
      github_url: project.github_url || "",
      live_url: project.live_url || "",
      image_url: project.image_url || "",
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) return;

    setMessage("");
    setError("");

    try {
      await api.delete(
        `/projects/${id}`,
        authConfig()
      );

      setProjects((prev) =>
        prev.filter((project) => project.id !== id)
      );

      if (editingId === id) {
        resetForm();
      }

      setMessage("Project deleted successfully!");
    } catch (err) {
      console.error(
        "PROJECT DELETE ERROR:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.detail ||
          "Could not delete project."
      );
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-purple-500";

  if (loading) {
    return (
      <div className="min-h-full bg-gray-50 p-8 text-gray-700">
        Loading projects...
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50 p-6 text-gray-900 md:p-8">

      <div className="mb-8">
        <p className="text-sm uppercase tracking-widest text-purple-600">
          Portfolio Content
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Projects
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Add and manage the projects displayed on your portfolio.
        </p>
      </div>

      {message && (
        <div className="mb-5 max-w-4xl rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-5 max-w-4xl rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {typeof error === "string"
            ? error
            : JSON.stringify(error)}
        </div>
      )}

      <section className="mb-8 max-w-4xl rounded-xl border border-gray-200 bg-white p-6 md:p-8">

        <h2 className="mb-1 text-xl font-semibold">
          {editingId !== null
            ? "Edit Project"
            : "Add Project"}
        </h2>

        <p className="mb-6 text-sm text-gray-500">
          {editingId !== null
            ? "Update the details below."
            : "Fill in the details for your new project."}
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Project Title *
            </label>

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Portfolio CMS"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="What does this project do?"
              rows={4}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Tech Stack
            </label>

            <input
              name="tech_stack"
              value={form.tech_stack}
              onChange={handleChange}
              placeholder="React, FastAPI, PostgreSQL"
              className={inputClass}
            />

            <p className="mt-1 text-xs text-gray-400">
              Separate technologies with commas.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                GitHub URL
              </label>

              <input
                type="url"
                name="github_url"
                value={form.github_url}
                onChange={handleChange}
                placeholder="https://github.com/..."
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Live Demo URL
              </label>

              <input
                type="url"
                name="live_url"
                value={form.live_url}
                onChange={handleChange}
                placeholder="https://your-project.com"
                className={inputClass}
              />
            </div>

          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Project Image URL
            </label>

            <input
              type="url"
              name="image_url"
              value={form.image_url}
              onChange={handleChange}
              placeholder="https://example.com/project-image.png"
              className={inputClass}
            />

            {form.image_url && (
              <div className="mt-3">
                <p className="mb-2 text-xs text-gray-500">
                  Image preview
                </p>

                <img
                  src={form.image_url}
                  alt="Project preview"
                  className="max-h-48 rounded-lg border border-gray-200 object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                  onLoad={(e) => {
                    e.currentTarget.style.display = "block";
                  }}
                />
              </div>
            )}
          </div>

          <div className="flex flex-wrap justify-end gap-3 pt-2">

            {editingId !== null && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-500 disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingId !== null
                ? "Update Project"
                : "Add Project"}
            </button>

          </div>

        </form>
      </section>

      <section className="max-w-4xl overflow-hidden rounded-xl border border-gray-200 bg-white">

        <div className="border-b border-gray-200 px-6 py-5">

          <h2 className="text-lg font-semibold">
            Your Projects
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {projects.length}{" "}
            {projects.length === 1
              ? "project"
              : "projects"}{" "}
            added
          </p>

        </div>

        {projects.length === 0 ? (

          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">
              No projects added yet.
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Add your first project using the form above.
            </p>
          </div>

        ) : (

          <div className="divide-y divide-gray-200">

            {projects.map((project) => (

              <article
                key={project.id}
                className="flex flex-col gap-4 p-6 sm:flex-row"
              >

                {project.image_url && (
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="h-32 w-full rounded-lg border border-gray-200 object-cover sm:w-40"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}

                <div className="min-w-0 flex-1">

                  <h3 className="text-lg font-semibold">
                    {project.title}
                  </h3>

                  {project.description && (
                    <p className="mt-2 whitespace-pre-wrap text-sm text-gray-600">
                      {project.description}
                    </p>
                  )}

                  {project.tech_stack && (
                    <p className="mt-3 text-sm text-gray-500">
                      <span className="font-medium text-gray-700">
                        Tech:
                      </span>{" "}
                      {project.tech_stack}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap gap-3 text-sm">

                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-purple-700 underline"
                      >
                        GitHub
                      </a>
                    )}

                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-purple-700 underline"
                      >
                        Live Demo
                      </a>
                    )}

                  </div>

                </div>

                <div className="flex shrink-0 gap-2">

                  <button
                    type="button"
                    onClick={() => handleEdit(project)}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(project.id)}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                  >
                    Delete
                  </button>

                </div>

              </article>

            ))}

          </div>

        )}

      </section>

    </div>
  );
}

export default Projects;

