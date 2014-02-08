var Project = require('../models/Project');

exports.getNewProject = function(req, res) {
  res.render('projects/new', {
    title: 'Create a new Project'
  });
};

exports.postCreateProject = function(req, res) {
  req.assert('name', 'Name cannot be blank').notEmpty();
  req.assert('description', 'Description cannot be blank').notEmpty();
  req.assert('location', 'Location cannot be blank').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    console.log('ProjectsController: Validation errors: ' + errors);
    req.flash('errors', errors);
    return res.redirect('/projects/new');
  }

  var project;
  console.log("POST: ");
  console.log(req.body);

  project = new Project({
    name: req.body.name,
    description: req.body.description,
    location: req.body.location
  });

  project.save(function(error) {
    if (!error) {
      console.log('ProjectsController: Created project with ID: ' + project._id);
    } else {
      console.log('ProjectsController: Error creating project: ' + error);
      if (error.code === 11000) {
        req.flash('errors', { msg: 'ProjectsController: ' + project._id + '  already exists!' });
      }
    }
  });

  return res.redirect('/projects/' + project._id);
};

exports.getProject = function(req, res) {
  return Project.findById(req.params.id, function (error, project) {
    if (!error) {
      return res.render('projects/project', {project: project});
    } else {
      return console.log(error);
    }
  });
};