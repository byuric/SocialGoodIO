var mongoose = require('mongoose'), ObjectId = mongoose.Schema.Types.ObjectId;

var projectMemberSchema = new mongoose.Schema({
  user: { type: ObjectId, ref: 'User' },
  project: { type: ObjectId, ref: 'Project' },
  role: { type: String, required: true },  //refactor to have a dictionary of availabe role types? (advocate, donator, volunteer)
  totalDonation: { type: Number, default: 0 }
  //donations: [{ date: Date, amount: Number }]
});

module.exports = mongoose.model('ProjectMember', projectMemberSchema);