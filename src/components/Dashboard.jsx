import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const menuItems = [
    { name: "About", path: "/about" },
    { name: "Skills", path: "/skills" },
    { name: "Projects", path: "/projects" },
    { name: "Blogs", path: "/blogs" },
    { name: "Experience", path: "/experience" },
    { name: "Testimonials", path: "/testimonials" },
    { name: "Services", path: "/services" },
    { name: "Media", path: "/media" },
    { name: "Messages", path: "/messages" },
  ];

  return (<div className="flex min-h-screen w-full bg-[#F6F0E8] text-[#2C211B]">


    {/* SIDEBAR */}
    <aside className="hidden w-64 shrink-0 flex-col bg-[#2D211A] md:flex">

      <div className="border-b border-white/10 px-6 py-7">
        <h1 className="text-2xl font-semibold text-[#FFF9F2]">
          Portfolio<span className="text-[#C89B72]">.</span>
        </h1>
        <p className="mt-1 text-xs tracking-wide text-[#B9A99B]">
          CMS ADMIN
        </p>
      </div>

      <nav className="flex-1 px-4 py-6">
        <p className="mb-4 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#88776A]">
          Content
        </p>

        <div className="space-y-1.5">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className="w-full rounded-lg px-3 py-3 text-left text-sm text-[#C8BBB0] transition hover:bg-white/10 hover:text-white"
            >
              {item.name}
            </button>
          ))}
        </div>
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.reload();
          }}
          className="w-full rounded-lg px-3 py-3 text-left text-sm text-[#B9A99B] transition hover:bg-white/10 hover:text-white"
        >
          Sign Out
        </button>
      </div>
    </aside>

    {/* MAIN CONTENT */}
    <div className="min-w-0 flex-1">

      <header className="border-b border-[#E5D9CC] px-6 py-7 sm:px-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-[0.15em] text-[#9A806B]">
              Admin Panel
            </p>
            <h2 className="text-2xl font-semibold text-[#2C211B]">
              Dashboard
            </h2>
            <p className="mt-1 text-sm text-[#8A796B]">
              Manage your portfolio content.
            </p>
          </div>

          <span className="shrink-0 rounded-full border border-[#DDCEC0] bg-[#FFF9F2] px-4 py-2 text-xs font-medium text-[#725B49]">
            Admin
          </span>
        </div>
      </header>

      <main className="w-full px-5 py-9 sm:px-10 sm:py-12">

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-[#33261F]">
            Content Management
          </h3>
          <p className="mt-2 text-sm text-[#8A796B]">
            Select a section to manage your portfolio.
          </p>
        </div>

        <div className="flex w-full flex-col gap-4">
          {menuItems.map((item, index) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className="group flex min-h-[100px] w-full items-center justify-between gap-4 rounded-xl border border-[#E4D8CC] bg-[#FFF9F2] px-5 py-5 text-left shadow-sm transition hover:border-[#C9AD92] hover:shadow-md sm:px-7"
            >
              <div className="flex min-w-0 items-center gap-4 sm:gap-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EFE3D7] text-sm font-semibold text-[#876B54]">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="min-w-0">
                  <h4 className="text-base font-semibold text-[#33261F] sm:text-lg">
                    {item.name}
                  </h4>
                  <p className="mt-1 text-xs text-[#8A796B] sm:text-sm">
                    Manage {item.name.toLowerCase()} content
                  </p>
                </div>
              </div>

              <span className="shrink-0 text-xl text-[#B8A496] transition group-hover:translate-x-1 group-hover:text-[#8B6245]">
                →
              </span>
            </button>
          ))}
        </div>

        <div className="mt-10 border-t border-[#E5D9CC] pt-5">
          <p className="text-xs text-[#9A897B]">
            Portfolio CMS · Admin Dashboard
          </p>
        </div>

      </main>
    </div>
  </div>


  );
}

export default Dashboard;
