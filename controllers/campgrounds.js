const Campground = require('../models/campground')

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken = process.env.MAPBOX_TOKEN


const geoCoder = mbxGeocoding({accessToken: mapBoxToken})

const { cloudinary } = require('../cloudinary')

module.exports.index = async (req, res, next) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}
module.exports.renderNewForm = (req, res) => {

    // const campgrounds = await Campground.create(req.params.id)
    res.render('campgrounds/new')
}
module.exports.createCampground = async (req, res, next) => {
    // const campgrounds = await Campground.create(req.params.id)
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400)
   const geoData = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.author = req.user._id;
    await campground.save();
    // console.log(campground)
    req.flash('success', 'Successfully made a new campground!')
    res.redirect(`/campgrounds/${campground._id}`)

}
module.exports.showCampground = async (req, res, next) => {
    const campgrounds = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author')
    // console.log(campgrounds)
    res.render('campgrounds/show', { campgrounds })
}

module.exports.renderEditForm = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', 'cannot find that campground')
        return res.redirect('/campgrounds')
    }

    res.render('campgrounds/edit', { campground })
}
module.exports.updateCampground = async (req, res, next) => {
    const { id } = req.params;
    // console.log(req.body)
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.images.push(...imgs)
    await campground.save()
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages ){
           await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
        console.log(campground)
    }
    req.flash('success', 'successfully updated campground')
    res.redirect(`/campgrounds/${campground._id}`)
    // res.send('it worked')
}

module.exports.deleteCampgrounds = async (req, res) => {

    const { id } = req.params;
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Deleted campground!')
    res.redirect(`/campgrounds`)
    // res.send('it worked')
}