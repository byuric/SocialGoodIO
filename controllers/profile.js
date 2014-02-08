var User = require('../models/User');

exports.getProfile = function(req, res) {
  return User.findById(req.params.id, function (error, user) {
    if (!error) {
      return res.render('profile/profile', {
        title: user.profile.name,
        profile: user.profile
      });
    } else {
      return console.log(error);
    }
  });
};