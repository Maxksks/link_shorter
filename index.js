const express = require('express')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const MongoStore = require('connect-mongo')
const config = require('./config')
const urlsRouter = require('./routes/urlsRoute')
const redirectRouter = require('./routes/redirectRoute')
const sessionMiddleware = require('./middlewares/sessionMiddleware')
const PORT = config.serverPort || 4001

const app = express()

app.set('views', __dirname + '/views');

app.set('view engine', 'pug');

app.use(cookieParser())
app.use(session({
    secret: config.secret,
    key: config.key,
    cookie: config.cookie,
    saveUninitialized: false,
    resave: false,
    store: new MongoStore({
        mongoUrl: config.dbUrl,
        collection: "sessions"
    })
}))

app.use(sessionMiddleware)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/api', urlsRouter)
app.use('/', redirectRouter)
app.use(express.static(__dirname + '/public'));

const start = async () => {
    try {
        await mongoose.connect(config.dbUrl)
        app.listen(PORT, ()=>{console.log(`server started${PORT}`)})
    } catch (e) {
        console.log(e)
    }
}

start()