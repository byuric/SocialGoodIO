var Project = require('../models/Project');

/**
 * GET /
 * Home page.
 */

exports.getProjects = function (req, res) {
    Project.find().exec(function (err, projects) {
        if (err) return next(err);
        res.render('projects/projectList', {
            title: 'SocialGood - Project list',
            projects: projects
        });
    });

};

exports.findProjects = function (req, res) {
    res.render('/home', { title: 'SocialGood' });
};
