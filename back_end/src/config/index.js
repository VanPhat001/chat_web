const dbName = 'chatDB'

const config = {
    app: {
        port: process.env.PORT || 9999
    },
    db: {
        uri: `mongodb+srv://admin:He8SXOUyRVdNmAvt@cluster0.c9re2w6.mongodb.net/${dbName}?retryWrites=true&w=majority`
    }
}

module.exports = config