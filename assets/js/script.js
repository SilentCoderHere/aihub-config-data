"use strict";

(function () {
  const grid = document.getElementById("servicesGrid");
  const emptyMsg = document.getElementById("emptyMessage");
  const searchInput = document.getElementById("searchInput");
  const countLine = document.getElementById("countLine");
  const versionDisplay = document.getElementById("versionDisplay");
  const filterToggle = document.getElementById("filterToggle");
  const filterBadge = document.getElementById("filterBadge");
  const modal = document.getElementById("filterModal");
  const modalClose = document.getElementById("modalClose");
  const modalBody = document.getElementById("modalBody");
  const clearAllBtn = document.getElementById("clearAllBtn");
  const applyBtn = document.getElementById("applyFiltersBtn");

  let allServices = [];
  let filterState = {
    categories: [],
    pricings: [],
    privacies: [],
    loginRequired: null,
  };

  function titlecase(str) {
    return (
      String(str).charAt(0).toUpperCase() + String(str).slice(1).toLowerCase()
    );
  }

  function escapeHtml(str) {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return String(str).replace(/[&<>"']/g, (c) => map[c]);
  }

  function hslToRgb(h, s, l) {
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  }

  function nameToColor(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = (hash << 5) - hash + name.charCodeAt(i);
      hash |= 0;
    }
    const hue = Math.abs(hash % 360);
    const rgb = hslToRgb(hue / 360, 0.7, 0.6);
    return (
      "#" +
      ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1)
    );
  }

  function getActiveFilterCount() {
    let count = 0;
    if (filterState.categories.length > 0) count++;
    if (filterState.pricings.length > 0) count++;
    if (filterState.privacies.length > 0) count++;
    if (filterState.loginRequired !== null) count++;
    return count;
  }

  function updateBadge() {
    const count = getActiveFilterCount();
    if (count === 0) {
      filterBadge.classList.add("hidden");
      filterBadge.textContent = "0";
      filterToggle.classList.remove("active");
    } else {
      filterBadge.classList.remove("hidden");
      filterBadge.textContent = count;
      filterToggle.classList.add("active");
      filterBadge.classList.remove("bump");
      void filterBadge.offsetWidth;
      filterBadge.classList.add("bump");
    }
  }

  function getFilteredServices() {
    let services = allServices;
    const query = searchInput.value.trim().toLowerCase();

    if (filterState.categories.length > 0) {
      services = services.filter((s) =>
        filterState.categories.includes(s.category),
      );
    }
    if (filterState.pricings.length > 0) {
      services = services.filter((s) =>
        filterState.pricings.includes(s.pricing),
      );
    }
    if (filterState.privacies.length > 0) {
      services = services.filter((s) =>
        filterState.privacies.includes(s.privacy),
      );
    }
    if (filterState.loginRequired === "yes") {
      services = services.filter((s) => s.login_required === true);
    } else if (filterState.loginRequired === "no") {
      services = services.filter((s) => s.login_required === false);
    }

    if (query) {
      services = services.filter((s) => s.name.toLowerCase().includes(query));
    }
    return services;
  }

  function render(services) {
    if (!services.length) {
      grid.innerHTML = "";
      emptyMsg.style.display = "block";
      countLine.textContent = "";
      return;
    }
    emptyMsg.style.display = "none";
    grid.innerHTML = services.map((s) => createCard(s)).join("");
    const plural = services.length === 1 ? "" : "s";
    countLine.innerHTML = `Showing <span class="count-number">${services.length}</span> AI${plural}`;
  }

  function createCard(service) {
    const color = nameToColor(service.name);
    const pricingClass = service.pricing;
    let privacyClass = "";
    if (service.privacy === "friendly") privacyClass = "friendly";
    else if (service.privacy === "neutral") privacyClass = "neutral";
    else if (service.privacy === "avoid") privacyClass = "avoid";

    const loginBadge = service.login_required
      ? '<span class="badge badge-login-true">🔐 Login needed</span>'
      : '<span class="badge badge-login-false">👋 No login</span>';

    const bestForHtml =
      service.best_for && service.best_for.length
        ? `<div class="best-for">${service.best_for.map((tag) => `<span class="best-for-tag">${escapeHtml(tag)}</span>`).join("")}</div>`
        : "";

    const categoryDisplay = titlecase(service.category);

    return `
      <div class="card" style="--accent: ${color}">
        <div class="card-name">
          <a href="${escapeHtml(service.website)}" target="_blank" rel="noopener noreferrer">${escapeHtml(service.name)}</a>
        </div>
        <div class="badges">
          <span class="badge badge-${pricingClass}">💰 ${escapeHtml(service.pricing)}</span>
          <span class="badge badge-${privacyClass}">🔒 ${escapeHtml(service.privacy)}</span>
          ${loginBadge}
          <span class="badge badge-category">📁 ${escapeHtml(categoryDisplay)}</span>
        </div>
        ${bestForHtml}
      </div>
    `;
  }

  function applyAllFilters() {
    const filtered = getFilteredServices();
    render(filtered);
    updateBadge();
  }

  function buildModal() {
    const cats = [...new Set(allServices.map((s) => s.category))].sort();
    const pricings = [...new Set(allServices.map((s) => s.pricing))].sort();
    const privacies = [...new Set(allServices.map((s) => s.privacy))].sort();

    let html = "";

    html += `
      <div class="filter-group-modal">
      <label class="group-label">📂 Category</label>
      <div class="filter-options" data-group="categories">
    `;
    cats.forEach((cat) => {
      const checked = filterState.categories.includes(cat) ? "checked" : "";
      const label = titlecase(cat);
      html += `
        <label class="filter-option ${checked ? "selected" : ""}">
          <input type="checkbox" value="${escapeHtml(cat)}" ${checked} data-group="categories" />
          <span class="checkmark"></span>
          <span class="option-label">${escapeHtml(label)}</span>
        </label>
      `;
    });
    html += `</div></div>`;

    html += `
      <div class="filter-group-modal">
      <label class="group-label">💰 Pricing</label>
      <div class="filter-options" data-group="pricings">
    `;
    pricings.forEach((val) => {
      const checked = filterState.pricings.includes(val) ? "checked" : "";
      const label = titlecase(val);
      html += `
        <label class="filter-option ${checked ? "selected" : ""}">
          <input type="checkbox" value="${escapeHtml(val)}" ${checked} data-group="pricings" />
          <span class="checkmark"></span>
          <span class="option-label">${escapeHtml(label)}</span>
        </label>
      `;
    });
    html += `</div></div>`;

    html += `
      <div class="filter-group-modal">
      <label class="group-label">🔒 Privacy</label>
      <div class="filter-options" data-group="privacies">
    `;
    privacies.forEach((val) => {
      const checked = filterState.privacies.includes(val) ? "checked" : "";
      const label = titlecase(val);
      html += `
        <label class="filter-option ${checked ? "selected" : ""}">
          <input type="checkbox" value="${escapeHtml(val)}" ${checked} data-group="privacies" />
          <span class="checkmark"></span>
          <span class="option-label">${escapeHtml(label)}</span>
        </label>
      `;
    });
    html += `</div></div>`;

    const loginOptions = [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ];
    html += `
      <div class="filter-group-modal">
      <label class="group-label">🔐 Login Required</label>
      <div class="filter-options" data-group="loginRequired">
    `;
    loginOptions.forEach((opt) => {
      const checked = filterState.loginRequired === opt.value ? "checked" : "";
      const label = opt.label;
      html += `
        <label class="filter-option ${checked ? "selected" : ""}" data-login-value="${opt.value}">
          <input type="radio" name="loginRequired" value="${opt.value}" ${checked} />
          <span class="radiomark"></span>
          <span class="option-label">${label}</span>
        </label>
      `;
    });
    html += `</div></div>`;

    modalBody.innerHTML = html;

    modalBody.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
      cb.addEventListener("change", function (e) {
        const group = this.dataset.group;
        const val = this.value;
        const label = this.closest(".filter-option");
        if (this.checked) {
          if (group === "categories" && !filterState.categories.includes(val)) {
            filterState.categories.push(val);
          }
          if (group === "pricings" && !filterState.pricings.includes(val)) {
            filterState.pricings.push(val);
          }
          if (group === "privacies" && !filterState.privacies.includes(val)) {
            filterState.privacies.push(val);
          }
          label.classList.add("selected");
        } else {
          if (group === "categories") {
            filterState.categories = filterState.categories.filter(
              (v) => v !== val,
            );
          }
          if (group === "pricings") {
            filterState.pricings = filterState.pricings.filter(
              (v) => v !== val,
            );
          }
          if (group === "privacies") {
            filterState.privacies = filterState.privacies.filter(
              (v) => v !== val,
            );
          }
          label.classList.remove("selected");
        }
        applyAllFilters();
        updateBadge();
      });
    });

    modalBody
      .querySelectorAll('input[type="radio"][name="loginRequired"]')
      .forEach((rb) => {
        rb.addEventListener("click", function (e) {
          const label = this.closest(".filter-option");
          const val = this.value;

          if (filterState.loginRequired === val) {
            filterState.loginRequired = null;

            modalBody
              .querySelectorAll('input[type="radio"][name="loginRequired"]')
              .forEach((r) => {
                r.checked = false;
              });
            modalBody
              .querySelectorAll(".filter-option[data-login-value]")
              .forEach((l) => l.classList.remove("selected"));
          } else {
            filterState.loginRequired = val;
            modalBody
              .querySelectorAll(".filter-option[data-login-value]")
              .forEach((l) => l.classList.remove("selected"));
            label.classList.add("selected");
            modalBody
              .querySelectorAll('input[type="radio"][name="loginRequired"]')
              .forEach((r) => {
                r.checked = r.value === val;
              });
          }
          applyAllFilters();
          updateBadge();
        });
      });

    syncModalVisuals();
  }

  function syncModalVisuals() {
    modalBody.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
      const group = cb.dataset.group;
      const val = cb.value;
      const label = cb.closest(".filter-option");
      let checked = false;
      if (group === "categories")
        checked = filterState.categories.includes(val);
      else if (group === "pricings")
        checked = filterState.pricings.includes(val);
      else if (group === "privacies")
        checked = filterState.privacies.includes(val);
      cb.checked = checked;
      label.classList.toggle("selected", checked);
    });

    modalBody
      .querySelectorAll('input[type="radio"][name="loginRequired"]')
      .forEach((rb) => {
        const val = rb.value;
        const label = rb.closest(".filter-option");
        const checked = filterState.loginRequired === val;
        rb.checked = checked;
        label.classList.toggle("selected", checked);
      });
  }

  function openModal() {
    buildModal();
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }

  function clearAllFilters() {
    filterState.categories = [];
    filterState.pricings = [];
    filterState.privacies = [];
    filterState.loginRequired = null;
    if (modal.classList.contains("open")) {
      syncModalVisuals();
    }
    applyAllFilters();
    updateBadge();
  }

  async function loadData() {
    try {
      const res = await fetch("ais.json");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      allServices = [];
      const categoriesSet = new Set();
      for (const [category, items] of Object.entries(data)) {
        if (Array.isArray(items)) {
          categoriesSet.add(category);
          items.forEach((item) => {
            allServices.push({
              name: item.name,
              website: item.website,
              pricing: item.pricing,
              privacy: item.privacy,
              login_required: item.login_required,
              best_for: item.best_for || [],
              category: category,
            });
          });
        }
      }
      const sortedCategories = Array.from(categoriesSet).sort();
      versionDisplay.textContent = `📦 ${allServices.length} AIs · ${sortedCategories.length} categories`;
      applyAllFilters();
    } catch (err) {
      grid.innerHTML = `<div class="empty-message">⚠️ Couldn't load services. ${escapeHtml(err.message)}</div>`;
    }
  }

  filterToggle.addEventListener("click", openModal);
  modalClose.addEventListener("click", closeModal);
  modal.addEventListener("click", function (e) {
    if (e.target === this) closeModal();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
  });

  clearAllBtn.addEventListener("click", function () {
    clearAllFilters();
    if (modal.classList.contains("open")) {
      syncModalVisuals();
    }
  });

  applyBtn.addEventListener("click", function () {
    closeModal();
  });

  searchInput.addEventListener("input", function () {
    applyAllFilters();
  });

  loadData();
})();
