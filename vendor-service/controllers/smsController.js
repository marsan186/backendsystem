const Nexmo = require('nexmo');

exports.sendSmstoUser = function (req, res, next) {
  const nexmo = new Nexmo({
    apiKey: 'f2b4ebef',
    apiSecret: 'JUPbn1lEC95PlzAr'
  })

  const from = 'FeedTheNeed'
  const to = '918778040146'
  const text = 'You have registered successfully!!!!'

/*   nexmo.message.sendSms(from, to, text)
 */
  nexmo.message.sendSms(from, to, text, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Msg sent: ' + info.response);
    }
  });
}