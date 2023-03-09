module.exports = {
    secret: 'SECRET_KEY',
    key: 'sid',
    cookie: {
        path: '/',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24
    },
    serverPort : 4001,
    dbUrl: 'mongodb+srv://maksim:password1999@cluster0.yt263vh.mongodb.net/?retryWrites=true&w=majority'
}