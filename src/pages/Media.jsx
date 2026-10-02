import { useState } from "react";
import api from "../services/api";

function Media() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(null);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select an image first.");
      return;
    }

    setUploading(true);
    setError("");
    setUploaded(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const token = localStorage.getItem("token");

      const response = await api.post(
        "/upload/image",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUploaded(response.data);
      setFile(null);

      e.target.reset();
    } catch (err) {
      console.error("UPLOAD ERROR:", err);

      if (err.response?.status === 401) {
        setError(
          "Your login session expired. Please sign out and log in again."
        );
      } else {
        setError(
          err.response?.data?.detail ||
            "Image upload failed."
        );
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!uploaded) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this image?"
    );

    if (!confirmed) return;

    setDeleting(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      await api.delete(
        `/upload/${uploaded.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUploaded(null);
    } catch (err) {
      console.error("DELETE ERROR:", err);

      if (err.response?.status === 401) {
        setError(
          "Your login session expired. Please sign out and log in again."
        );
      } else {
        setError(
          err.response?.data?.detail ||
            "Image deletion failed."
        );
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 px-8 py-10 text-white">
      <div className="mx-auto max-w-5xl">

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Media</h1>

          <p className="mt-2 text-zinc-500">
            Upload and manage images for your portfolio.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">

          <h2 className="text-xl font-semibold">
            Upload Image
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            Supported formats: JPEG, PNG, WEBP and GIF.
          </p>

          <form
            onSubmit={handleUpload}
            className="mt-8 space-y-6"
          >

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Select Image
              </label>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={(e) => {
                  setFile(e.target.files?.[0] || null);
                  setError("");
                  setUploaded(null);
                }}
                className="block w-full cursor-pointer rounded-xl border border-white/10 bg-white px-4 py-3 text-sm text-black file:mr-4 file:rounded-lg file:border-0 file:bg-purple-600 file:px-4 file:py-2 file:text-white"
              />
            </div>

            {file && (
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm text-zinc-300">
                  Selected file:
                </p>

                <p className="mt-1 text-sm text-purple-400">
                  {file.name}
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={!file || uploading}
              className="rounded-xl bg-purple-600 px-6 py-3 font-medium text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload Image"}
            </button>

          </form>
        </div>

        {uploaded && (
          <div className="mt-8 rounded-2xl border border-green-500/20 bg-green-500/5 p-6">

            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-green-400">
                Upload Successful
              </h2>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>

            <div className="mt-5 grid gap-6 md:grid-cols-[220px_1fr]">

              <img
                src={`http://127.0.0.1:8000${uploaded.file_url}`}
                alt={uploaded.filename}
                className="h-52 w-full rounded-xl object-cover"
              />

              <div className="space-y-3 text-sm">

                <div>
                  <p className="text-zinc-500">Filename</p>
                  <p className="text-zinc-200">
                    {uploaded.filename}
                  </p>
                </div>

                <div>
                  <p className="text-zinc-500">File type</p>
                  <p className="text-zinc-200">
                    {uploaded.file_type}
                  </p>
                </div>

                <div>
                  <p className="text-zinc-500">URL</p>
                  <p className="break-all text-purple-400">
                    {`http://127.0.0.1:8000${uploaded.file_url}`}
                  </p>
                </div>

                <div>
                  <p className="text-zinc-500">Media ID</p>
                  <p className="text-zinc-200">
                    #{uploaded.id}
                  </p>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Media;
