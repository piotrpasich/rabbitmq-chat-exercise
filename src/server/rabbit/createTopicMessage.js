import connect from './connect'

module.exports = function (message) {
  connect(function (err, conn) {
    conn.createChannel(function (err, ch) {
      var ex = 'bytebay-topic_logs'
      var key = 'bytebay-*'
      var msg = message.text

      ch.assertExchange(ex, 'topic', {'durable': true,'auto-delete': false});
      ch.publish(ex, key, new Buffer(msg));
      console.log(" [x] Sent %s:'%s'", key, msg);
    });
  })
}
