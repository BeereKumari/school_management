/**
 * SchoolMap — Frontend Application Logic
 * Description: All frontend JS — ToastManager, Validator, ApiService,
 *              form handlers, dashboard stats, health check, animations.
 * Author: SchoolMap Dev Team
 * Date: 2026-05-10
 */

/* ─── CONFIG ─────────────────────────────────────────────────────── */
const API_BASE = '';

/* ─── TOAST NOTIFICATION SYSTEM ──────────────────────────────────── */
const ToastManager = {
  container: document.getElementById('toast-container'),

  /**
   * Show a toast notification.
   * @param {string} message - Toast message text
   * @param {'success'|'error'|'info'} type - Toast type
   * @param {number} duration - Auto-dismiss time in ms
   */
  showToast(message, type = 'success', duration = 4000) {
    const icons = { success: '\u2713', error: '\u2715', info: '\u2139' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || '\u2139'}</span>
      <span class="toast-message">${this._escapeHtml(message)}</span>
      <button class="toast-close" aria-label="Close">&times;</button>
    `;
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => this._hideToast(toast));
    this.container.appendChild(toast);
    this._autoDismiss(toast, duration);
  },

  /**
   * Hide a toast with animation.
   * @param {HTMLElement} toastEl
   */
  _hideToast(toastEl) {
    if (toastEl.classList.contains('fade-out')) return;
    toastEl.classList.add('fade-out');
    setTimeout(() => {
      if (toastEl.parentNode) toastEl.parentNode.removeChild(toastEl);
    }, 400);
  },

  /**
   * Auto-dismiss toast after duration.
   * @param {HTMLElement} toastEl
   * @param {number} duration
   */
  _autoDismiss(toastEl, duration) {
    setTimeout(() => this._hideToast(toastEl), duration);
  },

  /**
   * Escape HTML in message to prevent XSS.
   * @param {string} str
   * @returns {string}
   */
  _escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  },
};

/* ─── UTILITY FUNCTIONS ──────────────────────────────────────────── */

/**
 * Escape HTML special characters to prevent XSS.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(str).replace(/[&<>"']/g, (c) => map[c]);
}

/**
 * Debounce a function call.
 * @param {Function} fn
 * @param {number} delay - milliseconds
 * @returns {Function}
 */
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Format distance in km for display.
 * @param {number} km
 * @returns {string}
 */
function formatDistance(km) {
  if (km < 1) return km.toFixed(1) + ' km';
  return km.toFixed(1) + ' km';
}

/**
 * Get human-readable time ago string.
 * @param {Date|string} date
 * @returns {string}
 */
function timeAgo(date) {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now - then) / 1000);
  if (seconds < 10) return 'Just now';
  if (seconds < 60) return seconds + 's ago';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return minutes + ' min ago';
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours + 'h ago';
  const days = Math.floor(hours / 24);
  return days + 'd ago';
}

/**
 * Truncate string with ellipsis.
 * @param {string} str
 * @param {number} max
 * @returns {string}
 */
function truncate(str, max) {
  if (str.length <= max) return str;
  return str.slice(0, max - 3) + '...';
}

/* ─── FORM VALIDATION ────────────────────────────────────────────── */
const Validator = {
  /**
   * Validate a single field against rules.
   * @param {string} value - Field value
   * @param {object} rules - { required, minLength, maxLength, isFloat, min, max }
   * @returns {{ valid: boolean, message: string }}
   */
  validateField(value, rules) {
    if (rules.required && (!value || String(value).trim() === '')) {
      return { valid: false, message: 'This field is required' };
    }
    if (rules.minLength && String(value).trim().length < rules.minLength) {
      return { valid: false, message: `Minimum ${rules.minLength} characters` };
    }
    if (rules.maxLength && String(value).trim().length > rules.maxLength) {
      return { valid: false, message: `Maximum ${rules.maxLength} characters` };
    }
    if (rules.isFloat) {
      const num = parseFloat(value);
      if (isNaN(num)) return { valid: false, message: 'Must be a valid number' };
      if (rules.min !== undefined && num < rules.min) {
        return { valid: false, message: `Minimum value is ${rules.min}` };
      }
      if (rules.max !== undefined && num > rules.max) {
        return { valid: false, message: `Maximum value is ${rules.max}` };
      }
    }
    return { valid: true, message: '' };
  },

  /**
   * Show field error message and add error class.
   * @param {string} fieldId - Input element ID
   * @param {string} message - Error message
   */
  showFieldError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const errorEl = document.getElementById(`error-${fieldId}`);
    if (input) {
      input.classList.remove('input-valid');
      input.classList.add('input-error');
    }
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('visible');
    }
  },

  /**
   * Clear error state for a field.
   * @param {string} fieldId - Input element ID
   */
  clearFieldError(fieldId) {
    const input = document.getElementById(fieldId);
    const errorEl = document.getElementById(`error-${fieldId}`);
    if (input) {
      input.classList.remove('input-error');
    }
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('visible');
    }
  },

  /**
   * Clear all errors in a form.
   * @param {HTMLElement} formEl
   */
  clearAllErrors(formEl) {
    const inputs = formEl.querySelectorAll('input');
    inputs.forEach((inp) => {
      this.clearFieldError(inp.id);
      inp.classList.remove('input-valid');
    });
  },

  /**
   * Validate all add-school form fields.
   * @returns {boolean}
   */
  validateAddForm() {
    let valid = true;
    const name = document.getElementById('school-name').value;
    const address = document.getElementById('school-address').value;
    const lat = document.getElementById('school-lat').value;
    const lon = document.getElementById('school-lon').value;

    const nameResult = this.validateField(name, { required: true, minLength: 2, maxLength: 255 });
    if (!nameResult.valid) { this.showFieldError('school-name', nameResult.message); valid = false; }
    else { this.clearFieldError('school-name'); }

    const addrResult = this.validateField(address, { required: true, minLength: 5, maxLength: 500 });
    if (!addrResult.valid) { this.showFieldError('school-address', addrResult.message); valid = false; }
    else { this.clearFieldError('school-address'); }

    const latResult = this.validateField(lat, { required: true, isFloat: true, min: -90, max: 90 });
    if (!latResult.valid) { this.showFieldError('school-lat', latResult.message); valid = false; }
    else { this.clearFieldError('school-lat'); }

    const lonResult = this.validateField(lon, { required: true, isFloat: true, min: -180, max: 180 });
    if (!lonResult.valid) { this.showFieldError('school-lon', lonResult.message); valid = false; }
    else { this.clearFieldError('school-lon'); }

    if (valid) {
      document.getElementById('school-lat').classList.add('input-valid');
      document.getElementById('school-lon').classList.add('input-valid');
    }

    return valid;
  },

  /**
   * Validate search form fields.
   * @returns {boolean}
   */
  validateSearchForm() {
    let valid = true;
    const lat = document.getElementById('user-lat').value;
    const lon = document.getElementById('user-lon').value;

    const latResult = this.validateField(lat, { required: true, isFloat: true, min: -90, max: 90 });
    if (!latResult.valid) { this.showFieldError('user-lat', latResult.message); valid = false; }
    else { this.clearFieldError('user-lat'); }

    const lonResult = this.validateField(lon, { required: true, isFloat: true, min: -180, max: 180 });
    if (!lonResult.valid) { this.showFieldError('user-lon', lonResult.message); valid = false; }
    else { this.clearFieldError('user-lon'); }

    return valid;
  },
};

/* ─── API SERVICE ────────────────────────────────────────────────── */
const ApiService = {
  /**
   * Set a button to loading state.
   * @param {HTMLElement} btn
   */
  _setLoading(btn) {
    btn.classList.add('loading');
    btn.disabled = true;
  },

  /**
   * Restore button from loading state.
   * @param {HTMLElement} btn
   */
  _unsetLoading(btn) {
    btn.classList.remove('loading');
    btn.disabled = false;
  },

  /**
   * Add a new school via POST /addSchool.
   * @param {{ name: string, address: string, latitude: number, longitude: number }} payload
   * @returns {Promise<object>}
   */
  async addSchool(payload) {
    const btn = document.getElementById('add-school-btn');
    this._setLoading(btn);
    try {
      const res = await fetch(`${API_BASE}/addSchool`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      return { status: res.status, data };
    } catch (err) {
      throw err;
    } finally {
      this._unsetLoading(btn);
    }
  },

  /**
   * List schools sorted by proximity via GET /listSchools.
   * @param {number} lat - User latitude
   * @param {number} lon - User longitude
   * @returns {Promise<object>}
   */
  async listSchools(lat, lon) {
    const btn = document.getElementById('search-btn');
    this._setLoading(btn);
    try {
      const url = `${API_BASE}/listSchools?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}`;
      const res = await fetch(url);
      const data = await res.json();
      return { status: res.status, data };
    } catch (err) {
      throw err;
    } finally {
      this._unsetLoading(btn);
    }
  },

  /**
   * Perform a health check against the API root.
   * @returns {Promise<boolean>}
   */
  async healthCheck() {
    try {
      const res = await fetch(`${API_BASE}/api/health`);
      return res.ok;
    } catch {
      return false;
    }
  },
};

/* ─── SKELETON LOADER BUILDER ────────────────────────────────────── */

/**
 * Build HTML string for skeleton loader cards.
 * @param {number} count - Number of skeleton cards
 * @returns {string}
 */
function buildSkeletonCards(count = 3) {
  let html = '';
  for (let i = 0; i < count; i++) {
    html += `
      <div class="skeleton-card" style="animation-delay: ${i * 60}ms">
        <div class="skeleton-rank"></div>
        <div class="skeleton-info">
          <div class="skeleton-name"></div>
          <div class="skeleton-addr"></div>
        </div>
        <div class="skeleton-distance"></div>
      </div>
    `;
  }
  return html;
}

/* ─── SCHOOL CARD BUILDER ────────────────────────────────────────── */

/**
 * Build a school card HTML element for the results list.
 * @param {object} school - School object with name, address, latitude, longitude, distance_km
 * @param {number} index - Position in the sorted list (0-based)
 * @returns {HTMLElement}
 */
function buildSchoolCard(school, index) {
  const rank = index + 1;
  let rankClass = '';
  if (rank === 1) rankClass = 'rank-1';
  else if (rank === 2) rankClass = 'rank-2';
  else if (rank === 3) rankClass = 'rank-3';

  const card = document.createElement('div');
  card.className = 'school-card';
  card.style.animationDelay = `${index * 60}ms`;
  card.innerHTML = `
    <div class="school-rank ${rankClass}">${rank}</div>
    <div>
      <div class="school-name">${escapeHtml(school.name)}</div>
      <div class="school-address">${escapeHtml(school.address)}</div>
      <div class="school-coords">${escapeHtml(String(school.latitude))}, ${escapeHtml(String(school.longitude))}</div>
    </div>
    <div class="school-distance">${formatDistance(school.distance_km)}</div>
  `;
  return card;
}

/* ─── RECENT SUBMISSIONS ─────────────────────────────────────────── */
let recentSubmissions = [];

/**
 * Add a school to the recent submissions list (max 3).
 * @param {{ name: string }} school
 */
function addToRecent(school) {
  recentSubmissions.unshift({
    name: school.name,
    timestamp: new Date(),
  });
  if (recentSubmissions.length > 3) recentSubmissions.pop();
  renderRecent();
}

/**
 * Render the recent submissions list.
 */
function renderRecent() {
  const container = document.getElementById('recent-submissions');
  if (recentSubmissions.length === 0) {
    container.innerHTML = '<p class="recent-empty">None yet</p>';
    return;
  }
  container.innerHTML = recentSubmissions
    .map(
      (item) => `
      <div class="recent-item">
        <span class="recent-item-name">${escapeHtml(truncate(item.name, 30))}</span>
        <span class="recent-item-time">${timeAgo(item.timestamp)}</span>
      </div>
    `
    )
    .join('');
}

/* ─── ADD SCHOOL HANDLER ─────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('add-school-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!Validator.validateAddForm()) {
      ToastManager.showToast('Please fix the errors above', 'error');
      return;
    }
    const payload = {
      name: document.getElementById('school-name').value.trim(),
      address: document.getElementById('school-address').value.trim(),
      latitude: parseFloat(document.getElementById('school-lat').value),
      longitude: parseFloat(document.getElementById('school-lon').value),
    };
    try {
      const { status, data } = await ApiService.addSchool(payload);
      if (status === 201) {
        ToastManager.showToast('School added successfully!', 'success');
        form.reset();
        Validator.clearAllErrors(form);
        addToRecent(data.data);
        loadDashboardStats();
      } else if (status === 422 && data.errors) {
        data.errors.forEach((err) => {
          const fieldMap = {
            name: 'school-name',
            address: 'school-address',
            latitude: 'school-lat',
            longitude: 'school-lon',
          };
          const fieldId = fieldMap[err.field];
          if (fieldId) Validator.showFieldError(fieldId, err.message);
        });
        ToastManager.showToast('Validation failed — check the form', 'error');
      } else {
        ToastManager.showToast(data.message || 'Something went wrong', 'error');
      }
    } catch (err) {
      ToastManager.showToast('Network error. Please try again.', 'error');
    }
  });

  /* ─── LIST SCHOOLS HANDLER ─────────────────────────────────────── */
  const searchBtn = document.getElementById('search-btn');

  async function performSearch() {
    if (!Validator.validateSearchForm()) {
      ToastManager.showToast('Please fix the errors above', 'error');
      return;
    }
    const lat = parseFloat(document.getElementById('user-lat').value);
    const lon = parseFloat(document.getElementById('user-lon').value);
    const resultsList = document.getElementById('results-list');
    const resultCount = document.getElementById('result-count');

    resultsList.innerHTML = buildSkeletonCards(3);
    resultCount.textContent = 'Searching...';

    try {
      const { status, data } = await ApiService.listSchools(lat, lon);
      if (status === 200) {
        renderResults(data, lat, lon);
      } else {
        ToastManager.showToast(data.message || 'Search failed', 'error');
        resultsList.innerHTML = '';
        resultCount.textContent = 'Error';
      }
    } catch (err) {
      ToastManager.showToast('Network error. Please try again.', 'error');
      resultsList.innerHTML = '';
      resultCount.textContent = 'Error';
    }
  }

  searchBtn.addEventListener('click', performSearch);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const active = document.activeElement;
      if (active && (active.id === 'user-lat' || active.id === 'user-lon')) {
        performSearch();
      }
    }
  });

  /**
   * Render search results into the results list.
   * @param {object} data - API response data
   * @param {number} userLat - User's latitude for display
   * @param {number} userLon - User's longitude for display
   */
  function renderResults(data, userLat, userLon) {
    const resultsList = document.getElementById('results-list');
    const resultCount = document.getElementById('result-count');

    resultsList.innerHTML = '';

    if (!data.data || data.data.length === 0) {
      resultCount.textContent = '0 results';
      resultsList.innerHTML = `
        <div class="empty-state">
          <svg class="empty-icon" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <h4 class="empty-title">No schools found nearby</h4>
          <p class="empty-sub">Try adjusting your location or add schools first</p>
        </div>
      `;
      return;
    }

    resultCount.textContent = `${data.data.length} schools found  (Your location: ${userLat}, ${userLon})`;
    data.data.forEach((school, index) => {
      const card = buildSchoolCard(school, index);
      resultsList.appendChild(card);
    });
  }

  /* ─── PRESET LOCATION BUTTONS ──────────────────────────────────── */
  document.querySelectorAll('.preset-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const lat = btn.getAttribute('data-lat');
      const lon = btn.getAttribute('data-lon');
      document.getElementById('user-lat').value = lat;
      document.getElementById('user-lon').value = lon;
      Validator.clearFieldError('user-lat');
      Validator.clearFieldError('user-lon');
      document.getElementById('user-lat').classList.add('input-valid');
      document.getElementById('user-lon').classList.add('input-valid');
    });
  });

  /* ─── QUICK-FILL COORDINATE HELPER ─────────────────────────────── */
  document.getElementById('quick-fill-sample').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('school-lat').value = '28.5562';
    document.getElementById('school-lon').value = '77.2722';
    Validator.clearFieldError('school-lat');
    Validator.clearFieldError('school-lon');
    document.getElementById('school-lat').classList.add('input-valid');
    document.getElementById('school-lon').classList.add('input-valid');
  });
});

/* ─── REAL-TIME VALIDATION (DEBOUNCED) ───────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const addInputs = ['school-name', 'school-address', 'school-lat', 'school-lon'];
  const searchInputs = ['user-lat', 'user-lon'];

  const addRules = {
    'school-name': { required: true, minLength: 2, maxLength: 255 },
    'school-address': { required: true, minLength: 5, maxLength: 500 },
    'school-lat': { required: true, isFloat: true, min: -90, max: 90 },
    'school-lon': { required: true, isFloat: true, min: -180, max: 180 },
  };

  const searchRules = {
    'user-lat': { required: true, isFloat: true, min: -90, max: 90 },
    'user-lon': { required: true, isFloat: true, min: -180, max: 180 },
  };

  const debouncedValidate = debounce((inputId, rules) => {
    const input = document.getElementById(inputId);
    if (!input) return;
    const value = input.value;
    const result = Validator.validateField(value, rules);
    if (!result.valid) {
      Validator.showFieldError(inputId, result.message);
    } else {
      Validator.clearFieldError(inputId);
      input.classList.add('input-valid');
    }
  }, 300);

  addInputs.forEach((id) => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('input', () => debouncedValidate(id, addRules[id]));
      input.addEventListener('blur', () => debouncedValidate(id, addRules[id]));
    }
  });

  searchInputs.forEach((id) => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('input', () => debouncedValidate(id, searchRules[id]));
      input.addEventListener('blur', () => debouncedValidate(id, searchRules[id]));
    }
  });
});

/* ─── DASHBOARD STATS LOADER ─────────────────────────────────────── */

/**
 * Load and update dashboard statistics from the API.
 */
async function loadDashboardStats() {
  try {
    const { status, data } = await ApiService.listSchools(28.6139, 77.2090);
    if (status === 200 && data.data) {
      const total = data.total || data.data.length;
      document.getElementById('stat-total').textContent = total;

      const cities = new Set();
      data.data.forEach((s) => {
        const parts = s.address.split(',').map((p) => p.trim());
        if (parts.length >= 2) {
          cities.add(parts[parts.length - 2]);
        } else {
          cities.add(parts[0]);
        }
      });
      document.getElementById('stat-cities').textContent = cities.size || '—';

      const sortedById = [...data.data].sort((a, b) => a.id - b.id);
      const latest = sortedById[sortedById.length - 1];
      document.getElementById('stat-latest').textContent = latest
        ? truncate(latest.name, 18)
        : 'None yet';

      document.querySelectorAll('.stat-number').forEach((el) => {
        el.style.animation = 'fadeIn 0.4s ease forwards';
      });
    }
  } catch {
    // Silent fail for stats — they'll show "—"
  }
}

/* ─── API HEALTH CHECK ───────────────────────────────────────────── */

/**
 * Check API health and update nav status indicator.
 */
async function checkHealth() {
  const isOnline = await ApiService.healthCheck();
  const dot = document.getElementById('status-dot');
  const text = document.getElementById('status-text');
  if (isOnline) {
    dot.className = 'status-dot';
    text.textContent = 'API Online';
  } else {
    dot.className = 'status-dot offline';
    text.textContent = 'API Offline';
  }
}

/* ─── SMOOTH SCROLL NAV ──────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const navHeight = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
      // Close mobile nav
      document.getElementById('navbar').classList.remove('nav-open');
    });
  });
});

/* ─── MOBILE NAV TOGGLE ──────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('nav-hamburger');
  const navbar = document.getElementById('navbar');

  hamburger.addEventListener('click', () => {
    navbar.classList.toggle('nav-open');
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') navbar.classList.remove('nav-open');
  });

  // Close on scroll past hero
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const hero = document.getElementById('hero');
    if (hero && window.scrollY > hero.offsetHeight) {
      navbar.classList.remove('nav-open');
    }
    lastScroll = window.scrollY;
  });
});

/* ─── FOOTER API DOCS LINK ───────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  const apiDocsLink = document.getElementById('api-docs-link');
  if (apiDocsLink) {
    apiDocsLink.addEventListener('click', (e) => {
      e.preventDefault();
      ToastManager.showToast(
        'POST /addSchool — Add a school\nGET /listSchools?latitude=X&longitude=Y — Find nearby schools\nGET / — Health check',
        'info',
        6000
      );
    });
  }
});

/* ─── ACTIVE NAV STATE ───────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          navLinks.forEach((link) => {
            link.classList.toggle(
              'active',
              link.getAttribute('data-section') === entry.target.id
            );
          });
        }
      });
    },
    { threshold: 0.5 }
  );

  sections.forEach((section) => observer.observe(section));
});

/* ─── HERO IMAGE SLIDER ──────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.hero-slider .slide');
  const dots = document.querySelectorAll('.slider-dots .dot');
  let current = 0;
  let interval;

  function goTo(index) {
    slides.forEach((s) => s.classList.remove('active'));
    dots.forEach((d) => d.classList.remove('active'));
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    current = index;
  }

  function nextSlide() {
    goTo((current + 1) % slides.length);
  }

  function startAutoPlay() {
    stopAutoPlay();
    interval = setInterval(nextSlide, 5000);
  }

  function stopAutoPlay() {
    clearInterval(interval);
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.getAttribute('data-index'), 10);
      goTo(index);
      startAutoPlay();
    });
  });

  startAutoPlay();
});

/* ─── INIT ───────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  loadDashboardStats();
  checkHealth();
});
