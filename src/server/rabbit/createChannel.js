import connect from './connect'

module.exports = function (channelName, cb = null) {
  connect(function (err, conn) {
    conn.createChannel(function (err, ch) {
      var q = 'bytebay-' + channelName;
      ch.assertQueue(q, {
        'durable': true,
        'auto-delete': false
      });
      if (cb !== null) {
        cb(ch);
      }
    });
  })
}
