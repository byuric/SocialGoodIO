var Project = require('../models/Project');

/**
 * GET /project/new
 * Project form page.
 */

exports.getNewProject = function(req, res) {
  res.render('project/new', {
    title: 'Project'
  });
};

/**
 * POST /project/new
 * Store project
 * @param name
 * @param description
 * @param location
 */

exports.postNewProject = function(req, res) {
  req.assert('name', 'Name cannot be blank').notEmpty();
  req.assert('description', 'Description cannot be blank').notEmpty();
  req.assert('location', 'Location cannot be blank').notEmpty();

  var errors = req.validationErrors();

  console.log('Store Project')

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/project');
  }

  var name = req.body.name;
  var description = req.body.description;
  var location = req.body.location;

  var project = new Project({
        name: req.body.name,
        description: req.body.description,
        location: req.body.location
  });

    project.save(function(err) {
        if (err) {
            if (err.code === 11000) {
                req.flash('errors', { msg: 'Project with this id already exist.' });
            }
            return res.redirect('/project');
        }
        res.redirect('/project');
    });

};

/**
 * GET /project
 * Project page.
 */

exports.getProject = function(req, res) {
    res.render('project/project', {
        title: 'Account Management'
    });
};
