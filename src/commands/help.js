const setStatus = require("../core/status");
const botSend = require("../core/send");
const auth = require("../core/auth");

// ------------------------
// Bot Help / Command List
// ------------------------

module.exports = function(data)
{
   setStatus(data.bot, "startTyping", data.message.channel, data.canWrite);

   data.color = "info";

   //
   // Detect if help is needed for specific command
   //

   var getHelpWith = "basics";

   if (data.cmd.params)
   {
      const cleanParam = data.cmd.params.toLocaleLowerCase().trim();
      getHelpWith = cleanParam;
   }

   data.text = helpMessage(data.config, data.bot.username, getHelpWith);

   return botSend(data);
};

// ------------------------
// Help Section
// ------------------------

const helpSection = function(data)
{
   var section =
      `${data.icon}  **[${data.title}](${data.link})**\n\n`
      //`\`${data.config.translateCmd} help ${data.help}\`\n\n`
      //"\n```cpp\n" +
      //`Command: "` +
      //`${data.config.translateCmd} ${data.cmd} ${data.args}"\n\n` +
      //`Example: "` +
      //`${data.config.translateCmd} ${data.cmd} ${data.example}"\n` +
      //`Help: "` +
      //`${data.config.translateCmd} help ${data.help}"` +
      //"\n```\n"
   ;

   return section;
};

// ------------------------
// Help Text
// ------------------------

const helpMessage = function(config, botname, param)
{
   //
   // Bot Info
   //

   const info =
   `**${botname} Bot - v.${config.version}**\n` +
   `Translates Discord messages (based on \`Google API\`).\n\n`;

   var donation = "";

   if (auth.donation.length > 5)
   {
      donation =
         "Like this bot? [Support the developer!](" + auth.donation + ")";
   }

   //
   // Help Basics
   //

   const basics =
   helpSection({
      config: config,
      title: "Translate by Reacting `new`",
      link: "https://git.io/vb7IH",
      icon: ":flag_white:",
      cmd: null,
      help: "react",
      args: null,
      example: null
   }) +
   helpSection({
      config: config,
      title: "Translate Custom Text",
      link: "https://git.io/vbSLB",
      icon: ":abc:",
      cmd: "this",
      help: "custom",
      args: "to [lang] from [lang]: [msg]",
      example: "to french from english: hello"
   }) +
   helpSection({
      config: config,
      title: "Translate Last Message",
      link: "https://git.io/vbSgl",
      icon: ":arrow_double_up:",
      cmd: "last",
      help: "last",
      args: "[count] from [lang] to [lang]",
      example: "3 from german to spanish"
   }) +
   helpSection({
      config: config,
      title: "Translate Channel (Automatic)",
      link: "https://git.io/vbSgB",
      icon: ":hash:",
      cmd: "channel",
      help: "auto",
      args: "from [lang] to [lang] for [@/#]",
      example: "from hebrew to arabic for me"
   }) +
   helpSection({
      config: config,
      title: "Stats",
      link: "https://git.io/vbSg0",
      icon: ":bar_chart:",
      cmd: "stats",
      help: "misc",
      args: "stats [server/global]",
      example: ""
   }) +
   helpSection({
      config: config,
      title: "Settings",
      link: "https://git.io/vbSga",
      icon: ":gear:",
      cmd: "settings",
      help: "settings",
      args: "setLang to [lang]",
      example: "setLang to italian"
   }) +
   helpSection({
      config: config,
      title: "Report Bugs / Request Features",
      link: config.botServer,
      icon: ":raising_hand::skin-tone-3:"
   }) +
   donation;

   //
   // Last Message (last)
   //

   const last =
   `__**Translate Last Message(s)**__\n\n` +
   `Translates last message chain(s) in channel. A chain is a collection of ` +
   `messages by the same author, to keep things simple.\n` +
   "```md\n" +

   `# Command\n` +
   `> ${config.translateCmd} last \n` +
   `> ${config.translateCmd} last [n] to [lang] from [lang] \n\n` +

   `# Parameters\n` +
   `> to [lang] - defaults to server default language\n` +
   `> to [lang, lang, ...] - translates to multiple languages\n` +
   `> from [lang] - defaults to automatic detection\n` +
   `> [n] - number of chains to translate, default is 1\n` +
   `> [-n] - negative number means only one chain is translated\n\n` +

   `# Examples\n` +
   `* ${config.translateCmd} last 2 \n` +
   `* ${config.translateCmd} last to english \n` +
   `* ${config.translateCmd} last to english, german, french \n` +
   `* ${config.translateCmd} last -6 to english from german` +
   "```";

   //
   // Flag Emoji Reaction
   //

   const react =
   `__**Translate by reaction**__\n\n` +
   `Translates a message in the server when you react to it with a ` +
   `flag emoji. For example: :flag_ca:, :flag_it:, :flag_eg:, :flag_jp:`;

   //
   // Custom message (this)
   //

   const custom =
   `__**Translate Custom Message**__\n\n` +
   `Translates a custom message entered by user.\n` +
   "```md\n" +

   `# Command\n` +
   `> ${config.translateCmd} this: [msg] \n` +
   `> ${config.translateCmd} this to [lang] from [lang]: [msg] \n\n` +

   `# Parameters\n` +
   `> to [lang] - defaults to server default language\n` +
   `> to [lang, lang, ...] - translates to multiple languages\n` +
   `> from [lang] - defaults to automatic detection\n\n` +

   `# Examples\n` +
   `* ${config.translateCmd} this: bonjour \n` +
   `* ${config.translateCmd} this to spanish: hello world \n` +
   `* ${config.translateCmd} this to arabic, hebrew: I love you \n` +
   `* ${config.translateCmd} this to de from en: how are you? \n` +
   "```";

   //
   // Auto translate (channel)
   //

   const auto =
   `__**Auto Translate Channels/Users**__\n\n` +
   `Automatically translates any new messages in channel and forwards them ` +
   `to you. Admins/mods can set forwarding to other channels or users in ` +
   `server. Messages in forwarded channels will also be sent back to origin*.` +
   "```md\n" +

   `# Command\n` +
   `> ${config.translateCmd} channel \n` +
   `> ${config.translateCmd} channel to [lang] from [lang] for [me/@/#] \n` +
   `> ${config.translateCmd} stop for [me/@/#] \n\n` +

   `# Parameters\n` +
   `> to [lang] - defaults to server default language\n` +
   `> from [lang] -  language to translate from \n` +
   `> for [me/@/#] - defaults to "me", admins can use mentions \n\n` +

   `# Examples\n` +
   `* ${config.translateCmd} channel to english from chinese \n` +
   `* ${config.translateCmd} channel to en from de for #englishChannel \n` +
   `* ${config.translateCmd} channel to de from en for @steve \n` +
   `* ${config.translateCmd} channel to en from ru for #ch1, #ch2, #usr1 \n` +
   "```" +
   "\n* Translated messages that are forwarded to users include a special id " +
   "for replying. Simply copy the code and paste into DM window before your " +
   "message to send a response, example: `XX123: your message here`.";

   //
   // Auto translate (stop)
   //

   const stop =
   `__**Stop Auto Translation**__\n\n` +
   `Terminates auto-translation of channel for you. ` +
   `Admins/mods can stop for other channels or users in server.` +
   "```md\n" +

   `# Command\n` +
   `> ${config.translateCmd} stop \n` +
   `> ${config.translateCmd} stop for [me/@/#/all] \n\n` +

   `# Parameters\n` +
   `> for [me/@/#/all] - defaults to "me" \n\n` +

   `# Examples\n` +
   `* ${config.translateCmd} stop \n` +
   `* ${config.translateCmd} stop for me \n` +
   `* ${config.translateCmd} stop for @usr1 \n` +
   `* ${config.translateCmd} stop for #ch1 \n` +
   `* ${config.translateCmd} stop for all \n` +
   "```";

   //
   // Misc
   //

   const misc =
   `__**Miscellaneous Commands**__\n\n` +
   "```md\n" +

   `# Help\n` +
   `> ${config.translateCmd} help\n` +
   `> ${config.translateCmd} help [command]\n\n` +

   `# Statistics\n` +
   `> ${config.translateCmd} version \n` +
   `> ${config.translateCmd} stats \n` +
   `> ${config.translateCmd} stats global \n` +
   `> ${config.translateCmd} stats server \n\n` +

   `# Supported Languages\n` +
   `> ${config.translateCmd} list\n` +
   "```";

   //
   // Settings
   //

   const settings =
   `__**Settings**__\n\n` +
   `These commands are available only to admins in server channels.` +
   "```md\n" +

   `# Set default server language\n` +
   `> ${config.translateCmd} settings setLang to [lang]\n\n` +

   `# Disconnect bot from server\n` +
   `> ${config.translateCmd} settings disconnect \n` +
   "```";

   //
   // Proccess result
   //

   const paramMap =
   {
      "basics": info + basics,
      "custom": custom,
      "react": react,
      "last": last,
      "auto": auto,
      "stop": stop,
      "misc": misc,
      "settings": settings
   };

   if (paramMap.hasOwnProperty(param))
   {
      return paramMap[param];
   }

   return paramMap.basics;
};
