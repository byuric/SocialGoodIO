var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');

var projectMemberSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, required: true }  //refactor to have a dictionary of availabe role types? (advocate, donator, volunteer)
});

module.exports = mongoose.model('ProjectMember', projectMember);