var createChannel = require('./createChannel')

module.exports = function (channelName, cb) {
  createChannel(channelName, function(channel) {
    ch.consume('bytebay-' + channelName, function(msg) {
      console.log(" [x] Received %s", msg.content.toString());
      cb(msg.content.toString())
    }, {noAck: true});
  })
}
