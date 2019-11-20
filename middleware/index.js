var express = require("express");
var router =  express.Router();

var Campground = require("../models/campground"),
	Comment    = require("../models/comment");


var middlewareObj = {}

middlewareObj.checkCampgroundOwnership = function(req,res,next){
	
	if(req.isAuthenticated()){
		Campground.findById(req.params.id,(err,foundcamp)=>{
			if(err){
				req.flash("error","Campground Not Found");
				res.redirect("back");
			}else{
				if(foundcamp.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error","You are not authorised to do that!!")
					res.redirect("back")
				}
			}
		});
	}else{
		req.flash("error","you need to be logged in!!");
		res.redirect("back");
	}
	
}

middlewareObj.checkCommentOwnership = function(req,res,next){
	
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id,(err,foundcomm)=>{
			if(err){
				red.redirect("back");
			}else{
				if(foundcomm.author.id.equals(req.user._id)){
					next();
				}else{
					res.redirect("back")
				}
			}
		});
	}else{
		res.redirect("back");
	}
	
}

middlewareObj.isLoggedIn = function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","You must login first");
	res.redirect("/login");
}



module.exports = middlewareObj;