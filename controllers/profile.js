var User = require('../models/User');

exports.getProfile = function(req, res) {
  return User.findById(req.params.id, function (error, user) {
    if (!error) {
      return res.render('profile/profile', {
        title: user.name,
        user: user
      });
    } else {
      return console.log(error);
    }
  });
};