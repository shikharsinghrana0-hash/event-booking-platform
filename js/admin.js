/**
 * EventPulse - Organizer & Executive Admin Studio
 * Real-time analytics, event management, gate check-in verification, and payouts.
 */

// Initial Seed Bookings for Admin demonstration if empty
const DEMO_SEED_BOOKINGS = [
  {
    id: "EVT-9821-412",
    eventId: 1,
    eventTitle: "Neon Horizon: Cyberpunk Live 2026",
    eventDate: "2026-11-20",
    tierName: "VIP Pass",
    quantity: 2,
    amountUSD: 198,
    bookingDate: "2026-11-14 18:32",
    attendee: {
      name: "Sophia Chen",
      email: "sophia.chen@matrixcorp.io",
      phone: "+1 (555) 392-8819"
    },
    checkedIn: true,
    checkInTime: "2026-11-20 19:15"
  },
  {
    id: "EVT-4819-092",
    eventId: 2,
    eventTitle: "Global AI & NextGen Compute Summit",
    eventDate: "2026-12-05",
    tierName: "Executive All-Access",
    quantity: 1,
    amountUSD: 399,
    bookingDate: "2026-11-15 09:12",
    attendee: {
      name: "Aarav Sharma",
      email: "aarav.sharma@deepscale.tech",
      phone: "+91 98201 44921"
    },
    checkedIn: false
  },
  {
    id: "EVT-3321-778",
    eventId: 3,
    eventTitle: "Artisan Wine & Gastronomy Showcase",
    eventDate: "2026-11-28",
    tierName: "Grand Sommelier Tasting",
    quantity: 2,
    amountUSD: 170,
    bookingDate: "2026-11-15 14:45",
    attendee: {
      name: "Marcus Vance",
      email: "m.vance@lifestyle-journal.com",
      phone: "+1 (415) 839-2041"
    },
    checkedIn: false
  },
  {
    id: "EVT-7104-551",
    eventId: 4,
    eventTitle: "Cirque Nocturne: Lumina Wonderland",
    eventDate: "2026-12-12",
    tierName: "Front Row Orchestra",
    quantity: 4,
    amountUSD: 380,
    bookingDate: "2026-11-13 21:04",
    attendee: {
      name: "Elena Rostova",
      email: "elena.r@avantgarde.org",
      phone: "+44 20 7946 0912"
    },
    checkedIn: true,
    checkInTime: "2026-12-12 18:40"
  },
  {
    id: "EVT-1920-334",
    eventId: 5,
    eventTitle: "Redline Drift Championship 2026",
    eventDate: "2026-12-18",
    tierName: "Pit Lane & Paddock Access",
    quantity: 2,
    amountUSD: 178,
    bookingDate: "2026-11-16 11:20",
    attendee: {
      name: "Rohan Kapoor",
      email: "rohan.kapoor@motorsport.in",
      phone: "+91 99302 11840"
    },
    checkedIn: false
  },
  {
    id: "EVT-8842-109",
    eventId: 6,
    eventTitle: "Venture Velocity & Founder Syndicate",
    eventDate: "2027-01-15",
    tierName: "Angel Investor Pass",
    quantity: 1,
    amountUSD: 349,
    bookingDate: "2026-11-16 14:05",
    attendee: {
      name: "David Miller",
      email: "david@horizonventures.vc",
      phone: "+1 (212) 670-4921"
    },
    checkedIn: false
  }
];

// Ensure seed bookings exist
function initAdminBookings() {
  const existing = getStoredBookings();
  if (!existing || existing.length === 0) {
    saveBookings(DEMO_SEED_BOOKINGS);
  }
}

// Open Admin Modal
function openAdminModal() {
  initAdminBookings();
  const modal = document.getElementById("adminModal");
  if (modal) {
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
    refreshAdminDashboard();
  }
}

// Close Admin Modal
function closeAdminModal() {
  const modal = document.getElementById("adminModal");
  if (modal) {
    modal.classList.remove("open");
    document.body.style.overflow = "";
    if (window.location.hash === "#admin") {
      history.replaceState(null, null, " ");
    }
  }
}

// Switch Admin Tab Navigation
function switchAdminTab(tabName) {
  const tabs = ["overview", "events", "attendees", "financials"];
  
  tabs.forEach(tab => {
    const btn = document.getElementById(`adminTab${tab.charAt(0).toUpperCase() + tab.slice(1)}Btn`);
    const pane = document.getElementById(`adminPane${tab.charAt(0).toUpperCase() + tab.slice(1)}`);
    
    if (btn) {
      if (tab === tabName) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    }
    
    if (pane) {
      if (tab === tabName) {
        pane.classList.add("active");
      } else {
        pane.classList.remove("active");
      }
    }
  });

  if (tabName === "overview") {
    renderAdminChart();
  }
}

// Refresh Entire Admin Dashboard
function refreshAdminDashboard() {
  initAdminBookings();
  const events = getStoredEvents();
  const bookings = getStoredBookings();
  const currency = getStoredCurrency();

  // Calculate gross telemetry
  let totalBookedSeats = 0;
  events.forEach(e => {
    totalBookedSeats += (e.bookedSeats || 0);
  });

  // Calculate revenue from all bookings + base event occupancy estimate
  let totalRevenueUSD = 0;
  bookings.forEach(b => {
    const val = b.amountUSD || (b.pricing && b.pricing.total ? (currency === 'INR' ? b.pricing.total / 83 : b.pricing.total) : 95);
    totalRevenueUSD += val;
  });

  // Base multiplier for realistic live studio metrics
  const combinedGrossUSD = Math.max(totalRevenueUSD * 45, 68450);
  const platformFeeUSD = combinedGrossUSD * 0.08;
  const netPayoutUSD = combinedGrossUSD - platformFeeUSD;

  // Update Overview Metrics
  const metricRev = document.getElementById("adminMetricRevenue");
  if (metricRev) {
    metricRev.textContent = formatCurrencyAmount(combinedGrossUSD, currency);
  }

  const metricAtt = document.getElementById("adminMetricAttendees");
  if (metricAtt) {
    metricAtt.textContent = (totalBookedSeats + bookings.length * 12).toLocaleString();
  }

  const metricEvt = document.getElementById("adminMetricEvents");
  if (metricEvt) {
    metricEvt.textContent = events.length.toString();
  }

  // Update Badges
  const countEvents = document.getElementById("adminEventsCountBadge");
  if (countEvents) countEvents.textContent = events.length;

  const countAttendees = document.getElementById("adminAttendeesCountBadge");
  if (countAttendees) countAttendees.textContent = bookings.length;

  // Update Financials Tab Metrics
  const finGross = document.getElementById("adminFinGross");
  if (finGross) finGross.textContent = formatCurrencyAmount(combinedGrossUSD, currency);

  const finFees = document.getElementById("adminFinFees");
  if (finFees) finFees.textContent = formatCurrencyAmount(platformFeeUSD, currency);

  const finNet = document.getElementById("adminFinNet");
  if (finNet) finNet.textContent = formatCurrencyAmount(netPayoutUSD, currency);

  // Render Sub-Views
  renderAdminChart();
  renderAdminEventsTable(events);
  renderAdminBookingsTable(bookings);
}

// Render SVG Spline Chart for 7-Day Velocity
function renderAdminChart() {
  const container = document.getElementById("adminChartSvgContainer");
  if (!container) return;

  const currency = getStoredCurrency();
  const isINR = currency === "INR";
  const symbol = isINR ? "₹" : "$";
  const rate = isINR ? 83 : 1;

  // 7-day data points (USD base)
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const salesUSD = [5400, 7200, 6800, 9400, 11200, 14800, 16250];
  const admissions = [112, 148, 134, 192, 240, 310, 344];

  const maxUSD = Math.max(...salesUSD) * 1.15;
  const width = 880;
  const height = 240;
  const paddingX = 55;
  const paddingY = 30;
  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;

  // Calculate points
  const points = salesUSD.map((val, idx) => {
    const x = paddingX + (idx / (salesUSD.length - 1)) * chartW;
    const y = height - paddingY - (val / maxUSD) * chartH;
    return { x, y, valUSD: val, day: days[idx], adm: admissions[idx] };
  });

  // Cubic Bezier Spline generator
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cpX1 = p0.x + (p1.x - p0.x) / 2;
    const cpY1 = p0.y;
    const cpX2 = p0.x + (p1.x - p0.x) / 2;
    const cpY2 = p1.y;
    pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
  }

  // Area Path
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  // Gridlines and labels
  let gridLines = "";
  const gridSteps = 4;
  for (let s = 0; s <= gridSteps; s++) {
    const y = height - paddingY - (s / gridSteps) * chartH;
    const valueUSD = (maxUSD * (s / gridSteps));
    const label = `${symbol}${(Math.round((valueUSD * rate) / 1000))}k`;
    gridLines += `
      <line x1="${paddingX}" y1="${y}" x2="${width - paddingX}" y2="${y}" stroke="var(--border-subtle)" stroke-dasharray="4,4" stroke-width="1" />
      <text x="${paddingX - 10}" y="${y + 4}" fill="var(--text-muted)" font-size="10" text-anchor="end" font-family="sans-serif">${label}</text>
    `;
  }

  // Day markers & Interactive Points
  let markersHtml = "";
  points.forEach((pt) => {
    const formattedVal = formatCurrencyAmount(pt.valUSD, currency);
    markersHtml += `
      <g class="chart-point-group" style="cursor: pointer;">
        <line x1="${pt.x}" y1="${paddingY}" x2="${pt.x}" y2="${height - paddingY}" stroke="var(--border-subtle)" stroke-width="1" opacity="0.4" />
        <circle cx="${pt.x}" cy="${pt.y}" r="6" fill="#8b5cf6" stroke="#ffffff" stroke-width="2.5" />
        <circle cx="${pt.x}" cy="${pt.y}" r="11" fill="#8b5cf6" opacity="0.2" />
        <text x="${pt.x}" y="${height - paddingY + 18}" fill="var(--text-secondary)" font-size="11" font-weight="600" text-anchor="middle" font-family="sans-serif">${pt.day}</text>
        <title>${pt.day}: ${formattedVal} (${pt.adm} admissions)</title>
      </g>
    `;
  });

  container.innerHTML = `
    <div style="width:100%; overflow-x:auto;">
      <svg viewBox="0 0 ${width} ${height}" style="width:100%; min-width:600px; height:auto; display:block;">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.4" />
            <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.0" />
          </linearGradient>
        </defs>
        ${gridLines}
        <path d="${areaD}" fill="url(#chartGradient)" />
        <path d="${pathD}" fill="none" stroke="#8b5cf6" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
        ${markersHtml}
      </svg>
    </div>
  `;
}

// Render Manage Events Table
function renderAdminEventsTable(events) {
  const tbody = document.getElementById("adminEventsTableBody");
  if (!tbody) return;

  if (events.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:2rem; color:var(--text-muted);">No events found. Click "+ Add New Event" to publish one!</td></tr>`;
    return;
  }

  tbody.innerHTML = events.map(e => {
    const formattedPrice = formatPrice(e.price);
    const capacity = e.capacity || 1000;
    const booked = e.bookedSeats || 0;
    const occupancy = Math.min(Math.round((booked / capacity) * 100), 100);

    return `
      <tr>
        <td>
          <div style="display:flex; align-items:center; gap:0.85rem;">
            <img src="${e.image}" alt="${e.title}" style="width:48px; height:48px; border-radius:8px; object-fit:cover; border:1px solid var(--border-subtle);" loading="lazy">
            <div>
              <div style="font-weight:600; color:var(--text-primary); font-size:0.92rem;">${e.title}</div>
              <div style="font-size:0.75rem; color:var(--text-muted);">ID: #${e.id} • ${e.organizer ? e.organizer.name : "EventPulse Official"}</div>
            </div>
          </div>
        </td>
        <td>
          <span class="badge badge-primary" style="text-transform:capitalize;">${e.category}</span>
        </td>
        <td>
          <div style="font-weight:500; font-size:0.85rem;">${e.date}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">${e.venue ? e.venue.city : e.city || "San Francisco"}</div>
        </td>
        <td>
          <strong style="color:var(--text-primary); font-size:0.95rem;">${formattedPrice}</strong>
        </td>
        <td>
          <div style="min-width:110px;">
            <div style="display:flex; justify-content:space-between; font-size:0.75rem; margin-bottom:0.25rem;">
              <span>${booked} / ${capacity}</span>
              <strong>${occupancy}%</strong>
            </div>
            <div style="height:6px; background:var(--bg-card); border-radius:99px; overflow:hidden;">
              <div style="width:${occupancy}%; height:100%; background:linear-gradient(90deg, var(--primary), #ec4899); border-radius:99px;"></div>
            </div>
          </div>
        </td>
        <td>
          <div style="display:flex; gap:0.5rem;">
            <button class="btn btn-secondary btn-sm" onclick="closeAdminModal(); openEventDetails(${e.id});" title="Preview Public Page">
              View
            </button>
            <button class="btn btn-sm" style="background:rgba(239,68,68,0.15); color:#ef4444; border:1px solid rgba(239,68,68,0.3);" onclick="deleteAdminEvent(${e.id})" title="Remove Event">
              Delete
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

// Render Attendees & Bookings Table
function renderAdminBookingsTable(bookings) {
  const tbody = document.getElementById("adminBookingsTableBody");
  if (!tbody) return;

  if (bookings.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:2rem; color:var(--text-muted);">No attendee registrations recorded yet.</td></tr>`;
    return;
  }

  const currency = getStoredCurrency();

  tbody.innerHTML = bookings.map(b => {
    const isChecked = !!b.checkedIn;
    const name = (b.attendee && b.attendee.name) ? b.attendee.name : "Guest Attendee";
    const email = (b.attendee && b.attendee.email) ? b.attendee.email : "guest@eventpulse.io";
    const phone = (b.attendee && b.attendee.phone) ? b.attendee.phone : "+1 (555) 000-0000";
    const title = b.eventTitle || (b.event ? b.event.title : "Event Admission");
    const tier = b.tierName || (b.tier ? b.tier.name : "General Access");
    const qty = b.quantity || 1;
    
    // Amount formatting
    const amountVal = b.amountUSD || (b.pricing && b.pricing.total ? (currency === 'INR' ? b.pricing.total / 83 : b.pricing.total) : 95);
    const formattedAmount = formatCurrencyAmount(amountVal, currency);

    return `
      <tr id="booking-row-${b.id}">
        <td>
          <span style="font-family:monospace; font-weight:700; color:var(--primary); font-size:0.85rem;">${b.id}</span>
          <div style="font-size:0.7rem; color:var(--text-muted);">${b.bookingDate || "Today"}</div>
        </td>
        <td>
          <div style="font-weight:600; color:var(--text-primary); font-size:0.9rem;">${name}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">${email}</div>
          <div style="font-size:0.72rem; color:var(--text-muted);">${phone}</div>
        </td>
        <td>
          <div style="max-width:200px; font-weight:500; font-size:0.85rem; line-height:1.3;">${title}</div>
        </td>
        <td>
          <span class="badge badge-secondary" style="font-size:0.75rem;">${tier}</span>
          <span style="font-size:0.78rem; font-weight:600; margin-left:0.35rem;">×${qty}</span>
        </td>
        <td>
          <strong style="color:#10b981; font-size:0.92rem;">${formattedAmount}</strong>
        </td>
        <td>
          <button class="btn btn-sm ${isChecked ? 'btn-secondary' : 'btn-primary'}" 
                  style="${isChecked ? 'background:rgba(16,185,129,0.15); color:#10b981; border:1px solid rgba(16,185,129,0.3);' : ''}"
                  onclick="toggleGateCheckIn('${b.id}')">
            ${isChecked ? '✓ Checked-In' : 'Gate Check-In'}
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

// Filter Attendees by Search & Status
function filterAdminAttendees() {
  const query = (document.getElementById("adminAttendeeSearchInput")?.value || "").toLowerCase().trim();
  const status = document.getElementById("adminAttendeeStatusFilter")?.value || "all";
  
  const allBookings = getStoredBookings();
  const filtered = allBookings.filter(b => {
    const name = (b.attendee && b.attendee.name ? b.attendee.name : "").toLowerCase();
    const email = (b.attendee && b.attendee.email ? b.attendee.email : "").toLowerCase();
    const id = (b.id || "").toLowerCase();
    const title = (b.eventTitle || (b.event ? b.event.title : "")).toLowerCase();

    const matchesQuery = !query || name.includes(query) || email.includes(query) || id.includes(query) || title.includes(query);
    
    let matchesStatus = true;
    if (status === "checked") {
      matchesStatus = !!b.checkedIn;
    } else if (status === "pending") {
      matchesStatus = !b.checkedIn;
    }

    return matchesQuery && matchesStatus;
  });

  renderAdminBookingsTable(filtered);
}

// Toggle Gate Check-In for Attendee
function toggleGateCheckIn(orderId) {
  const bookings = getStoredBookings();
  const item = bookings.find(b => b.id === orderId);
  if (!item) return;

  item.checkedIn = !item.checkedIn;
  if (item.checkedIn) {
    item.checkInTime = new Date().toISOString();
  } else {
    delete item.checkInTime;
  }

  saveBookings(bookings);
  filterAdminAttendees();

  const attendeeName = item.attendee ? item.attendee.name : "Attendee";
  if (item.checkedIn) {
    showToast(`✓ Check-In Confirmed for ${attendeeName} (${orderId})`, "success");
  } else {
    showToast(`Status reset to Pending for ${attendeeName}`, "info");
  }
}

// Delete Event from Platform
function deleteAdminEvent(eventId) {
  const events = getStoredEvents();
  const target = events.find(e => e.id === eventId);
  if (!target) return;

  const confirmed = confirm(`Are you sure you want to delete "${target.title}"? This cannot be undone.`);
  if (!confirmed) return;

  const updated = events.filter(e => e.id !== eventId);
  saveEvents(updated);

  // Sync with main app state
  if (typeof state !== "undefined") {
    state.events = updated;
    if (typeof applyFilters === "function") applyFilters();
    if (typeof renderEvents === "function") renderEvents();
    if (typeof renderHeroSpotlight === "function") renderHeroSpotlight();
    if (typeof updateNavigationBadges === "function") updateNavigationBadges();
  }

  refreshAdminDashboard();
  showToast(`Event "${target.title}" has been removed from platform.`, "info");
}

// Open / Close Create Event Modal
function openCreateEventModal() {
  const modal = document.getElementById("createEventModal");
  if (modal) {
    modal.classList.add("open");
  }
}

function closeCreateEventModal() {
  const modal = document.getElementById("createEventModal");
  if (modal) {
    modal.classList.remove("open");
  }
}

// Handle Form Submission for Publishing a New Event
function handleCreateEventSubmit(e) {
  e.preventDefault();

  const title = document.getElementById("newEventTitle").value.trim();
  const category = document.getElementById("newEventCategory").value;
  const date = document.getElementById("newEventDate").value;
  const time = document.getElementById("newEventTime").value.trim() || "19:00 - 23:00";
  const venueName = document.getElementById("newEventVenue").value.trim();
  const city = document.getElementById("newEventCity").value.trim() || "San Francisco, CA";
  const rawPrice = parseFloat(document.getElementById("newEventPrice").value) || 45;
  const capacity = parseInt(document.getElementById("newEventCapacity").value, 10) || 800;
  const image = document.getElementById("newEventImage").value.trim() || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=80";
  const description = document.getElementById("newEventDesc").value.trim();

  // Price conversion based on current active currency
  const currency = getStoredCurrency();
  const priceUSD = currency === "INR" ? Math.round(rawPrice / 83) : rawPrice;

  const events = getStoredEvents();
  const newId = events.length > 0 ? Math.max(...events.map(ev => ev.id || 0)) + 1 : 1;

  const newEvent = {
    id: newId,
    title,
    category,
    date,
    time,
    venue: {
      name: venueName,
      address: `${venueName}, Downtown Arts District`,
      city: city,
      coordinates: "37.7749,-122.4194"
    },
    price: priceUSD,
    capacity,
    bookedSeats: 0,
    rating: 5.0,
    reviewsCount: 1,
    image,
    description,
    featured: false,
    organizer: {
      name: "Verified Event Creator",
      badge: "Verified Organizer",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      followers: "12.8k"
    },
    tiers: [
      {
        id: "gen",
        name: "General Admission",
        price: priceUSD,
        desc: "Full venue access, standing floor, digital guide",
        available: capacity - 150
      },
      {
        id: "vip",
        name: "VIP Lounge Pass",
        price: Math.round(priceUSD * 2.2),
        desc: "Express lane, elevated private mezzanine, complimentary signature drink",
        available: 100
      },
      {
        id: "all",
        name: "Backstage Patron Pass",
        price: Math.round(priceUSD * 3.8),
        desc: "Artist meet & greet, exclusive merch bundle, premium private lounge",
        available: 50
      }
    ],
    schedule: [
      { time: "18:00", title: "Doors Open & Check-In", desc: "Welcome reception and badge collection" },
      { time: "19:30", title: "Opening Act & Keynote", desc: "Main stage performances commence" },
      { time: "21:30", title: "Headliner Showcase", desc: "Peak performance and visual spectacle" },
      { time: "23:00", title: "Afterparty & Mingling", desc: "DJ set and networking in VIP lounge" }
    ],
    faq: [
      { q: "What is the refund policy?", a: "Full refunds are available up to 48 hours prior to the event start." },
      { q: "Is parking available at the venue?", a: "Yes, designated valet and self-parking are located on-site." },
      { q: "Are mobile tickets accepted at the gate?", a: "Yes, present your digital QR pass from the platform at check-in." }
    ]
  };

  events.unshift(newEvent);
  saveEvents(events);

  // Sync app state
  if (typeof state !== "undefined") {
    state.events = events;
    if (typeof applyFilters === "function") applyFilters();
    if (typeof renderEvents === "function") renderEvents();
    if (typeof updateNavigationBadges === "function") updateNavigationBadges();
  }

  closeCreateEventModal();
  refreshAdminDashboard();
  switchAdminTab("events");

  showToast(`🚀 "${title}" published successfully and live on EventPulse!`, "success");
}

// Global hook for currency changes to re-render admin metrics
window.refreshAdminDashboard = refreshAdminDashboard;
