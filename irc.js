var irc = require('irc');

module.exports = function (opts) {
  opts = opts || {};
  opts.floodProtection = opts.floodProtection || true;
  return function (bot) {
    opts.nick = opts.nick || bot.name;
    var client;
    var re1 = RegExp('\\' + bot.commandPrefix + '(\\w+) *');
    var re2 = RegExp(opts.nick + '[:,?!]? (\\w+) *');
    var re3 = /(\w+) */;
    function commandCheck (to, text) {
      // ex: .ping
      if (re1.test(text)) return re1;
      // ex: botName: ping
      if (re2.test(text)) return re2;
      // ex: /msg botName ping
      if (to === opts.nick) return re3;
    }
    client = new irc.Client(opts.network, opts.nick, opts);
    client.on('message', function (nick, to, text, message) {
      var commandText, command, re = commandCheck(to, text);
      if (re) {
        commandText = text.replace(re, function (match, p1) {
          command = '.' + p1;
          return '';
        });
        // second argument here is our nice command object
        client.emit(command, {
          reply: function (replyText) {
            // if sent directly to then just reply directly to
            if (to === opts.nick) return client.say(nick, replyText);
            // otherwise say it in the channel and prepend the nick
            client.say(to, nick + ': ' + replyText);
          },
          text: commandText  // commandText is everything after the command
        });
      }
    });
    return client;
  }
};

