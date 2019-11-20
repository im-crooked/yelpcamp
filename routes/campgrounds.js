var express = require("express");
var router =  express.Router();

var Campground = require("../models/campground"),
	Comment    = require("../models/comment");

var middleware = require("../middleware");




router.get("/campgrounds", (req,res)=>{
	
	Campground.find({},(err,allcampgrounds)=>{
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/campgrounds",{camps: allcampgrounds});
		}
	});
	
});

router.get("/campgrounds/newcampground",middleware.isLoggedIn,(req,res)=>{
	res.render("campgrounds/newcampground");
})

router.post("/campgrounds",middleware.isLoggedIn, (req,res)=>{
	var campname = req.body.campname;
	var imgurl =req.body.imgurl;
	var description = req.body.description;
	var price = req.body.price;
	var author = {
		id:req.user._id,
		username:req.user.username
	}
	var p_ele = {name:campname,image:imgurl,description:description,price:price,author:author};
	Campground.create(p_ele,(err,newlyCreated)=>{
		if(err){
			console.log(err);
		}else{
			res.redirect("/campgrounds");
		}
	});
	
});

// SHOW more info about campground
router.get("/campgrounds/:id", (req,res)=>{
	Campground.findById(req.params.id).populate("comments").exec((err,campsend)=>{
		if(err){
			console.log(err)
		}else{
			res.render("campgrounds/show",{camp:campsend})
		}
	});
});

//edit

router.get("/campgrounds/:id/edit",middleware.checkCampgroundOwnership,(req,res)=>{
	Campground.findById(req.params.id,(err,foundcamp)=>{
			if(err){
				console.log(err);
			}else{
				res.render("campgrounds/editcampground",{camp:foundcamp});
			}
	});
});
	
	
	
	

router.put("/campgrounds/:id",middleware.checkCampgroundOwnership,(req,res)=>{
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,(err,ucamp)=>{
		if(err){
			console.log(err);
		}else{
			req.flash("success","camp updated succesfully!");
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});

router.delete("/campgrounds/:id",middleware.checkCampgroundOwnership,(req,res)=>{
	Campground.findByIdAndRemove(req.params.id,(err)=>{
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds");
		}
	});
});





module.exports = router;