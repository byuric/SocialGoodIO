/**
 * Module dependencies.
 */

var express = require('express');
var MongoStore = require('connect-mongo')(express);
var flash = require('express-flash');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var expressValidator = require('express-validator');

/**
 * Load controllers.
 */

var homeController = require('./controllers/home');
var userController = require('./controllers/user');
var profileController = require('./controllers/profile');
var apiController = require('./controllers/api');
var contactController = require('./controllers/contact');
var projectController = require('./controllers/project');
var projectsController = require('./controllers/projects');

/**
 * API keys + Passport configuration.
 */

var secrets = require('./config/secrets');
var passportConf = require('./config/passport');

/**
 * Create Express server.
 */

var app = express();

/**
 * Mongoose configuration.
 */

mongoose.connect(secrets.db);
mongoose.connection.on('error', function() {
  console.error('✗ MongoDB Connection Error. Please make sure MongoDB is running.');
});

/**
 * Express configuration.
 */

var hour = 3600000;
var day = (hour * 24);
var week = (day * 7);
var month = (day * 30);

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.locals.basedir = app.get('views');
//app.set('view options', { basedir: process.env.__dirname });  //allow absolute paths in includes.
app.set('view engine', 'jade');
app.use(require('connect-assets')({
  src: 'public',
  helperContext: app.locals
}));
app.use(express.compress());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.json());
app.use(express.urlencoded());
app.use(expressValidator());
app.use(express.methodOverride());
app.use(express.session({
  secret: secrets.sessionSecret,
  store: new MongoStore({
    db: mongoose.connection.db,
    auto_reconnect: true
  })
}));
app.use(express.csrf());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  res.locals.token = req.csrfToken();
  next();
});
app.use(flash());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public'), { maxAge: week }));
app.use(function(req, res) {
  res.status(404);
  res.render('404');
});
app.use(express.errorHandler());

/**
 * Application routes.
 */

/**
 * OAuth routes for account creation, update
 */
app.get('/', homeController.index);
app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);
app.get('/account', passportConf.isAuthenticated, userController.getAccount);
app.post('/account/profile', passportConf.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConf.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConf.isAuthenticated, userController.postDeleteAccount);
app.get('/account/unlink/:provider', passportConf.isAuthenticated, userController.getOauthUnlink);

/**
 * Project
 */
app.get('/project/new',passportConf.isAuthenticated, projectController.getNewProject);
app.post('/project', projectController.postCreateProject);
app.get('/project/:id', projectController.getProject);
app.get('/project/:id/edit', projectController.editProject);
app.put('/project/:id', projectController.updateProject);
app.get('/project/:id/destroy', projectController.destroyProject);
app.get('/project/:id/join', projectController.joinProject)
app.get('/project/:id/leave', projectController.leaveProject)
app.post('/project/:id/donate', projectController.donateToProject)

/**
 * Projects
 */
app.get('/projects', projectsController.getProjects);
app.post('/projects/search/', projectsController.findProjects);


/**
 * User
 */
app.get('/profile/:id', profileController.getProfile);

/**
 * OAuth routes for sign-in.
 */
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' }));
app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
app.get('/auth/google/callback', passport.authenticate('google', { successRedirect: '/', failureRedirect: '/login' }));
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/login' }));

app.get('/contact', contactController.getContact);
app.post('/contact', contactController.postContact);

app.get('/api', apiController.getApi);
app.get('/api/lastfm', apiController.getLastfm);
app.get('/api/nyt', apiController.getNewYorkTimes);
app.get('/api/aviary', apiController.getAviary);
app.get('/api/paypal', apiController.getPayPal);
app.get('/api/paypal/success', apiController.getPayPalSuccess);
app.get('/api/paypal/cancel', apiController.getPayPalCancel);
app.get('/api/steam', apiController.getSteam);
app.get('/api/scraping', apiController.getScraping);
app.get('/api/twilio', apiController.getTwilio);
app.post('/api/twilio', apiController.postTwilio);
app.get('/api/foursquare', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getFoursquare);
app.get('/api/tumblr', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getTumblr);
app.get('/api/facebook', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getFacebook);
app.get('/api/github', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getGithub);
app.get('/api/twitter', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getTwitter);

/**
 * Start Express server.
 */

app.listen(app.get('port'), function() {
  console.log("✔ Express server listening on port %d in %s mode", app.get('port'), app.settings.env);
});
