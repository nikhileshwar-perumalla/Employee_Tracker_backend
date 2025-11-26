export function parsePagination(query) {
  const page = Math.max(1, parseInt(query.page || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || '10', 10)));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function parseSort(sortParam, defaultSort = '-createdAt') {
  if (!sortParam) return defaultSort;
  // Support comma-separated fields, leading - for desc
  return sortParam
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .join(' ');
}

export function buildSearchFilter(query, fields) {
  const search = (query.search || '').trim();
  if (!search) return {};
  const regex = new RegExp(escapeRegex(search), 'i');
  return { $or: fields.map(f => ({ [f]: regex })) };
}

function escapeRegex(str) {
  // Escape special regex characters
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
