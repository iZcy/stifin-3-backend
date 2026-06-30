const express = require('express')
const router = express.Router()
const Booking = require('../models/Booking')
const auth = require('../middleware/auth')

router.post('/', async (req, res) => {
  try {
    const booking = await Booking.create(req.body)
    res.status(201).json(booking)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.get('/', auth, async (req, res) => {
  const bookings = await Booking.find().sort({ createdAt: -1 })
  res.json(bookings)
})

router.patch('/:id', auth, async (req, res) => {
  try {
    const { status } = req.body
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status tidak valid' })
    }
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { returnDocument: 'after' })
    if (!booking) return res.status(404).json({ message: 'Booking tidak ditemukan' })
    res.json(booking)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id)
    if (!booking) return res.status(404).json({ message: 'Booking tidak ditemukan' })
    res.json({ message: 'Booking dihapus' })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

module.exports = router
