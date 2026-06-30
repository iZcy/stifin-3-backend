const mongoose = require('mongoose')
const Admin = require('./models/Admin')

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('MongoDB connected')

    const existing = await Admin.findOne({ username: 'admin' })
    if (existing) {
      console.log('Admin sudah ada, skip seed')
      await mongoose.disconnect()
      return
    }

    await Admin.create({ username: 'admin', password: 'admin123' })
    console.log('Admin berhasil dibuat — username: admin, password: admin123')
    await mongoose.disconnect()
  } catch (err) {
    console.error(err.message)
    process.exit(1)
  }
}

seed()
