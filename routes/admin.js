const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const Admin = require('../models/Admin')

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(400).json({ message: 'Username dan password wajib diisi' })
    }

    const admin = await Admin.findOne({ username })
    if (!admin) {
      return res.status(401).json({ message: 'Username atau password salah' })
    }

    const match = await admin.comparePassword(password)
    if (!match) {
      return res.status(401).json({ message: 'Username atau password salah' })
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, username: admin.username })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
