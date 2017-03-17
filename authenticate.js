const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Users = require('./models/users');
const config = require('./config');

exports.local = passport.use(new LocalStrategy(Users.authenticate()));

passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

const FacebookStrategy = require('passport-facebook').Strategy;

exports.facebook = passport.use(new FacebookStrategy({
		clientID: config.facebook.clientID,
		clientSecret: config.facebook.clientSecret,
		callbackURL: config.facebook.callbackURL
	},
	(accessToken, refreshToken, profile, done) => {
		// console.log("profile:", profile);
		Users.findOne({ OauthId: profile.id }, (err, user) => {
			if(err) {
				console.log(err); // handle errors!
			}
			if (!err && user !== null) {
				console.log("User facebook relogin");
				done(null, user);
			} else {
				user = new Users({
					username: profile.displayName
				});
				user.OauthId = profile.id;
				user.OauthToken = accessToken;
				user.save((err) => {
					if(err) {
						console.log(err); // handle errors!
					} else {
						console.log("saving user ...");
						done(null, user);
					}
				});
			}
		});
	}
));