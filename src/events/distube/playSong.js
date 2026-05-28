const { nowPlayingEmbed } = require('../../utils/embeds');
const logger = require('../../utils/logger');

module.exports = {
  name: 'playSong',

  async execute(queue, song) {
    logger.music(`Now playing: ${song.name} in ${queue.voiceChannel.guild.name}`);

    const embed = nowPlayingEmbed(song, queue);

    // Send to the text channel associated with the queue
    if (queue.textChannel) {
      await queue.textChannel.send({ embeds: [embed] }).catch(() => {});
    }
  },
};
