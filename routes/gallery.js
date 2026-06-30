const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const Gallery = require('../models/Gallery')
const auth = require('../middleware/auth')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, unique + path.extname(file.originalname))
  },
})

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/
  const ext = allowed.test(path.extname(file.originalname).toLowerCase())
  const mime = allowed.test(file.mimetype)
  if (ext && mime) return cb(null, true)
  cb(new Error('Hanya file gambar (jpg, png, webp) yang diizinkan'))
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
})

router.get('/', async (req, res) => {
  const images = await Gallery.find().sort({ createdAt: -1 })
  res.json(images)
})

router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'File gambar wajib diupload' })
    const image = await Gallery.create({
      imageUrl: `/uploads/${req.file.filename}`,
      caption: req.body.caption || '',
    })
    res.status(201).json(image)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.put('/:id', auth, async (req, res) => {
  try {
    const { caption } = req.body
    const image = await Gallery.findByIdAndUpdate(req.params.id, { caption }, { returnDocument: 'after' })
    if (!image) return res.status(404).json({ message: 'Gambar tidak ditemukan' })
    res.json(image)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.delete('/:id', auth, async (req, res) => {
  try {
    const image = await Gallery.findByIdAndDelete(req.params.id)
    if (!image) return res.status(404).json({ message: 'Gambar tidak ditemukan' })
    res.json({ message: 'Gambar dihapus' })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

module.exports = router
