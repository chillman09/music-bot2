const { SlashCommandBuilder } = require('discord.js');
const { errorEmbed, successEmbed } = require('../../utils/embeds');
const { hasDJPermission } = require('../../utils/permissions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('move')
    .setDescription('↕️ Move a song to a different position in the queue')
    .addIntegerOption(opt =>
      opt.setName('from').setDescription('Current position of the song').setRequired(true).setMinValue(1)
    )
    .addIntegerOption(opt =>
      opt.setName('to').setDescription('New position for the song').setRequired(true).setMinValue(1)
    ),

  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction.guildId);
    if (!queue || queue.songs.length < 3) {
      return interaction.reply({ embeds: [errorEmbed('Need at least 2 songs in queue to move!')], ephemeral: true });
    }
    if (!hasDJPermission(interaction.member, interaction.member.voice.channel)) {
      return interaction.reply({ embeds: [errorEmbed('You need the **DJ** role!')], ephemeral: true });
    }

    const from = interaction.options.getInteger('from');
    const to = interaction.options.getInteger('to');
    const max = queue.songs.length - 1;

    if (from > max || to > max) {
      return interaction.reply({ embeds: [errorEmbed(`Position out of range! Max is ${max}.`)], ephemeral: true });
    }
    if (from === to) {
      return interaction.reply({ embeds: [errorEmbed('From and To positions are the same!')], ephemeral: true });
    }

    const [song] = queue.songs.splice(from, 1);
    queue.songs.splice(to, 0, song);

    await interaction.reply({ embeds: [successEmbed(`↕️ Moved **${song.name}** from position ${from} to ${to}`)] });
  },
};
