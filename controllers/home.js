var Project = require('../models/Project');

/**
 * GET /
 * Home page.
 */

exports.index = function (req, res) {
    Project.find().exec(function (err, projects) {
        if (err) return next(err);
        res.render('home', {
            title: 'SocialGood I Owe',
            projects: projects
        });
    });

};
