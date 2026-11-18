(() => {
  "use strict";

  const root = document.documentElement;
  root.classList.add("js");

  const themeButtons = [...document.querySelectorAll("[data-theme-toggle]")];
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const darkThemeColor = "#07111f";
  const lightThemeColor = "#f4f7fb";

  const saveTheme = (theme) => {
    try {
      window.localStorage.setItem("sch-theme", theme);
    } catch {
      // The selected theme still applies for this page when storage is unavailable.
    }
  };

  const applyTheme = (theme, persist = false) => {
    const isDark = theme === "dark";
    root.dataset.theme = theme;
    root.style.colorScheme = theme;

    themeButtons.forEach((button) => {
      button.setAttribute("aria-label", isDark ? "밝은 테마로 전환" : "어두운 테마로 전환");
    });

    themeMeta?.setAttribute("content", isDark ? darkThemeColor : lightThemeColor);
    if (persist) saveTheme(theme);
  };

  applyTheme(root.dataset.theme ?? "dark");

  themeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      applyTheme(root.dataset.theme === "dark" ? "light" : "dark", true);
    });
  });

  const year = document.querySelector("[data-current-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  const filterButtons = [...document.querySelectorAll("[data-filter]")];
  const archiveItems = [...document.querySelectorAll(".archive-item")];
  const visibleCount = document.querySelector("[data-visible-count]");

  const applyFilter = (filter) => {
    let count = 0;

    archiveItems.forEach((item) => {
      const categories = item.dataset.category?.split(/\s+/) ?? [];
      const matches = filter === "all" || categories.includes(filter);
      item.hidden = !matches;
      if (!matches) item.removeAttribute("open");
      if (matches) count += 1;
    });

    filterButtons.forEach((button) => {
      const active = button.dataset.filter === filter;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    if (visibleCount) visibleCount.textContent = String(count);
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => applyFilter(button.dataset.filter ?? "all"));
  });

  const navLinks = [...document.querySelectorAll("[data-nav]")];
  const sections = [...document.querySelectorAll("[data-section]")];
  const mobileSection = document.querySelector("[data-mobile-section]");

  let currentSection = null;

  const setCurrentSection = (section) => {
    if (section === currentSection) return;
    currentSection = section;

    navLinks.forEach((link) => {
      if (link.dataset.nav === section.id) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });

    if (mobileSection) mobileSection.textContent = section.dataset.section ?? "";
  };

  // 화면 위 30% 선을 지난 마지막 섹션이 현재 섹션이다. 맨 아래에서는 마지막 섹션.
  const updateCurrentSection = () => {
    const line = window.innerHeight * 0.3;
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    const passed = sections.filter((section) => section.getBoundingClientRect().top <= line);
    const section = atBottom ? sections.at(-1) : passed.at(-1) ?? sections[0];
    if (section) setCurrentSection(section);
  };

  window.addEventListener("scroll", updateCurrentSection, { passive: true });
  window.addEventListener("resize", updateCurrentSection, { passive: true });
  updateCurrentSection();
})();
