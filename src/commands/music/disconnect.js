const { SlashCommandBuilder } = require('discord.js');
const { errorEmbed, successEmbed } = require('../../utils/embeds');
const { hasDJPermission } = require('../../utils/permissions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('disconnect')
    .setDescription('👋 Disconnect the bot from the voice channel'),

  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction.guildId);
    if (!hasDJPermission(interaction.member, interaction.member.voice.channel)) {
      return interaction.reply({ embeds: [errorEmbed('You need the **DJ** role!')], ephemeral: true });
    }

    if (queue) {
      await queue.stop();
    }

    const voiceState = interaction.guild.members.me.voice;
    if (voiceState.channel) {
      voiceState.disconnect();
    }

    await interaction.reply({ embeds: [successEmbed('👋 Disconnected from the voice channel.')] });
  },
};
