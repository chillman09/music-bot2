const { SlashCommandBuilder } = require('discord.js');
const { errorEmbed, successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('loop')
    .setDescription('🔁 Set loop mode')
    .addStringOption(opt =>
      opt.setName('mode')
        .setDescription('Loop mode')
        .setRequired(true)
        .addChoices(
          { name: '➡️  Off', value: '0' },
          { name: '🔂  Current Song', value: '1' },
          { name: '🔁  Entire Queue', value: '2' },
        )
    ),

  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction.guildId);
    if (!queue) return interaction.reply({ embeds: [errorEmbed('Nothing is playing!')], ephemeral: true });

    const mode = parseInt(interaction.options.getString('mode'));
    queue.setRepeatMode(mode);

    const labels = ['➡️ Loop **off**', '🔂 Looping **current song**', '🔁 Looping **entire queue**'];
    await interaction.reply({ embeds: [successEmbed(labels[mode])] });
  },
};
