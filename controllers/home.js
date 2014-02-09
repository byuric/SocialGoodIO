var Project = require('../models/Project');

/**
 * GET /
 * Home page.
 */

exports.index = function (req, res) {
    
        res.render('home', {
            title: 'SocialGood I Owe'
        });

};
