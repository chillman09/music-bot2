const { EmbedBuilder } = require('discord.js');
const { COLORS } = require('../../utils/embeds');

module.exports = {
  name: 'finish',

  async execute(queue) {
    if (queue.textChannel) {
      const embed = new EmbedBuilder()
        .setColor(COLORS.info)
        .setDescription('✅ Queue finished! Add more songs with `/play`.');
      await queue.textChannel.send({ embeds: [embed] }).catch(() => {});
    }

    // Auto-disconnect after 5 minutes of silence
    setTimeout(async () => {
      const currentQueue = queue.distube.getQueue(queue.id);
      if (!currentQueue || !currentQueue.songs.length) {
        try {
          await queue.voice.leave();
          if (queue.textChannel) {
            const embed = new EmbedBuilder()
              .setColor(0x808080)
              .setDescription('👋 Left the voice channel due to inactivity.');
            await queue.textChannel.send({ embeds: [embed] }).catch(() => {});
          }
        } catch {}
      }
    }, 5 * 60 * 1000);
  },
};
