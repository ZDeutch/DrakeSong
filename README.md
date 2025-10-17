# Guess the Drake Song 🎵

A minimal browser game where you listen to short audio previews and guess the Drake song title.

## Features

- **Three Difficulty Levels**: Easy (7s), Medium (3s), Hard (1s)
- **Smart Fuzzy Matching**: Accepts close guesses with intelligent normalization
- **Autosuggest**: Real-time suggestions as you type
- **Streak Tracking**: Persistent streak counter in localStorage
- **Keyboard Shortcuts**: Space (play/pause), Enter (submit), Esc (clear)
- **Mobile Friendly**: Responsive design that works on all devices

## Quick Start

1. **Install Node.js** (if not already installed):
   ```bash
   # macOS with Homebrew
   brew install node
   
   # Or download from https://nodejs.org/
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Open your browser** to `http://localhost:5173`

## How to Play

1. **Select Difficulty**: Choose Easy (7s), Medium (3s), or Hard (1s)
2. **Listen**: Click the play button to hear the audio preview
3. **Guess**: Type the song title (autosuggest helps!)
4. **Submit**: Press Enter or click Submit
5. **See Results**: Get immediate feedback and track metadata
6. **Play Again**: Start a new round with a random song

## Technical Details

- **Built with**: Vite + React + TypeScript + Tailwind CSS
- **No Backend**: Everything runs client-side
- **Audio**: Uses Spotify 30s preview URLs (muted by default)
- **Storage**: Streak counter persisted in localStorage
- **Fuzzy Matching**: Levenshtein distance + token overlap algorithms

## Project Structure

```
src/
├── components/
│   ├── AudioClip.tsx      # Audio player with progress bar
│   └── GuessBox.tsx       # Input with autosuggest
├── data/
│   └── drake-fallback.json # Song metadata (10 tracks)
├── lib/
│   ├── fuzzy.ts           # Matching algorithms
│   ├── storage.ts         # localStorage utilities
│   └── tracks.ts          # Track management
├── App.tsx                # Main game component
├── main.tsx               # App bootstrap
└── index.css              # Tailwind styles
```

## Building for Production

```bash
npm run build
# or
pnpm build
```

The built files will be in the `dist/` directory.

## Customization

- **Add More Songs**: Edit `src/data/drake-fallback.json`
- **Adjust Difficulty**: Modify durations in `src/App.tsx`
- **Styling**: Update Tailwind classes or `src/index.css`

## Legal Notice

This game uses Spotify's 30-second preview URLs for educational purposes. All audio previews are provided by Spotify and are not cached or redistributed by this application.

---

Built with ❤️ for Drake fans everywhere.
