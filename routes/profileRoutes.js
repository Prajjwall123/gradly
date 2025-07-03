const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/profileController');

router.get('/:userId', getProfile);

router.patch('/:userId', updateProfile);

module.exports = router;