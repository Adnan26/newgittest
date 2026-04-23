'use strict';

// ── State ─────────────────────────────────────────────────────────────────────
let state = {
  goalWeight: 185,
  currentDateKey: todayKey(),
  logs: {},          // { "YYYY-MM-DD": [ entry, ... ] }
  weights: [],       // [ { date, weight } ]
  ketoLimit: 20,     // net carbs grams
};

// ── Persistence ───────────────────────────────────────────────────────────────
function save() {
  localStorage.setItem('keto_state', JSON.stringify(state));
}

function load() {
  const raw = localStorage.getItem('keto_state');
  if (raw) {
    try {
      const saved = JSON.parse(raw);
      state = { ...state, ...saved };
    } catch { /* ignore parse errors */ }
  }
}

function todayKey() {
  return new Date().toISOString().split('T')[0];
}

function formatDateLabel(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = (dt - today) / 86400000;
  if (diff === 0) return 'Today';
  if (diff === -1) return 'Yesterday';
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function shiftDate(dateKey, days) {
  const [y, m, d] = dateKey.split('-').map(Number);
  const dt = new Date(y, m - 1, d + days);
  return dt.toISOString().split('T')[0];
}

// ── Macro helpers ─────────────────────────────────────────────────────────────
function calcNetCarbs(entry) {
  return Math.max(0, entry.carbs - entry.fiber);
}

function scaleMacros(food, grams) {
  const scale = grams / food.serving;
  return {
    name: food.name,
    calories: round(food.calories * scale),
    fat: round(food.fat * scale),
    protein: round(food.protein * scale),
    carbs: round(food.carbs * scale),
    fiber: round(food.fiber * scale),
    grams,
    servingUnit: food.servingUnit,
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  };
}

function round(n) { return Math.round(n * 10) / 10; }

function getTotals(dateKey) {
  const entries = state.logs[dateKey] || [];
  return entries.reduce((acc, e) => ({
    calories: round(acc.calories + e.calories),
    fat:      round(acc.fat + e.fat),
    protein:  round(acc.protein + e.protein),
    carbs:    round(acc.carbs + e.carbs),
    fiber:    round(acc.fiber + e.fiber),
    netCarbs: round(acc.netCarbs + calcNetCarbs(e)),
  }), { calories: 0, fat: 0, protein: 0, carbs: 0, fiber: 0, netCarbs: 0 });
}

// ── DOM refs ──────────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);

// ── Render ────────────────────────────────────────────────────────────────────
function render() {
  const dateKey = state.currentDateKey;
  const totals = getTotals(dateKey);
  const entries = state.logs[dateKey] || [];

  // Date nav
  $('current-date-label').textContent = formatDateLabel(dateKey);

  // Goal
  $('goal-weight-input').value = state.goalWeight;

  // Macro cards
  updateMacroCard('calories', totals.calories, state.ketoLimit * 45, 'kcal');
  updateMacroCard('fat',      totals.fat,      state.ketoLimit * 7,  'g');
  updateMacroCard('protein',  totals.protein,  state.ketoLimit * 6.5,'g');
  updateMacroCard('carbs',    totals.netCarbs, state.ketoLimit,      'g net');

  // Keto status
  const nc = totals.netCarbs;
  const statusBadge = $('keto-badge');
  const statusText = $('keto-status-text');
  const ncEl = $('net-carbs-display');
  ncEl.textContent = `${nc}g`;
  if (nc <= state.ketoLimit * 0.5) {
    statusBadge.textContent = 'Deep Ketosis';
    statusBadge.className = 'keto-badge';
    ncEl.className = 'net-carbs-big';
    statusText.textContent = `${state.ketoLimit - nc}g net carbs remaining — you're in deep ketosis!`;
  } else if (nc <= state.ketoLimit) {
    statusBadge.textContent = 'In Ketosis';
    statusBadge.className = 'keto-badge';
    ncEl.className = 'net-carbs-big';
    statusText.textContent = `${round(state.ketoLimit - nc)}g net carbs remaining to stay in ketosis.`;
  } else if (nc <= state.ketoLimit * 1.5) {
    statusBadge.textContent = 'Approaching Limit';
    statusBadge.className = 'keto-badge warn';
    ncEl.className = 'net-carbs-big warn';
    statusText.textContent = `${round(nc - state.ketoLimit)}g over keto limit — consider cutting carbs for the rest of the day.`;
  } else {
    statusBadge.textContent = 'Over Limit';
    statusBadge.className = 'keto-badge danger';
    ncEl.className = 'net-carbs-big danger';
    statusText.textContent = `${round(nc - state.ketoLimit)}g over keto limit — this may kick you out of ketosis.`;
  }

  // Macro split bar
  const totalCals = totals.calories || 1;
  const fatCals   = totals.fat * 9;
  const protCals  = totals.protein * 4;
  const carbCals  = totals.carbs * 4;
  const fatPct    = Math.round(fatCals / totalCals * 100);
  const protPct   = Math.round(protCals / totalCals * 100);
  const carbPct   = Math.round(carbCals / totalCals * 100);
  $('bar-fat').style.flex   = fatCals;
  $('bar-prot').style.flex  = protCals;
  $('bar-carb').style.flex  = carbCals;
  $('legend-fat').textContent  = `Fat ${fatPct}%`;
  $('legend-prot').textContent = `Protein ${protPct}%`;
  $('legend-carb').textContent = `Carbs ${carbPct}%`;

  // Log list
  const logList = $('log-list');
  if (entries.length === 0) {
    logList.innerHTML = `<div class="empty-log">No food logged for ${formatDateLabel(dateKey)}.<br>Add your first meal above!</div>`;
  } else {
    logList.innerHTML = entries.map((e, i) => `
      <div class="log-item">
        <div class="log-item-info">
          <div class="log-item-name">${esc(e.name)}</div>
          <div class="log-item-macros">
            <span class="cal">${e.calories} kcal</span>
            <span class="fat">Fat: ${e.fat}g</span>
            <span class="prot">Prot: ${e.protein}g</span>
            <span class="carb">Net Carbs: ${calcNetCarbs(e)}g</span>
          </div>
        </div>
        <span class="log-item-time">${e.time || ''}</span>
        <button class="btn btn-danger btn-sm" onclick="removeEntry(${i})">✕</button>
      </div>
    `).reverse().join('');
  }

  // Weight history
  renderWeights();
}

function updateMacroCard(id, value, goal, unit) {
  const card = document.querySelector(`.macro-card.${id}`);
  card.querySelector('.macro-value').innerHTML = `${value} <span>${unit}</span>`;
  card.querySelector('.macro-goal').textContent = `Goal: ${goal}${unit}`;
  const pct = Math.min((value / goal) * 100, 100);
  const bar = card.querySelector('.macro-bar');
  bar.style.width = pct + '%';
  bar.classList.toggle('over', value > goal);
}

function renderWeights() {
  const container = $('weight-history');
  const weights = [...state.weights].sort((a, b) => b.date.localeCompare(a.date));
  if (weights.length === 0) {
    container.innerHTML = '<div class="empty-log" style="padding:16px 0">No weight entries yet.</div>';
    return;
  }
  container.innerHTML = weights.slice(0, 14).map((w, i) => {
    const prev = weights[i + 1];
    let diffHtml = '';
    if (prev) {
      const diff = round(w.weight - prev.weight);
      if (diff !== 0) {
        const cls = diff > 0 ? 'pos' : 'neg';
        const sign = diff > 0 ? '+' : '';
        diffHtml = `<span class="we-diff ${cls}">${sign}${diff} lbs</span>`;
      }
    }
    const toGoal = round(w.weight - state.goalWeight);
    const goalSpan = toGoal > 0
      ? `<span class="we-diff pos">${toGoal} to goal</span>`
      : `<span class="we-diff neg">✓ goal reached!</span>`;
    return `
      <div class="weight-entry">
        <span class="we-date">${formatDateLabel(w.date)}</span>
        <span class="we-val">${w.weight} lbs</span>
        ${diffHtml || goalSpan}
        <button class="btn btn-danger btn-sm" onclick="removeWeight(${i})">✕</button>
      </div>
    `;
  }).join('');
}

// ── Autocomplete ──────────────────────────────────────────────────────────────
let selectedFoodItem = null;
let acIndex = -1;

function setupAutocomplete() {
  const input = $('food-search');
  const list = $('autocomplete-list');

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    acIndex = -1;
    if (q.length < 1) { list.style.display = 'none'; return; }
    const matches = FOOD_DATABASE.filter(f => f.name.toLowerCase().includes(q)).slice(0, 10);
    if (matches.length === 0) { list.style.display = 'none'; return; }
    list.innerHTML = matches.map((f, i) => {
      const nc = Math.max(0, f.carbs - f.fiber);
      return `<div class="autocomplete-item" data-index="${i}" onclick="selectFood(${FOOD_DATABASE.indexOf(f)})">
        <span>${esc(f.name)}</span>
        <span class="macro-hint">${f.calories}kcal · ${f.fat}g fat · ${nc}g net carbs / ${f.serving}${f.servingUnit.includes('g') ? 'g' : 'ml'}</span>
      </div>`;
    }).join('');
    list.style.display = 'block';
  });

  input.addEventListener('keydown', e => {
    const items = list.querySelectorAll('.autocomplete-item');
    if (e.key === 'ArrowDown') { acIndex = Math.min(acIndex + 1, items.length - 1); highlightAc(items); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { acIndex = Math.max(acIndex - 1, -1); highlightAc(items); e.preventDefault(); }
    else if (e.key === 'Enter' && acIndex >= 0) { items[acIndex].click(); e.preventDefault(); }
    else if (e.key === 'Escape') { list.style.display = 'none'; }
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('#food-search-wrap')) list.style.display = 'none';
  });
}

function highlightAc(items) {
  items.forEach((el, i) => el.classList.toggle('active', i === acIndex));
  if (acIndex >= 0) items[acIndex].scrollIntoView({ block: 'nearest' });
}

function selectFood(idx) {
  selectedFoodItem = FOOD_DATABASE[idx];
  $('food-search').value = selectedFoodItem.name;
  $('autocomplete-list').style.display = 'none';
  $('gram-amount').value = selectedFoodItem.serving;
  updatePreview();
}

function updatePreview() {
  const preview = $('food-preview');
  if (!selectedFoodItem) { preview.classList.remove('show'); return; }
  const grams = parseFloat($('gram-amount').value) || selectedFoodItem.serving;
  const scaled = scaleMacros(selectedFoodItem, grams);
  const nc = calcNetCarbs(scaled);
  preview.classList.add('show');
  preview.querySelector('.preview-name').textContent = `${scaled.name}  ·  ${grams}${selectedFoodItem.servingUnit.includes('ml') ? 'ml' : 'g'}`;
  preview.querySelector('.preview-macros').innerHTML = `
    <span><span class="dot" style="background:var(--cal-color)"></span>${scaled.calories} kcal</span>
    <span><span class="dot" style="background:var(--fat-color)"></span>Fat ${scaled.fat}g</span>
    <span><span class="dot" style="background:var(--protein-color)"></span>Protein ${scaled.protein}g</span>
    <span><span class="dot" style="background:var(--carb-color)"></span>Net Carbs ${nc}g</span>
    <span><span class="dot" style="background:var(--muted)"></span>Fiber ${scaled.fiber}g</span>
  `;
}

// ── Actions ───────────────────────────────────────────────────────────────────
function addFood() {
  const manualMode = $('manual-fields').classList.contains('show');
  let entry;

  if (manualMode) {
    const name = $('manual-name').value.trim();
    if (!name) { showToast('Please enter a food name'); return; }
    entry = {
      name,
      calories: parseFloat($('manual-cal').value)  || 0,
      fat:      parseFloat($('manual-fat').value)   || 0,
      protein:  parseFloat($('manual-prot').value)  || 0,
      carbs:    parseFloat($('manual-carbs').value) || 0,
      fiber:    parseFloat($('manual-fiber').value) || 0,
      grams: 0,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
  } else {
    if (!selectedFoodItem) { showToast('Search for and select a food first'); return; }
    const grams = parseFloat($('gram-amount').value);
    if (!grams || grams <= 0) { showToast('Enter a valid amount'); return; }
    entry = scaleMacros(selectedFoodItem, grams);
  }

  const dk = state.currentDateKey;
  if (!state.logs[dk]) state.logs[dk] = [];
  state.logs[dk].push(entry);
  save();
  render();

  // Reset
  $('food-search').value = '';
  $('gram-amount').value = '';
  selectedFoodItem = null;
  $('food-preview').classList.remove('show');
  if (manualMode) clearManual();

  showToast(`Added: ${entry.name}`);
}

function removeEntry(idx) {
  const dk = state.currentDateKey;
  const entries = state.logs[dk] || [];
  // idx is from reversed order display, so recalculate
  const realIdx = entries.length - 1 - idx;
  if (realIdx >= 0) {
    const name = entries[realIdx].name;
    state.logs[dk].splice(realIdx, 1);
    save();
    render();
    showToast(`Removed: ${name}`);
  }
}

function clearManual() {
  ['manual-name','manual-cal','manual-fat','manual-prot','manual-carbs','manual-fiber']
    .forEach(id => { $(id).value = ''; });
}

function logWeight() {
  const val = parseFloat($('weight-input').value);
  if (!val || val < 50 || val > 600) { showToast('Enter a valid weight (50–600 lbs)'); return; }
  const dk = state.currentDateKey;
  // replace if same date already exists
  const existing = state.weights.findIndex(w => w.date === dk);
  if (existing >= 0) state.weights.splice(existing, 1);
  state.weights.push({ date: dk, weight: val });
  state.weights.sort((a, b) => a.date.localeCompare(b.date));
  save();
  render();
  $('weight-input').value = '';
  showToast(`Weight logged: ${val} lbs`);
}

function removeWeight(idx) {
  const sorted = [...state.weights].sort((a, b) => b.date.localeCompare(a.date));
  const entry = sorted[idx];
  state.weights = state.weights.filter(w => !(w.date === entry.date && w.weight === entry.weight));
  save();
  render();
}

function saveGoal() {
  const val = parseFloat($('goal-weight-input').value);
  if (!val || val < 50 || val > 600) { showToast('Enter a valid goal weight'); return; }
  state.goalWeight = val;
  save();
  render();
  showToast(`Goal weight set: ${val} lbs`);
}

function navigateDate(days) {
  state.currentDateKey = shiftDate(state.currentDateKey, days);
  save();
  render();
}

function goToToday() {
  state.currentDateKey = todayKey();
  save();
  render();
}

function toggleManual() {
  const fields = $('manual-fields');
  const btn = $('toggle-manual-btn');
  const searchSection = $('search-section');
  const isShowing = fields.classList.toggle('show');
  btn.textContent = isShowing ? '← Back to food search' : '+ Enter macros manually';
  searchSection.style.display = isShowing ? 'none' : 'block';
  $('food-preview').classList.remove('show');
}

// ── Toast ─────────────────────────────────────────────────────────────────────
let toastTimer;
function showToast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2500);
}

// ── Utils ─────────────────────────────────────────────────────────────────────
function esc(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  load();
  setupAutocomplete();
  render();

  $('gram-amount').addEventListener('input', updatePreview);
  $('add-food-btn').addEventListener('click', addFood);
  $('log-weight-btn').addEventListener('click', logWeight);
  $('save-goal-btn').addEventListener('click', saveGoal);
  $('toggle-manual-btn').addEventListener('click', toggleManual);
  $('prev-day-btn').addEventListener('click', () => navigateDate(-1));
  $('next-day-btn').addEventListener('click', () => navigateDate(1));
  $('today-btn').addEventListener('click', goToToday);

  $('weight-input').addEventListener('keydown', e => { if (e.key === 'Enter') logWeight(); });
  $('food-search').addEventListener('keydown', e => { if (e.key === 'Enter' && selectedFoodItem) { /* handled in autocomplete */ } });
});
