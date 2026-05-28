require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const commands = [];
const commandFolders = ['music', 'utility'];

for (const folder of commandFolders) {
  const cmdPath = path.join(__dirname, 'commands', folder);
  const files = fs.readdirSync(cmdPath).filter(f => f.endsWith('.js'));
  for (const file of files) {
    const command = require(path.join(cmdPath, file));
    if (command.data) commands.push(command.data.toJSON());
  }
}

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

(async () => {
  try {
    console.log(`🔄 Refreshing ${commands.length} application slash commands...`);
    const data = await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log(`✅ Successfully registered ${data.length} slash commands globally!`);
  } catch (error) {
    console.error('❌ Error registering commands:', error);
  }
})();
