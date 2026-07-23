document.addEventListener("DOMContentLoaded", () => {

  // 1. LOAD NAVBAR
  fetch("/components/navbar.html?v=" + Date.now())
    .then((res) => {
      if (!res.ok) throw new Error("Navbar 404: " + res.status);
      return res.text();
    })
    .then((data) => {
      // Parse HTML lengkap, terus ambil cuma tag <header> di dalamnya
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, "text/html");
      const headerEl = doc.querySelector("header");
      document.getElementById("navbar").innerHTML = headerEl ? headerEl.outerHTML : data;

      // ===== JS NAVBAR JALAN SETELAH KE-LOAD =====
      const hamburgerBtn = document.querySelector(".menu-toggle"); // di html lu classnya ini
      const mobileNav = document.getElementById("navMobile"); // di html lu id nya ini

      if (hamburgerBtn && mobileNav) {
        hamburgerBtn.addEventListener("click", () => {
          const isOpen = mobileNav.classList.toggle("open");
          hamburgerBtn.classList.toggle("active", isOpen);
          hamburgerBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });

        mobileNav.querySelectorAll("a").forEach((link) => {
          link.addEventListener("click", () => {
            mobileNav.classList.remove("open");
            hamburgerBtn.classList.remove("active");
            hamburgerBtn.setAttribute("aria-expanded", "false");
          });
        });
      }

      // ===== AUTO ACTIVE NAVBAR (pake clean URL path, bukan nama file) =====
      const currentPath = window.location.pathname.replace(/\/$/, "") || "/";
      document.querySelectorAll("#navbar a").forEach(link => {
        const linkPath = link.getAttribute("href").replace(/\/$/, "") || "/";
        if (linkPath === currentPath) {
          link.classList.add("active");
        }
      });
    })
    .catch(err => console.error("Navbar gagal di load:", err));

  // 2. LOAD FOOTER
  fetch("/components/footer.html?v=" + Date.now())
    .then((res) => {
      if (!res.ok) throw new Error("Footer 404: " + res.status);
      return res.text();
    })
    .then((data) => {
      // Parse HTML lengkap, terus ambil cuma tag <footer> di dalamnya
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, "text/html");
      const footerEl = doc.querySelector("footer");
      document.getElementById("footer").innerHTML = footerEl ? footerEl.outerHTML : data;
      console.log("Footer berhasil di load");
    })
    .catch(err => console.error("Footer gagal di load:", err));

});
