var mongoose = require('mongoose');

var projectSchema = new mongoose.Schema({
    name: { type: String, default: '' },
    description: { type: String, default: '' },
    location: { type: String, default: '' }
});

module.exports = mongoose.model('Project', projectSchema);
