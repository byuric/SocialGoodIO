var mongoose = require('mongoose'), ObjectId = mongoose.Schema.Types.ObjectId;
var projectSchema = new mongoose.Schema({
    name: { type: String, default: '' },
    description: { type: String, default: '' },
    location: { type: String, default: '' },
    startDate: { type: Date, required: false },
    endDate: { type: Date, required: false },
    status: { type: String, default: 'Planning' }, //options: Planning, In Progress, Finished
    totalHoursNeeded: { type: Number },
    totalDollarsNeeded: { type: Number }, //refactor for multi-currency?
    owner: {type: ObjectId, ref:'User'},
    members: [{ type: ObjectId, ref: 'ProjectMember' }]
});

//projectSchema.methods.ownerDetails = function (size, defaults) {
//    var outObj = {
//        name: ''
//    };

//    Users.findOne({ _id: this.owner }, function (err, user) {
//        outObj.name = user.name;
//    });
    
//    return outObj;
//};


module.exports = mongoose.model('Project', projectSchema);
