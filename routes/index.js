var express = require("express");
var router =  express.Router();
var passport = require("passport");
var User = require("../models/user");

var Campground = require("../models/campground"),
	Comment    = require("../models/comment");



router.get("/", (req,res)=>{
	res.render("home");
});

router.get("/register",(req,res)=>{
	res.render("auth/register")
});

router.post("/register",(req,res)=>{
	User.register(new User({username:req.body.username}),req.body.password,(err,user)=>{
		if(err){
			console.log(err);
			req.flash("error",err.message);
			return res.render("auth/register");
		}
		passport.authenticate("local")(req,res,()=>{
			req.flash("success","welcome to yelpcamp "+ user.username);
			res.redirect("/campgrounds")
		})
	})
});

router.get("/login",(req,res)=>{
	res.render("auth/login");
});

router.post("/login",passport.authenticate('local',{
	successRedirect:"/campgrounds",
	failureRedirect:"/login"
}) ,(req,res)=>{
});

router.get("/logout",(req,res)=>{
	req.logout();
	req.flash("success","You have successfully logged-out!");
	res.redirect("/campgrounds");
});


module.exports = router;