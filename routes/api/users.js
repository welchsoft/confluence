const express = require('express');
const router = express.Router();

// @route   GET api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users Works' }))

module.exports = router
