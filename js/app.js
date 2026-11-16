/**
 * EventPulse - Main Application Controller
 * Handles state, DOM rendering, search & filtering, details modal,
 * wishlist, theme switching, auth, and global event listeners.
 */

// Application Global State
const state = {
  events: [],
  filteredEvents: [],
  activeCategory: "all",
  searchQuery: "",
  dateFilter: "all",
  priceFilter: "all",
  typeFilter: "all",
  sortBy: "upcoming",
  currentView: "grid", // 'grid' | 'list'
  theme: "dark",
  currency: "INR",
  featuredEvent: null,
  activeDetailEvent: null
};

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initCurrency();
  loadData();
  setupEventListeners();
  startHeroCountdown();
  renderHeroSpotlight();
  updateNavigationBadges();
  renderCategoriesGrid();
  renderEvents();

  // Check URL hash for direct admin routing
  if (window.location.hash === "#admin") {
    setTimeout(() => openAdminModal(), 200);
  }
});

// Load Data from events-data.js / localStorage
function loadData() {
  state.events = getStoredEvents();
  state.featuredEvent = state.events.find(e => e.featured) || state.events[0];
  applyFilters();
}

// Currency Management (INR ₹ & USD $)
function initCurrency() {
  state.currency = getStoredCurrency();
  updateCurrencyUI();
  updateFilterPriceOptions();
}

function setCurrency(curr) {
  state.currency = curr;
  saveStoredCurrency(curr);
  updateCurrencyUI();
  updateFilterPriceOptions();
  renderHeroSpotlight();
  renderEvents();
  
  if (state.activeDetailEvent) {
    openEventDetails(state.activeDetailEvent.id);
  }
  if (typeof currentBooking !== 'undefined' && currentBooking.event) {
    updatePriceSummary();
    const step1 = document.getElementById("wizardStep1");
    if (step1 && step1.style.display !== "none") {
      renderStep1();
    }
  }
  if (typeof refreshAdminDashboard === 'function') {
    const adminModal = document.getElementById("adminModal");
    if (adminModal && adminModal.classList.contains("open")) {
      refreshAdminDashboard();
    }
  }
  showToast(`Currency switched to ${curr === 'INR' ? '₹ INR (Indian Rupee)' : '$ USD (US Dollar)'}`, "info");
}

function updateCurrencyUI() {
  const curr = state.currency || getStoredCurrency();
  const btnINR = document.getElementById("currBtnINR");
  const btnUSD = document.getElementById("currBtnUSD");
  const btnINRMobile = document.getElementById("currBtnINRMobile");
  const btnUSDMobile = document.getElementById("currBtnUSDMobile");

  if (btnINR) btnINR.classList.toggle("active", curr === "INR");
  if (btnUSD) btnUSD.classList.toggle("active", curr === "USD");
  if (btnINRMobile) btnINRMobile.classList.toggle("active", curr === "INR");
  if (btnUSDMobile) btnUSDMobile.classList.toggle("active", curr === "USD");
}

function updateFilterPriceOptions() {
  const select = document.getElementById("filterPriceSelect");
  if (!select) return;
  const isINR = (state.currency || getStoredCurrency()) === "INR";
  const currentVal = select.value;

  select.innerHTML = `
    <option value="all">🏷️ Any Price</option>
    <option value="free">Free Events</option>
    <option value="under50">${isINR ? 'Under ₹4,000' : 'Under $50'}</option>
    <option value="50-150">${isINR ? '₹4,000 - ₹12,000' : '$50 - $150'}</option>
    <option value="over150">${isINR ? '₹12,000+' : '$150+'}</option>
  `;
  select.value = currentVal;
}

function renderHeroSpotlight() {
  const btnText = document.getElementById("heroBookingBtnText");
  if (btnText && state.featuredEvent) {
    btnText.innerText = `Book Tickets From ${formatPrice(state.featuredEvent.minPrice)}`;
  }
}

// Theme Management (Dark / Light Mode)
function initTheme() {
  const savedTheme = localStorage.getItem("eventpulse_theme") || "dark";
  state.theme = savedTheme;
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeIcon();
}

function toggleTheme() {
  state.theme = state.theme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", state.theme);
  localStorage.setItem("eventpulse_theme", state.theme);
  updateThemeIcon();
  showToast(`Switched to ${state.theme === 'dark' ? 'Dark' : 'Light'} Mode`, "info");
}

function updateThemeIcon() {
  const btn = document.getElementById("themeToggleBtn");
  if (!btn) return;
  if (state.theme === "dark") {
    btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
  } else {
    btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
  }
}

// Setup Global Event Listeners
function setupEventListeners() {
  // Mobile Nav Toggle
  const mobileToggle = document.getElementById("mobileNavToggle");
  const mobileDrawer = document.getElementById("mobileNavDrawer");
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener("click", () => {
      mobileDrawer.classList.toggle("open");
    });
  }

  // Quick Search input in Hero
  const heroSearchInput = document.getElementById("heroSearchInput");
  const heroSearchBtn = document.getElementById("heroSearchSubmit");
  if (heroSearchBtn) {
    heroSearchBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const cat = document.getElementById("heroCategorySelect").value;
      const q = heroSearchInput ? heroSearchInput.value.trim() : "";
      if (cat) state.activeCategory = cat;
      if (q) state.searchQuery = q;
      applyFilters();
      scrollToSection("eventsSection");
    });
  }

  // Filter Toolbar Search
  const filterSearchInput = document.getElementById("filterSearchInput");
  if (filterSearchInput) {
    filterSearchInput.addEventListener("input", debounce((e) => {
      state.searchQuery = e.target.value.trim();
      applyFilters();
    }, 200));
  }

  // Filter Dropdowns
  const dateSelect = document.getElementById("filterDateSelect");
  if (dateSelect) {
    dateSelect.addEventListener("change", (e) => {
      state.dateFilter = e.target.value;
      applyFilters();
    });
  }

  const priceSelect = document.getElementById("filterPriceSelect");
  if (priceSelect) {
    priceSelect.addEventListener("change", (e) => {
      state.priceFilter = e.target.value;
      applyFilters();
    });
  }

  const sortSelect = document.getElementById("filterSortSelect");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      state.sortBy = e.target.value;
      applyFilters();
    });
  }

  // Keyboard shortcut '/' to focus search
  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
      e.preventDefault();
      const input = document.getElementById("filterSearchInput") || document.getElementById("heroSearchInput");
      if (input) {
        input.focus();
        showToast("Search focused! Press Esc to unfocus", "info", 1500);
      }
    }
    // Escape key closes modals
    if (e.key === "Escape") {
      closeAllModals();
    }
  });

  // Modal Backdrop click to close
  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.classList.remove("open");
      }
    });
  });

  // Listen to hash changes for Admin panel
  window.addEventListener("hashchange", () => {
    if (window.location.hash === "#admin") {
      openAdminModal();
    }
  });

  // Newsletter Form Submit
  const newsletterForm = document.getElementById("newsletterForm");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector("input");
      if (input && input.value) {
        showToast(`🎉 VIP Pass Code "EARLY20" unlocked for ${input.value}!`, "success");
        input.value = "";
      }
    });
  }
}

// Live Countdown Timer for Featured Event
function startHeroCountdown() {
  const countdownBox = document.getElementById("heroCountdown");
  if (!countdownBox || !state.featuredEvent) return;

  const targetDate = new Date(state.featuredEvent.date + "T" + (state.featuredEvent.time.split(' - ')[0] || "18:00") + ":00");

  function update() {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      countdownBox.innerHTML = `<span style="color:#10b981; font-weight:700;">LIVE NOW</span>`;
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    countdownBox.innerHTML = `
      <div class="countdown-digits">
        <span>${days}</span><span class="countdown-unit">d</span>
        <span>${hours.toString().padStart(2, '0')}</span><span class="countdown-unit">h</span>
        <span>${mins.toString().padStart(2, '0')}</span><span class="countdown-unit">m</span>
        <span>${secs.toString().padStart(2, '0')}</span><span class="countdown-unit">s</span>
      </div>
    `;
  }

  update();
  setInterval(update, 1000);
}

// Categories Grid Rendering
function renderCategoriesGrid() {
  const container = document.getElementById("categoriesGrid");
  if (!container) return;

  const categories = [
    { id: "music", name: "Concerts & Music", count: "12 Events", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>` },
    { id: "tech", name: "Tech & AI", count: "8 Events", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>` },
    { id: "food", name: "Food & Wine", count: "5 Events", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>` },
    { id: "arts", name: "Arts & Theatre", count: "9 Events", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>` },
    { id: "sports", name: "Sports & Gaming", count: "7 Events", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M14.31 8l5.74 9.94"></path><path d="M9.69 8h11.48"></path><path d="M7.38 12l5.74-9.94"></path><path d="M9.69 16L3.95 6.06"></path><path d="M14.31 16H2.83"></path><path d="M16.62 12l-5.74 9.94"></path></svg>` },
    { id: "business", name: "Business Summit", count: "6 Events", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>` }
  ];

  container.innerHTML = categories.map(cat => {
    const isActive = state.activeCategory === cat.id;
    return `
      <div class="category-card ${isActive ? 'active' : ''}" onclick="setCategoryFilter('${cat.id}')">
        <div class="cat-icon-box">${cat.icon}</div>
        <h4>${cat.name}</h4>
        <span>${cat.count}</span>
      </div>
    `;
  }).join('');

  renderCategoryPills(categories);
}

function renderCategoryPills(categories) {
  const pillsContainer = document.getElementById("categoryPillsContainer");
  if (!pillsContainer) return;

  pillsContainer.innerHTML = `
    <button class="pill-btn ${state.activeCategory === 'all' ? 'active' : ''}" onclick="setCategoryFilter('all')">
      All Events
    </button>
    ${categories.map(cat => `
      <button class="pill-btn ${state.activeCategory === cat.id ? 'active' : ''}" onclick="setCategoryFilter('${cat.id}')">
        ${cat.name}
      </button>
    `).join('')}
  `;
}

function setCategoryFilter(categoryId) {
  state.activeCategory = categoryId;
  applyFilters();
  renderCategoriesGrid();
  scrollToSection("eventsSection");
}

function updateCategoryCounts() {
  renderCategoriesGrid();
}

// Filtering & Sorting Logic
function applyFilters() {
  let list = [...state.events];

  // 1. Category Filter
  if (state.activeCategory !== "all") {
    list = list.filter(e => e.category === state.activeCategory);
  }

  // 2. Search Query
  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    list = list.filter(e => 
      e.title.toLowerCase().includes(q) ||
      e.venue.toLowerCase().includes(q) ||
      e.city.toLowerCase().includes(q) ||
      e.shortDescription.toLowerCase().includes(q)
    );
  }

  // 3. Date Filter
  if (state.dateFilter !== "all") {
    const now = new Date();
    list = list.filter(e => {
      const evDate = new Date(e.date);
      if (state.dateFilter === "today") {
        return evDate.toDateString() === now.toDateString();
      } else if (state.dateFilter === "weekend") {
        const day = evDate.getDay();
        return day === 5 || day === 6 || day === 0; // Fri, Sat, Sun
      } else if (state.dateFilter === "month") {
        return evDate.getMonth() === now.getMonth() && evDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  }

  // 4. Price Filter
  if (state.priceFilter !== "all") {
    list = list.filter(e => {
      if (state.priceFilter === "free") return e.minPrice === 0;
      if (state.priceFilter === "under50") return e.minPrice < 50;
      if (state.priceFilter === "50-150") return e.minPrice >= 50 && e.minPrice <= 150;
      if (state.priceFilter === "over150") return e.minPrice > 150;
      return true;
    });
  }

  // 5. Sorting
  if (state.sortBy === "upcoming") {
    list.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (state.sortBy === "price-low") {
    list.sort((a, b) => a.minPrice - b.minPrice);
  } else if (state.sortBy === "price-high") {
    list.sort((a, b) => b.minPrice - a.minPrice);
  } else if (state.sortBy === "popularity") {
    list.sort((a, b) => (b.bookedSeats || 0) - (a.bookedSeats || 0));
  }

  state.filteredEvents = list;
  renderEvents();
}

// Render Event Cards Grid / List View
function renderEvents() {
  const grid = document.getElementById("eventsGrid");
  const countBadge = document.getElementById("eventsResultCount");
  if (!grid) return;

  if (countBadge) {
    countBadge.innerText = `${state.filteredEvents.length} Events Available`;
  }

  if (state.filteredEvents.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>
        <h3>No matching events found</h3>
        <p>Try adjusting your search criteria, selecting a different category, or resetting all active filters.</p>
        <button class="btn btn-primary" onclick="resetFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  const wishlist = getStoredWishlist();

  grid.innerHTML = state.filteredEvents.map(event => {
    const isBookmarked = wishlist.includes(event.id);
    const capacityPct = Math.min(100, Math.round(((event.bookedSeats || 0) / (event.capacity || 1000)) * 100));
    const seatsRemaining = (event.capacity || 1000) - (event.bookedSeats || 0);

    return `
      <div class="event-card" data-id="${event.id}">
        <div class="event-card-media">
          <img src="${event.coverImage}" alt="${event.title}" class="event-card-img" loading="lazy">
          
          <div class="card-top-badges">
            <span class="badge ${event.badge === 'SELLING FAST' ? 'badge-hot' : event.badge === 'TOP RATED' ? 'badge-emerald' : 'badge-primary'}">
              ${event.badge || 'UPCOMING'}
            </span>
            <button class="wishlist-toggle-btn ${isBookmarked ? 'bookmarked' : ''}" onclick="toggleWishlist('${event.id}', event)" title="Save to Favorites">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </button>
          </div>

          <div class="event-card-date-ribbon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            <span>${formatEventDate(event.date)}</span>
          </div>
        </div>

        <div class="event-card-body">
          <div class="event-card-header">
            <span class="event-card-category">${event.categoryLabel}</span>
            <h3 class="event-card-title">${highlightQuery(event.title, state.searchQuery)}</h3>
          </div>

          <div class="event-card-meta">
            <div class="meta-row">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span>${event.venue}, ${event.city}</span>
            </div>
            <div class="meta-row">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <span>${event.time}</span>
            </div>
          </div>

          <p class="event-card-description">${event.shortDescription}</p>

          <div class="capacity-tracker">
            <div class="capacity-labels">
              <span>${seatsRemaining > 0 ? `Only ${seatsRemaining} tickets left` : 'Sold Out'}</span>
              <span>${capacityPct}% booked</span>
            </div>
            <div class="capacity-bar">
              <div class="capacity-progress" style="width: ${capacityPct}%;"></div>
            </div>
          </div>

          <div class="event-card-footer">
            <div class="event-price-box">
              <span class="price-label">Tickets From</span>
              <span class="price-value">${formatPrice(event.minPrice)}</span>
            </div>
            <div class="event-card-actions">
              <button class="btn btn-secondary btn-sm" onclick="openEventDetails('${event.id}')">
                Details
              </button>
              <button class="btn btn-primary btn-sm" onclick="openBookingModal('${event.id}')">
                Book Ticket
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function setViewMode(mode) {
  state.currentView = mode;
  const grid = document.getElementById("eventsGrid");
  const gridBtn = document.getElementById("viewGridBtn");
  const listBtn = document.getElementById("viewListBtn");

  if (grid) {
    grid.className = mode === "list" ? "events-grid list-view" : "events-grid";
  }
  if (gridBtn && listBtn) {
    gridBtn.classList.toggle("active", mode === "grid");
    listBtn.classList.toggle("active", mode === "list");
  }
}

function resetFilters() {
  state.activeCategory = "all";
  state.searchQuery = "";
  state.dateFilter = "all";
  state.priceFilter = "all";
  state.sortBy = "upcoming";

  const searchInput = document.getElementById("filterSearchInput");
  if (searchInput) searchInput.value = "";
  const dateSelect = document.getElementById("filterDateSelect");
  if (dateSelect) dateSelect.value = "all";
  const priceSelect = document.getElementById("filterPriceSelect");
  if (priceSelect) priceSelect.value = "all";
  const sortSelect = document.getElementById("filterSortSelect");
  if (sortSelect) sortSelect.value = "upcoming";

  renderCategoriesGrid();
  applyFilters();
  showToast("Filters reset to default", "info");
}

// Event Details Modal
function openEventDetails(eventId) {
  const events = getStoredEvents();
  const event = events.find(e => e.id === eventId);
  if (!event) return;

  state.activeDetailEvent = event;
  const modal = document.getElementById("eventDetailsModal");
  const container = document.getElementById("eventDetailsModalContent");
  if (!modal || !container) return;

  container.innerHTML = `
    <div class="event-details-hero">
      <img src="${event.coverImage}" alt="${event.title}">
      <div class="event-details-hero-content">
        <span class="badge badge-cyan" style="margin-bottom: 0.5rem;">${event.categoryLabel}</span>
        <h2 style="font-size: 2rem; color: white;">${event.title}</h2>
        <div style="display:flex; gap:1.5rem; font-size:0.9rem; margin-top:0.5rem; flex-wrap:wrap;">
          <span>📍 ${event.venue}, ${event.city}</span>
          <span>📅 ${formatEventDate(event.date)} (${event.time})</span>
          <span>⭐ ${event.rating} (${event.reviewsCount} reviews)</span>
        </div>
      </div>
    </div>

    <div class="event-details-body">
      <!-- Tab Navigation -->
      <div class="details-tab-nav">
        <button class="details-tab-btn active" onclick="switchDetailTab('overview')">Overview</button>
        <button class="details-tab-btn" onclick="switchDetailTab('schedule')">Schedule & Agenda</button>
        <button class="details-tab-btn" onclick="switchDetailTab('speakers')">Featured Guests</button>
        <button class="details-tab-btn" onclick="switchDetailTab('venue')">Venue & Location</button>
        <button class="details-tab-btn" onclick="switchDetailTab('faqs')">FAQs</button>
      </div>

      <!-- Tab Panes -->
      <div id="tab-overview" class="details-tab-pane active">
        <h4 style="margin-bottom: 0.75rem;">About This Event</h4>
        <p style="color: var(--text-muted); line-height: 1.7; margin-bottom: 1.5rem;">${event.fullDescription}</p>

        <h4 style="margin-bottom: 0.75rem;">Organizer Information</h4>
        <div class="organizer-card">
          <img src="${event.organizer.avatar}" alt="${event.organizer.name}" class="organizer-avatar">
          <div>
            <div style="display:flex; align-items:center; gap:0.4rem;">
              <strong>${event.organizer.name}</strong>
              ${event.organizer.verified ? '<span style="color:#38bdf8;">✓ Verified</span>' : ''}
            </div>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-top:0.25rem;">${event.organizer.bio}</p>
            <div style="font-size:0.78rem; color:var(--text-dim); margin-top:0.35rem;">
              ${event.organizer.eventsHosted} events hosted • ⭐ ${event.organizer.rating} organizer rating
            </div>
          </div>
        </div>
      </div>

      <div id="tab-schedule" class="details-tab-pane">
        <h4 style="margin-bottom: 1.25rem;">Event Timeline & Schedule</h4>
        <div class="timeline-list">
          ${event.schedule.map(item => `
            <div class="timeline-item">
              <span class="timeline-time">${item.time}</span>
              <h5 class="timeline-title">${item.title}</h5>
              <div class="timeline-meta">${item.artist} • <em>${item.stage}</em></div>
            </div>
          `).join('')}
        </div>
      </div>

      <div id="tab-speakers" class="details-tab-pane">
        <h4 style="margin-bottom: 1.25rem;">Headliners & Keynote Speakers</h4>
        <div class="speakers-grid">
          ${event.speakers && event.speakers.length > 0 ? event.speakers.map(sp => `
            <div class="speaker-card">
              <img src="${sp.image}" alt="${sp.name}" class="speaker-avatar">
              <h5 style="margin-bottom: 0.25rem;">${sp.name}</h5>
              <p style="font-size: 0.8rem; color: var(--text-muted);">${sp.role}</p>
            </div>
          `).join('') : '<p style="color:var(--text-muted)">Guest line-up will be announced shortly.</p>'}
        </div>
      </div>

      <div id="tab-venue" class="details-tab-pane">
        <h4 style="margin-bottom: 0.75rem;">Venue Location</h4>
        <p style="color: var(--text-muted); margin-bottom: 1rem;">${event.venue} — ${event.address}, ${event.city}</p>
        <div style="border-radius: var(--radius-md); overflow: hidden; height: 200px; background: #1e293b; display: flex; align-items: center; justify-content: center; position: relative;">
          <div style="text-align: center; color: #94a3b8;">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-bottom: 0.5rem;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <div>Interactive Venue Map Preview (${event.city})</div>
          </div>
        </div>
      </div>

      <div id="tab-faqs" class="details-tab-pane">
        <h4 style="margin-bottom: 1.25rem;">Frequently Asked Questions</h4>
        <div style="display:flex; flex-direction:column; gap:1rem;">
          ${event.faqs ? event.faqs.map(f => `
            <div style="background:var(--bg-glass-input); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:1rem 1.25rem;">
              <strong style="display:block; margin-bottom:0.35rem; color:var(--text-main);">${f.q}</strong>
              <p style="font-size:0.88rem; color:var(--text-muted);">${f.a}</p>
            </div>
          `).join('') : '<p style="color:var(--text-muted)">No FAQs available at this moment.</p>'}
        </div>
      </div>

      <!-- Sticky Bottom Details Bar -->
      <div class="details-bottom-bar">
        <div>
          <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Passes Starting At</span>
          <div style="font-family: var(--font-display); font-size: 1.5rem; font-weight: 800;">
            ${formatPrice(event.minPrice)} <span style="font-size:0.8rem; font-weight:normal; color:var(--text-muted);">/ person</span>
          </div>
        </div>
        <button class="btn btn-primary btn-lg" onclick="closeDetailsAndOpenBooking('${event.id}')">
          Book Tickets Now
        </button>
      </div>
    </div>
  `;

  modal.classList.add("open");
}

function switchDetailTab(tabId) {
  document.querySelectorAll(".details-tab-btn").forEach(btn => btn.classList.remove("active"));
  document.querySelectorAll(".details-tab-pane").forEach(pane => pane.classList.remove("active"));

  const targetPane = document.getElementById(`tab-${tabId}`);
  if (targetPane) targetPane.classList.add("active");

  const activeBtn = Array.from(document.querySelectorAll(".details-tab-btn")).find(b => b.innerText.toLowerCase().includes(tabId));
  if (activeBtn) activeBtn.classList.add("active");
}

function closeDetailsAndOpenBooking(eventId) {
  const detailsModal = document.getElementById("eventDetailsModal");
  if (detailsModal) detailsModal.classList.remove("open");
  openBookingModal(eventId);
}

// Wishlist / Bookmarking
function toggleWishlist(eventId, eventObj) {
  if (eventObj) eventObj.stopPropagation();
  let wishlist = getStoredWishlist();
  const index = wishlist.indexOf(eventId);

  if (index > -1) {
    wishlist.splice(index, 1);
    showToast("Removed from your saved events", "info");
  } else {
    wishlist.push(eventId);
    showToast("❤️ Saved to your wishlist!", "success");
  }

  saveWishlist(wishlist);
  updateNavigationBadges();
  renderEvents();
}

function openWishlistModal() {
  const wishlist = getStoredWishlist();
  const modal = document.getElementById("wishlistModal");
  const container = document.getElementById("wishlistEventsContainer");
  if (!modal || !container) return;

  const savedEvents = state.events.filter(e => wishlist.includes(e.id));

  if (savedEvents.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding: 3rem 1rem;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">❤️</div>
        <h3>Your Wishlist is Empty</h3>
        <p style="color:var(--text-muted); margin-top:0.5rem;">Explore upcoming events and tap the heart icon on any card to save it for later.</p>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:1rem;">
        ${savedEvents.map(e => `
          <div style="display:flex; align-items:center; justify-content:space-between; gap:1rem; padding:1rem; background:var(--bg-glass-input); border:1px solid var(--border-subtle); border-radius:var(--radius-md);">
            <img src="${e.coverImage}" style="width:70px; height:60px; object-fit:cover; border-radius:var(--radius-sm);" alt="${e.title}">
            <div style="flex:1;">
              <h5 style="font-size:1rem; margin-bottom:0.2rem;">${e.title}</h5>
              <div style="font-size:0.8rem; color:var(--text-muted);">${formatEventDate(e.date)} • ${e.venue}</div>
            </div>
            <div style="display:flex; gap:0.5rem;">
              <button class="btn btn-primary btn-sm" onclick="closeWishlistAndBook('${e.id}')">Book</button>
              <button class="btn btn-outline btn-sm" onclick="toggleWishlist('${e.id}'); openWishlistModal();">Remove</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  modal.classList.add("open");
}

function closeWishlistAndBook(eventId) {
  const modal = document.getElementById("wishlistModal");
  if (modal) modal.classList.remove("open");
  openBookingModal(eventId);
}

// "My Tickets" Portal
function openMyTicketsModal() {
  const bookings = getStoredBookings();
  const modal = document.getElementById("myTicketsModal");
  const container = document.getElementById("myTicketsListContainer");
  if (!modal || !container) return;

  if (bookings.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding: 3rem 1rem;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🎟️</div>
        <h3>No Booked Passes Yet</h3>
        <p style="color:var(--text-muted); margin-top:0.5rem;">Choose an event from our listings and reserve your spot to view your official digital ticket pass here.</p>
        <button class="btn btn-primary" style="margin-top:1.5rem;" onclick="closeAllModals(); scrollToSection('eventsSection');">Explore Events</button>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:1.25rem;">
        ${bookings.map(b => `
          <div style="display:flex; align-items:center; justify-content:space-between; gap:1.25rem; padding:1.25rem; background:var(--bg-glass-input); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); flex-wrap:wrap;">
            <img src="${b.coverImage}" style="width:90px; height:75px; object-fit:cover; border-radius:var(--radius-md);" alt="${b.eventTitle}">
            <div style="flex:1; min-width:220px;">
              <span class="badge badge-primary" style="margin-bottom:0.35rem;">${b.id}</span>
              <h4 style="font-size:1.1rem; margin-bottom:0.25rem;">${b.eventTitle}</h4>
              <div style="font-size:0.85rem; color:var(--text-muted);">
                📅 ${b.eventDate} • 📍 ${b.eventVenue}
              </div>
              <div style="font-size:0.82rem; color:#38bdf8; margin-top:0.25rem;">
                ${b.quantity} × ${b.tierName} (${b.totalPaid})
              </div>
            </div>
            <div style="display:flex; flex-direction:column; gap:0.5rem;">
              <button class="btn btn-primary btn-sm" onclick="reprintTicketPass('${b.id}')">
                View Digital Pass
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  modal.classList.add("open");
}

function reprintTicketPass(bookingId) {
  const bookings = getStoredBookings();
  const b = bookings.find(item => item.id === bookingId);
  if (!b) return;

  const events = getStoredEvents();
  const ev = events.find(e => e.id === b.eventId) || {
    id: b.eventId,
    title: b.eventTitle,
    venue: b.eventVenue,
    date: b.eventDate,
    time: b.eventTime || "19:00",
    coverImage: b.coverImage
  };

  currentBooking.event = ev;
  currentBooking.tier = { name: b.tierName, price: b.ticketPrice || 50 };
  currentBooking.quantity = b.quantity;
  currentBooking.orderId = b.id;
  currentBooking.attendee = { fullName: b.attendeeName, email: b.attendeeEmail };

  closeAllModals();
  const modal = document.getElementById("bookingModal");
  if (modal) {
    modal.classList.add("open");
    renderWizardStep(4);
  }
}

// User Authentication (Sign In & Sign Up)
function openAuthModal(initialTab = "signin") {
  const modal = document.getElementById("authModal");
  if (!modal) return;
  switchAuthTab(initialTab);
  modal.classList.add("open");
}

function switchAuthTab(tab) {
  const signinForm = document.getElementById("authSigninForm");
  const signupForm = document.getElementById("authSignupForm");
  const signinBtn = document.getElementById("authTabSignin");
  const signupBtn = document.getElementById("authTabSignup");

  if (tab === "signin") {
    signinForm.style.display = "block";
    signupForm.style.display = "none";
    signinBtn.classList.add("active");
    signupBtn.classList.remove("active");
  } else {
    signinForm.style.display = "none";
    signupForm.style.display = "block";
    signupBtn.classList.add("active");
    signinBtn.classList.remove("active");
  }
}

function handleAuthSubmit(type, e) {
  e.preventDefault();
  let user = null;

  if (type === "signin") {
    const email = document.getElementById("signinEmail").value.trim();
    user = {
      name: email.split("@")[0].toUpperCase() || "Alex Mercer",
      email: email,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
    };
    showToast(`Welcome back, ${user.name}!`, "success");
  } else {
    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    user = {
      name: name || "New Member",
      email: email,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
    };
    showToast(`Account created! Welcome, ${user.name}`, "success");
  }

  setActiveUser(user);
  closeAllModals();
  updateNavigationBadges();
}

function handleSocialLogin(provider) {
  const dummyUser = {
    name: provider === "Google" ? "Jordan Vance" : "Devon Lane",
    email: `${provider.toLowerCase()}.user@example.com`,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
  };
  setActiveUser(dummyUser);
  closeAllModals();
  updateNavigationBadges();
  showToast(`Signed in successfully with ${provider}!`, "success");
}

function handleLogout() {
  setActiveUser(null);
  updateNavigationBadges();
  showToast("You have been signed out", "info");
}

// Navigation Badges & User Status Updates
function updateNavigationBadges() {
  // Wishlist count
  const wishlist = getStoredWishlist();
  const wishBadge = document.getElementById("navWishlistCount");
  if (wishBadge) wishBadge.innerText = wishlist.length;

  // Bookings count
  const bookings = getStoredBookings();
  const bookBadge = document.getElementById("navTicketsCount");
  if (bookBadge) bookBadge.innerText = bookings.length;

  // User auth button
  const user = getActiveUser();
  const userActionContainer = document.getElementById("navUserActionBox");
  if (userActionContainer) {
    if (user) {
      userActionContainer.innerHTML = `
        <div style="display:flex; align-items:center; gap:0.6rem;">
          <img src="${user.avatar}" style="width:34px; height:34px; border-radius:50%; border:2px solid var(--primary);" alt="${user.name}">
          <span style="font-size:0.85rem; font-weight:600; color:var(--text-main); display:none;" class="desktop-user-name">${user.name}</span>
          <button class="btn btn-outline btn-sm" onclick="handleLogout()" title="Log out">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          </button>
        </div>
      `;
    } else {
      userActionContainer.innerHTML = `
        <button class="btn btn-primary btn-sm" onclick="openAuthModal('signin')">
          Sign In
        </button>
      `;
    }
  }
}

// Utility Helpers
function closeAllModals() {
  document.querySelectorAll(".modal-overlay").forEach(m => m.classList.remove("open"));
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

function formatEventDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return d.toLocaleDateString('en-US', options);
}

function highlightQuery(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
  return text.replace(regex, '<mark style="background:rgba(99,102,241,0.3); color:#fff; border-radius:2px; padding:0 2px;">$1</mark>');
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Global Toast Notification
function showToast(message, type = "info", duration = 3500) {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  const icon = type === "success" 
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`
    : type === "error"
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`
    : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;

  toast.innerHTML = `${icon}<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, duration);
}
