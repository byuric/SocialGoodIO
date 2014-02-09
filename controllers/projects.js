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
          res.render('projects/projectList', {
            title: 'Project list',
            projects: projects
          });
        }
        else { console.log(err) }
      });
     
    } else {
      return console.log(error);
    }
  });

};

exports.findProjects = function (req, res) {
    res.render('/home', { title: 'SocialGood' });
};
