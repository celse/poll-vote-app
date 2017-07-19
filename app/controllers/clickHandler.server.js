'use strict';
var path = process.cwd();
var Users = require('../models/users.js').User;
var Polls = require('../models/polls.js').Poll;
var dataCash = require('../common/cach-var')
function ClickHandler () {
	function capitalizeFirstLetter(string) {
	    return string.charAt(0).toUpperCase() + string.slice(1);
	}
	function restoreback(doc){
		console.log('DATA RECUP :'+doc.key)
		//{'req':req,'res':res, 'data':data, 'key_gen':key_gen}
		var pollData = doc.data,
			req = doc.req,
			res = doc.res,
			key_g = doc.key_gen
		Polls
			.find({'created_by': req.user._id,'theme':pollData.theme })
			.exec(function(err, docPoll){
				if(err){throw err;}
				var pollId = stringGen();
				if(docPoll.length == 0){
					var poll = new Polls({
	                        created_by  : req.user._id,
	            	        id : key_g,
	            	        theme : pollData.theme,
	                    	option : pollData.option
	                    });
	                poll.save((err, poll)=>{
	                    if(err){ throw err}
	                    console.log('### Result ###');
	                    updateUserPolls(req.user._id, poll)
	                    res.json(poll);
	                    
	                });
	                
				}else{
					var list_poll_id=[];
					console.log('### Error  ### ');
					
					res.json({'erro':'this the is already existed, please try with an other theme'})
				}
				
		})
		
	}
	function stringGen(){
        var text = "";
    
        var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    
        for( var i=0; i < 10; i++ )
            text += charset.charAt(Math.floor(Math.random() * charset.length));
    
        return text;
    };
	function pollCreator(req,res,data,calback){
		var cond ={'_id':false,  'theme':false,'created_by':false, 'option':false, '__v':false}
		Polls
			.find({},cond)
			.exec(function(err, polls_id ) {
			    var key_gen = stringGen(),
			    	list_poll_id=[];
			    //console.log(polls_id)
			    if(polls_id.length != 0){
			    	for(var i=0; i < polls_id.length; i++){
						list_poll_id.push(polls_id[i]['id'])
					}
					console.log('@@@@@@@@@ B @@@@@@@@')	
					console.log( list_poll_id)
					while(searchKey(key_gen, list_poll_id)){
		                key_gen = stringGen();
		            }
			    }
			    calback({'req':req,'res':res, 'data':data, 'key_gen':key_gen});
			})
	}
	function searchKey(urlk, list){
	    var val = false
	    for(var i=0; i< list.length; i++){
	        if(list[i] == urlk){return true;}; 
	    }
	    return val;
	};
	function recup_User(dataUser){
		if(dataUser.github.id != undefined){
			return{
				id : dataUser.github.id,
				username : dataUser.github.username,
				displayName : dataUser.github.displayName,
				publicRepos : dataUser.github.polls.length
			}; 
        }
        if(dataUser.local.id != undefined){
        	return{
				id : dataUser.local.id,
				username : dataUser.local.username,
				displayName : dataUser.local.displayName,
				publicRepos : dataUser.local.polls.length
			};
        }
	}
	function obj_option(db){
        var keys = Object.keys(db),
            list_option=[];
        keys.forEach(function(element){
            if (element != 'theme'){
                list_option.push(db[element])
            }
        });
        return list_option;
        
    };
	function updateUserPolls(userrId, pollId){
        Users
    		.findOne({'_id': userrId})
    		.exec(function (err, result) {
				if (err) { throw err; }

				if (result) {
					if (result['local'].email){
				        console.log('result["polls"]')
				        console.log(result)
				        result['local']["polls"].push(pollId);
				        result.save((err, result)=>{
                            if(err){ throw err}
        				});
				        
				    }
				    if (result['github'].id){
				        result['github']["polls"].push(pollId)
				        result.save((err, result)=>{
                            if(err){ throw err}
                            
        				});
				    }
				}
            });
    };
    function getpolls(req, res){
    	var data_db ={}, projection = {}, cond ={'_id':false, 'created_by':false, 'option':false, '__v':false};
		if(req.user  != undefined){
			projection ={ 'created_by':req.user._id}
			cond ={'_id':false, 'created_by':false,  '__v':false}
			data_db['userData'] = recup_User(req.user);
		};
		Polls
            .find(projection,cond)
            .exec(function(err, allPolls){
                if (err) { throw err; }
                var data_elemt=[];
                allPolls.forEach(function(element){
                    if(element.theme != undefined ){data_elemt.push(element.theme);}
                })
                console.log('### DATA LIST OF THEME II ######');
                //console.log(allPolls)
                data_db['theme'] = allPolls 
                res.json(data_db);
			});
    }
	this.dataInfo = function(req, res){
		console.log('###### info data  #####')
		console.log('chach data : ',dataCash.pull_id);
		var info_data = {};
		if(dataCash.pull_id != ''){
			info_data['cach'] = dataCash.pull_id
		}
		
		if(req.user._id != undefined){
			 info_data['userData'] = recup_User(req.user);
		}
		res.json(info_data);
		
		
	};
	this.postPoll = function(req, res){
		var poll_id = req.params.id.split('-')[0];
		var poll_vote = req.params.id.split('-')[1];
		var ip = req.headers['x-forwarded-for'] || 
    			req.connection.remoteAddress || 
			     req.socket.remoteAddress ||
			     req.connection.socket.remoteAddress;
    	
		
		Polls
			.findOne({'id':poll_id})
			.exec(function(err, doc){
				if (err){throw err;}
				var list_opt = [];
				var option_v = doc.option;
				doc.ip_vote.push(ip)
				for (var i = 0, len = doc.option.length; i < len; i++) {
				  
				  if(doc.option[i]['_id'].toString() == poll_vote.toString() ){
				  	doc.option[i].vote += 1; 
				  };
				}
				doc.save()
				res.json(doc)
			})
			
		
	}
	this.dataPoll = function(req, res){
		console.log('###### poll data  #####')
		console.log(req)
		Users
			.find({})
			.exec(function (err, result) {
					if (err) { throw err; }

					res.json(result);
				}
			);
	};
	this.userPolls = function(req, res){
		console.log('###### poll data  B #####')
		console.log('req.user' +req.user)
		if(req.user){
			Polls
	            .find({'created_by':req.user._id},{'_id':false, 'created_by':false, 'option':false, '__v':false})
	            .exec(function(err, allPolls){
	                if (err) { throw err; }
	                var data_db ={}, data_elemt=[];
	                
	                allPolls.forEach(function(element){
	                    if(element.theme != undefined ){data_elemt.push(element.theme);}
	                })
	                console.log('### DATA LIST OF THEME ######');
	                console.log(allPolls)
	                data_db['userData'] = recup_User(req.user);
	                data_db['theme'] = data_elemt;
	                
	                res.json(data_db);
	    			
				});
				//return done(null, user);
		}
			
	};
	this.getClicks = function (req, res) {
		Users
			.findOne({ 'github.id': req.user.github.id }, { '_id': false })
			.exec(function (err, result) {
				if (err) { throw err; }

				res.json(result.nbrClicks);
			});
	};

	this.addClick = function (req, res) {
		
		Users
			.findOneAndUpdate({ 'github.id': req.user.github.id }, { $inc: { 'nbrClicks.clicks': 1 } })
			.exec(function (err, result) {
					if (err) { throw err; }

					res.json(result.nbrClicks);
				}
			);
	};
	this.login_pg = function(req, res){
		//console.log(req)	
		res.json({'id_user':'dsfdsf'});
	}
	this.resetClicks = function (req, res) {
		Users
			.findOneAndUpdate({ 'github.id': req.user.github.id }, { 'nbrClicks.clicks': 0 })
			.exec(function (err, result) {
					if (err) { throw err; }

					res.json(result.nbrClicks);
				}
			);
	};
	this.createPoll= function(req, res){
		console.log('###### poll posted  #####')
		console.log(req.params.id)
		console.log(req.originalUrl)
		dataCash.pull_id = '';
		var dat_list = req.originalUrl.split('/api/newpoll/')[1].split('-&')
		var V_theme = dat_list[0].split('%20').join(' ');
		dat_list.splice(0,1)
			
		var opt = dat_list 
		var  Var_list_option = [] 
		
		if (dat_list.length != 0){
			for(var i = 0; i < dat_list.length; i++){
	            Var_list_option.push({
	                label : capitalizeFirstLetter(dat_list[i].split('%20').join(' ')),
	                vote : 0
	            });
	        };
	        var data = {
				'theme': capitalizeFirstLetter(V_theme),
				'option': Var_list_option
			}
			pollCreator(req,res,data,restoreback)
		}else{
			res.json({'erro':'erro to get data option try again please by new login'})
		}
		
	};
	this.updateUser = function(req, res){
		var params  = req.originalUrl.split('/api/profile/')[1].split('-&')
		console.log(params)
		
		//UPDATE USER 
		if(req.user._id != undefined){
			var cond ={'_id' : req.user._id}
			Users
				.findById(cond)
				.exec(function(err, doc){
					if(err){ throw err}
					
					if(req.user.github.id != undefined){
						for(var i = 0; i < params.length; i++){
							//populate doc to update
							doc.github[params[i].split('-')[0]] = params[i].split('-')[1].split('%20').join(' ');
						}
					}
					if(req.user.local.id != undefined){
			        	for(var i = 0; i < params.length; i++){
							//populate doc to update
							doc.local[params[i].split('-')[0]] = params[i].split('-')[1].split('%20').join(' ');
						}
			        }
					
					doc.save(function(err, updateDoc){
						if(err){ throw err}
						res.json(recup_User(updateDoc));	
					});
					
				})
		}
		
	};
	/*this.newpoll_posts = function(req, res){
		console.log('### new poll posted ###');
		console.log(req.body);
	};*/
	this.getClicks_poll = function(req, res){
		console.log('### new poll posted ###');
		dataCash.pull_id = req.params.id;
		console.log(req.body);
	};
	this.pollDelet = function(req, res){
		console.log('### poll Delele ###');
		dataCash.pull_id='';
		console.log('params : '+req.params.id);
		console.log('params : '+req.user._id);
		if (req.user._id != undefined){
			Polls
				.deleteMany({'created_by': req.user._id,'id':req.params.id.split('-')})
				.exec(function(err, allPolls){
					if(err){ throw err}
					//console.log(allPolls)
					getpolls(req, res);
				});
		}else{
			//deconnecter
			res.sendFile(path + '/public/polls.html');
		}
		
	};
	function updatePollDelet(arr){
		var  test ; 
		for(var  i = 0; i < arr.length; i++){
			test = false;
			Polls
				.findOneAndRemove({'id':arr[i]})
				.exec(function(err, allPolls){
					if(err){ throw err}
					test = true
				});
		}
		return test
	}
	
	this.getpoll = function(req, res){
		console.log('### poll get ###');
		console.log('params : '+req.params.id);
		console.log('Cach : '+dataCash.pull_id);
		var poll_v = '';
		if(req.params.id == 'load'){
			if(dataCash.pull_id != ''){
				poll_v = dataCash.pull_id
			}
		}else{
			if(req.params.id != undefined){
				poll_v = req.params.id
			}
		}
		console.log(poll_v);
		
		var data_db ={}, projection = {'id': poll_v}, cond ={'_id':false, 'created_by':false,  '__v':false} ;
		if(req.user  != undefined){
			console.log('req user '+ req.user)
			projection ={'id': poll_v, 'created_by':req.user._id}
			cond ={'_id':false, 'created_by':false,  '__v':false};
			cond
			data_db['userData'] = recup_User(req.user);
		};
		var ip = req.headers['x-forwarded-for'] || 
    			req.connection.remoteAddress || 
			     req.socket.remoteAddress ||
			     req.connection.socket.remoteAddress;
    	console.log(ip);
    	
		Polls
            .find(projection,cond)
		    .exec(function(err, allPolls){
                if (err) { throw err; }
                console.log('######################')
                //console.log(allPolls[0].ip_vote)
                if(allPolls[0].ip_vote != undefined && searchKey(ip,allPolls[0].ip_vote)){
                	data_db['ip']=true;
                }
                data_db['theme'] = allPolls;
                res.json(data_db);
                
            });
	};
	this.listPolls = function (req, res){
		var data_db ={}, projection = {}, cond ={'_id':false, 'created_by':false, 'option':false, '__v':false};
		var ip = req.headers['x-forwarded-for'] || 
    			req.connection.remoteAddress || 
			     req.socket.remoteAddress ||
			     req.connection.socket.remoteAddress;
    	console.log(ip);
		//console.log(req.user)
		if(req.user  != undefined){
			projection ={ 'created_by':req.user._id}
			cond ={'_id':false, 'created_by':false,  '__v':false}
			data_db['userData'] = recup_User(req.user);
			console.log(data_db)
		};
		Polls
            .find(projection,cond)
            .exec(function(err, allPolls){
                if (err) { throw err; }
                var data_elemt=[];
                allPolls.forEach(function(element){
                    if(element.theme != undefined ){data_elemt.push(element.theme);}
                })
                console.log('### DATA LIST OF THEME I ######');
                //keyGenerator()
                console.log(data_db)
                data_db['theme'] = allPolls 
                res.json(data_db);
			});
	}

}

module.exports = ClickHandler;
