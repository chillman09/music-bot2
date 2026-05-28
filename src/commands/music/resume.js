const { SlashCommandBuilder } = require('discord.js');
const { errorEmbed, successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('▶️ Resume the paused song'),

  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction.guildId);
    if (!queue) return interaction.reply({ embeds: [errorEmbed('Nothing is playing!')], ephemeral: true });
    if (!queue.paused) return interaction.reply({ embeds: [errorEmbed('Music is already playing!')], ephemeral: true });
    queue.resume();
    await interaction.reply({ embeds: [successEmbed('▶️ Resumed the music.')] });
  },
};
