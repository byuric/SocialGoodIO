var Project = require('../models/Project');
var ProjectMember = require('../models/ProjectMember');
var User= require('../models/User');

/**
 * GET /
 * Home page.
 */

exports.getProjects = function (req, res) {
 
  Project.find().populate('owner members').exec(function (err, projects) {

    if (!err) {
      User.populate(projects, { path: 'members.user' }, function (err, data) {
        if (!err) {
          var totalDontations = 0;
          for (var i = 0; i < projects.length; i++) {
            var p = projects[i];
            for (var j = 0; j < p.members.length; j++) {
              totalDontations += (p.members[j].totalDonation) ? p.members[j].totalDonation : 0;
            }
            projects[i].totalDonations = parseInt(totalDontations);
            projects[i].save();
            console.log(p.totalDonations);
          }

          res.render('projects/projectList', {
            title: 'Project list',
            projects: projects
          });
        }
        else
        { console.log(err) }
      });
     
    } else {
      return console.log(error);
    }
  });

};

exports.findProjects = function (req, res) {
    res.render('/home', { title: 'SocialGood' });
};
