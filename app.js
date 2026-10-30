const STORAGE_KEY = 'mediavault-items-v1';
const SETTINGS_KEY = 'mediavault-settings-v1';

const DEFAULT_TYPES = ['影片', 'Podcast', '音樂', '直播', '文章／其他'];
const UNCLASSIFIED_TYPE = '未分類';
const TYPES_KEY = 'mediavault-types-v1';
const GOOGLE_CLIENT_ID = '736171088462-9lgp18000mae0p30vc2kgorj2kqlq7v3.apps.googleusercontent.com';
const STATUSES = [
  { value: '待觀看', className: 'pending' },
  { value: '觀看中', className: 'watching' },
  { value: '已完成', className: 'done' },
  { value: '封存', className: 'archived' }
];
const CATEGORIES = ['設計靈感', '工作方法', '城市與旅行', '音樂現場', '生活觀察'];
const FIELD_DEFINITIONS = [
  ['id', '唯一識別碼'], ['title', '影音標題'], ['mediaType', '影音類型'], ['sourceUrl', '來源連結'],
  ['thumbnailUrl', '縮圖網址'], ['category', '主要分類'], ['tags', '逗號分隔標籤'], ['status', '觀看狀態'],
  ['rating', '0–5 評分'], ['notes', '個人備註'], ['createdAt', '建立時間'], ['updatedAt', '更新時間']
];

const seedItems = [
  { id: 'mv-001', title: 'The art of noticing', mediaType: '影片', sourceUrl: 'https://www.youtube.com/watch?v=demo1', thumbnailUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80', category: '設計靈感', tags: '觀察,創意', status: '待觀看', rating: 4.5, notes: '留意講者怎麼把日常物件轉成靈感索引。', createdAt: '2026-10-21T08:20:00+08:00', updatedAt: '2026-10-25T12:10:00+08:00' },
  { id: 'mv-002', title: '一座城市的聲音地圖', mediaType: 'Podcast', sourceUrl: 'https://example.com/podcast-city', thumbnailUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=900&q=80', category: '城市與旅行', tags: '城市,聲音', status: '觀看中', rating: 4, notes: '第 3 集提到的市場聲景很想再找來聽。', createdAt: '2026-10-18T09:00:00+08:00', updatedAt: '2026-10-24T16:48:00+08:00' },
  { id: 'mv-003', title: 'How to build a second brain', mediaType: '影片', sourceUrl: 'https://www.youtube.com/watch?v=demo3', thumbnailUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=80', category: '工作方法', tags: '知識管理,工作流', status: '已完成', rating: 5, notes: '想把這套標籤方法套用到自己的素材庫。', createdAt: '2026-10-15T11:30:00+08:00', updatedAt: '2026-10-22T10:15:00+08:00' },
  { id: 'mv-004', title: 'Live at the Blue Note', mediaType: '音樂', sourceUrl: 'https://example.com/live-blue-note', thumbnailUrl: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=900&q=80', category: '音樂現場', tags: '爵士,現場', status: '待觀看', rating: 4.5, notes: '適合週末整理房間時播放。', createdAt: '2026-10-12T13:20:00+08:00', updatedAt: '2026-10-20T18:05:00+08:00' },
  { id: 'mv-005', title: '慢慢走，台北的雨', mediaType: '影片', sourceUrl: 'https://example.com/taipei-rain', thumbnailUrl: 'https://images.unsplash.com/photo-1501691223387-dd0500403074?auto=format&fit=crop&w=900&q=80', category: '生活觀察', tags: '台北,散步', status: '已完成', rating: 4, notes: '畫面色調很舒服，可以作為攝影參考。', createdAt: '2026-10-11T07:10:00+08:00', updatedAt: '2026-10-19T09:40:00+08:00' },
  { id: 'mv-006', title: 'The long game of craft', mediaType: 'Podcast', sourceUrl: 'https://example.com/long-game', thumbnailUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80', category: '工作方法', tags: '創作,專注', status: '待觀看', rating: 4.5, notes: '記下「每天留一點空白」這句話。', createdAt: '2026-10-08T17:20:00+08:00', updatedAt: '2026-10-18T11:32:00+08:00' },
  { id: 'mv-007', title: 'Patterns in public space', mediaType: '文章／其他', sourceUrl: 'https://example.com/public-space', thumbnailUrl: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80', category: '設計靈感', tags: '空間,建築', status: '觀看中', rating: 3.5, notes: '想整理成「城市觀察」的長期資料夾。', createdAt: '2026-10-04T12:00:00+08:00', updatedAt: '2026-10-17T14:27:00+08:00' },
  { id: 'mv-008', title: 'The quiet kitchen', mediaType: '影片', sourceUrl: 'https://www.youtube.com/watch?v=demo8', thumbnailUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=80', category: '生活觀察', tags: '料理,日常', status: '封存', rating: 3, notes: '先封存，等想研究食物影像時再回來。', createdAt: '2026-09-29T15:12:00+08:00', updatedAt: '2026-10-12T08:50:00+08:00' }
];

const state = {
  items: [],
  mediaTypes: [],
  filteredItems: [],
  selectedItem: null,
  editing: false,
  filters: { type: '' },
  query: '',
  sort: 'updated',
  settings: { mode: 'demo', apiUrl: '' },
  auth: { authenticated: false, user: null }
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[char]));
}

function getSettings() {
  try { return { ...state.settings, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') }; } catch { return state.settings; }
}

function saveLocalItems(items) { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }
function loadMediaTypes() {
  try {
    const stored = JSON.parse(localStorage.getItem(TYPES_KEY) || 'null');
    if (Array.isArray(stored) && stored.length) return [...new Set(stored.map(String).map((value) => value.trim()).filter(Boolean))];
  } catch { /* use defaults */ }
  localStorage.setItem(TYPES_KEY, JSON.stringify(DEFAULT_TYPES));
  return [...DEFAULT_TYPES];
}
function saveMediaTypes(types) { localStorage.setItem(TYPES_KEY, JSON.stringify(types)); }
function loadLocalItems() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (Array.isArray(stored)) return stored;
  } catch { /* use seed */ }
  saveLocalItems(seedItems);
  return [...seedItems];
}

const dataSource = {
  async meta() {
    if (state.settings.mode === 'demo') return { mediaTypes: state.mediaTypes };
    if (!state.settings.apiUrl) throw new Error('請先在「資料來源」設定 Apps Script Web App URL。');
    const response = await fetch(`${state.settings.apiUrl}?action=meta`, { headers: { Accept: 'application/json' } });
    const payload = await response.json();
    if (!payload.ok) throw new Error(payload.error?.message || 'API 回應失敗。');
    return payload.data || {};
  },
  async list() {
    if (state.settings.mode === 'demo') return loadLocalItems();
    if (!state.settings.apiUrl) throw new Error('請先在「資料來源」設定 Apps Script Web App URL。');
    const params = new URLSearchParams({ action: 'list' });
    if (state.query) params.set('q', state.query);
    if (state.filters.type) params.set('mediaType', state.filters.type);
    if (state.sort) params.set('sort', state.sort);
    const response = await fetch(`${state.settings.apiUrl}?${params.toString()}`, { headers: { Accept: 'application/json' } });
    const payload = await response.json();
    if (!payload.ok) throw new Error(payload.error?.message || 'API 回應失敗。');
    return Array.isArray(payload.data) ? payload.data : [];
  },
  async mutate(action, item, id) {
    if (state.settings.mode === 'demo') {
      let items = loadLocalItems();
      if (action === 'create') items = [item, ...items];
      if (action === 'update') items = items.map((entry) => entry.id === id ? item : entry);
      if (action === 'delete') items = items.filter((entry) => entry.id !== id);
      saveLocalItems(items);
      return item;
    }
    if (!state.settings.apiUrl) throw new Error('請先設定 Apps Script Web App URL。');
    // 使用 text/plain 讓跨來源 POST 保持 CORS simple request，避免 Apps Script Web App 的 OPTIONS 預檢被擋下。
    // doPost 仍以 e.postData.contents 解析 JSON，因此不需要修改 API payload 契約。
    const response = await fetch('/api/sheet-write', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ apiUrl: state.settings.apiUrl, payload: { action, item, id } }) });
    if (!response.ok) {
      if (response.status === 405) throw new Error('Apps Script 部署目前只允許 GET；請確認 Code.gs 包含 doPost(e)，並重新部署 Web App。');
      throw new Error(`Apps Script 回應 HTTP ${response.status}。`);
    }
    const payload = await response.json();
    if (!payload.ok) throw new Error(payload.error?.message || 'API 回應失敗。');
    return payload.data;
  },
  async mutateType(action, value) {
    if (state.settings.mode === 'demo') return { value };
    if (!state.settings.apiUrl) throw new Error('請先設定 Apps Script Web App URL。');
    const response = await fetch('/api/sheet-write', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ apiUrl: state.settings.apiUrl, payload: { action, value } }) });
    const payload = await response.json();
    if (!response.ok || !payload.ok) throw new Error(payload.error?.message || `影音類型操作失敗（HTTP ${response.status}）。`);
    return payload.data;
  }
};

function formatDate(dateValue) {
  if (!dateValue) return '—';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return String(dateValue);
  return new Intl.DateTimeFormat('zh-TW', { month: 'short', day: 'numeric' }).format(date);
}

function statusClass(status) { return STATUSES.find((entry) => entry.value === status)?.className || 'pending'; }
function tagsOf(item) { return String(item.tags || '').split(',').map((tag) => tag.trim()).filter(Boolean); }
function ratingStars(rating) { return rating ? `${'★'.repeat(Math.floor(Number(rating)))}${Number(rating) % 1 ? '½' : ''}` : ''; }

function renderStats() {
  const total = state.items.length;
  $('#nav-count').textContent = String(total).padStart(2, '0');
}

function renderMediaTypeSelect() {
  const select = $('#type-search-select');
  if (!select) return;
  select.innerHTML = `<option value="">所有影音類型</option>${state.mediaTypes.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join('')}`;
  select.value = state.filters.type;
  $('#delete-type-button').disabled = !state.auth.authenticated || !state.filters.type || state.filters.type === UNCLASSIFIED_TYPE;
  select.onchange = () => { state.filters.type = select.value; renderMediaTypeSelect(); renderList(); };
}

async function addMediaType() {
  if (!requireAdmin()) return;
  const value = window.prompt('請輸入新的影音類型：', '線上課程')?.trim();
  if (!value) return;
  if (state.mediaTypes.some((type) => type.toLowerCase() === value.toLowerCase())) { showToast('這個影音類型已經存在。', 'error'); return; }
  try {
    await dataSource.mutateType('createType', value);
    state.mediaTypes = [...state.mediaTypes, value];
    saveMediaTypes(state.mediaTypes);
    renderMediaTypeSelect();
    showToast(`已新增影音類型「${value}」。`, 'success');
  } catch (error) { showToast(error.message, 'error'); }
}

async function removeMediaType(value) {
  if (!requireAdmin()) return;
  if (!value || value === UNCLASSIFIED_TYPE) { showToast('「未分類」是保留類型，不能刪除。', 'error'); return; }
  const reassignedCount = state.items.filter((item) => item.mediaType === value).length;
  const message = reassignedCount ? `刪除後，${reassignedCount} 張使用「${value}」的收藏卡會改為「${UNCLASSIFIED_TYPE}」。確定要繼續嗎？` : `確定要刪除影音類型「${value}」嗎？`;
  if (!window.confirm(message)) return;
  try {
    const result = await dataSource.mutateType('deleteType', value);
    state.items = state.items.map((item) => item.mediaType === value ? { ...item, mediaType: UNCLASSIFIED_TYPE } : item);
    if (state.settings.mode === 'demo') saveLocalItems(state.items);
    state.mediaTypes = state.mediaTypes.filter((type) => type !== value);
    if (reassignedCount && !state.mediaTypes.includes(UNCLASSIFIED_TYPE)) state.mediaTypes = [...state.mediaTypes, UNCLASSIFIED_TYPE];
    if (state.filters.type === value) state.filters.type = '';
    saveMediaTypes(state.mediaTypes);
    renderMediaTypeSelect(); renderList();
    showToast(`已刪除影音類型「${value}」${result?.reassigned ? `，${result.reassigned} 張收藏已改為「${UNCLASSIFIED_TYPE}」` : ''}。`, 'success');
  } catch (error) { showToast(error.message, 'error'); }
}

function chipHtml(label, selected, filter, value = label) { return `<button class="chip ${selected ? 'selected' : ''}" data-filter="${escapeHtml(filter)}" data-value="${escapeHtml(value)}">${escapeHtml(label)}</button>`; }

function applyFilters() {
  const query = state.query.trim().toLowerCase();
  let list = state.items.filter((item) => {
    const haystack = [item.title, displayMediaType(item), item.sourceUrl, item.category, item.tags, item.notes].join(' ').toLowerCase();
    return (!query || haystack.includes(query)) && (!state.filters.type || displayMediaType(item) === state.filters.type);
  });
  list.sort((a, b) => {
    if (state.sort === 'rating') return Number(b.rating || 0) - Number(a.rating || 0);
    if (state.sort === 'title') return String(a.title).localeCompare(String(b.title), 'zh-Hant');
    const field = state.sort === 'created' ? 'createdAt' : 'updatedAt';
    return new Date(b[field] || 0) - new Date(a[field] || 0);
  });
  state.filteredItems = list;
}

function renderList() {
  applyFilters();
  $('#result-count').textContent = state.filteredItems.length;
  $('#view-caption').textContent = state.settings.mode === 'demo' ? '示範資料 · 即時篩選' : 'Google Sheet · 即時同步';
  if (!state.filteredItems.length) {
    $('#media-grid').innerHTML = `<div class="empty-state"><div class="empty-orb">⌕</div><h3>${state.items.length ? '找不到符合的收藏' : '你的收藏架還是空的'}</h3><p>${state.items.length ? '試試調整搜尋字詞或清除篩選條件。' : '先放進第一筆影音，讓靈感有一個回來的地方。'}</p>${state.items.length ? '<button class="secondary-button" id="empty-clear">清除篩選</button>' : '<button class="primary-button" id="empty-add">新增第一筆</button>'}</div>`;
    $('#empty-clear')?.addEventListener('click', clearFilters);
    $('#empty-add')?.addEventListener('click', () => openForm());
    return;
  }
  $('#media-grid').innerHTML = state.filteredItems.map(mediaCardHtml).join('');
  $$('.media-card').forEach((card) => card.addEventListener('click', (event) => {
    if (event.target.closest('a, button, video, iframe')) return;
    openDetail(card.dataset.id);
  }));
  $$('.player-launch').forEach((button) => button.addEventListener('click', (event) => {
    event.stopPropagation();
    const player = button.closest('.inline-player');
    if (!player) return;
    const kind = button.dataset.playerKind;
    const url = button.dataset.playerUrl;
    const embedUrl = kind === 'youtube'
      ? `https://www.youtube.com/embed/${encodeURIComponent(url)}?autoplay=1&rel=0`
      : `https://player.vimeo.com/video/${encodeURIComponent(url)}?autoplay=1`;
    player.innerHTML = `<iframe src="${embedUrl}" title="影音播放器" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
  }));
  $$('.card-edit').forEach((button) => button.addEventListener('click', (event) => {
    event.stopPropagation();
    const item = state.items.find((entry) => entry.id === button.dataset.id);
    if (item) openForm(item);
  }));
  $$('.card-delete').forEach((button) => button.addEventListener('click', (event) => {
    event.stopPropagation();
    const item = state.items.find((entry) => entry.id === button.dataset.id);
    if (item) confirmDelete(item);
  }));
}

function mediaCardHtml(item) {
  const tags = tagsOf(item);
  const image = item.thumbnailUrl ? `<img src="${escapeHtml(item.thumbnailUrl)}" alt="${escapeHtml(item.title)} 縮圖" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('div'), {className:'image-placeholder', textContent:'▶'}))" />` : '<div class="image-placeholder">▶</div>';
  return `<article class="media-card" data-id="${escapeHtml(item.id)}"><div class="media-card-image">${playerHtml(item, image)}<span class="media-type-pill">${escapeHtml(displayMediaType(item))}</span></div><div class="media-card-body"><h3>${escapeHtml(item.title)}</h3><div class="card-meta"><div class="card-tags">${tags.slice(0, 2).map((tag) => `<span class="card-tag">#${escapeHtml(tag)}</span>`).join('')}</div>${item.rating ? `<span class="card-rating">${ratingStars(item.rating)}</span>` : ''}</div><div class="card-footer"><span class="card-time">更新於 ${formatDate(item.updatedAt)}</span><div class="card-actions"><a class="card-open" href="${escapeHtml(item.sourceUrl)}" target="_blank" rel="noreferrer">開啟來源 ↗</a><button class="card-action card-edit" type="button" data-id="${escapeHtml(item.id)}">修改</button><button class="card-action delete card-delete" type="button" data-id="${escapeHtml(item.id)}">刪除</button></div></div></div></article>`;
}

function playerInfo(url) {
  const value = String(url || '').trim();
  const youtubeId = youtubeVideoId(value);
  if (youtubeId) return { kind: 'youtube', id: youtubeId };
  try {
    const parsed = new URL(value);
    if (parsed.hostname.toLowerCase().endsWith('vimeo.com')) {
      const id = parsed.pathname.split('/').filter(Boolean).pop();
      if (/^\d+$/.test(id || '')) return { kind: 'vimeo', id };
    }
    if (/\.(mp4|webm|ogg|ogv)(?:$|[?#])/i.test(parsed.pathname + parsed.search)) return { kind: 'direct', url: value };
  } catch { /* fallback to the normal source link */ }
  return null;
}

function playerHtml(item, image) {
  const info = playerInfo(item.sourceUrl);
  if (!info) return image;
  if (info.kind === 'direct') return `<video class="inline-video" controls preload="metadata" poster="${escapeHtml(item.thumbnailUrl || '')}"><source src="${escapeHtml(info.url)}" /></video>`;
  return `<div class="inline-player"><div class="player-poster">${image}<button class="player-launch" type="button" data-player-kind="${info.kind}" data-player-url="${escapeHtml(info.id)}" aria-label="播放${escapeHtml(item.title)}"><span>▶</span><em>播放</em></button></div></div>`;
}

function displayMediaType(item) { return item.mediaType && state.mediaTypes.includes(item.mediaType) ? item.mediaType : UNCLASSIFIED_TYPE; }

function openDetail(id) {
  const item = state.items.find((entry) => entry.id === id);
  if (!item) return;
  state.selectedItem = item;
  $('#drawer-kicker').textContent = 'COLLECTION DETAIL';
  $('#drawer-title').textContent = '收藏詳情';
  $('#drawer-scroll').innerHTML = detailHtml(item);
  showDrawer();
  $('#edit-item').addEventListener('click', () => openForm(item));
  $('#delete-item').addEventListener('click', () => confirmDelete(item));
}

function detailHtml(item) {
  const image = item.thumbnailUrl ? `<img src="${escapeHtml(item.thumbnailUrl)}" alt="${escapeHtml(item.title)} 縮圖" onerror="this.replaceWith(Object.assign(document.createElement('div'), {className:'image-placeholder', textContent:'▶'}))" />` : '<div class="image-placeholder">▶</div>';
  return `<div class="detail-image">${image}</div><div class="detail-topline"><span class="card-category">${escapeHtml(displayMediaType(item))}</span><span class="status-pill ${statusClass(item.status)}">${escapeHtml(item.status)}</span></div><div class="detail-title">${escapeHtml(item.title)}</div><div class="detail-tags">${tagsOf(item).map((tag) => `<span class="card-tag">#${escapeHtml(tag)}</span>`).join('') || '<span class="muted-label">尚未加上標籤</span>'}</div><dl class="detail-grid"><div class="detail-data"><dt>影音類型</dt><dd>${escapeHtml(displayMediaType(item))}</dd></div><div class="detail-data"><dt>評分</dt><dd class="card-rating">${ratingStars(item.rating)}</dd></div><div class="detail-data"><dt>加入日期</dt><dd>${formatDate(item.createdAt)}</dd></div><div class="detail-data"><dt>最後更新</dt><dd>${formatDate(item.updatedAt)}</dd></div></dl><div class="detail-notes"><span class="detail-label">NOTES</span><p>${escapeHtml(item.notes || '還沒有備註。')}</p></div><div class="drawer-actions"><a class="primary-button" href="${escapeHtml(item.sourceUrl)}" target="_blank" rel="noreferrer" style="display:grid;place-items:center;text-decoration:none">開啟來源 ↗</a><button class="secondary-button" id="edit-item">編輯</button><button class="danger-button" id="delete-item">刪除收藏</button></div>`;
}

function openForm(item = null) {
  state.selectedItem = item;
  state.editing = Boolean(item);
  $('#drawer-kicker').textContent = item ? 'EDIT ENTRY' : 'NEW ENTRY';
  $('#drawer-title').textContent = item ? '編輯收藏' : '新增收藏';
  $('#drawer-scroll').innerHTML = formHtml(item || { mediaType: '影片', status: '待觀看', rating: 0, category: '', title: '', sourceUrl: '', thumbnailUrl: '', tags: '', notes: '' });
  showDrawer();
  $('#media-form').addEventListener('submit', handleFormSubmit);
  $('#fetch-youtube-info')?.addEventListener('click', () => fetchYoutubeInfo(true));
  $('#form-url')?.addEventListener('blur', () => fetchYoutubeInfo(false));
}

function youtubeVideoId(value) {
  try {
    const url = new URL(value.trim());
    const hostname = url.hostname.toLowerCase();
    if (hostname === 'youtu.be') return url.pathname.slice(1).split('/')[0] || '';
    if (hostname === 'youtube.com' || hostname.endsWith('.youtube.com')) {
      if (url.pathname === '/watch') return url.searchParams.get('v') || '';
      const parts = url.pathname.split('/').filter(Boolean);
      if (['shorts', 'embed', 'live'].includes(parts[0])) return parts[1] || '';
    }
  } catch { /* allow normal non-YouTube links */ }
  return '';
}

async function fetchYoutubeInfo(force = false) {
  const urlInput = $('#form-url');
  const titleInput = $('#form-title');
  const thumbnailInput = $('#form-thumbnail');
  const button = $('#fetch-youtube-info');
  const videoId = youtubeVideoId(urlInput?.value || '');
  if (!videoId) return;
  if (!force && titleInput.value.trim() && thumbnailInput.value.trim()) return;
  const originalLabel = button?.textContent;
  if (button) { button.disabled = true; button.textContent = '讀取中…'; }
  try {
    // noembed 提供 Access-Control-Allow-Origin，可由靜態前端直接讀取；YouTube oEmbed 本身沒有穩定的 CORS 標頭。
    const response = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(urlInput.value.trim())}`);
    if (!response.ok) throw new Error('YouTube 資訊讀取失敗');
    const payload = await response.json();
    if (force || !titleInput.value.trim()) titleInput.value = payload.title || titleInput.value;
    if (force || !thumbnailInput.value.trim()) thumbnailInput.value = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    showToast('已帶入 YouTube 標題與縮圖。', 'success');
  } catch (error) {
    if (force) showToast(`無法取得 YouTube 資訊：${error.message}`, 'error');
  } finally {
    if (button) { button.disabled = false; button.textContent = originalLabel || '取用 YouTube'; }
  }
}

function formHtml(item) {
  const select = (id, options, current) => `<select class="select-input" id="${id}">${options.map((option) => `<option ${option === current ? 'selected' : ''}>${escapeHtml(option)}</option>`).join('')}</select>`;
  return `<form id="media-form" class="form-stack">
    <div class="field"><label class="field-label" for="form-url">來源連結 <span>必填</span></label><div class="field-inline-action"><input class="text-input" id="form-url" type="url" required value="${escapeHtml(item.sourceUrl)}" placeholder="貼上 YouTube 連結後會自動帶入" /><button class="secondary-button youtube-fetch-button" id="fetch-youtube-info" type="button">取用 YouTube</button></div><p class="field-hint compact-hint">貼上 YouTube 網址後離開欄位，或按「取用 YouTube」，會自動帶入標題與縮圖。</p></div>
    <div class="field"><label class="field-label" for="form-title">標題 <span>必填</span></label><input class="text-input" id="form-title" required value="${escapeHtml(item.title)}" placeholder="例如：The art of noticing" /></div>
    <div class="field"><label class="field-label" for="form-type">影音類型 <span>必填</span></label>${select('form-type', state.mediaTypes, item.mediaType)}</div>
    <div class="field"><label class="field-label" for="form-thumbnail">縮圖網址 <span>選填</span></label><input class="text-input" id="form-thumbnail" type="url" value="${escapeHtml(item.thumbnailUrl)}" placeholder="YouTube 縮圖會自動填入，也可自行修改" /></div>
    <div class="field"><label class="field-label" for="form-notes">備註</label><textarea class="textarea-input" id="form-notes" placeholder="記下為什麼收藏，或之後想回來看的地方…">${escapeHtml(item.notes)}</textarea></div>
    <div class="form-footer"><span class="required-note">* 為必要欄位</span><button class="primary-button" type="submit">${state.editing ? '儲存變更' : '加入收藏'}</button></div>
  </form>`;
}

function renderRatingInput(value) { $$('.rating-star').forEach((star) => star.classList.toggle('active', Number(star.dataset.rating) <= value)); }

async function handleFormSubmit(event) {
  event.preventDefault();
  const title = $('#form-title').value.trim();
  const sourceUrl = $('#form-url').value.trim();
  try { const parsedUrl = new URL(sourceUrl); if (!['http:', 'https:'].includes(parsedUrl.protocol)) throw new Error('protocol'); } catch { showToast('請輸入有效的 HTTP(S) 來源連結。', 'error'); return; }
  if (!title) { showToast('請填寫影音標題。', 'error'); return; }
  const now = new Date().toISOString();
  const item = { id: state.selectedItem?.id || `mv-${Date.now()}`, title, mediaType: $('#form-type').value, sourceUrl, thumbnailUrl: $('#form-thumbnail').value.trim(), category: state.selectedItem?.category || '', tags: state.selectedItem?.tags || '', status: state.selectedItem?.status || '待觀看', rating: Number(state.selectedItem?.rating) || 0, notes: $('#form-notes').value.trim(), createdAt: state.selectedItem?.createdAt || now, updatedAt: now };
  const submitButton = event.currentTarget.querySelector('button[type="submit"]');
  submitButton.disabled = true; submitButton.textContent = '儲存中…';
  try {
    await dataSource.mutate(state.editing ? 'update' : 'create', item, item.id);
    await refreshData(false);
    closeDrawer();
    showToast(state.editing ? '收藏已更新。' : '已加入收藏架。', 'success');
  } catch (error) { showToast(error.message, 'error'); submitButton.disabled = false; submitButton.textContent = state.editing ? '儲存變更' : '加入收藏'; }
}

function confirmDelete(item) {
  if (!window.confirm(`確定要刪除「${item.title}」嗎？此動作無法復原。`)) return;
  dataSource.mutate('delete', item, item.id).then(async () => { await refreshData(false); closeDrawer(); showToast('收藏已刪除。', 'success'); }).catch((error) => showToast(error.message, 'error', { label: '重試', handler: () => confirmDelete(item) }));
}

async function refreshData(showSuccess = true) {
  $('#media-grid').innerHTML = '<div class="empty-state"><div class="empty-orb">…</div><h3>正在整理你的收藏</h3><p>資料很快就會回來。</p></div>';
  try {
    if (state.settings.mode === 'api') {
      const meta = await dataSource.meta();
      if (Array.isArray(meta.mediaTypes) && meta.mediaTypes.length) state.mediaTypes = [...new Set(meta.mediaTypes.map(String).filter(Boolean))];
    }
    state.items = await dataSource.list();
    renderStats(); renderMediaTypeSelect(); renderList();
    if (showSuccess) showToast('清單已更新。', 'success');
  } catch (error) {
    state.items = [];
    renderStats(); renderMediaTypeSelect(); renderList();
    showToast(error.message, 'error', { label: '重試', handler: () => refreshData(false) });
  }
}

function showDrawer() { $('#drawer-backdrop').hidden = false; requestAnimationFrame(() => $('#drawer').classList.add('open')); $('#drawer').setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; }
function closeDrawer() { $('#drawer').classList.remove('open'); $('#drawer').setAttribute('aria-hidden', 'true'); setTimeout(() => { $('#drawer-backdrop').hidden = true; }, 250); document.body.style.overflow = ''; }
function clearFilters() { state.filters = { type: '' }; state.query = ''; $('#search-input').value = ''; renderMediaTypeSelect(); renderList(); }
function showToast(message, type = '', action = null) { const toast = document.createElement('div'); toast.className = `toast ${type}`; toast.append(document.createTextNode(message)); if (action) { const button = document.createElement('button'); button.className = 'toast-action'; button.textContent = action.label; button.addEventListener('click', () => { toast.remove(); action.handler(); }); toast.append(button); } $('#toast-stack').appendChild(toast); setTimeout(() => toast.remove(), 5000); }

function setView(view, { syncUrl = true } = {}) {
  $$('[data-view]').forEach((item) => item.classList.toggle('active', item.dataset.view === view));
  $('#library-view').hidden = view !== 'library';
  $('#settings-view').hidden = view !== 'settings';
  if (view === 'settings') renderSettings();
  if (syncUrl) window.history.pushState({}, '', view === 'settings' ? '/settings' : '/');
}

function renderSettings() {
  state.settings = getSettings();
  $('#api-url').value = state.settings.apiUrl || '';
  $$('.mode-button').forEach((button) => button.classList.toggle('active', button.dataset.mode === state.settings.mode));
  $('#mode-label').textContent = state.settings.mode === 'demo' ? '示範資料' : 'Google Sheet API';
  $('#connection-pill').textContent = state.settings.mode === 'demo' ? '示範模式' : 'API 模式';
  $('#field-table').innerHTML = FIELD_DEFINITIONS.map(([field, description]) => `<div class="field-token"><strong>${field}</strong><span>${description}</span></div>`).join('');
}

function requireAdmin() {
  if (state.auth.authenticated && state.auth.user?.email?.toLowerCase() === 'notemaker@gmail.com') return true;
  showToast('請先使用 notemaker@gmail.com 登入後再進行管理操作。', 'error');
  return false;
}

function updateWriteControls() {
  const canWrite = state.auth.authenticated;
  ['add-button', 'mobile-add-button'].forEach((id) => { const button = $(`#${id}`); if (button) button.hidden = !canWrite; });
  const typeAdd = $('#add-type-button');
  if (typeAdd) typeAdd.disabled = !canWrite;
  renderMediaTypeSelect();
  const user = $('#auth-user');
  const login = $('#google-login');
  if (user) { user.hidden = !canWrite; user.querySelector('[data-auth-email]').textContent = state.auth.user?.email || ''; }
  if (login) login.hidden = canWrite;
}

async function refreshAuth() {
  try {
    const response = await fetch('/api/auth/me', { headers: { Accept: 'application/json' } });
    const payload = await response.json();
    state.auth = { authenticated: Boolean(payload.authenticated), user: payload.user || null };
  } catch { state.auth = { authenticated: false, user: null }; }
  updateWriteControls();
}

async function handleGoogleCredential(response) {
  try {
    const result = await fetch('/api/auth/google', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ credential: response.credential }) });
    const payload = await result.json();
    if (!result.ok || !payload.ok) throw new Error(payload.error || 'Google 登入失敗。');
    state.auth = { authenticated: true, user: payload.user };
    updateWriteControls();
    showToast('管理者登入成功，已開啟收藏管理功能。', 'success');
  } catch (error) { showToast(error.message, 'error'); }
}

function initGoogleLogin() {
  if (!window.google?.accounts?.id) { setTimeout(initGoogleLogin, 250); return; }
  window.google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: handleGoogleCredential, auto_select: false });
  $('#google-login').addEventListener('click', () => {
    if (!window.google?.accounts?.id) { showToast('Google 登入服務載入中，請稍後再試。', 'error'); return; }
    window.google.accounts.id.prompt();
  });
}

async function logout() {
  await fetch('/api/auth/logout', { method: 'POST' });
  state.auth = { authenticated: false, user: null };
  updateWriteControls();
  showToast('已登出，現在可以瀏覽與播放影音。', 'success');
}

async function testConnection() {
  const url = $('#api-url').value.trim();
  const result = $('#connection-result');
  if (!url) { result.hidden = false; result.className = 'connection-result error'; result.textContent = '請先輸入 Apps Script Web App URL。'; return; }
  result.hidden = false; result.className = 'connection-result'; result.textContent = '連線測試中…';
  try {
    const response = await fetch(`${url}?action=meta`);
    const payload = await response.json();
    if (!payload.ok) throw new Error(payload.error?.message || 'API 回應失敗。');
    result.className = 'connection-result ok'; result.textContent = `連線成功。API 版本 ${payload.meta?.version || '—'}，可以切換至 Google Sheet 模式。`;
  } catch (error) { result.className = 'connection-result error'; result.textContent = `連線失敗：${error.message}`; }
}

function saveSettings() {
  const mode = $('.mode-button.active')?.dataset.mode || 'demo';
  const apiUrl = $('#api-url').value.trim();
  state.settings = { mode, apiUrl };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
  $('#mode-label').textContent = mode === 'demo' ? '示範資料' : 'Google Sheet API';
  setView('library');
  refreshData(false);
  showToast(mode === 'demo' ? '已切換至示範資料。' : '資料來源設定已儲存。', 'success');
}

function init() {
  state.settings = getSettings();
  state.mediaTypes = loadMediaTypes();
  $('#search-input').addEventListener('input', (event) => { state.query = event.target.value; renderList(); });
  $('#add-type-button').addEventListener('click', addMediaType);
  $('#delete-type-button').addEventListener('click', () => removeMediaType(state.filters.type));
  $('#add-button').addEventListener('click', () => { if (requireAdmin()) openForm(); });
  $('#mobile-add-button').addEventListener('click', () => { if (requireAdmin()) openForm(); });
  $('#refresh-button').addEventListener('click', () => refreshData(true));
  $('#close-drawer').addEventListener('click', closeDrawer);
  $('#drawer-backdrop').addEventListener('click', closeDrawer);
  $$('[data-view]').forEach((item) => item.addEventListener('click', (event) => { event.preventDefault(); setView(item.dataset.view); }));
  window.addEventListener('popstate', () => setView(window.location.pathname === '/settings' ? 'settings' : 'library', { syncUrl: false }));
  $$('.mode-button').forEach((button) => button.addEventListener('click', () => { $$('.mode-button').forEach((entry) => entry.classList.remove('active')); button.classList.add('active'); }));
  $('#test-connection').addEventListener('click', testConnection);
  $('#save-settings').addEventListener('click', saveSettings);
  $('#logout-button').addEventListener('click', logout);
  document.addEventListener('keydown', (event) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); $('#search-input').focus(); } if (event.key === 'Escape' && !$('#drawer-backdrop').hidden) closeDrawer(); });
  setView(window.location.pathname === '/settings' ? 'settings' : 'library', { syncUrl: false });
  initGoogleLogin();
  refreshAuth().finally(() => refreshData(false));
}

init();
