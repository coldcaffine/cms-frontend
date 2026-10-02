
import { useEffect, useState } from "react";
import api from "../services/api";

const API_URL = "http://127.0.0.1:8000";

function Home() {
  const [about, setAbout] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([]);
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [blogs, setBlogs] = useState([]);

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [sending, setSending] = useState(false);
  const [contactMessage, setContactMessage] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [
          aboutResponse,
          projectsResponse,
          skillsResponse,
          experienceResponse,
          servicesResponse,
          testimonialsResponse,
          blogsResponse,
        ] = await Promise.all([
          api.get("/about/"),
          api.get("/projects/"),
          api.get("/skills/"),
          api.get("/experience/"),
          api.get("/services/"),
          api.get("/testimonials/"),
          api.get("/blogs/"),
        ]);

        setAbout(aboutResponse.data);
        setProjects(projectsResponse.data);
        setSkills(skillsResponse.data);
        setExperience(experienceResponse.data);
        setServices(servicesResponse.data);
        setTestimonials(testimonialsResponse.data);
        setBlogs(blogsResponse.data);
      } catch (error) {
        console.error("PORTFOLIO ERROR:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setSending(true);
    setContactMessage("");

    try {
      await api.post("/contact/", form);

      setContactMessage("Message sent successfully!");

      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("CONTACT ERROR:", error);
      setContactMessage("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  }

  function imageUrl(url) {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${API_URL}${url}`;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <p className="text-zinc-400">Loading portfolio...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* NAVBAR */}
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-zinc-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">

          <a href="#home" className="text-xl font-bold">
            Portfolio<span className="text-purple-500">.</span>
          </a>

          <div className="hidden gap-6 text-sm text-zinc-400 md:flex">
            <a href="#about" className="hover:text-white">About</a>
            <a href="#skills" className="hover:text-white">Skills</a>
            <a href="#projects" className="hover:text-white">Projects</a>
            <a href="#experience" className="hover:text-white">Experience</a>
            <a href="#services" className="hover:text-white">Services</a>
            <a href="#blog" className="hover:text-white">Blog</a>
            <a href="#contact" className="hover:text-white">Contact</a>
          </div>

          <a
            href="#contact"
            className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black hover:bg-zinc-200"
          >
            Let's Talk
          </a>

        </div>
      </nav>

      {/* HERO */}
      <section
        id="home"
        className="flex min-h-screen items-center px-6 pt-24"
      >
        <div className="mx-auto w-full max-w-6xl">

          <p className="text-sm uppercase tracking-[0.3em] text-purple-400">
            Developer • Builder • Creator
          </p>

          <h1 className="mt-6 text-5xl font-bold leading-tight sm:text-6xl md:text-7xl">
            Hi, I'm{" "}
            <span className="text-purple-500">
              {about?.name || "Your Name"}
            </span>
            .
          </h1>

          <h2 className="mt-6 text-2xl text-zinc-300 sm:text-3xl">
            {about?.headline || "I build things for the web."}
          </h2>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-500">
            {about?.bio ||
              "I'm a developer who enjoys building useful products and turning ideas into real applications."}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">

            <a
              href="#projects"
              className="rounded-xl bg-purple-600 px-6 py-3 font-medium hover:bg-purple-500"
            >
              View Projects
            </a>

            <a
              href="#contact"
              className="rounded-xl border border-white/10 px-6 py-3 font-medium hover:bg-white/5"
            >
              Contact Me
            </a>

          </div>

          <div className="mt-8 flex gap-5 text-sm text-zinc-500">

            {about?.github && (
              <a
                href={about.github}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white"
              >
                GitHub ↗
              </a>
            )}

            {about?.linkedin && (
              <a
                href={about.linkedin}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white"
              >
                LinkedIn ↗
              </a>
            )}

            {about?.email && (
              <a
                href={`mailto:${about.email}`}
                className="hover:text-white"
              >
                Email ↗
              </a>
            )}

          </div>

        </div>
      </section>

      {/* ABOUT */}
      <section
        id="about"
        className="border-t border-white/10 px-6 py-24"
      >
        <div className="mx-auto max-w-6xl">

          <p className="text-sm uppercase tracking-[0.25em] text-purple-400">
            About
          </p>

          <h2 className="mt-5 text-4xl font-bold">
            About Me
          </h2>

          <p className="mt-6 max-w-3xl leading-8 text-zinc-400">
            {about?.bio || "About information will appear here."}
          </p>

          {about?.location && (
            <p className="mt-5 text-sm text-zinc-500">
              📍 {about.location}
            </p>
          )}

        </div>
      </section>

      {/* SKILLS */}
      <section
        id="skills"
        className="border-t border-white/10 bg-white/[0.02] px-6 py-24"
      >
        <div className="mx-auto max-w-6xl">

          <p className="text-sm uppercase tracking-[0.25em] text-purple-400">
            Skills
          </p>

          <h2 className="mt-5 text-4xl font-bold">
            What I Work With
          </h2>

          <div className="mt-10 flex flex-wrap gap-3">

            {skills.length > 0 ? (
              skills.map((skill) => (
                <div
                  key={skill.id}
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-3"
                >
                  <p className="font-medium">
                    {skill.name}
                  </p>

                  {skill.category && (
                    <p className="mt-1 text-xs text-zinc-500">
                      {skill.category}
                    </p>
                  )}

                  {skill.level && (
                    <p className="mt-1 text-xs text-purple-400">
                      {skill.level}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-zinc-500">
                No skills added yet.
              </p>
            )}

          </div>

        </div>
      </section>

      {/* PROJECTS */}
      <section
        id="projects"
        className="border-t border-white/10 px-6 py-24"
      >
        <div className="mx-auto max-w-6xl">

          <p className="text-sm uppercase tracking-[0.25em] text-purple-400">
            Projects
          </p>

          <h2 className="mt-5 text-4xl font-bold">
            Things I've Built
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2">

            {projects.length > 0 ? (
              projects.map((project) => (
                <div
                  key={project.id}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
                >

                  {project.image_url && (
                    <img
                      src={imageUrl(project.image_url)}
                      alt={project.title}
                      className="h-56 w-full object-cover"
                    />
                  )}

                  <div className="p-6">

                    <h3 className="text-2xl font-semibold">
                      {project.title}
                    </h3>

                    {project.description && (
                      <p className="mt-4 leading-7 text-zinc-500">
                        {project.description}
                      </p>
                    )}

                    {project.tech_stack && (
                      <p className="mt-5 text-sm text-purple-400">
                        {project.tech_stack}
                      </p>
                    )}

                    <div className="mt-6 flex gap-5 text-sm">

                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-zinc-400 hover:text-white"
                        >
                          GitHub ↗
                        </a>
                      )}

                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-zinc-400 hover:text-white"
                        >
                          Live Demo ↗
                        </a>
                      )}

                    </div>

                  </div>
                </div>
              ))
            ) : (
              <p className="text-zinc-500">
                No projects added yet.
              </p>
            )}

          </div>

        </div>
      </section>

      {/* EXPERIENCE */}
      <section
        id="experience"
        className="border-t border-white/10 bg-white/[0.02] px-6 py-24"
      >
        <div className="mx-auto max-w-6xl">

          <p className="text-sm uppercase tracking-[0.25em] text-purple-400">
            Experience
          </p>

          <h2 className="mt-5 text-4xl font-bold">
            My Experience
          </h2>

          <div className="mt-10 space-y-6">

            {experience.length > 0 ? (
              experience.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                >
                  <div className="flex flex-col justify-between gap-3 md:flex-row">

                    <div>
                      <h3 className="text-xl font-semibold">
                        {item.role}
                      </h3>

                      {item.company && (
                        <p className="mt-1 text-purple-400">
                          {item.company}
                        </p>
                      )}
                    </div>

                    {(item.start_date || item.end_date) && (
                      <p className="text-sm text-zinc-500">
                        {item.start_date || ""}
                        {item.start_date && item.end_date ? " — " : ""}
                        {item.end_date || "Present"}
                      </p>
                    )}

                  </div>

                  {item.description && (
                    <p className="mt-5 leading-7 text-zinc-500">
                      {item.description}
                    </p>
                  )}

                </div>
              ))
            ) : (
              <p className="text-zinc-500">
                No experience added yet.
              </p>
            )}

          </div>

        </div>
      </section>

      {/* SERVICES */}
      <section
        id="services"
        className="border-t border-white/10 px-6 py-24"
      >
        <div className="mx-auto max-w-6xl">

          <p className="text-sm uppercase tracking-[0.25em] text-purple-400">
            Services
          </p>

          <h2 className="mt-5 text-4xl font-bold">
            What I Can Do
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-3">

            {services.length > 0 ? (
              services.map((service) => (
                <div
                  key={service.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                >

                  {service.icon && (
                    <div className="mb-5 text-3xl">
                      {service.icon}
                    </div>
                  )}

                  <h3 className="text-xl font-semibold">
                    {service.title}
                  </h3>

                  {service.description && (
                    <p className="mt-4 leading-7 text-zinc-500">
                      {service.description}
                    </p>
                  )}

                </div>
              ))
            ) : (
              <p className="text-zinc-500">
                No services added yet.
              </p>
            )}

          </div>

        </div>
      </section>

      {/* TESTIMONIALS */}
      <section
        className="border-t border-white/10 bg-white/[0.02] px-6 py-24"
      >
        <div className="mx-auto max-w-6xl">

          <p className="text-sm uppercase tracking-[0.25em] text-purple-400">
            Testimonials
          </p>

          <h2 className="mt-5 text-4xl font-bold">
            What People Say
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2">

            {testimonials.length > 0 ? (
              testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                >

                  <p className="leading-8 text-zinc-400">
                    "{testimonial.content}"
                  </p>

                  <div className="mt-6 flex items-center gap-4">

                    {testimonial.image_url && (
                      <img
                        src={imageUrl(testimonial.image_url)}
                        alt={testimonial.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    )}

                    <div>
                      <p className="font-semibold">
                        {testimonial.name}
                      </p>

                      {testimonial.role && (
                        <p className="text-sm text-zinc-500">
                          {testimonial.role}
                        </p>
                      )}
                    </div>

                  </div>

                </div>
              ))
            ) : (
              <p className="text-zinc-500">
                No testimonials added yet.
              </p>
            )}

          </div>

        </div>
      </section>

      {/* BLOG */}
      <section
        id="blog"
        className="border-t border-white/10 px-6 py-24"
      >
        <div className="mx-auto max-w-6xl">

          <p className="text-sm uppercase tracking-[0.25em] text-purple-400">
            Blog
          </p>

          <h2 className="mt-5 text-4xl font-bold">
            Latest Articles
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2">

            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <article
                  key={blog.id}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
                >

                  {blog.cover_image && (
                    <img
                      src={imageUrl(blog.cover_image)}
                      alt={blog.title}
                      className="h-52 w-full object-cover"
                    />
                  )}

                  <div className="p-6">

                    <h3 className="text-2xl font-semibold">
                      {blog.title}
                    </h3>

                    {blog.published && (
                      <p className="mt-2 text-xs uppercase tracking-wider text-purple-400">
                        {blog.published}
                      </p>
                    )}

                    <p className="mt-4 leading-7 text-zinc-500">
                      {blog.excerpt || blog.content}
                    </p>

                  </div>

                </article>
              ))
            ) : (
              <p className="text-zinc-500">
                No blog posts added yet.
              </p>
            )}

          </div>

        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        className="border-t border-white/10 bg-white/[0.02] px-6 py-24"
      >
        <div className="mx-auto max-w-4xl">

          <div className="text-center">

            <p className="text-sm uppercase tracking-[0.25em] text-purple-400">
              Contact
            </p>

            <h2 className="mt-5 text-4xl font-bold">
              Let's Build Something.
            </h2>

            <p className="mt-6 text-zinc-500">
              Have a project, idea, or opportunity? I'd love to hear from you.
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-10 space-y-5"
          >

            <div className="grid gap-5 md:grid-cols-2">

              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                required
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-zinc-600 focus:border-purple-500"
              />

              <input
                type="email"
                name="email"
                placeholder="Your email"
                value={form.email}
                onChange={handleChange}
                required
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-zinc-600 focus:border-purple-500"
              />

            </div>

            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={form.subject}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-zinc-600 focus:border-purple-500"
            />

            <textarea
              name="message"
              placeholder="Your message"
              value={form.message}
              onChange={handleChange}
              required
              rows="6"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-zinc-600 focus:border-purple-500"
            />

            <button
              type="submit"
              disabled={sending}
              className="rounded-xl bg-purple-600 px-7 py-3 font-medium hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sending ? "Sending..." : "Send Message"}
            </button>

            {contactMessage && (
              <p className="text-sm text-zinc-400">
                {contactMessage}
              </p>
            )}

          </form>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-3 text-sm text-zinc-600 md:flex-row">

          <p>
            © {new Date().getFullYear()}{" "}
            {about?.name || "Portfolio"}
          </p>

          <p>
            Built with React + FastAPI
          </p>

        </div>
      </footer>

    </div>
  );
}

export default Home;

