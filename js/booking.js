/**
 * EventPulse - Booking Wizard & Digital Ticket Pass System
 * Handles multi-step booking, live price recalculations, card 3D preview,
 * Canvas confetti, QR code generator, and ticket persistence.
 */

// State for active booking process
let currentBooking = {
  event: null,
  tier: null,
  quantity: 1,
  discountPercent: 0,
  discountAmount: 0,
  appliedPromo: null,
  attendee: {
    fullName: "",
    email: "",
    phone: "",
    notes: ""
  },
  payment: {
    method: "card",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: ""
  },
  orderId: "",
  bookingDate: null
};

// Initialize Booking Modal
function openBookingModal(eventId, preselectedTierId = null) {
  const events = getStoredEvents();
  const event = events.find(e => e.id === eventId);
  if (!event) return;

  currentBooking.event = event;
  currentBooking.tier = preselectedTierId 
    ? event.ticketTiers.find(t => t.id === preselectedTierId) || event.ticketTiers[0]
    : event.ticketTiers[0];
  currentBooking.quantity = 1;
  currentBooking.discountPercent = 0;
  currentBooking.discountAmount = 0;
  currentBooking.appliedPromo = null;

  renderWizardStep(1);
  const modal = document.getElementById("bookingModal");
  if (modal) modal.classList.add("open");
}

function closeBookingModal() {
  const modal = document.getElementById("bookingModal");
  if (modal) modal.classList.remove("open");
}

// Step Navigation
function renderWizardStep(step) {
  // Update step indicators
  const indicators = document.querySelectorAll(".wizard-step-node");
  indicators.forEach(node => {
    const s = parseInt(node.getAttribute("data-step"));
    node.classList.remove("active", "completed");
    if (s === step) node.classList.add("active");
    else if (s < step) node.classList.add("completed");
  });

  // Toggle step panes
  document.querySelectorAll(".wizard-pane").forEach(pane => pane.style.display = "none");
  const activePane = document.getElementById(`wizardStep${step}`);
  if (activePane) activePane.style.display = "block";

  if (step === 1) renderStep1();
  if (step === 2) renderStep2();
  if (step === 3) renderStep3();
  if (step === 4) renderStep4();
}

// STEP 1: Tier Selection & Calculations
function renderStep1() {
  const container = document.getElementById("tierSelectionContainer");
  if (!container || !currentBooking.event) return;

  const event = currentBooking.event;
  container.innerHTML = event.ticketTiers.map(tier => {
    const isSelected = currentBooking.tier.id === tier.id;
    return `
      <div class="tier-select-card ${isSelected ? 'selected' : ''}" onclick="selectTier('${tier.id}')">
        <div class="tier-info">
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <input type="radio" name="tierRadio" ${isSelected ? 'checked' : ''} style="accent-color: var(--primary);">
            <h4>${tier.name}</h4>
          </div>
          <ul class="tier-perks-list">
            ${tier.perks.map(p => `<li><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> ${p}</li>`).join('')}
          </ul>
        </div>
        <div class="tier-single-price">${formatPrice(tier.price)}</div>
      </div>
    `;
  }).join('');

  updatePriceSummary();
}

function selectTier(tierId) {
  if (!currentBooking.event) return;
  const tier = currentBooking.event.ticketTiers.find(t => t.id === tierId);
  if (tier) {
    currentBooking.tier = tier;
    renderStep1();
  }
}

function changeQuantity(delta) {
  let newQty = currentBooking.quantity + delta;
  if (newQty < 1) newQty = 1;
  if (newQty > 10) {
    showToast("Maximum 10 tickets per order", "info");
    newQty = 10;
  }
  currentBooking.quantity = newQty;
  document.getElementById("ticketQtyDisplay").innerText = newQty;
  updatePriceSummary();
}

function applyCouponCode() {
  const input = document.getElementById("couponInput");
  if (!input) return;
  const code = input.value.trim().toUpperCase();

  if (code === "EARLY20") {
    currentBooking.discountPercent = 0.20;
    currentBooking.appliedPromo = code;
    showToast("🎉 20% Early Bird Discount applied!", "success");
  } else if (code === "STUDENT50") {
    currentBooking.discountPercent = 0.50;
    currentBooking.appliedPromo = code;
    showToast("🎓 50% Student Discount applied!", "success");
  } else if (code === "VIP50") {
    currentBooking.discountAmount = 50;
    currentBooking.appliedPromo = code;
    showToast("✨ $50 VIP Pass Discount applied!", "success");
  } else {
    showToast("Invalid promo code. Try 'EARLY20' or 'STUDENT50'", "error");
    return;
  }
  updatePriceSummary();
}

function updatePriceSummary() {
  const tier = currentBooking.tier;
  const qty = currentBooking.quantity;
  const curr = getStoredCurrency();
  const unitPrice = getConvertedValue(tier.price, curr);
  const baseSubtotal = unitPrice * qty;

  let discount = 0;
  if (currentBooking.discountPercent > 0) {
    discount = baseSubtotal * currentBooking.discountPercent;
  } else if (currentBooking.discountAmount > 0) {
    const convertedDiscount = getConvertedValue(currentBooking.discountAmount, curr);
    discount = Math.min(convertedDiscount, baseSubtotal);
  }

  const discountedSubtotal = Math.max(0, baseSubtotal - discount);
  const serviceFee = Math.round(discountedSubtotal * 0.08); // 8% fee
  const total = discountedSubtotal + serviceFee;

  document.getElementById("summaryTicketName").innerText = `${tier.name} × ${qty}`;
  document.getElementById("summarySubtotal").innerText = formatCurrencyAmount(baseSubtotal, curr);
  
  const discountRow = document.getElementById("summaryDiscountRow");
  if (discount > 0) {
    discountRow.style.display = "flex";
    document.getElementById("summaryDiscount").innerText = `-${formatCurrencyAmount(discount, curr)}`;
  } else {
    discountRow.style.display = "none";
  }

  document.getElementById("summaryFee").innerText = formatCurrencyAmount(serviceFee, curr);
  document.getElementById("summaryTotal").innerText = formatCurrencyAmount(total, curr);
}

// STEP 2: Attendee Details & Form Validation
function renderStep2() {
  // Pre-fill active user if signed in
  const user = getActiveUser();
  if (user) {
    const nameInput = document.getElementById("attendeeName");
    const emailInput = document.getElementById("attendeeEmail");
    if (nameInput && !nameInput.value) nameInput.value = user.name;
    if (emailInput && !emailInput.value) emailInput.value = user.email;
  }
}

function validateAndProceedStep2() {
  const nameInput = document.getElementById("attendeeName");
  const emailInput = document.getElementById("attendeeEmail");
  const phoneInput = document.getElementById("attendeePhone");
  const termsCheckbox = document.getElementById("termsCheckbox");

  let isValid = true;

  // Name validation
  if (!nameInput.value.trim() || nameInput.value.trim().length < 3) {
    nameInput.classList.add("is-invalid");
    isValid = false;
  } else {
    nameInput.classList.remove("is-invalid");
  }

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailInput.value.trim())) {
    emailInput.classList.add("is-invalid");
    isValid = false;
  } else {
    emailInput.classList.remove("is-invalid");
  }

  // Phone validation
  if (!phoneInput.value.trim() || phoneInput.value.trim().length < 7) {
    phoneInput.classList.add("is-invalid");
    isValid = false;
  } else {
    phoneInput.classList.remove("is-invalid");
  }

  // Terms agreement
  if (!termsCheckbox.checked) {
    showToast("Please agree to the booking terms & conditions", "error");
    return;
  }

  if (!isValid) {
    showToast("Please correct the errors in the form", "error");
    return;
  }

  currentBooking.attendee = {
    fullName: nameInput.value.trim(),
    email: emailInput.value.trim(),
    phone: phoneInput.value.trim(),
    notes: document.getElementById("attendeeNotes") ? document.getElementById("attendeeNotes").value : ""
  };

  renderWizardStep(3);
}

// STEP 3: Payment UI & 3D Interactive Card Preview
function renderStep3() {
  const cardNameInput = document.getElementById("cardNameInput");
  const cardNumberInput = document.getElementById("cardNumberInput");
  const cardExpiryInput = document.getElementById("cardExpiryInput");
  const cardCvvInput = document.getElementById("cardCvvInput");

  // Pre-fill cardholder name with attendee name
  if (cardNameInput && !cardNameInput.value) {
    cardNameInput.value = currentBooking.attendee.fullName.toUpperCase();
    document.getElementById("previewCardHolder").innerText = cardNameInput.value;
  }

  // Attach interactive listeners for live virtual card updating
  cardNameInput.oninput = (e) => {
    document.getElementById("previewCardHolder").innerText = e.target.value.toUpperCase() || "CARDHOLDER NAME";
  };

  cardNumberInput.oninput = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 16);
    // Format into 4-digit blocks
    val = val.replace(/(\d{4})(?=\d)/g, '$1 ');
    e.target.value = val;
    document.getElementById("previewCardNumber").innerText = val || "•••• •••• •••• ••••";
  };

  cardExpiryInput.oninput = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (val.length >= 2) {
      val = val.substring(0, 2) + '/' + val.substring(2);
    }
    e.target.value = val;
    document.getElementById("previewCardExpiry").innerText = val || "MM/YY";
  };
}

function setPaymentMethod(method) {
  currentBooking.payment.method = method;
  document.querySelectorAll(".pay-tab-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-method") === method);
  });

  const cardForm = document.getElementById("cardPaymentForm");
  const altForm = document.getElementById("alternativePaymentForm");
  const cardPreview = document.querySelector(".virtual-card-wrapper");

  if (method === "card") {
    cardForm.style.display = "block";
    cardPreview.style.display = "block";
    altForm.style.display = "none";
  } else {
    cardForm.style.display = "none";
    cardPreview.style.display = "none";
    altForm.style.display = "block";
    document.getElementById("altPaymentMethodName").innerText = method === "apple" ? "Apple Pay" : "PayPal One-Touch";
  }
}

function processPaymentAndBook() {
  const payBtn = document.getElementById("paySubmitBtn");
  payBtn.disabled = true;
  payBtn.innerHTML = `<span class="spinner" style="display:inline-block; animation: spin 1s linear infinite;">⏳</span> Processing Secure Payment...`;

  setTimeout(() => {
    payBtn.disabled = false;
    payBtn.innerHTML = `Authorize & Book Tickets`;

    // Generate unique order ID
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    currentBooking.orderId = `PULSE-${Date.now().toString().slice(-4)}-${randomNum}`;
    currentBooking.bookingDate = new Date().toISOString();

    // Save booking to LocalStorage
    const bookings = getStoredBookings();
    bookings.unshift({
      id: currentBooking.orderId,
      eventId: currentBooking.event.id,
      eventTitle: currentBooking.event.title,
      eventVenue: currentBooking.event.venue,
      eventDate: currentBooking.event.date,
      eventTime: currentBooking.event.time,
      coverImage: currentBooking.event.coverImage,
      tierName: currentBooking.tier.name,
      ticketPrice: currentBooking.tier.price,
      quantity: currentBooking.quantity,
      attendeeName: currentBooking.attendee.fullName,
      attendeeEmail: currentBooking.attendee.email,
      totalPaid: document.getElementById("summaryTotal").innerText,
      createdAt: currentBooking.bookingDate
    });
    saveBookings(bookings);

    // Update event seats count
    const events = getStoredEvents();
    const ev = events.find(e => e.id === currentBooking.event.id);
    if (ev) {
      ev.bookedSeats = (ev.bookedSeats || 0) + currentBooking.quantity;
      saveEvents(events);
    }

    // Advance to Step 4 & Launch Confetti
    renderWizardStep(4);
    launchCelebrationConfetti();
    showToast("🎉 Booking Confirmed! Your tickets are ready.", "success");
    updateNavigationBadges();
  }, 1200);
}

// STEP 4: Render Digital Ticket Pass
function renderStep4() {
  const container = document.getElementById("digitalTicketRenderBox");
  if (!container || !currentBooking.event) return;

  const event = currentBooking.event;
  const tier = currentBooking.tier;
  const attendee = currentBooking.attendee;

  container.innerHTML = `
    <div class="ticket-pass" id="printableTicket">
      <div class="ticket-pass-header">
        <div class="brand-title">EVENTPULSE PASS</div>
        <span class="badge badge-cyan">${tier.name.toUpperCase()}</span>
      </div>

      <div class="ticket-event-spotlight">
        <span style="font-size: 0.75rem; color: #818cf8; text-transform: uppercase; font-weight: 700;">CONFIRMED PASS</span>
        <h3>${event.title}</h3>
      </div>

      <div class="ticket-grid-meta">
        <div class="ticket-meta-block">
          <span>Attendee</span>
          <strong>${attendee.fullName}</strong>
        </div>
        <div class="ticket-meta-block">
          <span>Date & Time</span>
          <strong>${event.date} • ${event.time.split(' - ')[0]}</strong>
        </div>
        <div class="ticket-meta-block">
          <span>Venue</span>
          <strong>${event.venue}</strong>
        </div>
        <div class="ticket-meta-block">
          <span>Quantity & Tier</span>
          <strong>${currentBooking.quantity} × ${tier.name} (${document.getElementById("summaryTotal") ? document.getElementById("summaryTotal").innerText : ''})</strong>
        </div>
      </div>

      <!-- Perforated Cutout Line -->
      <div class="ticket-perforation">
        <div class="perforation-dashed-line"></div>
      </div>

      <div class="ticket-qr-section">
        <div class="qr-code-canvas-box">
          <canvas id="ticketQrCanvas" width="130" height="130"></canvas>
        </div>
        <div class="ticket-serial-code">REF: ${currentBooking.orderId}</div>
        <div class="ticket-barcode-lines" id="barcodeLinesContainer"></div>
        <p style="font-size: 0.72rem; color: #64748b; text-align: center;">Scan at gate for contactless RFID / optical entry</p>
      </div>
    </div>
  `;

  // Draw QR code onto canvas
  generateCanvasQRCode("ticketQrCanvas", `https://eventpulse.live/verify/${currentBooking.orderId}`);

  // Generate realistic barcode bars
  const barcodeBox = document.getElementById("barcodeLinesContainer");
  if (barcodeBox) {
    barcodeBox.innerHTML = "";
    for (let i = 0; i < 48; i++) {
      const bar = document.createElement("div");
      bar.className = "barcode-bar";
      bar.style.width = (i % 3 === 0 ? "3px" : (i % 5 === 0 ? "4px" : "1.5px"));
      bar.style.opacity = (i % 7 === 0 ? "0.4" : "1");
      barcodeBox.appendChild(bar);
    }
  }
}

// Pure Canvas QR Code Generator (Zero external dependency failures)
function generateCanvasQRCode(canvasId, text) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const size = canvas.width;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, size, size);

  ctx.fillStyle = "#0f172a";
  const matrixSize = 25;
  const moduleSize = size / matrixSize;

  // Simple deterministic pattern generator for realistic QR look
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash |= 0;
  }

  // Draw 3 Corner Position Markers
  function drawPositionMarker(x, y) {
    ctx.fillRect(x * moduleSize, y * moduleSize, 7 * moduleSize, 7 * moduleSize);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect((x + 1) * moduleSize, (y + 1) * moduleSize, 5 * moduleSize, 5 * moduleSize);
    ctx.fillStyle = "#0f172a";
    ctx.fillRect((x + 2) * moduleSize, (y + 2) * moduleSize, 3 * moduleSize, 3 * moduleSize);
  }

  drawPositionMarker(0, 0);
  drawPositionMarker(matrixSize - 7, 0);
  drawPositionMarker(0, matrixSize - 7);

  // Fill data dots pseudo-randomly based on text hash
  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      // Skip corners
      if ((r < 8 && c < 8) || (r < 8 && c > matrixSize - 9) || (r > matrixSize - 9 && c < 8)) {
        continue;
      }
      const val = Math.sin(r * 12.9898 + c * 78.233 + hash) * 43758.5453;
      if ((val - Math.floor(val)) > 0.5) {
        ctx.fillRect(c * moduleSize, r * moduleSize, moduleSize, moduleSize);
      }
    }
  }
}

// Pure JS Canvas Confetti (Zero dependency failure risk)
function launchCelebrationConfetti() {
  const canvas = document.createElement("canvas");
  canvas.id = "confettiCanvas";
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "9999";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ["#6366f1", "#8b5cf6", "#ec4899", "#06b6d4", "#10b981", "#f59e0b"];

  for (let i = 0; i < 120; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      w: Math.random() * 8 + 4,
      h: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.7) * 16,
      gravity: 0.35,
      rotation: Math.random() * 360,
      rSpeed: (Math.random() - 0.5) * 8
    });
  }

  let frame = 0;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rSpeed;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });

    frame++;
    if (frame < 140) {
      requestAnimationFrame(animate);
    } else {
      canvas.remove();
    }
  }
  animate();
}

// Download Ticket / Calendar Actions
function printDigitalTicket() {
  window.print();
}

function downloadCalendarInvite() {
  if (!currentBooking.event) return;
  const ev = currentBooking.event;
  const startIso = ev.date.replace(/-/g, '') + 'T100000Z';
  const endIso = ev.date.replace(/-/g, '') + 'T180000Z';

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//EventPulse//Event Pass//EN',
    'BEGIN:VEVENT',
    `UID:${currentBooking.orderId}@eventpulse.live`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    `DTSTART:${startIso}`,
    `DTEND:${endIso}`,
    `SUMMARY:${ev.title}`,
    `DESCRIPTION:${ev.shortDescription} (Ticket Ref: ${currentBooking.orderId})`,
    `LOCATION:${ev.venue}, ${ev.city}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `${ev.slug}-ticket.ics`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  showToast("📅 Calendar invite downloaded!", "success");
}
