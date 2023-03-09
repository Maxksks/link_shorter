const Router = require('express')
const router = new Router()
const controller = require('../controllers/urlsController')

router.post('/', controller.compressUrl)

router.get('/', controller.getAllUrls)

module.exports = router