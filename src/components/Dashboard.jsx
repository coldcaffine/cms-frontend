
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "About",
      path: "/about",
    },
    {
      name: "Skills",
      path: "/skills",
    },
    {
      name: "Projects",
      path: "/projects",
    },
    {
      name: "Blogs",
      path: "/blogs",
    },
    {
      name: "Experience",
      path: "/experience",
    },
    {
      name: "Testimonials",
      path: "/testimonials",
    },
    {
      name: "Services",
      path: "/services",
    },
    {
      name: "Media",
      path: "/media",
    },
    {
      name: "Messages",
      path: "/messages",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 border-r border-white/10 bg-black md:block">
        <div className="flex h-full flex-col">

          {/* Logo */}
          <div className="border-b border-white/10 px-6 py-6">
            <h1 className="text-2xl font-bold">
              Portfolio
              <span className="text-purple-500">.</span>
            </h1>

            <p className="mt-1 text-xs text-zinc-500">
              CMS Admin
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-zinc-600">
              Content
            </p>

            <div className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className="w-full rounded-xl px-3 py-3 text-left text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </nav>

          {/* Sign out */}
          <div className="border-t border-white/10 p-4">
            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.reload();
              }}
              className="w-full rounded-xl px-3 py-3 text-left text-sm text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400"
            >
              Sign Out
            </button>
          </div>

        </div>
      </aside>

      {/* MAIN AREA */}
      <div
        className="min-h-screen"
        style={{ marginLeft: "256px" }}
      >

        {/* HEADER */}
        <header className="border-b border-white/10 bg-zinc-950 px-8 py-6">
          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-2xl font-semibold">
                Dashboard
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Manage your portfolio content.
              </p>
            </div>

            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-zinc-400">
              Admin
            </div>

          </div>
        </header>

        {/* CONTENT */}
        <main className="px-8 py-10">

          <div className="mb-8">
            <h3 className="text-xl font-semibold">
              Content Management
            </h3>

            <p className="mt-2 text-sm text-zinc-500">
              Choose a section below to manage your portfolio.
            </p>
          </div>

          {/* CARDS */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {menuItems.map((item, index) => (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className="group min-h-[180px] rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left transition duration-200 hover:-translate-y-1 hover:border-purple-500/40 hover:bg-white/[0.05]"
              >

                <div className="flex items-start justify-between">

                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-xs font-medium text-zinc-500">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="text-lg text-zinc-600 transition group-hover:text-purple-400">
                    ↗
                  </span>

                </div>

                <h4 className="mt-8 text-lg font-semibold">
                  {item.name}
                </h4>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Manage {item.name.toLowerCase()} content
                </p>

              </button>
            ))}

          </div>

        </main>

      </div>

    </div>
  );
}

export default Dashboard;

