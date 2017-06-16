/**
 * Created by dell on 2017/6/16.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var registerSchema = new Schema({
	username: {
		type: String,
		unique: true
	},
	password: String,
	nickname: {
		type:String,
		unique: true
	}
});

module.exports = registerSchema;