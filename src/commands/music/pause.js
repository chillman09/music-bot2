const { SlashCommandBuilder } = require('discord.js');
const { errorEmbed, successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('⏸️ Pause the current song'),

  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction.guildId);
    if (!queue) return interaction.reply({ embeds: [errorEmbed('Nothing is playing!')], ephemeral: true });
    if (queue.paused) return interaction.reply({ embeds: [errorEmbed('Already paused! Use `/resume`.')], ephemeral: true });
    queue.pause();
    await interaction.reply({ embeds: [successEmbed('⏸️ Paused the music.')] });
  },
};
