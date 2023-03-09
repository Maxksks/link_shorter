const Router = require('express')
const router = new Router()
const controller = require('../controllers/redirectController')

router.get('/:url', controller.redirect)

router.get('/', controller.render)

module.exports = router