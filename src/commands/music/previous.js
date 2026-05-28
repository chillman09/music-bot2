const { SlashCommandBuilder } = require('discord.js');
const { errorEmbed, successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('previous')
    .setDescription('⏮️ Play the previous song'),

  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction.guildId);
    if (!queue) return interaction.reply({ embeds: [errorEmbed('Nothing is playing!')], ephemeral: true });

    try {
      await queue.previous();
      await interaction.reply({ embeds: [successEmbed('⏮️ Playing previous song!')] });
    } catch {
      await interaction.reply({ embeds: [errorEmbed('No previous song available!')], ephemeral: true });
    }
  },
};
