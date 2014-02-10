var Project = require('../models/Project');
var User = require('../models/User');
/**
 * GET /
 * Home page.
 */

exports.index = function (req, res) {
    Project.find().where('featured').equals('true').populate('owner members').exec(function (err, projects) {
        if (!err) {
            User.populate(projects, { path: 'members.user' }, function (err, data) {
                if (!err) {
                    res.render('home', {
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
