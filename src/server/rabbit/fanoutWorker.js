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
        var ex = 'bytebay-all_messages';
        ch.assertExchange(ex, 'fanout', {durable: true});
        ch.assertQueue('bytebay-Lobby', {durable: true,'auto-delete': false}, function(err, q) {
          console.log('PAAAAPI', err, q)
          console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
          ch.bindQueue(q.queue, ex, '');

          ch.consume(q.queue, function(msg) {
            var newMessage = JSON.parse(msg.content.toString())
            socket.emit('new message', newMessage);
            console.log('FANOUT',  msg);
          }, {noAck: true});
        });
      })
    })
  })
}
