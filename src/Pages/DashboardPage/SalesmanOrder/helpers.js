// Helper: get timestamp from MongoDB ObjectId
export function getTimestampFromObjectId(objectId) {
  if (!objectId) return 0;
  return parseInt(objectId.substring(0, 8), 16) * 1000;
}

export const toEnglishNumber = str =>
  (str || "")
    .toString()
    .replace(/[০-৯]/g, d => "০১২৩৪৫৬৭৮৯".indexOf(d))
    .replace("।", ".");

export const toBangla = n =>
  (n ?? "")
    .toString()
    .replace(/\d/g, d => "০১২৩৪৫৬৭৮৯"[d])
    .replace(/NaN/, "০");
