const { decode } = require('../helpers/codec')
const Url = require('../models/Url')

class RedirectController {
    async redirect(req, res){
        const timestamp = decode((req.params.url))
        let longUrl = await Url.findOne({timestamp:timestamp})

        if (!longUrl) {
            res.status(404);
            res.render('not-found', {
                title: '404 - Not Found'
            });
            return;
        }

        const redirectsCount = longUrl.redirectsCount + 1
        longUrl = await Url.findOneAndUpdate({timestamp:timestamp}, {redirectsCount: redirectsCount})

        res.status(301).redirect(longUrl.originalUrl);
    }

    async render(req, res){

        res.render('index', {
            title: 'Тестовое'
        });
    }

}

module.exports = new RedirectController()