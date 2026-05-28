const { SlashCommandBuilder } = require('discord.js');
const { errorEmbed, successEmbed } = require('../../utils/embeds');
const { hasDJPermission } = require('../../utils/permissions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clearqueue')
    .setDescription('🗑️ Clear all songs from the queue (keeps current song)'),

  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction.guildId);
    if (!queue || queue.songs.length < 2) {
      return interaction.reply({ embeds: [errorEmbed('The queue is already empty!')], ephemeral: true });
    }
    if (!hasDJPermission(interaction.member, interaction.member.voice.channel)) {
      return interaction.reply({ embeds: [errorEmbed('You need the **DJ** role!')], ephemeral: true });
    }

    const count = queue.songs.length - 1;
    queue.songs.splice(1);
    await interaction.reply({ embeds: [successEmbed(`🗑️ Cleared **${count}** song(s) from the queue.`)] });
  },
};
