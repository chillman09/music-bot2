# 🎵 Discord Music Bot

A feature-rich Discord music bot with slash commands, audio filters, lyrics, DJ roles, interactive controls, and more — inspired by Hydra, Jockie Music, and Beatra.

---

## ✨ Features

| Category | Features |
|---|---|
| 🎵 **Playback** | YouTube, Spotify, SoundCloud, direct URLs |
| 📋 **Queue** | View, shuffle, loop, autoplay, clear, move, jump |
| 🎛️ **Audio Filters** | Bass boost, Nightcore, Vaporwave, 3D, Echo, Karaoke, 8D, Chorus, Reverb + more |
| 🎤 **Lyrics** | Real-time lyrics via Genius API |
| 🎚️ **Controls** | Play, Pause, Resume, Skip, Previous, Stop, Seek, Volume |
| 🕹️ **Interactive** | Button controls on Now Playing embed, search selector |
| 🎭 **DJ Role** | Restrict control commands to `DJ` role |
| ♾️ **24/7** | Auto-disconnect after 5 min idle |
| 📊 **Progress Bar** | Visual progress bar in Now Playing |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** — [Download](https://nodejs.org)
- **ffmpeg** — [Install guide](https://ffmpeg.org/download.html)
- **yt-dlp** — [Install guide](https://github.com/yt-dlp/yt-dlp#installation)
- A Discord Bot Token — [Discord Developer Portal](https://discord.com/developers/applications)

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/discord-music-bot.git
cd discord-music-bot
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and fill in your tokens:

```env
BOT_TOKEN=your_discord_bot_token
CLIENT_ID=your_bot_client_id
GENIUS_TOKEN=your_genius_token        # optional, for lyrics
SPOTIFY_CLIENT_ID=your_spotify_id     # optional, better Spotify support
SPOTIFY_CLIENT_SECRET=your_spotify_secret
```

### 3. Register Slash Commands

```bash
npm run deploy
```

### 4. Start the Bot

```bash
npm start
# or for development with auto-restart:
npm run dev
```

---

## 🔑 Getting Tokens

### Discord Bot Token
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click **New Application** → name it
3. Go to **Bot** tab → **Add Bot**
4. Copy the **Token** → paste in `.env` as `BOT_TOKEN`
5. Copy the **Application ID** → paste as `CLIENT_ID`
6. Enable **Message Content Intent** under Privileged Gateway Intents
7. **Invite the bot**: OAuth2 → URL Generator → Scopes: `bot`, `applications.commands` → Permissions: `Connect`, `Speak`, `Send Messages`, `Embed Links`, `Read Message History`

### Genius API Token (Lyrics)
1. Go to [genius.com/api-clients](https://genius.com/api-clients)
2. Create a new API client
3. Copy the **Client Access Token** → paste as `GENIUS_TOKEN`

### Spotify Credentials (Optional)
1. Go to [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
2. Create an app
3. Copy **Client ID** and **Client Secret**

---

## 📖 Commands

### 🎵 Playback
| Command | Description |
|---|---|
| `/play [query/url]` | Play a song, playlist, or URL |
| `/search [query]` | Search and pick from 5 results |
| `/pause` | Pause playback |
| `/resume` | Resume playback |
| `/skip [amount]` | Skip one or more songs |
| `/previous` | Go back to previous song |
| `/stop` | Stop and clear queue |
| `/disconnect` | Leave voice channel |

### 📋 Queue
| Command | Description |
|---|---|
| `/queue [page]` | View paginated queue |
| `/nowplaying` | Show current song + button controls |
| `/shuffle` | Shuffle the queue |
| `/loop [off/song/queue]` | Set loop mode |
| `/autoplay` | Toggle autoplay |
| `/clearqueue` | Clear queued songs |
| `/remove [position]` | Remove a song |
| `/move [from] [to]` | Move a song |
| `/jump [position]` | Jump to a position |

### 🎛️ Audio
| Command | Description |
|---|---|
| `/volume [1-150]` | Set volume |
| `/seek [time]` | Seek (e.g. `1:30` or `90`) |
| `/filter set [name]` | Apply a filter |
| `/filter clear` | Remove all filters |
| `/filter list` | View all filters |

**Available Filters:** `bassboost`, `bassboost_low`, `3d`, `echo`, `karaoke`, `nightcore`, `vaporwave`, `flanger`, `reverse`, `surround`, `chorus`, `treble`, `haas`, `gate`

### 🎤 Extras
| Command | Description |
|---|---|
| `/lyrics [song]` | Get lyrics (current or specified) |
| `/ping` | Check bot latency |
| `/help` | Show all commands |

---

## 🎭 DJ Role System

Create a role named **`DJ`** (exact name, case-insensitive) in your server to restrict control commands (skip, stop, volume, shuffle, etc.) to users with that role.

> **Note:** Server admins and anyone alone in a voice channel bypass the DJ role requirement.

---

## 🌐 Hosting Options

### Free: Railway
1. Push your code to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Add environment variables in Railway dashboard
4. Railway auto-deploys on every push ✅

### Free: Render
1. Push to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect repo → Build: `npm install` → Start: `npm start`
4. Add env vars

### VPS with PM2
```bash
npm install -g pm2
pm2 start index.js --name music-bot
pm2 save
pm2 startup
```

---

## 🔧 Troubleshooting

**Bot joins but no sound:**
- Make sure `ffmpeg` is installed and in your PATH: `ffmpeg -version`
- Make sure `yt-dlp` is installed: `yt-dlp --version`

**Slash commands not showing:**
- Run `npm run deploy` again
- Global commands can take up to 1 hour to propagate

**Spotify not working:**
- Spotify links resolve to search — direct streaming isn't possible without a Spotify Premium API key

---

## 📄 License

MIT — use freely, give credit if you like!
