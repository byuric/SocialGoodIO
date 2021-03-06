var Project = require('../models/Project');
var User = require('../models/User');
var ProjectMember = require('../models/ProjectMember');
var mongoose = require('mongoose'), ObjectId = mongoose.Schema.Types.ObjectId;

exports.getNewProject = function(req, res) {
  res.render('project/new', {
    title: 'Start a new Project',
    project: new Project()
  });
};
exports.joinProject = function (req, res) {

  Project.findById(req.params.id).populate('members').exec(function (err, project) {
    if (!err) {
      User.populate(project, { path: 'members.user' }, function (err, data) {
        if (!err) {
          var userIsMember = false;
          for (var i = 0; i < project.members.length; i++) {
            userIsMember = userIsMember ? userIsMember : "" + project.members[i].user._id == "" + req.user._id;
          }
          if (!userIsMember) {
            var projectMember = new ProjectMember({ user: req.user.id, project:req.params.id,  role: 'Follower' });
            projectMember.save();
            req.user.projects.push(projectMember);
            req.user.save(function (err) {
                if (err) return handleError(err);
            });

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
          if(pmIndex >= 0){

            ProjectMember.findOne({ _id: project.members[pmIndex].id }).exec(function (err, obj) {
              if (err) console.log(err);

              //delete it from the db
              obj.remove();

              //pop it from the array
              project.members.splice(pmIndex, 1);

              //save the project
              project.save(function (err) {
                req.flash('success', 'Removed from the project');
                if (!err) return res.redirect('/project/' + project.id);
                else return console.log(err);
              });

            });;
          }
        }
        else { console.log(err) }
      });

    } else {
      return console.log(error);
    }
  });
}

function sanitiseNumber(input) {
  var result = 0;
  if (input != '') {
    result = parseInt(input);
  }
  return result;
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
    totalHoursPlanned: sanitiseNumber(req.body.totalHoursPlanned),
    totalEstimatedBudget: sanitiseNumber(req.body.totalEstimatedBudget),
    featured: req.body.featured,
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
      User.populate(project, { path: 'members.user' }, function (err, data) {
        if (!err) {
          var isOwner = false;
          var userIsMember = false;
          if (req.user) {
            isOwner = req.user._id.equals(project.owner._id);
            for (var i = 0; i < project.members.length; i++) {
              userIsMember = userIsMember ? userIsMember : "" + project.members[i].user._id == "" + req.user._id;
            }
          }
          var totalDontations = 0;

          for (var i = 0; i < project.members.length; i++) {
            totalDontations += (project.members[i].totalDonation) ? project.members[i].totalDonation : 0;
          }
          return res.render('project/project', {
            title: project.name,
            project: project,
            isOwner: isOwner,
            userIsMember: userIsMember,
            totalDonations:totalDontations
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

exports.editProject = function(req, res) {
  return Project.findById(req.params.id).exec(function (err, project) {
    return res.render('project/edit', {
      title: project.name,
      project: project
    });
  });
};

exports.donateToProject = function (req, res) {
  var token = JSON.parse(req.body.token);
  return ProjectMember.findOne({user:req.user, project:req.params.id}).exec(function (err, projectMember) {
    projectMember.role = "Donator";
    if(!projectMember.donations){projectMember.donations = [];}
    //projectMember.donations.push({ date: (new Date()).getDate(), amount: req.body.amount });
    projectMember.totalDonation += parseInt(req.body.amount);
    projectMember.save(function (err) {
      if (!err) {
        req.flash('success', { msg: 'Donation recieved. Thank you for supporting a worthy cause!!' });
        return res.redirect('/project/' + req.params.id);
      } else console.log(err);
    });
    
  });
};

exports.updateProject = function(req, res) {
  req.assert('name', 'Name cannot be blank').notEmpty();
  req.assert('description', 'Description cannot be blank').notEmpty();
  req.assert('location', 'Location cannot be blank').notEmpty();

  var errors = req.validationErrors();
  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/project/' + project._id + '/edit');
  }

  return Project.findById(req.params.id, function (error, project) {
    project.title = req.body.name;
    project.description = req.body.description;
    project.location = req.body.location;
    project.startDate = new Date(req.body.startDate);
    project.endDate = new Date(req.body.endDate);
    project.totalHoursPlanned = parseInt(req.body.totalHoursPlanned);
    project.totalEstimatedBudget = parseInt(req.body.totalEstimatedBudget);
    project.featured = req.body.featured;
    return project.save(function (error) {
      if (!error) {
        console.log('ProjectController: Updated ' + project._id);
        req.flash('success', { msg: 'Project updated.' });
      } else {
        console.log('ProjectController: Error updating project: ' + error);
        req.flash('errors', { msg: 'Error upating project: ' + error});
      }
      return res.redirect('/project/' + project._id);
    });
  });
};

exports.destroyProject = function (req, res) {
  return Project.findById(req.params.id, function (error, project) {
    var isOwner = req.user._id.equals(project.owner);
    if (isOwner) {
      return project.remove(function (error) {
        if (error) {
          req.flash('errors', { msg: 'Error deleting project: ' + error});
        } else {
          req.flash('success', { msg: 'Project deleted.' });
        }
        return res.redirect('/projects');
      });
    } else {
      req.flash('errors', { msg: 'You must be the owner of a project to delete it.' });
      return res.redirect('/projects');
    }
  });
}