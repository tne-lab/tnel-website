
const GSheetReader = require('g-sheets-api');
const ogs = require('open-graph-scraper-lite');
const fs = require('fs');
const path = require('path');

const options = {
  apiKey: process.env.GSHEETS_API_KEY,
  sheetId: '14t8BJBUmkVv43BU71uP733i907PxTvkLShvSIbfrARU',
  sheetName: 'Sheet1'
};

function readSheet() {
  return new Promise((resolve, reject) => {
    GSheetReader(options, resolve, reject);
  });
}

async function getMetadata(item) {
  try {
    const response = await fetch(item.URL, {
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

    const image = Array.isArray(result.ogImage)
      ? result.ogImage[0]?.url
      : result.ogImage?.url;

    return {
      url: item.URL,
      pinned: String(item.Pinned || '').trim().toLowerCase() === 'y',
      source: result.ogSiteName || new URL(item.URL).hostname,
      title: result.ogTitle || item.URL,
      description: result.ogDescription || '',
      image: image || ''
    };
  } catch (error) {
    console.error(`Could not fetch ${item.URL}: ${error.message}`);

    // Keep the link visible even if a publisher blocks metadata retrieval.
    return {
      url: item.URL,
      pinned: String(item.Pinned || '').trim().toLowerCase() === 'y',
      source: new URL(item.URL).hostname,
      title: item.URL,
      description: '',
      image: ''
    };
  }
}

async function main() {
  if (!options.apiKey) {
    throw new Error('Missing GSHEETS_API_KEY environment variable');
  }

  const rows = await readSheet();
  const media = await Promise.all(rows.map(getMetadata));

  media.sort((a, b) => Number(b.pinned) - Number(a.pinned));

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
