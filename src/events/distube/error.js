const { errorEmbed } = require('../../utils/embeds');
const logger = require('../../utils/logger');

module.exports = {
  name: 'error',

  async execute(channel, error) {
    logger.error(`DisTube error: ${error.message}`);
    if (channel) {
      await channel.send({ embeds: [errorEmbed(`An error occurred: ${error.message}`)] }).catch(() => {});
    }
  },
};
