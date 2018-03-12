var createChannel = require('./createChannel')

module.exports = function (channelName, newMessage) {
  createChannel(channelName, function(channel) {
    channel.sendToQueue('bytebay-' + channelName, new Buffer(JSON.stringify(newMessage)));
  })
}
