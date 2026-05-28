const { SlashCommandBuilder } = require('discord.js');
const { errorEmbed, successEmbed } = require('../../utils/embeds');
const { hasDJPermission } = require('../../utils/permissions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('jump')
    .setDescription('⏩ Jump to a specific song in the queue')
    .addIntegerOption(opt =>
      opt.setName('position').setDescription('Queue position to jump to').setRequired(true).setMinValue(1)
    ),

  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction.guildId);
    if (!queue || queue.songs.length < 2) {
      return interaction.reply({ embeds: [errorEmbed('Not enough songs in the queue!')], ephemeral: true });
    }
    if (!hasDJPermission(interaction.member, interaction.member.voice.channel)) {
      return interaction.reply({ embeds: [errorEmbed('You need the **DJ** role!')], ephemeral: true });
    }

    const pos = interaction.options.getInteger('position');
    if (pos >= queue.songs.length) {
      return interaction.reply({ embeds: [errorEmbed(`Invalid position! Queue has ${queue.songs.length - 1} upcoming songs.`)], ephemeral: true });
    }

    const song = queue.songs[pos];
    queue.songs.splice(1, pos - 1); // Remove songs before the target
    await queue.skip();
    await interaction.reply({ embeds: [successEmbed(`⏩ Jumped to **${song.name}**`)] });
  },
};
