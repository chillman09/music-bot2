const { errorEmbed } = require('../utils/embeds');
const logger = require('../utils/logger');

module.exports = {
  name: 'interactionCreate',

  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction, client);
    } catch (err) {
      logger.error(`Command ${interaction.commandName} failed: ${err.message}`);
      const errMsg = { embeds: [errorEmbed('An error occurred while running this command.')], ephemeral: true };

      if (interaction.deferred || interaction.replied) {
        await interaction.editReply(errMsg).catch(() => {});
      } else {
        await interaction.reply(errMsg).catch(() => {});
      }
    }
  },
};
