const { SlashCommandBuilder } = require('discord.js');
const { errorEmbed, successEmbed } = require('../../utils/embeds');
const { hasDJPermission } = require('../../utils/permissions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('🔊 Set the playback volume')
    .addIntegerOption(opt =>
      opt.setName('level')
        .setDescription('Volume level (1–150)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(150)
    ),

  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction.guildId);
    if (!queue) return interaction.reply({ embeds: [errorEmbed('Nothing is playing!')], ephemeral: true });
    if (!hasDJPermission(interaction.member, interaction.member.voice.channel)) {
      return interaction.reply({ embeds: [errorEmbed('You need the **DJ** role!')], ephemeral: true });
    }

    const level = interaction.options.getInteger('level');
    queue.setVolume(level);
    const emoji = level === 0 ? '🔇' : level < 50 ? '🔈' : level < 100 ? '🔉' : '🔊';
    await interaction.reply({ embeds: [successEmbed(`${emoji} Volume set to **${level}%**`)] });
  },
};
