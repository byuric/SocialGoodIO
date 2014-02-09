var Project = require('../models/Project');
var User = require('../models/User');
var ProjectMember = require('../models/ProjectMember');
var mongoose = require('mongoose'), ObjectId = mongoose.Schema.Types.ObjectId;

exports.getNewProject = function(req, res) {
  res.render('project/new', {
    title: 'Start a new Project'
  });
};

exports.joinProject = function (req, res) {
  Project.findById(req.params.id).populate('members').exec(function (err, project) {
    if (!err) {
      User.populate(project, { path: 'members.user' }, function (err, data) {
        if (!err) {
          var alreadyJoined = false;
          for (var i = 0; i < project.members.length; i++) {
            alreadyJoined = alreadyJoined ? alreadyJoined : "" + project.members[i].user._id == "" + req.user._id;
          }
          if (!alreadyJoined) {
            var projectMember = new ProjectMember({ user: req.user.id, role: 'Follower' });
            projectMember.save();

            project.members.push(projectMember);
            project.save(function (err) {
              if (err) return handleError(err);
              return res.redirect('/project/' + project.id);
            });
          }
          else {
            console.log('already Joined');
            return res.redirect('/project/' + project.id);
          }

        }
        else {
          console.log('already Joined');
          return res.redirect('/project/' + project.id);
        }
      });
    }
    else {
      return console.log(error);
    }
  });
}

exports.leaveProject = function (req, res) {
  return Project.findById(req.params.id).populate('members').exec(function (error, project) {
    if (!error) {
      User.populate(project, { path: 'members.user' }, function (err, data) {
        if (!err) {
          //find the projectMember for this user
          var pmIndex;
          for (var i = 0; i < project.members.length; i++) {
            if("" + project.members[i].user._id == "" + req.user._id){
              pmIndex = i;
              break;
            }
          }
          //delete it from the db
          ProjectMember.findById(project.members[pmIndex]._id).remove();

          //pop it from the array
          project.members.splice(pmIndex,1);

          //save the project
          project.save(function(err){
            if(!err) return res.redirect('/project/' + project.id);
            else return console.log(err);
          });
        }
        else { console.log(err) }
      });

    } else {
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
  return Project.findById(req.params.id).lean().populate('owner').populate('members').exec(function (error, project) {
    if (!error) {
      console.log(project.members);
      User.populate(project, { path: 'members.user' }, function (err, data) {
        if (!err) {
          var alreadyJoined = false;
          for (var i = 0; i < project.members.length; i++) {
            alreadyJoined = alreadyJoined ? alreadyJoined : "" + project.members[i].user._id == "" + req.user._id;
          }
          return res.render('project/project', {
            title: project.name,
            project: project,
            isOwner: req.user._id.equals(project.owner._id),
            userIsMember: alreadyJoined
          });
        } else {
          console.log(err);
        }
      });
    } else {
      return console.log(error);
    }
  });
};