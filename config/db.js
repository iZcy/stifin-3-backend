const mongoose = require('mongoose')

const connectDB = async () => {
  const uri = process.env.MONGO_URI
  if (!uri) {
    console.error('MONGO_URI tidak ditemukan! Set environment variable MONGO_URI di Railway dashboard.')
    process.exit(1)
  }
  try {
    const conn = await mongoose.connect(uri)
    console.log(`MongoDB connected: ${conn.connection.host}`)
  } catch (err) {
    console.error(`MongoDB error: ${err.message}`)
    process.exit(1)
  }
}

module.exports = connectDB
