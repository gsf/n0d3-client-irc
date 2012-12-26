var irc = require('irc');

module.exports = function (opts) {
  var client = new irc.Client(opts.network, opts.nick, {
    channels: opts.channels
  });
  console.log(client);
  return client;
};
