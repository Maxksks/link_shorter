const User = require('../models/User')

module.exports = async function (req, res, next){
    req.session.numberOfVisits = req.session.numberOfVisits + 1 || 1
    //console.log(req.sessionID)
    let currentUser = await User.findOne({sessionId: req.sessionID})

    if(!currentUser){
        const user = new User({sessionId: req.sessionID})
        await user.save()
    }
    next()
}