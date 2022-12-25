const app = require('./app')
const MongoDB = require('./src/utils/mongodb.util')
const config = require('./src/config')

async function startServer() {
    try {
        await MongoDB.connect(config.db.uri)
        console.log('ket noi thanh cong');
    
        const PORT = config.app.port
        app.listen(PORT, () => {
            console.log('listen http://localhost:' + PORT)
        })
    } catch (error) {
        console.log('ket noi that bai');
        process.exit()
    }
}

startServer()