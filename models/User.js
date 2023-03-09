const {Schema, model} = require('mongoose')

const User = new Schema({
    sessionId: { type: String, required: true},
})

module.exports = model('user', User)