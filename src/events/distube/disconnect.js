const { EmbedBuilder } = require('discord.js');
const { COLORS } = require('../../utils/embeds');

module.exports = {
  name: 'disconnect',

  async execute(queue) {
    if (queue.textChannel) {
      const embed = new EmbedBuilder()
        .setColor(COLORS.warning)
        .setDescription('🔌 Disconnected from the voice channel.');
      await queue.textChannel.send({ embeds: [embed] }).catch(() => {});
    }
  },
};
