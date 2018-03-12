import connect from './connect'

module.exports = function (message) {
  connect(function (err, conn) {
    conn.createChannel(function (err, ch) {
      var ex = 'bytebay-all_messages'
      var msg = message.text
      ch.assertExchange(ex, 'fanout', {durable: true,'auto-delete': false})
      ch.publish(ex, '', new Buffer(msg));
      console.log("Sent to fanout %s", msg);
    });
  })
}
