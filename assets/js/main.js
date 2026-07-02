(function () {
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#site-nav");

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      const isOpen = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.addEventListener("click", function (event) {
      if (event.target instanceof HTMLAnchorElement) {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  const year = document.querySelector("#year");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  const quoteForm = document.querySelector("#quote-form");
  if (quoteForm) {
    quoteForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const data = new FormData(quoteForm);
      const product = String(data.get("product") || "").trim();
      const grade = String(data.get("grade") || "").trim();
      const details = String(data.get("details") || "").trim();
      const city = String(data.get("city") || "").trim();
      const message = [
        "Hello Bharat Metals, I need a stainless steel quotation.",
        product ? "Product: " + product : "",
        grade ? "Grade: " + grade : "",
        details ? "Size / Quantity: " + details : "",
        city ? "Delivery City: " + city : ""
      ].filter(Boolean).join("\n");

      window.open("https://wa.me/919941133888?text=" + encodeURIComponent(message), "_blank", "noopener");
    });
  }
})();
