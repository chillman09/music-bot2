const { SlashCommandBuilder } = require('discord.js');
const { errorEmbed, successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('seek')
    .setDescription('⏩ Seek to a position in the current song')
    .addStringOption(opt =>
      opt.setName('time')
        .setDescription('Time to seek to (e.g. 1:30 or 90)')
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction.guildId);
    if (!queue) return interaction.reply({ embeds: [errorEmbed('Nothing is playing!')], ephemeral: true });

    const input = interaction.options.getString('time');
    let seconds = 0;

    if (input.includes(':')) {
      const parts = input.split(':').reverse();
      seconds = parts.reduce((acc, val, i) => acc + parseInt(val) * Math.pow(60, i), 0);
    } else {
      seconds = parseInt(input);
    }

    if (isNaN(seconds) || seconds < 0) {
      return interaction.reply({ embeds: [errorEmbed('Invalid time format! Use `1:30` or `90` (seconds).')], ephemeral: true });
    }

    const songDurationSec = Math.floor(queue.songs[0].duration / 1000);
    if (seconds > songDurationSec) {
      return interaction.reply({ embeds: [errorEmbed(`Cannot seek past the song duration (${songDurationSec}s)`)], ephemeral: true });
    }

    await queue.seek(seconds);
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    await interaction.reply({ embeds: [successEmbed(`⏩ Seeked to **${m}:${String(s).padStart(2, '0')}**`)] });
  },
};
