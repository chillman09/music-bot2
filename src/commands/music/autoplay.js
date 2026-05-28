const { SlashCommandBuilder } = require('discord.js');
const { errorEmbed, successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('autoplay')
    .setDescription('🎲 Toggle autoplay (plays related songs when queue ends)'),

  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction.guildId);
    if (!queue) return interaction.reply({ embeds: [errorEmbed('Nothing is playing!')], ephemeral: true });

    const state = queue.toggleAutoplay();
    await interaction.reply({ embeds: [successEmbed(`🎲 Autoplay is now **${state ? 'ON' : 'OFF'}**`)] });
  },
};
