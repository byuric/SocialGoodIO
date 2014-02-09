var Project = require('../models/Project');
var ProjectMember = require('../models/ProjectMember');
var User= require('../models/User');

/**
 * GET /
 * Home page.
 */

exports.getProjects = function (req, res) {
 
  Project.find().exec(function (err, projects) {
    if (err) return next(err);
        res.render('projects/projectList', {
            title: 'Project list',
            projects: projects
        });
    });

};

exports.findProjects = function (req, res) {
    res.render('/home', { title: 'SocialGood' });
};
