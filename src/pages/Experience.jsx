import { useEffect, useState } from "react";
import api from "../services/api";

const emptyForm = {
  role: "",
  company: "",
  description: "",
  start_date: "",
  end_date: "",
};

const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

function Experience() {
  const [experiences, setExperiences] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/experience/");
      setExperiences(response.data);
    } catch (err) {
      console.error(
        "EXPERIENCE GET ERROR:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.detail ||
          "Could not load experience."
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
      role: form.role,
      company: form.company || null,
      description: form.description || null,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
    };

    try {
      let response;

      if (editingId !== null) {
        response = await api.put(
          `/experience/${editingId}`,
          payload,
          authConfig()
        );

        setExperiences((prev) =>
          prev.map((experience) =>
            experience.id === editingId
              ? response.data
              : experience
          )
        );

        setMessage("Experience updated successfully!");
      } else {
        response = await api.post(
          "/experience/",
          payload,
          authConfig()
        );

        setExperiences((prev) => [
          ...prev,
          response.data,
        ]);

        setMessage("Experience added successfully!");
      }

      resetForm();
    } catch (err) {
      console.error(
        "EXPERIENCE SAVE ERROR:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.detail ||
          "Could not save experience."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (experience) => {
    setEditingId(experience.id);

    setForm({
      role: experience.role || "",
      company: experience.company || "",
      description: experience.description || "",
      start_date: experience.start_date || "",
      end_date: experience.end_date || "",
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
      "Are you sure you want to delete this experience?"
    );

    if (!confirmed) return;

    setMessage("");
    setError("");

    try {
      await api.delete(
        `/experience/${id}`,
        authConfig()
      );

      setExperiences((prev) =>
        prev.filter(
          (experience) => experience.id !== id
        )
      );

      if (editingId === id) {
        resetForm();
      }

      setMessage("Experience deleted successfully!");
    } catch (err) {
      console.error(
        "EXPERIENCE DELETE ERROR:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.detail ||
          "Could not delete experience."
      );
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-purple-500";

  if (loading) {
    return (
      <div className="min-h-full bg-gray-50 p-8 text-gray-700">
        Loading experience...
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
          Experience
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Add and manage your work, internship, and professional experience.
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
            ? "Edit Experience"
            : "Add Experience"}
        </h2>

        <p className="mb-6 text-sm text-gray-500">
          {editingId !== null
            ? "Update the details below."
            : "Add a new experience to your portfolio."}
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div className="grid gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Role *
              </label>

              <input
                name="role"
                value={form.role}
                onChange={handleChange}
                placeholder="Software Engineering Intern"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Company
              </label>

              <input
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Company Name"
                className={inputClass}
              />
            </div>

          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe what you worked on and what you accomplished..."
              rows={5}
              className={inputClass}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Start Date
              </label>

              <input
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                placeholder="June 2026"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                End Date
              </label>

              <input
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                placeholder="August 2026 / Present"
                className={inputClass}
              />
            </div>

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
                ? "Update Experience"
                : "Add Experience"}
            </button>

          </div>

        </form>
      </section>

      <section className="max-w-4xl overflow-hidden rounded-xl border border-gray-200 bg-white">

        <div className="border-b border-gray-200 px-6 py-5">

          <h2 className="text-lg font-semibold">
            Your Experience
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {experiences.length}{" "}
            {experiences.length === 1
              ? "experience"
              : "experiences"}{" "}
            added
          </p>

        </div>

        {experiences.length === 0 ? (

          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">
              No experience added yet.
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Add your first experience using the form above.
            </p>
          </div>

        ) : (

          <div className="divide-y divide-gray-200">

            {experiences.map((experience) => (

              <article
                key={experience.id}
                className="p-6"
              >

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                  <div className="min-w-0">

                    <h3 className="text-xl font-semibold">
                      {experience.role}
                    </h3>

                    {experience.company && (
                      <p className="mt-1 font-medium text-purple-600">
                        {experience.company}
                      </p>
                    )}

                    {(experience.start_date ||
                      experience.end_date) && (
                      <p className="mt-2 text-sm text-gray-400">
                        {experience.start_date || "—"}
                        {" — "}
                        {experience.end_date || "Present"}
                      </p>
                    )}

                    {experience.description && (
                      <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                        {experience.description}
                      </p>
                    )}

                  </div>

                  <div className="flex shrink-0 gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(experience)
                      }
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(experience.id)
                      }
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </article>

            ))}

          </div>

        )}

      </section>

    </div>
  );
}

export default Experience;

