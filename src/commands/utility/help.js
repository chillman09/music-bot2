const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { COLORS } = require('../../utils/embeds');

const COMMANDS = {
  '🎵 Playback': [
    { cmd: '/play [query]', desc: 'Play a song or playlist' },
    { cmd: '/search [query]', desc: 'Search and pick from results' },
    { cmd: '/pause', desc: 'Pause the current song' },
    { cmd: '/resume', desc: 'Resume paused music' },
    { cmd: '/skip [amount]', desc: 'Skip one or more songs' },
    { cmd: '/previous', desc: 'Play the previous song' },
    { cmd: '/stop', desc: 'Stop and clear queue' },
    { cmd: '/disconnect', desc: 'Leave the voice channel' },
  ],
  '📋 Queue': [
    { cmd: '/queue [page]', desc: 'View the queue' },
    { cmd: '/nowplaying', desc: 'Current song + controls' },
    { cmd: '/shuffle', desc: 'Shuffle the queue' },
    { cmd: '/loop [off/song/queue]', desc: 'Set loop mode' },
    { cmd: '/autoplay', desc: 'Toggle autoplay' },
    { cmd: '/clearqueue', desc: 'Clear all queued songs' },
    { cmd: '/remove [pos]', desc: 'Remove a song by position' },
    { cmd: '/move [from] [to]', desc: 'Reorder songs in queue' },
    { cmd: '/jump [pos]', desc: 'Skip to a position in queue' },
  ],
  '🎛️ Audio': [
    { cmd: '/volume [1-150]', desc: 'Set the volume' },
    { cmd: '/seek [time]', desc: 'Seek to a timestamp' },
    { cmd: '/filter set [name]', desc: 'Apply an audio filter' },
    { cmd: '/filter clear', desc: 'Remove all filters' },
    { cmd: '/filter list', desc: 'View all available filters' },
  ],
  '🎤 Extras': [
    { cmd: '/lyrics [song]', desc: 'Get song lyrics' },
    { cmd: '/ping', desc: 'Check bot latency' },
  ],
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('📖 Show all available commands'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(COLORS.primary)
      .setTitle('🎵 Music Bot — Command List')
      .setDescription('Supports **YouTube**, **Spotify**, **SoundCloud** and direct URLs.\nCreate a role named `DJ` to restrict control commands.')
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .setFooter({ text: `Requested by ${interaction.user.tag}` })
      .setTimestamp();

    for (const [category, cmds] of Object.entries(COMMANDS)) {
      embed.addFields({
        name: category,
        value: cmds.map(c => `\`${c.cmd}\` — ${c.desc}`).join('\n'),
      });
    }

    await interaction.reply({ embeds: [embed] });
  },
};
