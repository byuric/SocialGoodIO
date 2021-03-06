var mongoose = require('mongoose'), ObjectId = mongoose.Schema.Types.ObjectId;
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');

var userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: String,
    name: { type: String, default: '' },
    country: { type: String, default: '' },
    zipcode: { type: String, default: '' },
    phone: { type: String, default: '' },
    interests: { type: String, default: '' },
    age: { type: String, default: '' },
    gender: { type: String, default: 'male' },
    availability: { type: String, default: 'yes' },
    picture: { type: String, default: '' },
    facebook: { type: String, unique: true, sparse: true },
    twitter: { type: String, unique: true, sparse: true },
    google: { type: String, unique: true, sparse: true },
    tokens: Array,
    projects: [{type: ObjectId, ref:'ProjectMember'}]
});

/**
 * Hash the password for security.
 */

userSchema.pre('save', function(next) {
  var user = this;
  var SALT_FACTOR = 5;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

/**
 *  Get a URL to a user's Gravatar email.
 */

userSchema.methods.gravatar = function(size, defaults) {
  if (!size) size = 200;
  if (!defaults) defaults = 'retro';
  var md5 = crypto.createHash('md5').update(this.email);
  return 'https://gravatar.com/avatar/' + md5.digest('hex').toString() + '?s=' + size + '&d=' + defaults;
};

module.exports = mongoose.model('User', userSchema);
