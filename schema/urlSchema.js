const mongoose = require('mongoose')
const validator = require('validator')

const UrlSchema = new mongoose.Schema({
    longUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        unique : true
    },
    clickCount: {
        type: Number,
        default : 0
    }

},{versionKey:false, collection:'urlshort'})

const UrlModel = mongoose.model('urlshort',UrlSchema)
module.exports = {UrlModel}