const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const { errorEmbed, nowPlayingEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('🎵 Show the currently playing song with controls'),

  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction.guildId);
    if (!queue?.songs?.length) {
      return interaction.reply({ embeds: [errorEmbed('Nothing is playing right now!')], ephemeral: true });
    }

    const song = queue.songs[0];

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('np_previous').setEmoji('⏮️').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('np_pause').setEmoji(queue.paused ? '▶️' : '⏸️').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('np_skip').setEmoji('⏭️').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('np_stop').setEmoji('⏹️').setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId('np_loop').setEmoji('🔁').setStyle(ButtonStyle.Secondary),
    );

    const msg = await interaction.reply({
      embeds: [nowPlayingEmbed(song, queue)],
      components: [row],
      fetchReply: true,
    });

    // Auto-update the embed every 15s
    const interval = setInterval(async () => {
      const q = client.distube.getQueue(interaction.guildId);
      if (!q?.songs?.length) return clearInterval(interval);
      await msg.edit({ embeds: [nowPlayingEmbed(q.songs[0], q)], components: [row] }).catch(() => clearInterval(interval));
    }, 15_000);

    // Button interactions
    const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 120_000 });

    collector.on('collect', async btn => {
      if (btn.user.id !== interaction.user.id) {
        return btn.reply({ content: '🚫 These controls are for the person who ran this command.', ephemeral: true });
      }
      const q = client.distube.getQueue(interaction.guildId);
      if (!q) return btn.reply({ content: '❌ Nothing playing.', ephemeral: true });

      try {
        switch (btn.customId) {
          case 'np_pause':
            q.paused ? q.resume() : q.pause();
            break;
          case 'np_skip':
            await q.skip();
            break;
          case 'np_stop':
            await q.stop();
            clearInterval(interval);
            break;
          case 'np_previous':
            await q.previous();
            break;
          case 'np_loop':
            q.setRepeatMode((q.repeatMode + 1) % 3);
            break;
        }
      } catch {}

      const updatedQ = client.distube.getQueue(interaction.guildId);
      if (!updatedQ?.songs?.length) {
        await btn.update({ components: [] });
        return clearInterval(interval);
      }

      const updatedRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('np_previous').setEmoji('⏮️').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('np_pause').setEmoji(updatedQ.paused ? '▶️' : '⏸️').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId('np_skip').setEmoji('⏭️').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('np_stop').setEmoji('⏹️').setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId('np_loop').setEmoji('🔁').setStyle(ButtonStyle.Secondary),
      );

      await btn.update({ embeds: [nowPlayingEmbed(updatedQ.songs[0], updatedQ)], components: [updatedRow] });
    });

    collector.on('end', () => {
      clearInterval(interval);
      msg.edit({ components: [] }).catch(() => {});
    });
  },
};
