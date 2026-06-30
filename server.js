const express = require('express')
const cors = require('cors')
const path = require('path')
const multer = require('multer')
const connectDB = require('./config/db')

const bookingRoutes = require('./routes/booking')
const adminRoutes = require('./routes/admin')
const galleryRoutes = require('./routes/gallery')

const app = express()
const PORT = process.env.PORT || 5000

console.log('=== DEBUG ENV ===')
console.log('PORT:', process.env.PORT)
console.log('MONGO_URI:', process.env.MONGO_URI ? '✓ defined' : '✗ undefined')
const mongoKeys = Object.keys(process.env).filter(k => k.toLowerCase().includes('mongo'))
console.log('Env keys containing "mongo":', mongoKeys.length ? mongoKeys : '(none)')
console.log('All env keys:', Object.keys(process.env).slice(0, 20).join(', '))
console.log('================')

connectDB()

app.use(cors())
app.use(express.json())

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/bookings', bookingRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/gallery', galleryRoutes)

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message })
  }
  if (err.message?.includes('Hanya file gambar')) {
    return res.status(400).json({ message: err.message })
  }
  console.error(err)
  res.status(500).json({ message: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
