


import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import api from "./services/api";

import Dashboard from "./components/Dashboard";
import About from "./pages/About";
import Skills from "./pages/Skills";
import Projects from "./pages/Projects";
import Blogs from "./pages/Blogs";
import Experience from "./pages/Experience";
import Testimonials from "./pages/Testimonials";
import Services from "./pages/Services";
import Media from "./pages/Media";
import Messages from "./pages/Messages";
import Home from "./pages/Home";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [loggedIn, setLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.access_token);
      setLoggedIn(true);
    } catch (err) {
      console.log("LOGIN ERROR:", err);

      setError(
        err.response?.data?.detail ||
        "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!loggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-6">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-white">
              Portfolio<span className="text-purple-500">.</span>
            </h1>

            <p className="mt-3 text-zinc-400">
              CMS Admin Panel
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl">
            <h2 className="text-2xl font-semibold text-white">
              Welcome back
            </h2>

            <p className="mt-2 text-sm text-zinc-400">
              Sign in to manage your portfolio.
            </p>

            {error && (
              <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <form
              onSubmit={handleLogin}
              className="mt-8 space-y-5"
            >
              <div>
                <label className="mb-2 block text-sm text-zinc-300">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none placeholder:text-zinc-600 focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-300">
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none placeholder:text-zinc-600 focus:border-purple-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-purple-600 px-4 py-3 font-medium text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-zinc-600">
            Portfolio CMS
          </p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/portfolio" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/services" element={<Services />} />
        <Route path="/media" element={<Media />} />
        <Route path="/messages" element={<Messages />} />


        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
