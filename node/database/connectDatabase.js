require('dotenv').config()
const mongoose = require('mongoose')

exports.dbConnect = async () => {
    try {
        // console.log("process.env.MONGO_SERVER",process.env.MONGO_LOCAL, process.env.MONGO_SERVER)
        const conn = await mongoose.connect(process.env.MONGO_SERVER)
        console.log(`Mongodb connected on ${conn.connection.host}`)
    } catch (error) {
        console.log(`Mongo Error: ${error.message}`)
        process.exit()
    }
}