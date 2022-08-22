var express = require('express');
(router = express.Router({ mergeParams: true })),
  (Campground = require('../models/campground'));
(Comment = require('../models/comment')),
  (middleware = require('../middleware')),
  (NodeGeocoder = require('node-geocoder'));

var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null,
};

var geocoder = NodeGeocoder(options);

// INDEX: show all campgrounds
router.get('/', function (req, res) {
  //eval(require("locus"));
  var noMatch = null;

  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');

    // get campgrounds that match the search input text
    Campground.find({ name: regex }, function (err, allCampgrounds) {
      if (err) {
        console.log(err);
      } else {
        if (allCampgrounds.length < 1) {
          noMatch = 'No campgrounds match that query, please try again.';
        }
        res.render('campgrounds/index', {
          campgrounds: allCampgrounds,
          page: 'campgrounds',
          currentUser: req.user,
          noMatch: noMatch,
        });
      }
    });
  } else {
    // get all campgrounds from DB
    Campground.find({}, function (err, allCampgrounds) {
      if (err) {
        console.log(err);
      } else {
        res.render('campgrounds/index', {
          campgrounds: allCampgrounds,
          page: 'campgrounds',
          currentUser: req.user,
          noMatch: noMatch,
        });
      }
    });
  }
});

// CREATE: add new campground to DB
router.post('/', middleware.isLoggedIn, function (req, res) {
  var name = req.body.campground.name;
  var image = req.body.campground.image;
  var price = req.body.campground.price;
  var desc = req.body.campground.description;
  var dt = req.body.campground.createdAt;
  var author = {
    id: req.user._id,
    username: req.user.username,
  };
  geocoder.geocode(req.body.campground.location, function (err, data) {
    if (err || !data.length) {
      console.log(err);
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newCampground = {
      name: name,
      image: image,
      price: price,
      description: desc,
      createdAt: dt,
      author: author,
      location: location,
      lat: lat,
      lng: lng,
    };

    // Create a new campground and save to DB
    Campground.create(newCampground, function (err, newlyCreated) {
      if (err) {
        console.log(err);
      } else {
        //redirect back to campgrounds page
        res.redirect('/campgrounds');
      }
    });
  });
});

// NEW: show form to create new campground
router.get('/new', middleware.isLoggedIn, function (req, res) {
  res.render('campgrounds/new');
});

// SHOW: shows more info about campground
router.get('/:id', function (req, res) {
  // remove white space before id
  var curid = req.params.id;
  curid = curid.replace(/\s/g, '');

  // find the campground with the provided ID, display/ pass the comments to the show page
  Campground.findById(curid)
    .populate('comments')
    .exec(function (err, foundCampground) {
      if (err || !foundCampground) {
        req.flash('error', 'Campground not found');
        res.redirect('back');
      } else {
        // render show template with that campground
        res.render('campgrounds/show', { campground: foundCampground });
      }
    });
});

// EDIT CAMPGROUND ROUTE
router.get(
  '/:id/edit',
  middleware.checkCampgroundOwnership,
  function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
      res.render('campgrounds/edit', { campground: foundCampground });
    });
  }
);

// UPDATE CAMPGROUND ROUTE
router.put('/:id', middleware.checkCampgroundOwnership, function (req, res) {
  geocoder.geocode(req.body.campground.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    req.body.campground.lat = data[0].latitude;
    req.body.campground.lng = data[0].longitude;
    req.body.campground.location = data[0].formattedAddress;

    Campground.findByIdAndUpdate(
      req.params.id,
      req.body.campground,
      function (err, campground) {
        if (err) {
          req.flash('error', err.message);
          res.redirect('back');
        } else {
          req.flash('success', 'Successfully Updated!');
          res.redirect('/campgrounds/' + campground._id);
        }
      }
    );
  });
});

// DESTROY CAMPGROUND ROUTE: remove the campground with their comments
router.delete('/:id', middleware.checkCampgroundOwnership, function (req, res) {
  Campground.findByIdAndRemove(
    req.params.id,
    function (err, removedCampground) {
      if (err) {
        console.log(err);
      }
      Comment.deleteMany(
        { _id: { $in: removedCampground.comments } },
        function (err) {
          if (err) {
            console.log(err);
          }
          req.flash('success', 'Campground deleted');
          res.redirect('/campgrounds');
        }
      );
    }
  );
});

function escapeRegex(string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

module.exports = router;
