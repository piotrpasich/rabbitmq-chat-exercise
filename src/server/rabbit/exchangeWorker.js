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
        var ex = 'bytebay-topic_logs'
        ch.assertExchange(ex, 'topic', {
          'durable': true,
          'auto-delete': false
        })
        channels.forEach((channel) => {
          ch.assertQueue('bytebay-' + channel, {'durable': true,'auto-delete': false}, function(err, q) {
            ch.bindQueue(q.queue, ex, 'bytebay-*');
            ch.consume(q.queue, function(msg) {
              console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString());
            }, {noAck: true});
          })
        })
      })
    })
  })
}

