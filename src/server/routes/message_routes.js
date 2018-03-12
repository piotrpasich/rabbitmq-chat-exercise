var Message = require('../models/Message');
var bodyparser = require('body-parser');
var createMessage = require('../rabbit/createMessage')
var createFanoutMessage = require('../rabbit/createFanoutMessage')

module.exports = function(router) {
  router.use(bodyparser.json());

  // query DB for ALL messages
  router.get('/messages', function(req, res) {
    Message.find({}, {id: 1, channelID: 1, text: 1, user: 1, time: 1, _id: 0}, function(err, data) {
      if(err) {
        console.log(err);
        return res.status(500).json({msg: 'internal server error'});
      }
      res.json(data);
    });
  });

  // query DB for messages for a specific channel
  router.get('/messages/:channel', function(req, res) {
    res.json({});
    // Message.find({channelID: req.params.channel}, {id: 1, channelID: 1, text: 1, user: 1, time: 1, _id: 0}, function(err, data) {
    //   if(err) {
    //     console.log(err);
    //     return res.status(500).json({msg: 'internal server error'});
    //   }
    // });
  })

  //post a new message to db
  router.post('/newmessage', function(req, res) {
    var newMessage = new Message(req.body);

    if (newMessage.text.match(/all/g) !== null) {
    } else {
      createFanoutMessage(newMessage) //@papi
      createMessage(newMessage.channelID, newMessage) //@papi
    }

    res.json(newMessage);
  });
}
