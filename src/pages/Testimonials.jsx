import { useEffect, useState } from "react";
import api from "../services/api";

function Testimonials() {
  const emptyForm = {
    name: "",
    role: "",
    content: "",
    image_url: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [testimonials, setTestimonials] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const getToken = () => localStorage.getItem("token");

  const authConfig = () => ({
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const fetchTestimonials = async () => {
    try {
      setError("");

      const response = await api.get("/testimonials/");
      setTestimonials(response.data);
    } catch (err) {
      console.error("FETCH TESTIMONIALS ERROR:", err);
      setError(
        err.response?.data?.detail ||
          "Failed to load testimonials."
      );
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const token = getToken();

    if (!token) {
      setError("You are not logged in. Please sign in again.");
      return;
    }

    try {
      if (editingId) {
        await api.put(
          `/testimonials/${editingId}`,
          form,
          authConfig()
        );

        setMessage("Testimonial updated successfully.");
      } else {
        await api.post(
          "/testimonials/",
          form,
          authConfig()
        );

        setMessage("Testimonial saved successfully.");
      }

      resetForm();
      await fetchTestimonials();
    } catch (err) {
      console.error("TESTIMONIAL SAVE ERROR:", err);

      if (err.response?.status === 401) {
        setError(
          "Your login session expired. Please sign out and log in again."
        );
      } else {
        setError(
          err.response?.data?.detail ||
            "Failed to save testimonial."
        );
      }
    }
  };

  const handleEdit = (testimonial) => {
    setEditingId(testimonial.id);

    setForm({
      name: testimonial.name || "",
      role: testimonial.role || "",
      content: testimonial.content || "",
      image_url: testimonial.image_url || "",
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    setMessage("");
    setError("");

    try {
      await api.delete(
        `/testimonials/${id}`,
        authConfig()
      );

      setMessage("Testimonial deleted successfully.");
      await fetchTestimonials();
    } catch (err) {
      console.error("DELETE TESTIMONIAL ERROR:", err);

      if (err.response?.status === 401) {
        setError(
          "Your login session expired. Please sign out and log in again."
        );
      } else {
        setError(
          err.response?.data?.detail ||
            "Failed to delete testimonial."
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 px-8 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Testimonials
          </h1>

          <p className="mt-2 text-zinc-500">
            Manage testimonials displayed on your portfolio.
          </p>
        </div>

        {message && (
          <div className="mb-6 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="mb-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                {editingId
                  ? "Edit Testimonial"
                  : "Add Testimonial"}
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Add feedback from clients, mentors, or collaborators.
              </p>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-5 md:grid-cols-2"
          >
            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Name
              </label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="w-full rounded-xl border border-white/10 bg-white px-4 py-3 text-black outline-none placeholder:text-zinc-400 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Role
              </label>

              <input
                name="role"
                value={form.role}
                onChange={handleChange}
                placeholder="Founder / Developer"
                className="w-full rounded-xl border border-white/10 bg-white px-4 py-3 text-black outline-none placeholder:text-zinc-400 focus:border-purple-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-zinc-300">
                Testimonial
              </label>

              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                placeholder="Write the testimonial..."
                rows={5}
                required
                className="w-full resize-none rounded-xl border border-white/10 bg-white px-4 py-3 text-black outline-none placeholder:text-zinc-400 focus:border-purple-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-zinc-300">
                Image URL
              </label>

              <input
                name="image_url"
                value={form.image_url}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
                className="w-full rounded-xl border border-white/10 bg-white px-4 py-3 text-black outline-none placeholder:text-zinc-400 focus:border-purple-500"
              />
            </div>

            <div className="flex gap-3 md:col-span-2">
              <button
                type="submit"
                className="rounded-xl bg-purple-600 px-6 py-3 font-medium text-white transition hover:bg-purple-500"
              >
                {editingId
                  ? "Update Testimonial"
                  : "Save Testimonial"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-white/10 px-6 py-3 text-zinc-400 transition hover:bg-white/5 hover:text-white"
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        <div>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Saved Testimonials
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                {testimonials.length} testimonial
                {testimonials.length !== 1 ? "s" : ""}
              </p>
            </div>

            <button
              onClick={fetchTestimonials}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white"
            >
              Refresh
            </button>
          </div>

          {testimonials.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center">
              <p className="text-zinc-500">
                No testimonials yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                >
                  <div className="flex items-start gap-4">
                    {testimonial.image_url ? (
                      <img
                        src={testimonial.image_url}
                        alt={testimonial.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10 text-sm font-semibold text-purple-400">
                        {testimonial.name
                          ?.charAt(0)
                          ?.toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-white">
                        {testimonial.name}
                      </h3>

                      {testimonial.role && (
                        <p className="mt-1 text-sm text-zinc-500">
                          {testimonial.role}
                        </p>
                      )}
                    </div>
                  </div>

                  <p className="mt-5 whitespace-pre-wrap text-sm leading-6 text-zinc-400">
                    “{testimonial.content}”
                  </p>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => handleEdit(testimonial)}
                      className="rounded-lg border border-white/10 px-4 py-2 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(testimonial.id)
                      }
                      className="rounded-lg border border-red-500/20 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Testimonials;
