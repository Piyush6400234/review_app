const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds')
const catchAsync = require('../utility/catchAsync')
// const {campgroundSchema} = require('../schema')
const { isLoggedin, validateCampground, isAuthor } = require('../middleware')


const multer = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({ storage })

// const ExpressError = require('../utility/ExpressError')
const Campground = require('../models/campground')
// const Review = require('../models/review');



router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedin, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground)) 
    // .post(upload.single('image'), (req, res) => {//image is the name of the form element where image will be uploaded 
    //     console.log(req.body, req.file)
    

router.get('/new', isLoggedin, campgrounds.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedin, isAuthor, upload.array('image') , validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedin, isAuthor, catchAsync(campgrounds.deleteCampgrounds))



router.get('/:id/edit', isLoggedin, isAuthor, catchAsync(campgrounds.renderEditForm))



module.exports = router;