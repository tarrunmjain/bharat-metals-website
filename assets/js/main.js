(function () {
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#site-nav");
  const navGroups = Array.from(document.querySelectorAll(".nav-group"));

  function closeGroups(except) {
    navGroups.forEach(function (group) {
      if (group !== except) {
        group.classList.remove("is-open");
        const button = group.querySelector(".nav-menu-button");
        if (button) {
          button.setAttribute("aria-expanded", "false");
        }
      }
    });
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      const isOpen = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      if (!isOpen) {
        closeGroups();
      }
    });

    nav.addEventListener("click", function (event) {
      const target = event.target;
      if (target instanceof HTMLAnchorElement) {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        closeGroups();
      }
    });
  }

  navGroups.forEach(function (group) {
    const button = group.querySelector(".nav-menu-button");
    if (!button) {
      return;
    }

    button.addEventListener("click", function () {
      const isOpen = group.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(isOpen));
      closeGroups(group);
    });
  });

  document.addEventListener("click", function (event) {
    const target = event.target;
    if (!(target instanceof Node)) {
      return;
    }

    const clickedInsideNav = nav && nav.contains(target);
    const clickedToggle = navToggle && navToggle.contains(target);
    if (!clickedInsideNav && !clickedToggle) {
      if (nav && navToggle) {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
      closeGroups();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      if (nav && navToggle) {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
      closeGroups();
    }
  });

  const year = document.querySelector("#year");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }
})();
