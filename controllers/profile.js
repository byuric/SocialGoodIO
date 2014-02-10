var User = require('../models/User');
var Project = require('../models/Project');
var ProjectMember = require('../models/ProjectMember');

exports.getProfile = function(req, res) {
  return User.findById(req.params.id).lean().populate('projects').exec(function (error, user) {
    if (!error) {
        Project.populate(user, { path: 'projects.project' }, function (err, pm) {
            if (err) return next(err);
            ProjectMember.populate(user, { path: 'projects.project.members' }, function (err, members) {
                User.populate(user, { path: 'projects.project.members.user' }, function (err, users) {
                    return res.render('profile/profile', {
                        title: users.name,
                        profileUser: users,
                        projects: users.projects
                    });
                });
            });
        });
    }
  });
}