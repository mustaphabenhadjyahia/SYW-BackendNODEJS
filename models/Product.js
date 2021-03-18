var mongoose = require('mongoose')

var productSchema = new mongoose.Schema({
    name:String,
    price:String,
    userId :String,
    categories:[],
    image:Object,

});

const Product = mongoose.model('Product',productSchema)
module.exports = Product;
