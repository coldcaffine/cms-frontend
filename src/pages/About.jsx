import { useEffect, useState } from "react";
import api from "../services/api";

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

function About() {
  const [form, setForm] = useState({
    id: null,
    name: "",
    headline: "",
    bio: "",
    location: "",
    email: "",
    github: "",
    linkedin: "",
    profile_image: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadAbout();
  }, []);

  const loadAbout = async () => {
    try {
      const response = await api.get("/about/");

      console.log("ABOUT GET:", response.data);

      setForm({
        id: response.data.id,
        name: response.data.name || "",
        headline: response.data.headline || "",
        bio: response.data.bio || "",
        location: response.data.location || "",
        email: response.data.email || "",
        github: response.data.github || "",
        linkedin: response.data.linkedin || "",
        profile_image: response.data.profile_image || "",
      });
    } catch (err) {
      console.log("ABOUT GET ERROR:", err.response?.data || err);

      // 404 means there is no About row yet.
      // That's okay — the first Save will create it.
      if (err.response?.status !== 404) {
        setError(
          err.response?.data?.detail ||
          "Could not load About information."
        );
      }
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    console.log("================================");
    console.log("SENDING ABOUT DATA:", form);
    console.log("TOKEN:", localStorage.getItem("token"));
    console.log("================================");

    try {
      let response;

      if (form.id) {
        // Existing About record → UPDATE
        response = await api.put(
          "/about/",
          {
            name: form.name,
            headline: form.headline,
            bio: form.bio,
            location: form.location,
            email: form.email,
            github: form.github,
            linkedin: form.linkedin,
            profile_image: form.profile_image,
          },
          getAuthConfig()
        );
      } else {
        // No About record → CREATE
        response = await api.post(
          "/about/",
          {
            name: form.name,
            headline: form.headline,
            bio: form.bio,
            location: form.location,
            email: form.email,
            github: form.github,
            linkedin: form.linkedin,
            profile_image: form.profile_image,
          },
          getAuthConfig()
        );
      }

      console.log("ABOUT RESPONSE:", response.data);

      setForm({
        id: response.data.id,
        name: response.data.name || "",
        headline: response.data.headline || "",
        bio: response.data.bio || "",
        location: response.data.location || "",
        email: response.data.email || "",
        github: response.data.github || "",
        linkedin: response.data.linkedin || "",
        profile_image: response.data.profile_image || "",
      });

      setMessage("About information saved successfully!");
    } catch (err) {
      console.log("================================");
      console.log("ABOUT SAVE ERROR:", err);
      console.log("STATUS:", err.response?.status);
      console.log("RESPONSE:", err.response?.data);
      console.log("================================");

      setError(
        err.response?.data?.detail ||
        "Something went wrong while saving."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-full bg-gray-50 p-8">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          About Me
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Update the information displayed on your portfolio.
        </p>
      </div>

      {message && (
        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {typeof error === "string"
            ? error
            : JSON.stringify(error)}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">

        {/* Basic Information */}
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-5 text-lg font-semibold text-gray-900">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Name
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-black"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Headline
              </label>

              <input
                type="text"
                name="headline"
                value={form.headline}
                onChange={handleChange}
                placeholder="Your headline"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-black"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Location
              </label>

              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Your location"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-black"
              />
            </div>

          </div>
        </section>

        {/* Biography */}
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-5 text-lg font-semibold text-gray-900">
            Biography
          </h2>

          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Write something about yourself..."
            rows={7}
            className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
            required
          />
        </section>

        {/* Social Links */}
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-5 text-lg font-semibold text-gray-900">
            Social Links
          </h2>

          <div className="space-y-5">

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                GitHub
              </label>

              <input
                type="text"
                name="github"
                value={form.github}
                onChange={handleChange}
                placeholder="https://github.com/username"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                LinkedIn
              </label>

              <input
                type="text"
                name="linkedin"
                value={form.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/username"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Profile Image URL
              </label>

              <input
                type="text"
                name="profile_image"
                value={form.profile_image}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-black"
              />
            </div>

          </div>
        </section>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </form>
    </div>
  );
}

export default About;