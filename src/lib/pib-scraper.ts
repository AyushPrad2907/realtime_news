const imageCache = new Map<string, string>();

export async function getPibArticleImage(prid: string): Promise<string> {
  if (imageCache.has(prid)) {
    return imageCache.get(prid)!;
  }
  try {
    const url = `https://pib.gov.in/PressReleaseIframePage.aspx?PRID=${prid}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      next: { revalidate: 3600 }, // Cache scraper page fetch for 1 hour
    });
    if (!res.ok) return "";
    const buffer = await res.arrayBuffer();
    const html = new TextDecoder("utf-8").decode(buffer);
    
    // Match both relative and absolute image paths on the official site
    const imgRegex = /(?:https:\/\/static\.pib\.gov\.in)?\/?WriteReadData\/(?:userfiles\/image|specificdocs\/photo)\/[^\s"'>]+/i;
    const imgMatch = html.match(imgRegex);
    if (imgMatch) {
      let imgUrl = imgMatch[0];
      if (!imgUrl.startsWith("http")) {
        if (imgUrl.startsWith("/")) imgUrl = imgUrl.substring(1);
        imgUrl = `https://static.pib.gov.in/${imgUrl}`;
      }
      if (imageCache.size >= 500) {
        const firstKey = imageCache.keys().next().value;
        if (firstKey !== undefined) {
          imageCache.delete(firstKey);
        }
      }
      imageCache.set(prid, imgUrl);
      return imgUrl;
    }
  } catch (e) {
    console.error("Failed to scrape image for PRID", prid, e);
  }
  return "";
}
