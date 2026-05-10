/* =========================================
   Cleveland Trip — app logic
   - Swipeable card stack
   - Local persistence (likes / passes)
   - Optional Firebase sync for group counts
   ========================================= */

(function () {
  'use strict';

  // ---------- City helpers ----------
  const DEFAULT_CITY_KEY = (typeof window !== 'undefined' && window.DEFAULT_CITY) || 'cleveland';

  function currentCity() {
    const cities = (typeof window !== 'undefined' && window.CITIES) || {};
    return cities[state.city] || cities[DEFAULT_CITY_KEY] || { lat: 41.4993, lng: -81.6944, mapZoom: 11, label: 'Cleveland' };
  }

  // Center used by the map and as a fallback origin when GPS isn't available.
  function currentCityCenter() {
    const c = currentCity();
    return { lat: c.lat, lng: c.lng };
  }

  // Trip dates from the current city's CITIES entry. May be null if no trip is set.
  function currentTripDates() {
    const c = currentCity();
    return {
      start: c.tripStart ? new Date(c.tripStart + 'T00:00:00') : null,
      end:   c.tripEnd   ? new Date(c.tripEnd   + 'T23:59:59') : null
    };
  }

  function activityCity(a) {
    return a.city || DEFAULT_CITY_KEY;
  }

  function isInCurrentCity(a) {
    return activityCity(a) === state.city;
  }

  function activitiesInCurrentCity() {
    return ACTIVITIES.filter(isInCurrentCity);
  }

  // "Cleveland", "Traverse City, MI", etc. — used in directions/search queries.
  // Uses the activity's own city (not necessarily the currently-viewed one).
  function cityLabelFor(a) {
    const cities = (typeof window !== 'undefined' && window.CITIES) || {};
    const c = cities[activityCity(a)] || {};
    return c.label ? (c.state ? `${c.label}, ${c.state}` : c.label) : 'Cleveland';
  }

  // ---------- State ----------
  const STORAGE_KEY = 'cle-trip-v1';
  const state = {
    city: DEFAULT_CITY_KEY, // hydrated from localStorage in loadState()
    filter: 'all',
    likes: new Set(),
    passes: new Set(),
    groupCounts: {},  // activityId -> count from Firebase
    deck: [],         // current filtered deck (queue of remaining IDs)
    view: 'discover',
    reviewMode: false, // true = looking at things you passed on
    map: null,         // Leaflet map instance
    mapMarkers: [],    // current pin layer
    userMarker: null,  // single "you are here" marker (replaced on each locate)
    userLocation: null,// {lat, lng} after geolocation success
    mapOpenNowOnly: false,
    mapSource: 'group' // 'group' | 'mine' | 'all'
  };

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      state.likes = new Set(data.likes || []);
      state.passes = new Set(data.passes || []);
      // Restore last-selected city if it's still valid
      const cities = (window.CITIES) || {};
      if (data.city && cities[data.city]) state.city = data.city;
    } catch (e) { console.warn('Failed to load state:', e); }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        likes: [...state.likes],
        passes: [...state.passes],
        city: state.city
      }));
    } catch (e) { console.warn('Failed to save state:', e); }
  }

  // ---------- Deck building ----------
  function buildDeck() {
    const filtered = activitiesInCurrentCity().filter(a =>
      state.filter === 'all' || a.category === state.filter
    );

    let pool;
    if (state.reviewMode) {
      // Show only items previously passed (and not later liked)
      pool = filtered.filter(a => state.passes.has(a.id) && !state.likes.has(a.id));
    } else {
      // Hide anything already swiped (either way)
      pool = filtered.filter(a => !state.likes.has(a.id) && !state.passes.has(a.id));
    }

    // Shuffle so the order changes each session — but seed by date so
    // the same day shows similar order across reloads.
    pool.sort(() => Math.random() - 0.5);
    state.deck = pool.map(a => a.id);
  }

  // ---------- Render: Card stack ----------
  const stackEl = document.getElementById('card-stack');
  const emptyEl = document.getElementById('empty-state');
  const headerCounter = document.getElementById('header-counter');

  function activityById(id) {
    return ACTIVITIES.find(a => a.id === id);
  }

  function gradientCss(activity) {
    const cat = CATEGORIES[activity.category];
    const [c1, c2] = cat ? cat.gradient : ['#334155', '#1e293b'];
    return `linear-gradient(135deg, ${c1}, ${c2})`;
  }

  // Procedural image resolver.
  // Order: a.image (hand-set in activities.js) → IMAGE_MAP[id] → CATEGORY_FALLBACKS[cat] → null.
  // Null means render as gradient + emoji.
  function imageFor(a) {
    if (a.image) return a.image;
    const map = window.IMAGE_MAP || {};
    if (map[a.id]) return map[a.id];
    const fallbacks = window.CATEGORY_FALLBACKS || {};
    if (fallbacks[a.category]) return fallbacks[a.category];
    return null;
  }

  function buildCard(activityId) {
    const a = activityById(activityId);
    if (!a) return null;
    const cat = CATEGORIES[a.category] || { label: '', emoji: '' };

    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.id = a.id;

    const img = imageFor(a);
    const bg = img
      ? `background-image: url('${img}');`
      : `background: ${gradientCss(a)};`;
    const emoji = img ? '' : (a.emoji || cat.emoji || '✨');

    const tagsHtml = (a.tags || []).slice(0, 3).map(t =>
      `<span class="card-tag">${t.replace(/-/g, ' ')}</span>`
    ).join('');

    card.innerHTML = `
      <div class="card-image" style="${bg}">${emoji}</div>
      <div class="card-stamp like">LIKE</div>
      <div class="card-stamp nope">NOPE</div>
      <div class="card-overlay">
        <span class="card-category">${cat.emoji} ${cat.label}</span>
        <h2 class="card-title">${escapeHtml(a.title)}</h2>
        <p class="card-description">${escapeHtml(a.description)}</p>
        <div class="card-info">${escapeHtml(a.info || '')}</div>
        ${tagsHtml ? `<div class="card-tags">${tagsHtml}</div>` : ''}
      </div>
    `;

    return card;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  const actionBarEl = document.getElementById('action-bar');

  function renderStack() {
    stackEl.innerHTML = '';
    const visible = state.deck.slice(0, 3); // top 3 only for perf
    if (visible.length === 0) {
      emptyEl.classList.remove('hidden');
      stackEl.style.display = 'none';
      actionBarEl.style.display = 'none';
      updateHeaderCounter();
      return;
    }
    emptyEl.classList.add('hidden');
    stackEl.style.display = 'block';
    actionBarEl.style.display = '';

    // Render back-to-front so top card is the LAST DOM child (highest z-order)
    visible.slice().reverse().forEach((id, idxFromBack) => {
      const card = buildCard(id);
      if (!card) return;
      // The back card scales down slightly to add depth
      const offsetFromTop = visible.length - 1 - idxFromBack;
      const scale = 1 - (offsetFromTop * 0.04);
      const translateY = offsetFromTop * 8;
      card.style.transform = `scale(${scale}) translateY(${translateY}px)`;
      card.style.zIndex = 100 - offsetFromTop;
      stackEl.appendChild(card);
    });

    // Bind swipe to top card only
    const top = stackEl.lastElementChild;
    if (top) bindSwipe(top);

    updateHeaderCounter();
  }

  function updateHeaderCounter() {
    const total = activitiesInCurrentCity().filter(a =>
      state.filter === 'all' || a.category === state.filter
    ).length;
    const remaining = state.deck.length;
    const seen = total - remaining;
    if (state.reviewMode) {
      headerCounter.textContent = `Review · ${remaining} left`;
    } else {
      headerCounter.textContent = `${seen}/${total}`;
    }
  }

  // ---------- Swipe gestures ----------
  function bindSwipe(card) {
    let startX = 0, startY = 0, deltaX = 0, deltaY = 0;
    let dragging = false;
    const threshold = 100;  // pixels to trigger a swipe

    function onPointerDown(e) {
      // Only respond to primary touch / left mouse
      if (e.button && e.button !== 0) return;
      dragging = true;
      startX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
      startY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
      card.classList.add('dragging');
      card.setPointerCapture?.(e.pointerId);
    }

    function onPointerMove(e) {
      if (!dragging) return;
      const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
      const y = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
      deltaX = x - startX;
      deltaY = y - startY;
      const rotate = deltaX * 0.06;
      card.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${rotate}deg)`;
      card.classList.toggle('swipe-right', deltaX > 50);
      card.classList.toggle('swipe-left',  deltaX < -50);
    }

    function onPointerUp() {
      if (!dragging) return;
      dragging = false;
      card.classList.remove('dragging');
      card.classList.remove('swipe-right', 'swipe-left');

      if (Math.abs(deltaX) > threshold) {
        finishSwipe(card, deltaX > 0 ? 'right' : 'left');
      } else {
        // Snap back
        card.style.transform = '';
      }
      deltaX = deltaY = 0;
    }

    card.addEventListener('pointerdown', onPointerDown);
    card.addEventListener('pointermove', onPointerMove);
    card.addEventListener('pointerup', onPointerUp);
    card.addEventListener('pointercancel', onPointerUp);
    card.addEventListener('lostpointercapture', onPointerUp);
  }

  function finishSwipe(card, direction) {
    const id = card.dataset.id;
    const flyX = direction === 'right' ? window.innerWidth : -window.innerWidth;
    const rotate = direction === 'right' ? 30 : -30;
    card.style.transform = `translate(${flyX}px, 0) rotate(${rotate}deg)`;
    card.style.opacity = '0';

    // Wait for animation, then update state
    setTimeout(() => {
      handleVote(id, direction === 'right');
    }, 220);
  }

  function handleVote(id, liked) {
    if (state.reviewMode) {
      // In review mode: a "like" promotes from passed -> liked. A "nope" leaves it as passed.
      if (liked) {
        state.passes.delete(id);
        state.likes.add(id);
        incrementGroupLike(id);
      }
    } else {
      if (liked) {
        state.likes.add(id);
        incrementGroupLike(id);
      } else {
        state.passes.add(id);
      }
    }
    saveState();
    // Pop from deck
    state.deck.shift();
    renderStack();
  }

  // ---------- Filter chips ----------
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.filter = chip.dataset.cat;
      state.reviewMode = false;
      buildDeck();
      renderStack();
    });
  });

  // ---------- Action buttons ----------
  document.getElementById('btn-pass').addEventListener('click', () => {
    const top = stackEl.lastElementChild;
    if (top) finishSwipe(top, 'left');
  });
  document.getElementById('btn-like').addEventListener('click', () => {
    const top = stackEl.lastElementChild;
    if (top) finishSwipe(top, 'right');
  });
  document.getElementById('btn-info').addEventListener('click', () => {
    const top = stackEl.lastElementChild;
    if (!top) return;
    openModal(top.dataset.id);
  });

  // Empty-state buttons
  document.getElementById('another-look').addEventListener('click', () => {
    state.reviewMode = true;
    buildDeck();
    renderStack();
  });
  document.getElementById('reset-all').addEventListener('click', () => {
    if (!confirm('Clear all your swipes and start fresh? Your group votes stay saved.')) return;
    state.likes = new Set();
    state.passes = new Set();
    state.reviewMode = false;
    saveState();
    buildDeck();
    renderStack();
  });

  // ---------- Tab nav ----------
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => switchView(tab.dataset.view));
  });

  function switchView(view) {
    state.view = view;
    document.querySelectorAll('.tab').forEach(t =>
      t.classList.toggle('active', t.dataset.view === view));
    document.querySelectorAll('.view').forEach(v =>
      v.classList.toggle('active', v.id === `view-${view}`));

    if (view === 'likes') renderLikes();
    if (view === 'group') renderGroup();
    if (view === 'map') renderMap();
  }

  // ---------- Likes view ----------
  function renderLikes() {
    const list = document.getElementById('likes-list');
    const empty = document.getElementById('likes-empty');
    const count = document.getElementById('likes-count');

    const liked = activitiesInCurrentCity().filter(a => state.likes.has(a.id));
    count.textContent = `${liked.length} liked`;
    list.innerHTML = '';
    if (liked.length === 0) {
      empty.classList.remove('hidden');
      return;
    }
    empty.classList.add('hidden');

    liked.forEach(a => list.appendChild(makeListItem(a, '💛')));
  }

  // ---------- Group view ----------
  function renderGroup() {
    const list = document.getElementById('group-list');
    const empty = document.getElementById('group-empty');
    const status = document.getElementById('group-status');

    list.innerHTML = '';

    if (!window.FIREBASE_READY) {
      status.textContent = 'Group voting not configured. See README to enable.';
      empty.classList.add('hidden');
      return;
    }

    const counts = state.groupCounts || {};
    const ranked = activitiesInCurrentCity()
      .map(a => ({ a, n: counts[a.id] || 0 }))
      .filter(x => x.n > 0)
      .sort((x, y) => y.n - x.n);

    if (ranked.length === 0) {
      status.textContent = 'No likes yet — be the first.';
      empty.classList.remove('hidden');
      return;
    }

    status.textContent = `${ranked.length} activities have group ❤️`;
    empty.classList.add('hidden');

    ranked.forEach(({ a, n }) => {
      const item = makeListItem(a, '❤️', `${n}`);
      list.appendChild(item);
    });
  }

  function makeListItem(a, icon, count) {
    const cat = CATEGORIES[a.category] || {};
    const item = document.createElement('div');
    item.className = 'list-item';

    const img = imageFor(a);
    const thumbStyle = img
      ? `background-image: url('${img}');`
      : `background: ${gradientCss(a)};`;
    const thumbEmoji = img ? '' : (a.emoji || cat.emoji || '✨');

    item.innerHTML = `
      <div class="list-thumb" style="${thumbStyle}">${thumbEmoji}</div>
      <div class="list-text">
        <div class="list-title">${escapeHtml(a.title)}</div>
        <div class="list-sub">${cat.emoji || ''} ${cat.label || ''} · ${escapeHtml(a.info || '')}</div>
      </div>
      <div class="list-meta">
        <span class="list-meta-icon">${icon}</span>
        ${count !== undefined ? `<span>${count}</span>` : ''}
      </div>
    `;

    item.addEventListener('click', () => openModal(a.id));
    return item;
  }

  // ---------- Modal ----------
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modal-body');
  const modalActions = document.getElementById('modal-actions');

  /**
   * openModal(id, opts?)
   * opts.reasonChips: string[]  — e.g., ['Open now', '0.4 mi away'] (rendered above title)
   */
  function openModal(id, opts) {
    const a = activityById(id);
    if (!a) return;
    const cat = CATEGORIES[a.category] || {};
    const tagsHtml = (a.tags || []).map(t =>
      `<span class="card-tag">${t.replace(/-/g, ' ')}</span>`
    ).join('');
    const chipsHtml = (opts && opts.reasonChips && opts.reasonChips.length)
      ? `<div class="wn-reason">${opts.reasonChips.map(c =>
          `<span class="wn-reason-chip">${escapeHtml(c)}</span>`).join('')}</div>`
      : '';

    modalBody.innerHTML = `
      <div class="modal-cat">${cat.emoji || ''} ${cat.label || ''}</div>
      ${chipsHtml}
      <h3>${escapeHtml(a.title)}</h3>
      <p>${escapeHtml(a.description)}</p>
      <p class="modal-info">${escapeHtml(a.info || '')}</p>
      ${tagsHtml ? `<div class="card-tags">${tagsHtml}</div>` : ''}
      ${renderEventsSection(a)}
    `;
    modalActions.innerHTML = renderActionTray(a);
    modal.classList.remove('hidden');
  }

  /**
   * renderEventsSection(a)
   * Shows scheduled events during the current city's trip window (if set).
   * If the city has no trip dates configured, all events for the activity show.
   * If `eventsNote` is set instead, shows that as a simple note.
   */
  function renderEventsSection(a) {
    const { start: tripStart, end: tripEnd } = currentTripDates();
    const events = (a.events || []).filter(e => {
      const d = new Date(e.date + 'T00:00:00');
      if (!tripStart || !tripEnd) return true; // no trip set → show all events
      return d >= tripStart && d <= tripEnd;
    });

    if (events.length === 0 && !a.eventsNote) return '';

    const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    let html = '<div class="events-section"><div class="events-header">📅 During your trip</div>';

    if (events.length > 0) {
      events.sort((a, b) => a.date.localeCompare(b.date));
      html += '<div class="events-list">';
      events.forEach(e => {
        const d = new Date(e.date + 'T00:00:00');
        const dayLabel = `${dayNames[d.getDay()]} ${monthNames[d.getMonth()]} ${d.getDate()}`;
        const timeLabel = formatEventTime(e.time);
        html += `
          <div class="event-row">
            <div class="event-when">
              <div class="event-day">${dayLabel}</div>
              <div class="event-time">${timeLabel}</div>
            </div>
            <div class="event-name">${escapeHtml(e.name)}</div>
          </div>`;
      });
      html += '</div>';
    }

    if (a.eventsNote) {
      html += `<div class="events-note">${escapeHtml(a.eventsNote)}</div>`;
    }

    html += '</div>';
    return html;
  }

  function formatEventTime(t) {
    if (!t) return '';
    // Accept "HH:MM" 24h, return "h:mm AM/PM"
    const parts = t.split(':');
    let h = parseInt(parts[0], 10);
    const m = parts[1] || '00';
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  }

  /**
   * renderActionTray(a)
   * Always shows Directions (uses lat/lng or falls back to title+city search).
   * Shows Call only if phone exists. Shows Website if known, else "Search" fallback.
   */
  function renderActionTray(a) {
    const links = [];

    // Directions — always present
    const dirUrl = a.lat && a.lng
      ? `https://www.google.com/maps/dir/?api=1&destination=${a.lat},${a.lng}&destination_place_id=${encodeURIComponent(a.title)}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a.title + ' ' + cityLabelFor(a))}`;
    links.push({ icon: '🧭', label: 'Directions', href: dirUrl });

    // Call — only if we have a number
    if (a.phone) {
      links.push({ icon: '📞', label: 'Call', href: `tel:${a.phone.replace(/[^+\d]/g, '')}` });
    }

    // Website — known URL, or fallback to a Google search
    if (a.website) {
      links.push({ icon: '🌐', label: 'Website', href: a.website });
    } else {
      links.push({ icon: '🔎', label: 'Search', href: `https://www.google.com/search?q=${encodeURIComponent(a.title + ' ' + cityLabelFor(a))}` });
    }

    return links.map(l =>
      `<a class="action-link" href="${l.href}" target="_blank" rel="noopener">
         <span class="action-link-icon">${l.icon}</span>
         <span class="action-link-label">${l.label}</span>
       </a>`
    ).join('');
  }

  document.getElementById('modal-close').addEventListener('click', () => {
    modal.classList.add('hidden');
  });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  });

  // ---------- Firebase (group like counts) ----------
  function initFirebase() {
    const cfg = window.FIREBASE_CONFIG;
    if (!cfg || !cfg.databaseURL || cfg.databaseURL.includes('YOUR_')) {
      console.info('Firebase not configured — group voting disabled.');
      window.FIREBASE_READY = false;
      return;
    }
    try {
      firebase.initializeApp(cfg);
      const db = firebase.database();
      window.FIREBASE_DB = db;
      window.FIREBASE_READY = true;

      // Live-subscribe to all like counts
      db.ref('likes').on('value', (snap) => {
        state.groupCounts = snap.val() || {};
        if (state.view === 'group') renderGroup();
        if (state.view === 'map' && state.mapSource === 'group') renderMap();
      });
    } catch (e) {
      console.warn('Firebase init failed:', e);
      window.FIREBASE_READY = false;
    }
  }

  function incrementGroupLike(id) {
    if (!window.FIREBASE_READY) return;
    const ref = window.FIREBASE_DB.ref(`likes/${id}`);
    ref.transaction(curr => (curr || 0) + 1);
  }

  // ============================================================
  // ============== Helpers: time / distance / fit ==============
  // ============================================================

  // Haversine distance in miles between two {lat,lng} points
  function distanceMiles(a, b) {
    if (!a || !b) return Infinity;
    const R = 3958.8;
    const toRad = d => d * Math.PI / 180;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat), lat2 = toRad(b.lat);
    const x = Math.sin(dLat/2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng/2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(x));
  }
  function formatDistance(miles) {
    if (!isFinite(miles)) return '';
    if (miles < 0.1) return 'Right here';
    if (miles < 1) return `${miles.toFixed(1)} mi away`;
    if (miles < 10) return `${miles.toFixed(1)} mi away`;
    return `${Math.round(miles)} mi away`;
  }

  // Is `a` open right now?  Open by default if no hours are specified.
  // Schema:
  //   hours: { open, close, closedDays: [int], byDay: { dayIdx: [open, close] } }
  // byDay overrides take precedence for that specific day-of-week.
  function isOpenNow(a, now) {
    if (!a.hours) return true;
    now = now || new Date();
    const day = now.getDay();
    const h = a.hours;
    if (h.closedDays && h.closedDays.includes(day)) return false;

    let open, close;
    if (h.byDay && h.byDay[day]) {
      [open, close] = h.byDay[day];
    } else if (h.open !== undefined && h.close !== undefined) {
      open = h.open;
      close = h.close;
    } else {
      return true;
    }

    const nowHr = now.getHours() + now.getMinutes() / 60;
    if (close > 24) {
      // Open until next day
      return nowHr >= open || nowHr < (close - 24);
    }
    return nowHr >= open && nowHr < close;
  }

  // Which "daypart" is it right now?
  function currentDaypart(now) {
    now = now || new Date();
    const h = now.getHours();
    if (h < 11) return 'morning';
    if (h < 14) return 'lunch';
    if (h < 17) return 'afternoon';
    if (h < 21) return 'evening';
    return 'late';
  }

  // Tripification of "now": if the user is testing outside the current city's
  // trip window, behave as if it were the Saturday of that trip — so What's
  // Next? still works. If the current city has no trip dates set, just use now.
  function effectiveNow() {
    const now = new Date();
    const { start: tripStart, end: tripEnd } = currentTripDates();
    if (!tripStart || !tripEnd) return now;
    if (now >= tripStart && now <= tripEnd) return now;
    // Outside the trip window: fake the date to be the Saturday of the trip
    // (or trip start if no Saturday falls in the window) at current wall-clock.
    const fake = new Date(tripStart);
    // Walk forward up to 6 days to find a Saturday
    for (let i = 0; i < 7; i++) {
      if (fake.getDay() === 6) break;
      fake.setDate(fake.getDate() + 1);
      if (fake > tripEnd) { fake.setTime(tripStart.getTime()); break; }
    }
    fake.setHours(now.getHours(), now.getMinutes(), 0, 0);
    return fake;
  }

  // ===========================================
  // ============== MAP TAB ====================
  // ===========================================

  function getMapSourceActivities() {
    const inCity = activitiesInCurrentCity();
    let pool;
    if (state.mapSource === 'group' && window.FIREBASE_READY) {
      const counts = state.groupCounts || {};
      pool = inCity.filter(a => (counts[a.id] || 0) > 0);
      // Fallback to user's likes if group is empty
      if (pool.length === 0) pool = inCity.filter(a => state.likes.has(a.id));
    } else if (state.mapSource === 'mine') {
      pool = inCity.filter(a => state.likes.has(a.id));
    } else {
      pool = inCity.slice();
    }
    return pool;
  }

  function renderMap() {
    const mapEl = document.getElementById('map');
    const emptyEl = document.getElementById('map-empty');
    const emptyText = document.getElementById('map-empty-text');

    // Init Leaflet on first show
    if (!state.map && typeof L !== 'undefined') {
      state.map = L.map(mapEl, {
        zoomControl: true,
        attributionControl: true
      }).setView([currentCityCenter().lat, currentCityCenter().lng], currentCity().mapZoom || 11);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
      }).addTo(state.map);
    }
    if (!state.map) {
      // Leaflet hasn't finished loading from CDN yet — show a hint and retry.
      emptyEl.classList.remove('hidden');
      emptyText.textContent = 'Loading map…';
      setTimeout(() => { if (state.view === 'map') renderMap(); }, 400);
      return;
    }

    // Make sure the map size is correct after the tab becomes visible
    setTimeout(() => state.map.invalidateSize(), 50);

    // Clear previous markers
    state.mapMarkers.forEach(m => state.map.removeLayer(m));
    state.mapMarkers = [];

    // Filter by source + open-now
    let pool = getMapSourceActivities().filter(a => a.lat && a.lng);
    const now = effectiveNow();
    if (state.mapOpenNowOnly) {
      pool = pool.filter(a => isOpenNow(a, now));
    }

    if (pool.length === 0) {
      emptyEl.classList.remove('hidden');
      const cityHasActivities = activitiesInCurrentCity().length > 0;
      if (!cityHasActivities) {
        emptyText.textContent = `No activities for ${currentCity().label} yet — add some in activities.js.`;
      } else if (state.mapSource === 'group' && !window.FIREBASE_READY) {
        emptyText.textContent = 'Group voting isn\'t set up. Switch to "All" or like some activities.';
      } else if (state.mapOpenNowOnly) {
        emptyText.textContent = 'Nothing in this view is open right now. Toggle "Open now" off to see all.';
      } else {
        emptyText.textContent = 'Like a few things first — your map will fill up.';
      }
      return;
    }
    emptyEl.classList.add('hidden');

    // Add markers
    const bounds = L.latLngBounds([]);
    pool.forEach(a => {
      const cat = CATEGORIES[a.category] || {};
      const open = isOpenNow(a, now);
      const icon = L.divIcon({
        className: '',
        html: `<div class="cle-pin ${open ? '' : 'closed'}" style="background:${cat.pin || '#888'};"><span>${a.emoji || cat.emoji || '📍'}</span></div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28]
      });
      const m = L.marker([a.lat, a.lng], { icon }).addTo(state.map);
      const distHtml = state.userLocation
        ? `<br><span style="color:#94a3b8;font-size:12px;">${formatDistance(distanceMiles(state.userLocation, { lat: a.lat, lng: a.lng }))}</span>`
        : '';
      const openHtml = a.hours
        ? (open ? '<span style="color:#22c55e;">● Open</span>' : '<span style="color:#ef4444;">● Closed</span>')
        : '';
      m.bindPopup(`
        <strong>${escapeHtml(a.title)}</strong>
        ${cat.emoji || ''} ${cat.label || ''} ${openHtml ? '· ' + openHtml : ''}
        ${distHtml}
        <br><a href="#" data-id="${a.id}">More info →</a>
      `);
      m.on('popupopen', (e) => {
        // Wire the "More info" link inside the popup to the detail modal
        const a2 = e.popup._contentNode && e.popup._contentNode.querySelector('a[data-id]');
        if (a2) {
          a2.addEventListener('click', (ev) => {
            ev.preventDefault();
            state.map.closePopup();
            openModal(a.id);
          });
        }
      });
      state.mapMarkers.push(m);
      bounds.extend([a.lat, a.lng]);
    });

    // Fit bounds with some padding
    if (pool.length > 1) {
      state.map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
    } else if (pool.length === 1) {
      state.map.setView([pool[0].lat, pool[0].lng], 14);
    }
  }

  function locateUserOnMap() {
    if (!navigator.geolocation) {
      alert('Your browser doesn\'t support geolocation.');
      return;
    }
    const btn = document.getElementById('map-locate-btn');
    btn.textContent = '⏳ Locating…';
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        state.userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        if (state.map) {
          // Replace any prior "you are here" marker so repeated taps don't stack
          if (state.userMarker) state.map.removeLayer(state.userMarker);
          const userIcon = L.divIcon({
            className: '',
            html: `<div class="cle-pin user-loc"><span>📍</span></div>`,
            iconSize: [28, 28], iconAnchor: [14, 14]
          });
          state.userMarker = L.marker([state.userLocation.lat, state.userLocation.lng], { icon: userIcon })
            .addTo(state.map).bindPopup('<strong>You are here</strong>');
          state.map.setView([state.userLocation.lat, state.userLocation.lng], 13);
        }
        btn.textContent = '📍 Near me';
        // Re-render so distance shows in popups
        renderMap();
      },
      (err) => {
        btn.textContent = '📍 Near me';
        alert('Couldn\'t get your location: ' + err.message);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  }

  // ===========================================
  // ============= WHAT'S NEXT? ================
  // ===========================================
  // Score every group-liked activity by:
  //   - Open now (huge boost)
  //   - Daypart fit (matches morning/lunch/etc.)
  //   - Distance from user (closer = better)
  // Pick the top scorer. Open the detail modal with reasoning chips.

  function pickWhatsNext() {
    const now = effectiveNow();
    const dp = currentDaypart(now);

    // Source pool: prefer group likes, fall back to user's likes, then everything.
    // Always restricted to the current city.
    const inCity = activitiesInCurrentCity();
    let pool;
    if (window.FIREBASE_READY) {
      const counts = state.groupCounts || {};
      pool = inCity.filter(a => (counts[a.id] || 0) > 0);
    }
    if (!pool || pool.length === 0) pool = inCity.filter(a => state.likes.has(a.id));
    if (pool.length === 0) pool = inCity.slice();

    const origin = state.userLocation || currentCityCenter();

    const scored = pool.map(a => {
      const open = isOpenNow(a, now);
      const dpFit = (a.daypart || ['afternoon','evening']).includes(dp);
      const dist = a.lat ? distanceMiles(origin, { lat: a.lat, lng: a.lng }) : 50;

      let score = 0;
      if (open) score += 100;
      if (dpFit) score += 60;
      // Distance penalty: 0-2mi free, then linear penalty up to 50 points at 25+ mi
      score -= Math.min(50, Math.max(0, (dist - 2) * 2));
      // Slight randomness to break ties on repeat taps
      score += Math.random() * 5;

      return { a, score, open, dpFit, dist };
    }).sort((x, y) => y.score - x.score);

    return scored[0];
  }

  function showWhatsNext() {
    const pick = pickWhatsNext();
    if (!pick) {
      alert('Nothing to suggest yet — like some activities first!');
      return;
    }
    const now = effectiveNow();
    const reasons = [];
    if (pick.open) reasons.push('✓ Open now');
    if (pick.dpFit) reasons.push(`Good for ${currentDaypart(now)}`);
    if (state.userLocation && isFinite(pick.dist)) {
      reasons.push(formatDistance(pick.dist));
    }
    const counts = state.groupCounts || {};
    const n = counts[pick.a.id] || 0;
    if (n > 0) reasons.push(`${n} group ❤️`);

    openModal(pick.a.id, { reasonChips: reasons });
  }

  // ===========================================
  // =============== Event wiring ==============
  // ===========================================
  document.getElementById('whats-next-btn').addEventListener('click', showWhatsNext);

  document.getElementById('map-open-now-toggle').addEventListener('click', (e) => {
    state.mapOpenNowOnly = !state.mapOpenNowOnly;
    e.currentTarget.setAttribute('aria-pressed', String(state.mapOpenNowOnly));
    renderMap();
  });

  document.getElementById('map-locate-btn').addEventListener('click', locateUserOnMap);

  document.getElementById('map-source-toggle').addEventListener('click', (e) => {
    // Cycle: group → mine → all → group
    const order = ['group', 'mine', 'all'];
    const labels = { group: '👯 Group', mine: '💛 Mine', all: '🌎 All' };
    const idx = order.indexOf(state.mapSource);
    state.mapSource = order[(idx + 1) % order.length];
    e.currentTarget.textContent = labels[state.mapSource];
    e.currentTarget.dataset.source = state.mapSource;
    renderMap();
  });

  // ===========================================
  // ============== City switcher ==============
  // ===========================================

  // Update the header title to reflect the current city.
  function renderHeaderCity() {
    const c = currentCity();
    const titleEl = document.querySelector('#city-switch .city-label');
    if (titleEl) titleEl.textContent = `${c.emoji || '📍'} ${c.label || 'Trip'}`;
    // Also update document title for browser tab clarity
    document.title = `${c.label || 'Trip'} — Swipe to Plan`;
  }

  function openCitySwitcher() {
    const sheet = document.getElementById('city-sheet');
    const list = document.getElementById('city-sheet-list');
    list.innerHTML = '';
    const cities = window.CITIES || {};
    Object.keys(cities).forEach(key => {
      const c = cities[key];
      const count = ACTIVITIES.filter(a => (a.city || DEFAULT_CITY_KEY) === key).length;
      const row = document.createElement('button');
      row.className = 'city-row' + (key === state.city ? ' active' : '');
      row.innerHTML = `
        <span class="city-row-emoji">${c.emoji || '📍'}</span>
        <span class="city-row-text">
          <span class="city-row-name">${c.label}, ${c.state || ''}</span>
          <span class="city-row-meta">${count} ${count === 1 ? 'activity' : 'activities'}${c.tripStart ? ' · trip set' : ''}</span>
        </span>
        ${key === state.city ? '<span class="city-row-check">✓</span>' : ''}
      `;
      row.addEventListener('click', () => {
        switchCity(key);
        sheet.classList.add('hidden');
      });
      list.appendChild(row);
    });
    sheet.classList.remove('hidden');
  }

  function switchCity(key) {
    const cities = window.CITIES || {};
    if (!cities[key] || key === state.city) return;
    state.city = key;
    state.reviewMode = false;
    state.userLocation = null;
    state.deck = [];
    state.filter = 'all';            // reset category filter
    state.mapOpenNowOnly = false;    // reset map open-now toggle
    saveState();

    // Re-sync filter-chip UI to "All"
    document.querySelectorAll('.filter-chip').forEach(c => {
      c.classList.toggle('active', c.dataset.cat === 'all');
    });
    // Re-sync the map "open now" pill
    const openNowBtn = document.getElementById('map-open-now-toggle');
    if (openNowBtn) openNowBtn.setAttribute('aria-pressed', 'false');

    // Re-center the map for the new city if it's been initialized.
    if (state.map) {
      const center = currentCityCenter();
      state.map.setView([center.lat, center.lng], currentCity().mapZoom || 11);
      if (state.userMarker) { state.map.removeLayer(state.userMarker); state.userMarker = null; }
    }

    renderHeaderCity();
    buildDeck();
    renderStack();
    // Refresh whichever side view is currently visible.
    if (state.view === 'likes') renderLikes();
    if (state.view === 'group') renderGroup();
    if (state.view === 'map')   renderMap();
  }

  // Wire the header button + sheet close behaviors
  document.getElementById('city-switch').addEventListener('click', openCitySwitcher);
  document.getElementById('city-sheet-close').addEventListener('click', () => {
    document.getElementById('city-sheet').classList.add('hidden');
  });
  document.getElementById('city-sheet').addEventListener('click', (e) => {
    if (e.target.id === 'city-sheet') {
      document.getElementById('city-sheet').classList.add('hidden');
    }
  });

  // ---------- Boot ----------
  loadState();
  renderHeaderCity();
  initFirebase();
  buildDeck();
  renderStack();

  // Prevent the iOS pull-to-refresh / overscroll on the card area only.
  // Allow native scrolling in lists, filter chips, the modal, the map, and
  // anything inside Leaflet (so pan/zoom gestures aren't swallowed).
  document.body.addEventListener('touchmove', (e) => {
    if (e.target.closest('.list, .filters, .modal-card, .map-canvas, .map-controls, .leaflet-container')) return;
    e.preventDefault();
  }, { passive: false });

})();
