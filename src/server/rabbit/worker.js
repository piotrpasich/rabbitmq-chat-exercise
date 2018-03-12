import connect from './connect'
var Channel = require('../models/Channel');

module.exports = function (socket) {
  Channel.find({}, {name: 1, id: 1, _id: 0}, function (err, data) {
    if (err) {
      console.log(err);
      return res.status(500).json({msg: 'internal server error'});
    }

    var channels = data.map(function (channel) {
      return channel.name
    });

    connect(function (err, conn) {
      conn.createChannel(function (err, ch) {
        channels.forEach(function(channel) {
          var queueName = 'bytebay-' + channel;

          ch.assertQueue(queueName, {
            'durable': true,
            'auto-delete': false
          });
          ch.consume(queueName, function (msg) {
            var secs = msg.content.toString().split('.').length - 1;
            var newMessage = JSON.parse(msg.content.toString())

            console.log('[' + newMessage.user.username + '][' + newMessage.channelID + ']' + newMessage.text)
            socket.emit('new message', newMessage);

            setTimeout(function () {
            }, secs * 1000);
          }, {noAck: true});
        })
      })
    })
  })
}
