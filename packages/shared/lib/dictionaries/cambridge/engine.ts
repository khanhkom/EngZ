import type { DictionaryResult } from '../types.js';

const CAMBRIDGE_BASE_URL = 'https://dictionary.cambridge.org/dictionary/english';

const fetchCambridge = async (word: string): Promise<DictionaryResult> => {
  // Clean the word for URL
  const cleanWord = word.toLowerCase().trim().replace(/\s+/g, '-');

  try {
    const response = await fetch(`${CAMBRIDGE_BASE_URL}/${encodeURIComponent(cleanWord)}`, {
      method: 'GET',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Word not found in Cambridge Dictionary');
      }
      throw new Error(`Cambridge Dictionary failed: ${response.status}`);
    }

    const html = await response.text();

    // Parse the HTML to extract dictionary data
    // Using regex since we don't have cheerio in browser context
    const result = parseHtml(html, word);

    if (!result.definition && !result.pronunciation) {
      throw new Error('No definition found');
    }

    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Cambridge Dictionary failed: ${message}`);
  }
};

const parseHtml = (html: string, word: string): DictionaryResult => {
  // Extract pronunciation (IPA)
  const ipaMatch = html.match(/<span class="ipa[^"]*"[^>]*>([^<]+)<\/span>/);
  const pronunciation = ipaMatch ? `/${ipaMatch[1]}/` : undefined;

  // Extract definition
  const defMatch = html.match(/<div class="def ddef_d db"[^>]*>([^<]+(?:<[^>]+>[^<]*<\/[^>]+>)*[^<]*)<\/div>/);
  let definition = '';
  if (defMatch) {
    // Remove HTML tags from definition
    definition = defMatch[1].replace(/<[^>]+>/g, '').trim();
  }

  // Alternative definition pattern
  if (!definition) {
    const altDefMatch = html.match(/<span class="trans dtrans[^"]*"[^>]*>([^<]+)<\/span>/);
    if (altDefMatch) {
      definition = altDefMatch[1].trim();
    }
  }

  // Extract examples
  const examples: string[] = [];
  const exampleRegex = /<span class="eg deg"[^>]*>([^<]+)<\/span>/g;
  let match;
  while ((match = exampleRegex.exec(html)) !== null && examples.length < 3) {
    examples.push(match[1].trim());
  }

  // Alternative example pattern
  if (examples.length === 0) {
    const altExampleRegex = /<span class="eg dexamp[^"]*"[^>]*>([^<]+)<\/span>/g;
    while ((match = altExampleRegex.exec(html)) !== null && examples.length < 3) {
      examples.push(match[1].trim());
    }
  }

  return {
    word,
    pronunciation,
    definition: definition || undefined,
    examples: examples.length > 0 ? examples : undefined,
    source: 'cambridge',
  };
};

export { fetchCambridge };
