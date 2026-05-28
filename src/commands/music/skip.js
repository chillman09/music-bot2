// ─── skip.js ─────────────────────────────────────────────────────────────────
const { SlashCommandBuilder } = require('discord.js');
const { errorEmbed, successEmbed } = require('../../utils/embeds');
const { hasDJPermission } = require('../../utils/permissions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('⏭️ Skip the current song')
    .addIntegerOption(opt =>
      opt.setName('amount').setDescription('Number of songs to skip').setMinValue(1)
    ),

  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction.guildId);
    if (!queue) return interaction.reply({ embeds: [errorEmbed('Nothing is playing!')], ephemeral: true });
    if (!hasDJPermission(interaction.member, interaction.member.voice.channel)) {
      return interaction.reply({ embeds: [errorEmbed('You need the **DJ** role to use this!')], ephemeral: true });
    }

    const amount = interaction.options.getInteger('amount') || 1;
    const song = queue.songs[0];

    try {
      if (amount > 1) {
        queue.songs.splice(1, amount - 1);
      }
      await queue.skip();
      await interaction.reply({ embeds: [successEmbed(`Skipped **${song.name}**${amount > 1 ? ` and ${amount - 1} more` : ''}`)] });
    } catch (err) {
      await interaction.reply({ embeds: [errorEmbed(err.message)], ephemeral: true });
    }
  },
};
