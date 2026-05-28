const { addSongEmbed } = require('../../utils/embeds');

module.exports = {
  name: 'addSong',

  async execute(queue, song) {
    const position = queue.songs.indexOf(song);
    const embed = addSongEmbed(song, position);

    if (queue.textChannel) {
      await queue.textChannel.send({ embeds: [embed] }).catch(() => {});
    }
  },
};
