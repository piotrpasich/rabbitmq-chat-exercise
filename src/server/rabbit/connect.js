
var amqp = require('amqplib/callback_api')

export default function connect(cb) {
  return amqp.connect('amqp://bytebay:bytebay123@localhost/', cb);
}