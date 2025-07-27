import { franc } from 'franc'

// Mapping of ISO 639-3 to ISO 639-1 codes
const langCodeMap = {
  tgl: 'en',
  arb: 'ar',
  // Add more mappings as needed
};

export function detectLanguage(text) {
  const langCode = franc(text);

  if (langCode === 'und') return 'Unknown';

  // Return the ISO 639-1 code if it exists in the map, otherwise return the original ISO 639-3 code
  return langCodeMap[langCode] || "en";
}

export async function translateText(text, targetLang = 'ar') {
  const url = `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=auto&tl=${targetLang}&q=${encodeURIComponent(text)}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Translation failed: ${response.status}`);
  }

  const data = await response.json();

  return data[0][0]
}
