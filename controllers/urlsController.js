const { encode } = require('../helpers/codec')
const Url = require('../models/Url')
const User = require('../models/User')

class UrlsController {
    async compressUrl(req, res){
        try{
            let currentUser = await User.findOne({sessionId: req.sessionID})
            if(!currentUser){
                const user = new User({sessionId: req.sessionID})
                await user.save()
                currentUser = await User.findOne({sessionId: req.sessionID})
            }


            const { longUrl } = req.body
            const newUrl = new URL(req.headers.origin)
            const timestamp = Date.now()
            newUrl.pathname = encode(timestamp)
            const url = new Url({originalUrl: longUrl, shortLink: newUrl, timestamp: timestamp, userId: currentUser._id})
            await url.save()

            res.send({shortLink: newUrl})
        } catch (e) {
            res.status(500).send({message: 'Bad Request'});
            console.log(e)
        }
    }

    async getAllUrls(req, res){
        try{
            let currentUser = await User.findOne({sessionId: req.sessionID})

            if(!currentUser){
                const user = new User({sessionId: req.sessionID})
                await user.save()
                currentUser = await User.findOne({sessionId: req.sessionID})
            }


            const { page = 1, limit = 3 } = req.query;

            const urls = await Url.find({userId: currentUser._id})
                .limit(limit)
                .skip((page - 1) * limit)
                .exec()
            const count = await Url.countDocuments()

            res.send({
                urls,
                totalPages: Math.ceil(count / limit),
                currentPage: page
            })
        } catch (e) {
            res.status(500).send({message: 'Bad Request'});
            console.log(e)
        }
    }
}

module.exports = new UrlsController()