
const GSheetReader = require('g-sheets-api');
const ogs = require('open-graph-scraper-lite');
const fs = require('fs');
const path = require('path');

const options = {
  apiKey: 'AIzaSyAqDn2MItlUzWwLihcnahiI-Pnyxdk4wA8',
  sheetId: '14t8BJBUmkVv43BU71uP733i907PxTvkLShvSIbfrARU',
  sheetName: 'Sheet1'
};

function readSheet() {
  return new Promise((resolve, reject) => {
    GSheetReader(options, resolve, reject);
  });
}

// Identify YouTube video IDs from different YouTube URL formats.
function getYouTubeVideoId(url) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      return parsed.pathname.split('/')[1] || null;
    }

    if (
      ['youtube.com', 'm.youtube.com', 'youtube-nocookie.com'].includes(host)
    ) {
      if (parsed.pathname === '/watch') {
        return parsed.searchParams.get('v');
      }

      const match = parsed.pathname.match(
        /^\/(?:embed|shorts|live)\/([^/?]+)/
      );

      return match ? match[1] : null;
    }

    return null;
  } catch {
    return null;
  }
}

// Retrieve actual YouTube video information.
async function getYouTubeMetadata(url) {
  const videoId = getYouTubeVideoId(url);

  if (!videoId) {
    throw new Error('Could not identify YouTube video ID');
  }

  const response = await fetch(
    `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
    { signal: AbortSignal.timeout(20000) }
  );

  if (!response.ok) {
    throw new Error(`YouTube oEmbed returned HTTP ${response.status}`);
  }

  const data = await response.json();

  return {
    source: data.author_name || 'YouTube',
    title: data.title || url,
    description: `Video by ${data.author_name || 'YouTube creator'}`,
    image: data.thumbnail_url ||
      `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
  };
}

// Extract a readable title from a URL when a publisher blocks requests.
function titleFromUrl(url) {
  try {
    const parsed = new URL(url);

    const slug = parsed.pathname
      .split('/')
      .filter(Boolean)
      .pop();

    if (!slug) return parsed.hostname.replace(/^www\./, '');

    return decodeURIComponent(slug)
      .replace(/\.[a-z0-9]+$/i, '')
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  } catch {
    return url;
  }
}

// Retrieve metadata for each Google Sheets entry.
async function getMetadata(item) {
  const url = String(item.URL || '').trim();
  const pinned = String(item.Pinned || '').trim().toLowerCase() === 'y';

  if (!url) {
    return null;
  }

  const hostname = new URL(url).hostname.replace(/^www\./, '');

  try {
    // Special handling for YouTube videos.
    if (getYouTubeVideoId(url)) {
      const metadata = await getYouTubeMetadata(url);

      return {
        url,
        pinned,
        ...metadata
      };
    }

    // Standard metadata retrieval for other websites.
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TNE-Lab-MediaBot/1.0)'
      },
      signal: AbortSignal.timeout(20000)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    const { result } = await ogs({ html });

    // Try Open Graph metadata, then Twitter metadata.
    const image = Array.isArray(result.ogImage)
      ? result.ogImage[0]?.url
      : result.ogImage?.url;

    const twitterImage = Array.isArray(result.twitterImage)
      ? result.twitterImage[0]?.url
      : result.twitterImage?.url;

    // Use the HTML title as an additional fallback.
    const htmlTitle = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]
      ?.replace(/<[^>]*>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim();

    return {
      url,
      pinned,
      source: result.ogSiteName || hostname,
      title: result.ogTitle || result.twitterTitle || htmlTitle || titleFromUrl(url),
      description: result.ogDescription || result.twitterDescription || '',
      image: image || twitterImage || ''
    };

  } catch (error) {
    console.error(`Could not fetch ${url}: ${error.message}`);

    // Keep the link usable and show a readable title even if blocked.
    const videoId = getYouTubeVideoId(url);

    return {
      url,
      pinned,
      source: videoId ? 'YouTube' : hostname,
      title: videoId ? 'YouTube video' : titleFromUrl(url),
      description: '',
      image: videoId
        ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
        : ''
    };
  }
}

async function main() {
  if (!options.apiKey) {
    throw new Error('Missing GSHEETS_API_KEY environment variable');
  }

  const rows = await readSheet();
  const results = await Promise.all(rows.map(getMetadata));

  // Remove empty rows and keep pinned entries at the top.
  const media = results
    .filter(Boolean)
    .sort((a, b) => Number(b.pinned) - Number(a.pinned));

  fs.writeFileSync(
    path.join(__dirname, 'media.json'),
    JSON.stringify(media, null, 2) + '\n'
  );

  console.log(`Generated media.json with ${media.length} entries.`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
