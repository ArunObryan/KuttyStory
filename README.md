# KuttyStory

It's an interactive story telling website — romcom.

## Color Palette: White, Blue, Pink, Lavender

| Color        | Hex       |
|-------------|-----------|
| White       | `#FFFFFF` |
| Off White   | `#FAFBFC` |
| Soft Blue   | `#B8D4E8` |
| Deep Blue   | `#5B7FA3` |
| Soft Pink   | `#F5D5E0` |
| Pink        | `#E8B4C4` |
| Lavender    | `#E6E0F0` |

See `DESIGN_PALETTE.md` for full design system.

## Adding Your Content

1. **Images:** Place in `public/assets/images/` (e.g., `placeholder-1.jpg`, `video-poster.jpg`)
2. **Audio:** Place in `public/assets/audio/`
   - `Munbe_Vaa.mp3` — Background at top of page (20% volume)
   - `EnnaSollaPogirai.mp3` — Background at end of page (50% volume)
   - `song.mp3` — Chapter 2 song
   - *Free music:* [Kounine's CC0 tracks](https://bruno-simon.com/) (used in Bruno Simon's portfolio)
3. **Video:** Place in `public/assets/video/` (e.g., `moment.mp4`)

## Run Locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000

### npm scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production (output in `dist/`) |
| `npm run preview` | Preview production build locally |
| `npm test` | Run all Playwright tests |
| `npm run test:ui` | Interactive UI mode |
| `npm run test:headed` | See browser while testing |
| `npm run test:debug` | Debug mode |

## Testing

Full E2E test suite using Playwright covering:
- Page navigation & animations
- Audio/music controls
- Video popups
- Story cards carousel
- Form inputs
- Mobile responsiveness
- Accessibility

See [tests/README.md](tests/README.md) for detailed documentation.
