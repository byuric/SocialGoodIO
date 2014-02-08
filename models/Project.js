var mongoose = require('mongoose');

var projectSchema = new mongoose.Schema({
    name: { type: String, default: '' },
    description: { type: String, default: '' },
    location: { type: String, default: '' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, default: 'Planning' },
    totalHoursNeeded: { type: Number },
    totalDollarsNeeded: { type: Number }, //refactor for multi-currency?
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProjectMember' }]
});

module.exports = mongoose.model('Project', projectSchema);
