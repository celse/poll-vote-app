var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pollSchema = new Schema({
	id:String,
	created_by  : { type: Schema.Types.ObjectId, ref: 'User'},
	theme : String,
	ip_vote: [],
	option:[
			{
				label:String,
				vote:Number,
			}
		]
});


var Poll = mongoose.model('Poll', pollSchema);
module.exports = { 
	Poll : Poll
	};	