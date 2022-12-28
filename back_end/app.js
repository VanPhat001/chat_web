const epxress = require('express')
const cors = require('cors')
const ApiError = require('./src/api-error')
const router = require('./src/routes')

const app = epxress()

const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)

app.use(cors())
app.use(epxress.json())


app.use((req, res, next) => {
    console.log((new Date()).toLocaleTimeString())
    next()
})

app.use('/api', router)

app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found"))
})

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).send({
        message: err.message || "Internal server error"
    })
})


module.exports = {server, io}