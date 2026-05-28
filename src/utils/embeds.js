const { EmbedBuilder } = require('discord.js');

// ─── Color Palette ────────────────────────────────────────────────────────────
const COLORS = {
  primary: 0x5865F2,   // Discord Blurple
  success: 0x57F287,   // Green
  warning: 0xFEE75C,   // Yellow
  error: 0xED4245,     // Red
  music: 0xFF73FA,     // Pink-Purple
  info: 0xEB459E,      // Hot Pink
};

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function createProgressBar(current, total, size = 18) {
  const progress = Math.round((current / total) * size);
  const bar = '▬'.repeat(progress) + '🔘' + '▬'.repeat(size - progress);
  const pct = Math.round((current / total) * 100);
  return { bar, pct };
}

// ─── Format Duration ──────────────────────────────────────────────────────────
function formatDuration(ms) {
  if (!ms || ms === Infinity) return '∞ LIVE';
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

// ─── Trim text ────────────────────────────────────────────────────────────────
function trim(str, max = 40) {
  return str.length > max ? str.substring(0, max - 3) + '...' : str;
}

// ─── Embeds ───────────────────────────────────────────────────────────────────

function nowPlayingEmbed(song, queue) {
  const { bar, pct } = createProgressBar(queue.currentTime * 1000, song.duration);
  const elapsed = formatDuration(queue.currentTime * 1000);
  const total = formatDuration(song.duration);

  const loopIcon = queue.repeatMode === 1 ? '🔂' : queue.repeatMode === 2 ? '🔁' : '➡️';
  const filterNames = queue.filters?.names?.join(', ') || 'None';

  return new EmbedBuilder()
    .setColor(COLORS.music)
    .setAuthor({ name: '🎵 Now Playing' })
    .setTitle(trim(song.name, 60))
    .setURL(song.url)
    .setThumbnail(song.thumbnail)
    .addFields(
      { name: '⏱️ Duration', value: `\`${elapsed} / ${total}\``, inline: true },
      { name: '📻 Source', value: `\`${song.uploader?.name || 'Unknown'}\``, inline: true },
      { name: '👤 Requested by', value: `${song.user}`, inline: true },
      { name: '🔊 Volume', value: `\`${queue.volume}%\``, inline: true },
      { name: `${loopIcon} Loop`, value: `\`${['Off', 'Song', 'Queue'][queue.repeatMode]}\``, inline: true },
      { name: '🎛️ Filters', value: `\`${filterNames}\``, inline: true },
      { name: '\u200B', value: `${bar}\n\`${pct}%\`` }
    )
    .setFooter({ text: `Queue: ${queue.songs.length} song(s) | Autoplay: ${queue.autoplay ? 'On' : 'Off'}` });
}

function addSongEmbed(song, position) {
  return new EmbedBuilder()
    .setColor(COLORS.success)
    .setAuthor({ name: '➕ Added to Queue' })
    .setTitle(trim(song.name, 60))
    .setURL(song.url)
    .setThumbnail(song.thumbnail)
    .addFields(
      { name: '⏱️ Duration', value: `\`${formatDuration(song.duration)}\``, inline: true },
      { name: '📍 Position', value: `\`#${position}\``, inline: true },
      { name: '👤 Requested by', value: `${song.user}`, inline: true }
    );
}

function addListEmbed(queue, songs, name) {
  return new EmbedBuilder()
    .setColor(COLORS.success)
    .setAuthor({ name: '📋 Playlist Added' })
    .setTitle(trim(name, 60))
    .addFields(
      { name: '🎵 Songs', value: `\`${songs.length}\``, inline: true },
      { name: '⏱️ Total Duration', value: `\`${formatDuration(songs.reduce((a, s) => a + s.duration, 0))}\``, inline: true }
    );
}

function queueEmbed(queue, page = 1) {
  const songsPerPage = 10;
  const totalPages = Math.ceil((queue.songs.length - 1) / songsPerPage) || 1;
  page = Math.min(page, totalPages);

  const songs = queue.songs
    .slice(1 + (page - 1) * songsPerPage, 1 + page * songsPerPage)
    .map((s, i) => {
      const num = (page - 1) * songsPerPage + i + 1;
      return `\`${num}.\` [${trim(s.name, 40)}](${s.url}) — \`${formatDuration(s.duration)}\` | ${s.user}`;
    })
    .join('\n');

  const totalDuration = formatDuration(queue.songs.reduce((a, s) => a + s.duration, 0));

  return new EmbedBuilder()
    .setColor(COLORS.primary)
    .setAuthor({ name: '📋 Queue' })
    .setTitle(`Now Playing: ${trim(queue.songs[0].name, 50)}`)
    .setURL(queue.songs[0].url)
    .setDescription(songs || '*No songs in queue*')
    .addFields(
      { name: '🎵 Total', value: `\`${queue.songs.length} songs\``, inline: true },
      { name: '⏱️ Duration', value: `\`${totalDuration}\``, inline: true },
      { name: '🔊 Volume', value: `\`${queue.volume}%\``, inline: true }
    )
    .setFooter({ text: `Page ${page}/${totalPages} • Loop: ${['Off', 'Song', 'Queue'][queue.repeatMode]}` });
}

function errorEmbed(msg) {
  return new EmbedBuilder()
    .setColor(COLORS.error)
    .setDescription(`❌ **${msg}**`);
}

function successEmbed(msg) {
  return new EmbedBuilder()
    .setColor(COLORS.success)
    .setDescription(`✅ ${msg}`);
}

function infoEmbed(title, desc) {
  return new EmbedBuilder()
    .setColor(COLORS.info)
    .setTitle(title)
    .setDescription(desc);
}

function lyricsEmbed(title, lyrics, source) {
  const maxLen = 4000;
  const content = lyrics.length > maxLen ? lyrics.substring(0, maxLen) + '\n...' : lyrics;
  return new EmbedBuilder()
    .setColor(COLORS.music)
    .setAuthor({ name: '🎤 Lyrics' })
    .setTitle(title)
    .setDescription(content)
    .setFooter({ text: `Source: ${source}` });
}

function searchEmbed(results) {
  const list = results.map((r, i) =>
    `\`${i + 1}.\` **${trim(r.name, 50)}** — \`${formatDuration(r.duration)}\` by ${r.uploader?.name || 'Unknown'}`
  ).join('\n');

  return new EmbedBuilder()
    .setColor(COLORS.primary)
    .setAuthor({ name: '🔍 Search Results' })
    .setDescription(list)
    .setFooter({ text: 'Reply with a number 1–5 to select, or "cancel" to abort' });
}

module.exports = {
  nowPlayingEmbed,
  addSongEmbed,
  addListEmbed,
  queueEmbed,
  errorEmbed,
  successEmbed,
  infoEmbed,
  lyricsEmbed,
  searchEmbed,
  formatDuration,
  COLORS,
};
