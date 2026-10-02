import { useEffect, useState } from "react";
import api from "../services/api";

function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(null);

  const getToken = () => localStorage.getItem("token");

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/contact/", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      setMessages(response.data);
    } catch (err) {
      console.error("MESSAGES ERROR:", err);

      if (err.response?.status === 401) {
        setError(
          "Your login session expired. Please sign out and log in again."
        );
      } else {
        setError(
          err.response?.data?.detail ||
            "Failed to load messages."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!confirmed) return;

    try {
      setDeleting(id);

      await api.delete(`/contact/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      setMessages((current) =>
        current.filter((message) => message.id !== id)
      );
    } catch (err) {
      console.error("DELETE MESSAGE ERROR:", err);

      setError(
        err.response?.data?.detail ||
          "Failed to delete message."
      );
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 px-8 py-10 text-white">
      <div className="mx-auto max-w-6xl">

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Messages</h1>

          <p className="mt-2 text-zinc-500">
            View messages received through your portfolio contact form.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
            <p className="text-zinc-500">
              Loading messages...
            </p>
          </div>
        ) : messages.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
            <h2 className="text-xl font-semibold">
              No messages yet
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              Messages submitted through your portfolio contact form
              will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {messages.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

                  <div className="min-w-0 flex-1">

                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-semibold">
                        {item.subject || "No subject"}
                      </h2>

                      <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-500">
                        #{item.id}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">

                      <div>
                        <p className="text-xs uppercase tracking-wide text-zinc-600">
                          Name
                        </p>

                        <p className="mt-1 text-sm text-zinc-200">
                          {item.name}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wide text-zinc-600">
                          Email
                        </p>

                        <p className="mt-1 break-all text-sm text-purple-400">
                          {item.email}
                        </p>
                      </div>

                    </div>

                    <div className="mt-5">
                      <p className="text-xs uppercase tracking-wide text-zinc-600">
                        Message
                      </p>

                      <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-zinc-300">
                        {item.message}
                      </p>
                    </div>

                  </div>

                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deleting === item.id}
                    className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deleting === item.id
                      ? "Deleting..."
                      : "Delete"}
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

export default Messages;
