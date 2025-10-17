/**
 * Normalize a song title for comparison by:
 * - Converting to lowercase
 * - Trimming whitespace
 * - Removing punctuation
 * - Removing parenthetical content (feat., remix, etc.)
 */
export function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    // Remove parenthetical content like "(feat. Artist)", "- Remix", etc.
    .replace(/\([^)]*\)/g, '')
    .replace(/\s*-\s*(remix|feat\.|ft\.).*$/i, '')
    // Remove common punctuation
    .replace(/[.,;:!?'"()[\]{}]/g, '')
    // Replace multiple spaces with single space
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Simple Levenshtein distance calculation
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

/**
 * Calculate token overlap (Jaccard similarity) between two strings
 */
function tokenOverlap(str1: string, str2: string): number {
  const tokens1 = new Set(str1.split(/\s+/).filter(t => t.length > 0));
  const tokens2 = new Set(str2.split(/\s+/).filter(t => t.length > 0));
  
  const intersection = new Set([...tokens1].filter(x => tokens2.has(x)));
  const union = new Set([...tokens1, ...tokens2]);
  
  return intersection.size / union.size;
}

/**
 * Check if a guess matches the actual song title using fuzzy matching
 * Accepts if:
 * - Levenshtein distance <= 2, OR
 * - Token overlap >= 80%
 */
export function isMatch(guess: string, actual: string): boolean {
  const normalizedGuess = normalizeTitle(guess);
  const normalizedActual = normalizeTitle(actual);
  
  // Exact match after normalization
  if (normalizedGuess === normalizedActual) {
    return true;
  }
  
  // Check Levenshtein distance
  const distance = levenshteinDistance(normalizedGuess, normalizedActual);
  if (distance <= 2) {
    return true;
  }
  
  // Check token overlap
  const overlap = tokenOverlap(normalizedGuess, normalizedActual);
  if (overlap >= 0.8) {
    return true;
  }
  
  return false;
}
