const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground')
const Review = require('../models/review')
const reviews = require('../controllers/reviews')

const {validateReview, isLoggedin, isReviewAuthor} = require('../middleware')

const ExpressError = require('../utility/ExpressError')
const catchAsync = require('../utility/catchAsync')



router.post('/',isLoggedin, validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId',isLoggedin, isReviewAuthor , catchAsync(reviews.deleteReview))


module.exports = router;