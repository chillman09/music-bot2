const { SlashCommandBuilder } = require('discord.js');
const { errorEmbed, successEmbed } = require('../../utils/embeds');
const { hasDJPermission } = require('../../utils/permissions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shuffle')
    .setDescription('🔀 Shuffle the queue'),

  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction.guildId);
    if (!queue || queue.songs.length < 2) {
      return interaction.reply({ embeds: [errorEmbed('Not enough songs in the queue to shuffle!')], ephemeral: true });
    }
    if (!hasDJPermission(interaction.member, interaction.member.voice.channel)) {
      return interaction.reply({ embeds: [errorEmbed('You need the **DJ** role!')], ephemeral: true });
    }
    await queue.shuffle();
    await interaction.reply({ embeds: [successEmbed(`🔀 Shuffled **${queue.songs.length - 1}** songs in the queue!`)] });
  },
};
