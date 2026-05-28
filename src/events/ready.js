const { ActivityType } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
  name: 'ready',
  once: true,

  execute(client) {
    logger.success(`✅ Logged in as ${client.user.tag}`);
    logger.info(`📡 Serving ${client.guilds.cache.size} server(s)`);

    const activities = [
      { name: '/play [song]', type: ActivityType.Listening },
      { name: `${client.guilds.cache.size} servers 🎵`, type: ActivityType.Watching },
      { name: '/help for commands', type: ActivityType.Playing },
    ];

    let i = 0;
    const setActivity = () => {
      client.user.setActivity(activities[i].name, { type: activities[i].type });
      i = (i + 1) % activities.length;
    };

    setActivity();
    setInterval(setActivity, 15_000);
  },
};
