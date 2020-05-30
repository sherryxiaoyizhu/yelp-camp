require('dotenv').config();

var bodyParser         = require("body-parser"),
    mongoose           = require("mongoose"),
    flash              = require("connect-flash"),
    passport           = require("passport"),
    LocalStrategy      = require("passport-local").Strategy,
    methodOverride     = require("method-override"),
    express            = require("express"),
    app                = express(),
    expressSanitizer   = require("express-sanitizer"),
    Campground         = require("./models/campground"),
    Comment            = require("./models/comment"),
    User               = require("./models/user"),
    seedDB             = require("./seeds.js");

// REQUIRING ROUTES
var campgroundRoutes   = require("./routes/campgrounds"),
    commentRoutes      = require("./routes/comments"),
    indexRoutes        = require("./routes/index");

// CONNECT TO MongoDB
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true });

// Alternatively, connect to online MongoDB server
// mongoose.connect("mongodb+srv://xzhu:myRealPassword@cluster0-djrck.mongodb.net/test?retryWrites=true&w=majority", { 
// 	useNewUrlParser: true, 
// 	useUnifiedTopology: true,
// 	useCreateIndex: true
// }).then(() => {
// 	console.log("Connected to MongoDB!");
// }).catch(err => {
// 	console.log("ERROR:", err); 
// });

// FIX DEPRECATION WARNINGS
mongoose.set('useFindAndModify', false);

// APP CONFIGURATION
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');
//seedDB(); // seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Copper wins cutest dog!",
	resave: false,
	saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// MIDDLEWARE
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("Project Server Has Started!");
});