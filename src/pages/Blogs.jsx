import { useEffect, useState } from "react";
import api from "../services/api";

const emptyForm = {
  title: "",
  content: "",
  excerpt: "",
  cover_image: "",
  published: "No",
};

const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/blogs/");
      setBlogs(response.data);
    } catch (err) {
      console.error("BLOGS GET ERROR:", err.response?.data || err);

      setError(
        err.response?.data?.detail || "Could not load blogs."
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
      title: form.title,
      content: form.content,
      excerpt: form.excerpt || null,
      cover_image: form.cover_image || null,
      published: form.published,
    };

    try {
      let response;

      if (editingId !== null) {
        response = await api.put(
          `/blogs/${editingId}`,
          payload,
          authConfig()
        );

        setBlogs((prev) =>
          prev.map((blog) =>
            blog.id === editingId ? response.data : blog
          )
        );

        setMessage("Blog updated successfully!");
      } else {
        response = await api.post(
          "/blogs/",
          payload,
          authConfig()
        );

        setBlogs((prev) => [...prev, response.data]);

        setMessage("Blog added successfully!");
      }

      resetForm();
    } catch (err) {
      console.error(
        "BLOG SAVE ERROR:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.detail || "Could not save blog."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (blog) => {
    setEditingId(blog.id);

    setForm({
      title: blog.title || "",
      content: blog.content || "",
      excerpt: blog.excerpt || "",
      cover_image: blog.cover_image || "",
      published: blog.published || "No",
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
      "Are you sure you want to delete this blog?"
    );

    if (!confirmed) return;

    setMessage("");
    setError("");

    try {
      await api.delete(
        `/blogs/${id}`,
        authConfig()
      );

      setBlogs((prev) =>
        prev.filter((blog) => blog.id !== id)
      );

      if (editingId === id) {
        resetForm();
      }

      setMessage("Blog deleted successfully!");
    } catch (err) {
      console.error(
        "BLOG DELETE ERROR:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.detail ||
          "Could not delete blog."
      );
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-purple-500";

  if (loading) {
    return (
      <div className="min-h-full bg-gray-50 p-8 text-gray-700">
        Loading blogs...
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
          Blogs
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Write and manage the blog posts displayed on your portfolio.
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
            ? "Edit Blog"
            : "Add Blog"}
        </h2>

        <p className="mb-6 text-sm text-gray-500">
          {editingId !== null
            ? "Update the details below."
            : "Create a new blog post."}
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Blog Title *
            </label>

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="My Journey Learning Full-Stack Development"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Excerpt
            </label>

            <textarea
              name="excerpt"
              value={form.excerpt}
              onChange={handleChange}
              placeholder="A short description of your blog post..."
              rows={3}
              className={inputClass}
            />

            <p className="mt-1 text-xs text-gray-400">
              A short preview that can be shown before opening the full post.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Content *
            </label>

            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Write your blog content here..."
              rows={12}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Cover Image URL
            </label>

            <input
              type="url"
              name="cover_image"
              value={form.cover_image}
              onChange={handleChange}
              placeholder="https://example.com/blog-cover.jpg"
              className={inputClass}
            />

            {form.cover_image && (
              <div className="mt-3">
                <p className="mb-2 text-xs text-gray-500">
                  Image preview
                </p>

                <img
                  src={form.cover_image}
                  alt="Blog cover preview"
                  className="max-h-56 rounded-lg border border-gray-200 object-cover"
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

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Published
            </label>

            <select
              name="published"
              value={form.published}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="No">No — Draft</option>
              <option value="Yes">Yes — Published</option>
            </select>
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
                ? "Update Blog"
                : "Add Blog"}
            </button>

          </div>

        </form>
      </section>

      <section className="max-w-4xl overflow-hidden rounded-xl border border-gray-200 bg-white">

        <div className="border-b border-gray-200 px-6 py-5">

          <h2 className="text-lg font-semibold">
            Your Blogs
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {blogs.length}{" "}
            {blogs.length === 1 ? "blog" : "blogs"}{" "}
            added
          </p>

        </div>

        {blogs.length === 0 ? (

          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">
              No blogs added yet.
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Create your first blog using the form above.
            </p>
          </div>

        ) : (

          <div className="divide-y divide-gray-200">

            {blogs.map((blog) => (

              <article
                key={blog.id}
                className="flex flex-col gap-4 p-6"
              >

                {blog.cover_image && (
                  <img
                    src={blog.cover_image}
                    alt={blog.title}
                    className="h-48 w-full rounded-lg border border-gray-200 object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}

                <div>

                  <div className="flex flex-wrap items-start justify-between gap-3">

                    <h3 className="text-xl font-semibold">
                      {blog.title}
                    </h3>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        blog.published === "Yes"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {blog.published === "Yes"
                        ? "Published"
                        : "Draft"}
                    </span>

                  </div>

                  {blog.excerpt && (
                    <p className="mt-2 text-sm text-gray-600">
                      {blog.excerpt}
                    </p>
                  )}

                  <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-gray-500">
                    {blog.content}
                  </p>

                  <div className="mt-5 flex gap-2">

                    <button
                      type="button"
                      onClick={() => handleEdit(blog)}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(blog.id)}
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

export default Blogs;

