const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
	email: String,
	username: String,
	password: String,
	key: String,
	OauthId: String,
	OauthToken: String,
	isActive: {
		type: Boolean,
		default: false
	},
	admin: {
		type: Boolean,
		default: false,
	}
	
}, {
	timestamps: true
});

userSchema.plugin(passportLocalMongoose);
const Users = mongoose.model("Users", userSchema, "Users");

module.exports = Users;