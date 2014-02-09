var User = require('../models/User');
var Project = require('../models/Project');

exports.getProfile = function(req, res) {
  return User.findById(req.params.id, function (error, user) {
    if (!error) {
        Project.find().exec(function (err, projects) {
            if (err) return next(err);
            return res.render('profile/profile', {
                user: user,
                projects: projects
            });
        });
    }
  });
}