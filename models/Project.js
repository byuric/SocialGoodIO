var mongoose = require('mongoose'), ObjectId = mongoose.Schema.Types.ObjectId;
var projectSchema = new mongoose.Schema({
    name: { type: String, default: '' },
    description: { type: String, default: '' },
    location: { type: String, default: '' },
    creationDate: { type: Date, required: false },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true},
    featured: { type: Boolean, default: false },
    status: { type: String, default: 'New' }, //options: New, In Progress, Completed
    totalHoursPlanned: { type: Number },
    totalEstimatedBudget: { type: Number }, //refactor for multi-currency?
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
