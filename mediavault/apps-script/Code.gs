const API_VERSION = '0.2';
const ALLOWED_TYPES = ['影片', 'Podcast', '音樂', '直播', '文章／其他'];
const ALLOWED_STATUSES = ['待觀看', '觀看中', '已完成', '封存'];
const CONFIG = {
  spreadsheetId: PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID'),
  mediaSheet: 'Media',
  listsSheet: 'Lists'
};

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}

function meta_(requestId, httpStatus) {
  return { requestId: requestId || Utilities.getUuid(), version: API_VERSION, httpStatus: httpStatus || 200 };
}

function ok_(data, requestId) {
  return json_({ ok: true, data, error: null, meta: meta_(requestId, 200) });
}

function fail_(message, code, requestId, httpStatus) {
  return json_({ ok: false, data: null, error: { code: code || 'UNKNOWN', message }, meta: meta_(requestId, httpStatus || 500) });
}

function apiError_(message, code, httpStatus) {
  const error = new Error(message);
  error.code = code || 'SERVER_ERROR';
  error.httpStatus = httpStatus || 500;
  return error;
}

function doGet(e) {
  const requestId = Utilities.getUuid();
  const params = (e && e.parameter) || {};
  const action = String(params.action || 'list').toLowerCase();
  try {
    if (!CONFIG.spreadsheetId) throw apiError_('尚未設定 SPREADSHEET_ID。', 'CONFIG_MISSING', 500);
    if (action === 'meta') return ok_(getMeta_(), requestId);
    if (action !== 'list') throw apiError_('不支援的 GET action。', 'BAD_ACTION', 400);
    return ok_(listMedia_(params), requestId);
  } catch (error) {
    return fail_(error.message, error.code || 'SERVER_ERROR', requestId, error.httpStatus || 500);
  }
}

function doPost(e) {
  const requestId = Utilities.getUuid();
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (!CONFIG.spreadsheetId) throw apiError_('尚未設定 SPREADSHEET_ID。', 'CONFIG_MISSING', 500);
    if (body.action === 'create') return ok_(createMedia_(body.item), requestId);
    if (body.action === 'update') return ok_(updateMedia_(body.id, body.item), requestId);
    if (body.action === 'delete') return ok_(deleteMedia_(body.id), requestId);
    throw apiError_('不支援的 POST action。', 'BAD_ACTION', 400);
  } catch (error) {
    return fail_(error.message, error.code || 'SERVER_ERROR', requestId, error.httpStatus || 500);
  }
}

function getSheet_() {
  const sheet = SpreadsheetApp.openById(CONFIG.spreadsheetId).getSheetByName(CONFIG.mediaSheet);
  if (!sheet) throw apiError_('找不到 Media 工作表。', 'SHEET_MISSING', 500);
  return sheet;
}

function headers_() {
  return ['id', 'title', 'mediaType', 'sourceUrl', 'thumbnailUrl', 'category', 'tags', 'status', 'rating', 'notes', 'createdAt', 'updatedAt'];
}

function validateItem_(item) {
  if (!item || typeof item !== 'object') throw apiError_('資料格式錯誤。', 'BAD_REQUEST', 400);
  if (!String(item.title || '').trim()) throw apiError_('標題為必要欄位。', 'VALIDATION_ERROR', 400);
  if (!/^https?:\/\/\S+$/i.test(String(item.sourceUrl || '').trim())) throw apiError_('來源連結必須是合法的 HTTP(S) URL。', 'VALIDATION_ERROR', 400);
  if (ALLOWED_TYPES.indexOf(String(item.mediaType || '')) < 0) throw apiError_('影音類型不在允許清單中。', 'VALIDATION_ERROR', 400);
  if (ALLOWED_STATUSES.indexOf(String(item.status || '')) < 0) throw apiError_('觀看狀態不在允許清單中。', 'VALIDATION_ERROR', 400);
  const rating = item.rating === '' || item.rating === null || item.rating === undefined ? 0 : Number(item.rating);
  if (!Number.isFinite(rating) || rating < 0 || rating > 5 || Math.round(rating * 2) !== rating * 2) throw apiError_('評分必須是 0 至 5 的 0.5 倍數。', 'VALIDATION_ERROR', 400);
  return { ...item, title: String(item.title).trim(), sourceUrl: String(item.sourceUrl).trim(), rating };
}

function listMedia_(params) {
  const sheet = getSheet_();
  const rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return [];
  const headers = rows.shift().map(String);
  const items = rows.map(row => Object.fromEntries(headers.map((header, index) => [header, row[index]])));
  const query = String(params.q || '').trim().toLowerCase();
  const filtered = items.filter(item => {
    const haystack = [item.title, item.sourceUrl, item.category, item.tags, item.notes].join(' ').toLowerCase();
    return (!query || haystack.includes(query)) && (!params.status || item.status === params.status) && (!params.mediaType || item.mediaType === params.mediaType) && (!params.category || item.category === params.category);
  });
  const sort = String(params.sort || 'updated');
  filtered.sort((a, b) => {
    if (sort === 'rating') return Number(b.rating || 0) - Number(a.rating || 0);
    if (sort === 'title') return String(a.title || '').localeCompare(String(b.title || ''), 'zh-Hant');
    const field = sort === 'created' ? 'createdAt' : 'updatedAt';
    return new Date(b[field] || 0) - new Date(a[field] || 0);
  });
  return filtered;
}

function getMeta_() {
  const sheet = SpreadsheetApp.openById(CONFIG.spreadsheetId).getSheetByName(CONFIG.listsSheet);
  if (!sheet) return { categories: [], tags: [], statuses: ALLOWED_STATUSES, mediaTypes: ALLOWED_TYPES, version: API_VERSION };
  const rows = sheet.getDataRange().getValues();
  if (!rows.length) return { categories: [], tags: [], statuses: ALLOWED_STATUSES, mediaTypes: ALLOWED_TYPES, version: API_VERSION };
  const headers = rows.shift().map(String);
  const items = rows.map(row => Object.fromEntries(headers.map((header, index) => [header, row[index]])));
  return { categories: items.filter(item => item.kind === 'category' && item.active !== false).map(item => item.value), tags: items.filter(item => item.kind === 'tag' && item.active !== false).map(item => item.value), statuses: ALLOWED_STATUSES, mediaTypes: ALLOWED_TYPES, version: API_VERSION };
}

function createMedia_(item) {
  const safeItem = validateItem_(item);
  const now = new Date().toISOString();
  const next = { ...safeItem, id: Utilities.getUuid(), createdAt: now, updatedAt: now };
  getSheet_().appendRow(headers_().map(header => next[header] === undefined || next[header] === null ? '' : next[header]));
  return next;
}

function updateMedia_(id, item) {
  if (!id) throw apiError_('更新需要指定 id。', 'BAD_REQUEST', 400);
  const sheet = getSheet_();
  const values = sheet.getDataRange().getValues();
  const header = values.shift().map(String);
  const idIndex = header.indexOf('id');
  const rowIndex = values.findIndex(row => String(row[idIndex]) === String(id));
  if (rowIndex < 0) throw apiError_('找不到指定收藏。', 'NOT_FOUND', 404);
  const current = Object.fromEntries(header.map((key, index) => [key, values[rowIndex][index]]));
  const safeItem = validateItem_({ ...current, ...(item || {}) });
  const next = { ...current, ...safeItem, id: String(id), updatedAt: new Date().toISOString() };
  sheet.getRange(rowIndex + 2, 1, 1, header.length).setValues([header.map(key => next[key] === undefined || next[key] === null ? '' : next[key])]);
  return next;
}

function deleteMedia_(id) {
  if (!id) throw apiError_('刪除需要指定 id。', 'BAD_REQUEST', 400);
  const sheet = getSheet_();
  const values = sheet.getDataRange().getValues();
  const idIndex = values.shift().map(String).indexOf('id');
  const rowIndex = values.findIndex(row => String(row[idIndex]) === String(id));
  if (rowIndex < 0) throw apiError_('找不到指定收藏。', 'NOT_FOUND', 404);
  sheet.deleteRow(rowIndex + 2);
  return { id };
}
