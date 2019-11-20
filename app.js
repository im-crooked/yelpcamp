//requirements

var express         = require("express"),
	app             = express(),
	bodyParser      = require("body-parser"),
	mongoose        = require("mongoose"),
	methodOverride  = require("method-override"),
	passport        = require("passport"),
	LocalStrategy   = require("passport-local"),
	flash           = require("connect-flash"),
	User            = require("./models/user"),  
	Campground = require("./models/campground"),
	Comment    = require("./models/comment");


//connecting database
mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true,useUnifiedTopology: true});

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

// server configuration
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// server connection
app.listen(process.env.PORT || 3000,() =>{
	console.log("server running");
});

//passport configuration
app.use(require("express-session")({
	secret:"your secret key is sanjay",
	resave:false,
	saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
	res.locals.currUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});



// routes 

var campgroundRoutes = require("./routes/campgrounds"),
	commentRoutes    = require("./routes/comments"),
	indexRoutes      = require("./routes/index");

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);







