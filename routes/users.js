var express = require('express');
var router = express.Router();
const passport = require('passport');
const Users = require('../models/users');
const {v4} = require("node-uuid");

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('respond with a resource');
});

router.post('/register', (req, res, next) => {
	console.log("register here:", req.body);
	const email = req.body.email;
	const password = req.body.password;
	const username = req.body.username;
	const key = v4();
	const user = new Users({email, username, key});
	Users.register(user, password, (error, user) => {
		if (error) {
			return res.status(500).json(error);
		}
		// TODO: send activate email => use salt for key????
		// passport.authenticate('local')(req, res, () => {
		// 	return res.status(200).json({status: 'Registration Successful!'});
		// });

		return res.status(200).json({message: 'Registration Successful!'});
	});
});

router.post('/login', (req, res, next) => {
	passport.authenticate('local', (error, user, info) => {
		if (error) {
			return next(error);
		}
		if (!user) {
			return res.status(401).json({message: info.message});
		}
		req.login(user, (error) => {
			if (error) {
				return res.status(500).json({message: "Could not login user!"});
			}
			if (!user.isActive) {
				return res.status(401).json({message: "User is not activate"});
			}
			return res.json({message: "Login successully!"});
		})
	})(req, res, next);
});

router.post('/activate', (req, res, next) => {
	const key=req.body.key;
	Users.findOneAndUpdate({key}, {$set: {isActive: true, key: ""}}, {new: true}, (error, newUser) => {
		if (error) {
			return res.status(400).json({message: "Bad request!"});
		}
		req.login(newUser, (error) => {
			if (error) {
				return res.status(500).json({message: "Could not login user hehehe!"});
			}
			return res.json({message: "Active and Login successully!"});
		})
	});	
});

router.get('/auth', (req, res, next) => {
	const user = req.user;
	if (!user) {
		return res.status(401).json({message: "user is not exist in db"});
	}
	return res.status(200).json(user);
})

router.get('/logout', (req, res, next) => {
	req.logout();
	return res.json({message: "Logout successully!"});
});

router.get('/facebook', passport.authenticate('facebook'), (req, res) => {
	console.log("test, test");
});

router.get('/facebook/callback', function(req,res,next){
	passport.authenticate('facebook', function(err, user, info) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.status(401).json({message: info.message});
		}
		req.logIn(user, function(err) {
			if (err) {
				return res.status(500).json({
					err: 'Could not log in user'
				});
			}
			return res.json({message: "Login successully!"});
		});
	})(req,res,next);
});


module.exports = router;
