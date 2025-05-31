// Helper: get timestamp from MongoDB ObjectId
export function getTimestampFromObjectId(objectId) {
  if (!objectId) return 0;
  return parseInt(objectId.substring(0, 8), 16) * 1000;
}

export function paginate(arr, page, pageSize) {
  const start = page * pageSize;
  return arr.slice(start, start + pageSize);
}
