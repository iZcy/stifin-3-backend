const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: [true, 'Nama wajib diisi'],
  },
  email: {
    type: String,
    required: [true, 'Email wajib diisi'],
  },
  noHP: {
    type: String,
    required: [true, 'No HP wajib diisi'],
  },
  tanggal: {
    type: Date,
    required: [true, 'Tanggal wajib diisi'],
  },
  waktu: {
    type: String,
    required: [true, 'Waktu wajib diisi'],
  },
  lokasi: {
    type: String,
    required: [true, 'Lokasi wajib diisi'],
  },
  pesan: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
}, { timestamps: true })

module.exports = mongoose.model('Booking', bookingSchema)
