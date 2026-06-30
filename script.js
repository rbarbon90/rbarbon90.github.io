const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const links = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("section[id]");
const year = document.querySelector("#year");

const currentPath = window.location.pathname.replace(/\/$/, "/index.html");
const samePageLinks = Array.from(links).filter((link) => {
  const href = link.getAttribute("href");

  if (!href) {
    return false;
  }

  const url = new URL(href, window.location.href);
  const linkPath = url.pathname.replace(/\/$/, "/index.html");

  return linkPath === currentPath && url.hash;
});

if (window.lucide) {
  window.lucide.createIcons();
}

if (year) {
  year.textContent = new Date().getFullYear();
}

navToggle?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));

  const icon = navToggle.querySelector("i");
  if (icon) {
    icon.setAttribute("data-lucide", isOpen ? "x" : "menu");
    window.lucide?.createIcons();
  }
});

links.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");

    const icon = navToggle?.querySelector("i");
    if (icon) {
      icon.setAttribute("data-lucide", "menu");
      window.lucide?.createIcons();
    }
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

if (samePageLinks.length > 0) {
  const activeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        samePageLinks.forEach((link) => {
          const url = new URL(link.getAttribute("href"), window.location.href);
          const isActive = url.hash === `#${entry.target.id}`;
          link.classList.toggle("active", isActive);
        });
      });
    },
    {
      rootMargin: "-35% 0px -55% 0px",
      threshold: 0
    }
  );

  sections.forEach((section) => {
    activeObserver.observe(section);
  });
}
