var Project = require('../models/Project');
var User = require('../models/User');
var ProjectMember = require('../models/ProjectMember');

exports.getNewProject = function(req, res) {
  res.render('project/new', {
    title: 'Start a new Project'
  });
};
exports.joinProject = function (req, res) {
  req.assert('user', 'User is not logged in').notEmpty();
  Project.findById(req.params.id, function (err, project) {
    console.log('Project ID'+req.params.id);
    if (!err) {
      var alreadyJoined = false;
      for (var i = 0; i < project.members.length; i++) {
          console.log("User in members:" + project.members[i]+ ' User:'+req.user.id)
          alreadyJoined = alreadyJoined | project.members[i].user == req.user.id;
      }
      if (!alreadyJoined){
          var projectMember = new ProjectMember({ user: req.user.id, role: 'Follower' });
          projectMember.save();
          project.members.push(projectMember);
          project.save(function (err) {
            if (err) return handleError(err);
            return res.redirect('/project/' + project.id);
          });
      }
      else {
        return res.redirect('/project/' + project.id);
      }
    }
    else {
      return console.log(error);
    }
  });
}


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
    totalHoursPlanned: req.body.totalHoursPlanned,
    totalEstimatedBudget: req.body.totalEstimatedBudget,
    owner: req.user._id
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
  return Project.findById(req.params.id).populate('owner').exec( function (error, project) {
    if (!error) {
      console.log(project);
      
      var alreadyJoined = false;
      for (var i = 0; i < project.members.length; i++) {
        alreadyJoined = alreadyJoined | project.members[i]._id == req.user._id;
      }
      
      
      return res.render('project/project', {
        title: project.name,
        project: project,
        userIsMember: alreadyJoined
      });
    } else {
      return console.log(error);
    }
  });
};