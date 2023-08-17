
const mongoose = require('mongoose')
const Campground = require('../models/campground')
const cities = require('./cities')
const {places, descriptors} =require('./seedHelpers')
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected")
})

const sample = array => array[Math.floor(Math.random()*array.length)]


const seedDB = async () => {
    await Campground.deleteMany({});
    //     const c = new Campground({title: 'purple field', })
    //     await c.save();
    //
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random()*1000)
        const price = Math.floor(Math.random()*25) +10;
        const camp = new Campground({
            author: '6113a046ef6b732914b76688',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus amet, temporibus cumque quam eaque magnam voluptatibus fuga incidunt laboriosam rem commodi optio iure distinctio cupiditate fugit, aspernatur aperiam eius quia!',
            price,
            geometry: {
              type: 'Point',
              coordinates: [
                cities[random1000].longitude,
                cities[random1000].latitude
              ]
            },
            images: [
                {               
                  url: 'https://res.cloudinary.com/placestovisit666/image/upload/v1628771103/places/jclaf47nyoussqly3hcv.jpg',
                  filename: 'places/jclaf47nyoussqly3hcv'
                },
                {                
                  url: 'https://res.cloudinary.com/placestovisit666/image/upload/v1628771103/places/exdycvkuxkz90fp8baea.jpg',
                  filename: 'places/exdycvkuxkz90fp8baea'
                },
                {               
                  url: 'https://res.cloudinary.com/placestovisit666/image/upload/v1628771103/places/d3ekyqmrwstj8r3ihw5z.jpg',
                  filename: 'places/d3ekyqmrwstj8r3ihw5z'
                }
              ]
        })
        await camp.save()
    }
}
seedDB().then(()=>{
    mongoose.connection.close()

})
