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

let activeModalTrigger = null;

const closeProjectModal = (modal) => {
  const modalVideo = modal.querySelector("video");

  if (modalVideo) {
    modalVideo.pause();
  }

  modal.hidden = true;
  document.body.classList.remove("modal-open");
  activeModalTrigger?.focus();
  activeModalTrigger = null;
};

document.querySelectorAll("[data-modal-open]").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const modal = document.getElementById(trigger.dataset.modalOpen);

    if (!modal) {
      return;
    }

    activeModalTrigger = trigger;
    const modalMedia = modal.querySelector("[data-modal-src]");

    if (modalMedia && !modalMedia.getAttribute("src")) {
      modalMedia.setAttribute("src", modalMedia.dataset.modalSrc);
      modalMedia.load?.();
    }

    modal.hidden = false;
    document.body.classList.add("modal-open");
    modal.querySelector(".project-modal-panel")?.focus();
    modalMedia?.play?.().catch(() => {});
    window.lucide?.createIcons();
  });
});

document.querySelectorAll(".project-modal").forEach((modal) => {
  modal.querySelectorAll("[data-modal-close]").forEach((control) => {
    control.addEventListener("click", () => closeProjectModal(modal));
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") {
    return;
  }

  const openModal = document.querySelector(".project-modal:not([hidden])");

  if (openModal) {
    closeProjectModal(openModal);
  }
});
