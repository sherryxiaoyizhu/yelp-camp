// ALL MIDDLEWARE

var Campground = require("../models/campground"),
    Comment    = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
	// if the user is logged in 
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err || !foundCampground){
				req.flash("error", "Campground not found");
				res.redirect("back");
			} else {
				// if the user owns the campground
				if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){
					next();
				} else {
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need need to be logged in to do that");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next){
	// if the user is logged in 
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err || !foundComment){
				req.flash("error", "Comment not found");
				res.redirect("back");
			} else {
				// if the user owns the comment
				if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
					next();
				} else {
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need need to be logged in to do that");
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} 
	req.flash("error", "You need to be logged in to do that"); // key, value
	res.redirect("/login");
}

module.exports = middlewareObj;