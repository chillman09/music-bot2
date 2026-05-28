const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const { errorEmbed, queueEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('📋 View the current music queue')
    .addIntegerOption(opt =>
      opt.setName('page').setDescription('Page number').setMinValue(1)
    ),

  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction.guildId);
    if (!queue?.songs?.length) {
      return interaction.reply({ embeds: [errorEmbed('The queue is empty!')], ephemeral: true });
    }

    let page = interaction.options.getInteger('page') || 1;
    const totalPages = Math.ceil((queue.songs.length - 1) / 10) || 1;
    page = Math.min(page, totalPages);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('q_prev').setEmoji('◀️').setStyle(ButtonStyle.Secondary).setDisabled(page <= 1),
      new ButtonBuilder().setCustomId('q_next').setEmoji('▶️').setStyle(ButtonStyle.Secondary).setDisabled(page >= totalPages),
    );

    const msg = await interaction.reply({
      embeds: [queueEmbed(queue, page)],
      components: totalPages > 1 ? [row] : [],
      fetchReply: true,
    });

    if (totalPages <= 1) return;

    const collector = msg.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 60_000,
      filter: b => b.user.id === interaction.user.id,
    });

    collector.on('collect', async btn => {
      const q = client.distube.getQueue(interaction.guildId);
      if (!q) return btn.update({ components: [] });

      if (btn.customId === 'q_prev') page = Math.max(1, page - 1);
      if (btn.customId === 'q_next') page = Math.min(totalPages, page + 1);

      const updatedRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('q_prev').setEmoji('◀️').setStyle(ButtonStyle.Secondary).setDisabled(page <= 1),
        new ButtonBuilder().setCustomId('q_next').setEmoji('▶️').setStyle(ButtonStyle.Secondary).setDisabled(page >= totalPages),
      );

      await btn.update({ embeds: [queueEmbed(q, page)], components: [updatedRow] });
    });

    collector.on('end', () => msg.edit({ components: [] }).catch(() => {}));
  },
};
