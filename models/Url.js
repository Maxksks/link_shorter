const {Schema, model} = require('mongoose')

const Url = new Schema({
    originalUrl: { type: String, required: true},
    shortLink: { type: String, required: true},
    timestamp: { type :Number, required: true},
    userId: { type: String, required: true},
    redirectsCount: { type:Number, required: true, default: 0}
})

module.exports = model('url', Url)