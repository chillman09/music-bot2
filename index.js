require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { DisTube } = require('distube');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const fs = require('fs');
const path = require('path');
const logger = require('./src/utils/logger');

// ─── Client Setup ────────────────────────────────────────────────────────────
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

// ─── DisTube Setup ───────────────────────────────────────────────────────────
client.distube = new DisTube(client, {
  plugins: [
    new YtDlpPlugin({ update: true }),
    new SpotifyPlugin(),
    new SoundCloudPlugin(),
  ],
  ffmpegPath: process.env.FFMPEG_PATH || 'ffmpeg',
  emitNewSongOnly: true,
  joinNewVoiceChannel: true,
  nsfw: false,
  emitAddSongWhenCreatingQueue: false,
  emitAddListWhenCreatingQueue: false,
});

// ─── Load Commands ───────────────────────────────────────────────────────────
const commandFolders = ['music', 'utility'];
for (const folder of commandFolders) {
  const cmdPath = path.join(__dirname, 'src', 'commands', folder);
  const files = fs.readdirSync(cmdPath).filter(f => f.endsWith('.js'));
  for (const file of files) {
    const command = require(path.join(cmdPath, file));
    if (command.data && command.execute) {
      client.commands.set(command.data.name, command);
      logger.info(`Loaded command: ${command.data.name}`);
    }
  }
}

// ─── Load Client Events ──────────────────────────────────────────────────────
const eventPath = path.join(__dirname, 'src', 'events');
const eventFiles = fs.readdirSync(eventPath).filter(f => f.endsWith('.js'));
for (const file of eventFiles) {
  const event = require(path.join(eventPath, file));
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

// ─── Load DisTube Events ─────────────────────────────────────────────────────
const disTubeEventPath = path.join(__dirname, 'src', 'events', 'distube');
const disTubeFiles = fs.readdirSync(disTubeEventPath).filter(f => f.endsWith('.js'));
for (const file of disTubeFiles) {
  const event = require(path.join(disTubeEventPath, file));
  client.distube.on(event.name, (...args) => event.execute(...args, client));
}

// ─── Login ───────────────────────────────────────────────────────────────────
client.login(process.env.BOT_TOKEN).catch(err => {
  logger.error(`Failed to login: ${err.message}`);
  process.exit(1);
});
