var Project = require('../models/Project');

exports.getNewProject = function(req, res) {
  res.render('project/new', {
    title: 'Start a new Project'
  });
};

exports.postCreateProject = function(req, res) {
  req.assert('name', 'Name cannot be blank').notEmpty();
  req.assert('description', 'Description cannot be blank').notEmpty();
  req.assert('location', 'Location cannot be blank').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    console.log('ProjectController: Validation errors: ' + errors);
    req.flash('errors', errors);
    return res.redirect('/project/new');
  }

  var project = new Project({
    name: req.body.name,
    description: req.body.description,
    location: req.body.location,
    startDate: new Date(req.body.startDate),
    endDate: new Date(req.body.endDate),
    status: req.body.status,
    totalHoursNeeded: req.body.totalHoursNeeded,
    totalDollarsNeeded: req.body.totalDollarsNeeded
  });

  project.save(function(error) {
    if (!error) {
      console.log('ProjectController: Created project with ID: ' + project._id);
    } else {
      console.log('ProjectController: Error creating project: ' + error);
      if (error.code === 11000) {
        req.flash('errors', { msg: 'ProjectController: ' + project._id + '  already exists!' });
      }
    }
  });

  return res.redirect('/project/' + project._id);
};

exports.getProject = function(req, res) {
  return Project.findById(req.params.id, function (error, project) {
    if (!error) {
      return res.render('project/project', {
        title: project.name,
        project: project
      });
    } else {
      return console.log(error);
    }
  });
};