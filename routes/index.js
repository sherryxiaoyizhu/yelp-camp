var express  = require("express"),
    router   = express.Router(),
    passport = require("passport"),
    User     = require("../models/user");

// root route
router.get("/", function(req, res){
	res.render("landing");
});

// show register form
router.get("/register", function(req, res){
	res.render("register", {page: "register"});
});

// handle sign up logic
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	if(req.body.adminCode === process.env.SECRETE_CODE){
		newUser.isAdmin = true;
	}
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message);
			return res.redirect("/register");
			// Alternative, pass the req.flash object into the res.render() function
			//return res.render("register", {"error": err.message});
		} 
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to YelpCamp " + user.username);
			res.redirect("/campgrounds");
		});
	});
});

// show login form
router.get("/login", function(req, res){
	res.render("login", {page: "login"});
});

// handle login logic
router.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login",
		failureFlash: true
	}), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "See you later!");
	res.redirect("/campgrounds");
});

module.exports = router;