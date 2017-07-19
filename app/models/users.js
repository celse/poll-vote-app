'use strict';


var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	github: {
		id: String,
		displayName: String,
		username: String,
        publicRepos: Number,
        polls : [{ type: Schema.Types.ObjectId, ref : 'Poll'}]
	},
	local : {
	    id: String,
	    username     : String,     
	    email    : String,
	    displayName: String,
	    password : String,
	    polls : [{ type: Schema.Types.ObjectId, ref : 'Poll'}]
	},
   nbrClicks: {
      clicks: Number
   }
});

//generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

var User = mongoose.model('User', userSchema);

module.exports = { 
	User : User};
