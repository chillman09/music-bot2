const { addListEmbed } = require('../../utils/embeds');

module.exports = {
  name: 'addList',

  async execute(queue, playlist) {
    const embed = addListEmbed(queue, playlist.songs, playlist.name);
    if (queue.textChannel) {
      await queue.textChannel.send({ embeds: [embed] }).catch(() => {});
    }
  },
};
