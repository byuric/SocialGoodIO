var mongoose = require('mongoose'), ObjectId = mongoose.Schema.Types.ObjectId;

var projectMemberSchema = new mongoose.Schema({
  user: { type: ObjectId, ref: 'User' },
  role: { type: String, required: true }  //refactor to have a dictionary of availabe role types? (advocate, donator, volunteer)
});

module.exports = mongoose.model('ProjectMember', projectMemberSchema);