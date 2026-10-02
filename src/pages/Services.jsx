import { useEffect, useState } from "react";
import api from "../services/api";

function Services() {
  const emptyForm = {
    title: "",
    description: "",
    icon: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [services, setServices] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const getConfig = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const fetchServices = async () => {
    try {
      const response = await api.get("/services/");
      setServices(response.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load services.");
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      if (editingId) {
        await api.put(`/services/${editingId}`, form, getConfig());
        setMessage("Service updated successfully!");
      } else {
        await api.post("/services/", form, getConfig());
        setMessage("Service added successfully!");
      }

      resetForm();
      await fetchServices();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail || "Failed to save service."
      );
    }
  };

  const handleEdit = (service) => {
    setEditingId(service.id);
    setForm({
      title: service.title || "",
      description: service.description || "",
      icon: service.icon || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) {
      return;
    }

    try {
      await api.delete(`/services/${id}`, getConfig());
      setMessage("Service deleted successfully!");
      await fetchServices();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail || "Failed to delete service."
      );
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 px-8 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold">Services</h1>
        <p className="mb-8 mt-2 text-zinc-500">
          Manage the services displayed on your portfolio.
        </p>

        {message && (
          <p className="mb-5 rounded-xl bg-green-500/10 p-4 text-green-400">
            {message}
          </p>
        )}

        {error && (
          <p className="mb-5 rounded-xl bg-red-500/10 p-4 text-red-400">
            {error}
          </p>
        )}

        <div className="mb-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="mb-6 text-xl font-semibold">
            {editingId ? "Edit Service" : "Add New Service"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Service Title
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Web Development"
                required
                className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your service..."
                rows="4"
                className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Icon Name
              </label>
              <input
                name="icon"
                value={form.icon}
                onChange={handleChange}
                placeholder="Code2"
                className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="rounded-xl bg-purple-600 px-6 py-3 font-medium hover:bg-purple-500"
              >
                {editingId ? "Update Service" : "Add Service"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-white/10 px-6 py-3 text-zinc-300 hover:bg-white/5"
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Saved Services</h2>
          <button
            onClick={fetchServices}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
          >
            Refresh
          </button>
        </div>

        {services.length === 0 ? (
          <p className="rounded-xl border border-white/10 p-8 text-center text-zinc-500">
            No services added yet.
          </p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {services.map((service) => (
              <div
                key={service.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <p className="mb-2 text-sm text-purple-400">
                  {service.icon || "Service"}
                </p>
                <h3 className="text-lg font-semibold">{service.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  {service.description || "No description provided."}
                </p>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => handleEdit(service)}
                    className="rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="rounded-lg border border-red-500/20 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
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
  );
}

export default Services;
