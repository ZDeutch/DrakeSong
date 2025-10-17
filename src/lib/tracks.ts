import drakeFallback from '../data/drake-fallback.json';

export interface Track {
  id: string;
  title: string;
  album: string;
  year: number;
  image: string;
  preview_url: string;
}

let tracksCache: Track[] | null = null;

/**
 * Load tracks from fallback data, filtering out those without preview_url
 */
export function loadTracks(): Track[] {
  if (tracksCache) {
    return tracksCache;
  }
  
  tracksCache = drakeFallback.filter(track => track.preview_url) as Track[];
  return tracksCache;
}

/**
 * Get a random track that has a preview_url
 */
export function getRandomTrack(): Track {
  const tracks = loadTracks();
  if (tracks.length === 0) {
    throw new Error('No tracks with preview URLs available');
  }
  
  const randomIndex = Math.floor(Math.random() * tracks.length);
  return tracks[randomIndex];
}

/**
 * Get all track titles for autosuggest
 */
export function getAllTrackTitles(): string[] {
  return loadTracks().map(track => track.title);
}
