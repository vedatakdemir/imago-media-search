export function mapDb(value) {
    const dbMap = { stock: "st", sport: "sp" };
    return dbMap[value] || "st";
  }
  
  export function padMediaId(id) {
    return (id || "").padStart(10, "0");
  }
  
  export function generateImageUrl(db, mediaId) {
    const dbShort = mapDb(db);
    const paddedId = padMediaId(mediaId);
    return `https://www.imago-images.de/bild/${dbShort}/${paddedId}/s.jpg`;
  }
  