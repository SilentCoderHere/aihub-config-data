(function () {
  const grid = document.getElementById("servicesGrid");
  const emptyMsg = document.getElementById("emptyMessage");
  const searchInput = document.getElementById("searchInput");
  const categorySelect = document.getElementById("categorySelect");
  const pricingSelect = document.getElementById("pricingSelect");
  const privacySelect = document.getElementById("privacySelect");
  const countLine = document.getElementById("countLine");
  const versionDisplay = document.getElementById("versionDisplay");

  let allServices = [];

  function nameToColor(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = ((hash << 5) - hash) + name.charCodeAt(i);
      hash |= 0;
    }
    const hue = Math.abs(hash % 360);
    const rgb = hslToRgb(hue / 360, 0.7, 0.6);
    return `#${((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1)}`;
  }

  function hslToRgb(h, s, l) {
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
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
          items.forEach(item => {
            allServices.push({
              name: item.name,
              website: item.website,
              pricing: item.pricing,
              privacy: item.privacy,
              login_required: item.login_required,
              best_for: item.best_for || [],
              category: category
            });
          });
        }
      }
      const sortedCategories = Array.from(categoriesSet).sort();
      categorySelect.innerHTML = '<option value="all">All</option>';
      sortedCategories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
        categorySelect.appendChild(option);
      });

      versionDisplay.textContent = `📦 ${allServices.length} AIs · ${sortedCategories.length} categories`;
      applyAllFilters();
    } catch (err) {
      grid.innerHTML = `<div class="empty-message">⚠️ Couldn't load services. ${err.message}</div>`;
    }
  }

  function getFilteredServices() {
    const query = searchInput.value.trim().toLowerCase();
    const category = categorySelect.value;
    const pricing = pricingSelect.value;
    const privacy = privacySelect.value;

    let services = allServices;

    if (category !== "all") {
      services = services.filter(s => s.category === category);
    }
    if (pricing !== "all") {
      services = services.filter(s => s.pricing === pricing);
    }
    if (privacy !== "all") {
      services = services.filter(s => s.privacy === privacy);
    }
    if (query) {
      services = services.filter(s => s.name.toLowerCase().includes(query));
    }
    return services;
  }

  function render(services) {
    if (!services.length) {
      grid.innerHTML = "";
      emptyMsg.style.display = "block";
      countLine.textContent = "No AIs match the current filters.";
      return;
    }
    emptyMsg.style.display = "none";
    grid.innerHTML = services.map(s => createCard(s)).join("");
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

    const bestForHtml = service.best_for && service.best_for.length
      ? `<div class="best-for">${service.best_for.map(tag => `<span class="best-for-tag">${escapeHtml(tag)}</span>`).join('')}</div>`
      : '';

    const categoryDisplay = service.category.charAt(0).toUpperCase() + service.category.slice(1);

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

  function escapeHtml(str) {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };
    return String(str).replace(/[&<>"']/g, c => map[c]);
  }

  function applyAllFilters() {
    const filtered = getFilteredServices();
    render(filtered);
  }

  categorySelect.addEventListener("change", applyAllFilters);
  pricingSelect.addEventListener("change", applyAllFilters);
  privacySelect.addEventListener("change", applyAllFilters);
  searchInput.addEventListener("input", applyAllFilters);

  loadData();
})();
