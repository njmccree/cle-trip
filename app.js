/* =========================================
   Cleveland Trip — app logic
   - Swipeable card stack
   - Local persistence (likes / passes)
   - Optional Firebase sync for group counts
   ========================================= */

(function () {
  'use strict';

  // ---------- State ----------
  const STORAGE_KEY = 'cle-trip-v1';
  const state = {
    filter: 'all',
    likes: new Set(),
    passes: new Set(),
    groupCounts: {},  // activityId -> count from Firebase
    deck: [],         // current filtered deck (queue of remaining IDs)
    view: 'discover',
    reviewMode: false // true = looking at things you passed on
  };

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      state.likes = new Set(data.likes || []);
      state.passes = new Set(data.passes || []);
    } catch (e) { console.warn('Failed to load state:', e); }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        likes: [...state.likes],
        passes: [...state.passes]
      }));
    } catch (e) { console.warn('Failed to save state:', e); }
  }

  // ---------- Deck building ----------
  function buildDeck() {
    const filtered = ACTIVITIES.filter(a =>
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

  function buildCard(activityId) {
    const a = activityById(activityId);
    if (!a) return null;
    const cat = CATEGORIES[a.category] || { label: '', emoji: '' };

    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.id = a.id;

    const bg = a.image
      ? `background-image: url('${a.image}');`
      : `background: ${gradientCss(a)};`;
    const emoji = a.image ? '' : (a.emoji || cat.emoji || '✨');

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
    const total = ACTIVITIES.filter(a =>
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
  }

  // ---------- Likes view ----------
  function renderLikes() {
    const list = document.getElementById('likes-list');
    const empty = document.getElementById('likes-empty');
    const count = document.getElementById('likes-count');

    const liked = ACTIVITIES.filter(a => state.likes.has(a.id));
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
    const ranked = ACTIVITIES
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

    const thumbStyle = a.image
      ? `background-image: url('${a.image}');`
      : `background: ${gradientCss(a)};`;
    const thumbEmoji = a.image ? '' : (a.emoji || cat.emoji || '✨');

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

  function openModal(id) {
    const a = activityById(id);
    if (!a) return;
    const cat = CATEGORIES[a.category] || {};
    const tagsHtml = (a.tags || []).map(t =>
      `<span class="card-tag">${t.replace(/-/g, ' ')}</span>`
    ).join('');

    modalBody.innerHTML = `
      <div class="modal-cat">${cat.emoji || ''} ${cat.label || ''}</div>
      <h3>${escapeHtml(a.title)}</h3>
      <p>${escapeHtml(a.description)}</p>
      <p class="modal-info">${escapeHtml(a.info || '')}</p>
      ${tagsHtml ? `<div class="card-tags">${tagsHtml}</div>` : ''}
    `;
    modal.classList.remove('hidden');
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

  // ---------- Boot ----------
  loadState();
  initFirebase();
  buildDeck();
  renderStack();

  // Prevent the iOS pull-to-refresh / overscroll on the card area only.
  // Allow native scrolling in lists, filter chips, and the modal.
  document.body.addEventListener('touchmove', (e) => {
    if (e.target.closest('.list, .filters, .modal-card')) return;
    e.preventDefault();
  }, { passive: false });

})();
