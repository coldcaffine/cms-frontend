import { useEffect, useState } from "react";
import api from "../services/api";

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

function Skills() {
  const [skills, setSkills] = useState([]);

  const [form, setForm] = useState({
    name: "",
    category: "",
    level: "",
  });

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/skills/");

      console.log("SKILLS:", response.data);

      setSkills(response.data);
    } catch (err) {
      console.log(
        "SKILLS GET ERROR:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.detail ||
          "Failed to load skills."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  const resetForm = () => {
    setForm({
      name: "",
      category: "",
      level: "",
    });

    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      let response;

      if (editingId) {
        response = await api.put(
          `/skills/${editingId}`,
          form,
          getAuthConfig()
        );

        setSkills((prev) =>
          prev.map((skill) =>
            skill.id === editingId
              ? response.data
              : skill
          )
        );

        setMessage("Skill updated successfully!");
      } else {
        response = await api.post(
          "/skills/",
          form,
          getAuthConfig()
        );

        setSkills((prev) => [
          ...prev,
          response.data,
        ]);

        setMessage("Skill added successfully!");
      }

      resetForm();
    } catch (err) {
      console.log(
        "SKILL SAVE ERROR:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.detail ||
          "Failed to save skill."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (skill) => {
    setEditingId(skill.id);

    setForm({
      name: skill.name || "",
      category: skill.category || "",
      level: skill.level || "",
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    try {
      setMessage("");
      setError("");

      await api.delete(
        `/skills/${id}`,
        getAuthConfig()
      );

      setSkills((prev) =>
        prev.filter((skill) => skill.id !== id)
      );

      if (editingId === id) {
        resetForm();
      }

      setMessage("Skill deleted successfully!");
    } catch (err) {
      console.log(
        "SKILL DELETE ERROR:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.detail ||
          "Failed to delete skill."
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-full bg-gray-50 p-8">
        <p className="text-gray-600">
          Loading skills...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50 p-8">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Skills
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage the skills displayed on your portfolio.
        </p>
      </div>

      {/* SUCCESS MESSAGE */}
      {message && (
        <div className="mb-5 max-w-4xl rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mb-5 max-w-4xl rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {typeof error === "string"
            ? error
            : JSON.stringify(error)}
        </div>
      )}

      {/* ADD / EDIT FORM */}
      <section className="mb-8 max-w-4xl rounded-xl border border-gray-200 bg-white p-6">

        <div className="mb-5 flex items-center justify-between">

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {editingId ? "Edit Skill" : "Add Skill"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {editingId
                ? "Update this skill."
                : "Add a new skill to your portfolio."}
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-sm text-gray-500 hover:text-black"
            >
              Cancel Edit
            </button>
          )}

        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-5 md:grid-cols-3"
        >

          {/* SKILL NAME */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Skill Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Python"
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 outline-none focus:border-black"
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Category
            </label>

            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Programming"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 outline-none focus:border-black"
            />
          </div>

          {/* LEVEL */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Level
            </label>

            <input
              type="text"
              name="level"
              value={form.level}
              onChange={handleChange}
              placeholder="Intermediate"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 outline-none focus:border-black"
            />
          </div>

          {/* BUTTON */}
          <div className="flex justify-end md:col-span-3">

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Skill"
                : "Add Skill"}
            </button>

          </div>

        </form>
      </section>

      {/* SKILLS LIST */}
      <section className="max-w-4xl rounded-xl border border-gray-200 bg-white">

        <div className="border-b border-gray-200 px-6 py-5">

          <h2 className="text-lg font-semibold text-gray-900">
            Your Skills
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {skills.length}{" "}
            {skills.length === 1
              ? "skill"
              : "skills"}{" "}
            added
          </p>

        </div>

        {skills.length === 0 ? (

          <div className="px-6 py-12 text-center">

            <p className="text-gray-500">
              No skills added yet.
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Add your first skill using the form above.
            </p>

          </div>

        ) : (

          <div className="divide-y divide-gray-200">

            {skills.map((skill) => (

              <div
                key={skill.id}
                className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between"
              >

                <div>

                  <h3 className="font-semibold text-gray-900">
                    {skill.name}
                  </h3>

                  <div className="mt-2 flex flex-wrap gap-2">

                    {skill.category && (
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                        {skill.category}
                      </span>
                    )}

                    {skill.level && (
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                        {skill.level}
                      </span>
                    )}

                  </div>

                </div>

                <div className="flex gap-2">

                  <button
                    type="button"
                    onClick={() => handleEdit(skill)}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(skill.id)}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

    </div>
  );
}

export default Skills;

