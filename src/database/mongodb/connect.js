require('dotenv').config()
const mongoose = require('mongoose')

class MongoDB {

    static connectDB = () => {
        mongoose.connect(process.env.MONGODB_URL)
        .then(
            () => { console.log('MongoDB conectado com sucesso') },
            err =>  { return err })
    }

    static dbClose = () => {
        mongoose.connection.close();
    }
}

module.exports = MongoDB
