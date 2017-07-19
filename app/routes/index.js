'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	var clickHandler = new ClickHandler();

	app.route('/')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/index.html');
		});

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});
	
	app.route('/signup')
		.get(function (req, res) {
			res.sendFile(path + '/public/signup.html');
		});
	
	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/profile.html');
		});
	app.route('/polls/newpoll')
		.get(function (req, res) {
			res.redirect('/newpoll');
		});
	app.route('/polls/polls')
		.get(function (req, res) {
			res.redirect('/polls');
		});	
	app.route('/polls')
		.get(function (req, res) {
			res.sendFile(path + '/public/polls.html');
		});
	app.route('/polls/:id')
		.get(function (req, res) {
			clickHandler.getClicks_poll(req, res)
			res.sendFile(path + '/public/poll.html');
		});	
	app.route('/info')
		.get(function (req, res) {
			res.sendFile(path + '/public/info.html');
		});	
	
	app.route('/newpoll')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/newpoll.html');
		})
		
	app.route('/api/polls')
		.get(clickHandler.listPolls)
		
	app.route('/api/profile')
		.get(isLoggedIn, function (req, res) {
			clickHandler.userPolls(req, res);
		});
		
	app.route('/api/profile/:id')
		.post(isLoggedIn, function (req, res) {
			clickHandler.updateUser(req, res);
		});
		
	app.route('/api/info')
		.get(clickHandler.dataInfo);
		
		
	app.route('/api/login')
		.get(clickHandler.login_pg);
		
		
	app.route('/api/newpoll/:id')
		.get(function (req, res) {
			clickHandler.dataPoll(req, res);
			//res.json(req.user.github);
		})
		.post(isLoggedIn,clickHandler.createPoll);;
	

		
	app.route('/api/polls/:id')
		.get(function (req, res) {
			
			clickHandler.getpoll(req, res);
		})	
		.post(clickHandler.postPoll)
		.delete(isLoggedIn, clickHandler.pollDelet);
	
		
		
	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			clickHandler.userPolls(req, res);
		});
	
	app.route('/auth/github')
		.get(passport.authenticate('github'));
		
	app.route('/auth/signup')
		.post(passport.authenticate('local-signup',{
		successRedirect:'/polls',
		failureRedirect: '/signup'
	}));
	
	app.route('/auth/login')
		.get(passport.authenticate('login',{
		successRedirect:'/polls',
		failureRedirect: '/profile'
	}));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/polls',
			failureRedirect: '/login'
		}));
		
	app.route('/api/:id/clicks')
		.get(isLoggedIn, clickHandler.getClicks)
		.post(isLoggedIn, clickHandler.addClick)
		.delete(isLoggedIn, clickHandler.resetClicks);
};
