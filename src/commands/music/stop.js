const { SlashCommandBuilder } = require('discord.js');
const { errorEmbed, successEmbed } = require('../../utils/embeds');
const { hasDJPermission } = require('../../utils/permissions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('⏹️ Stop music and clear the queue'),

  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction.guildId);
    if (!queue) return interaction.reply({ embeds: [errorEmbed('Nothing is playing!')], ephemeral: true });
    if (!hasDJPermission(interaction.member, interaction.member.voice.channel)) {
      return interaction.reply({ embeds: [errorEmbed('You need the **DJ** role!')], ephemeral: true });
    }
    await queue.stop();
    await interaction.reply({ embeds: [successEmbed('⏹️ Stopped the music and cleared the queue.')] });
  },
};
