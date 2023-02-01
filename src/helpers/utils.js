function currentTime() { return new Date().getTime(); }

function hashCode(str) {
  let hash = 0, i, chr;
  const strLength = str.length;

  if (strLength === 0) return hash;
  for (i = 0; i < strLength; i++) {
    chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

export {
  currentTime,
  hashCode,
}