const express = require('express');
const router = express.Router();
const { submitContactForm, getContactMessages } = require('../controllers/contactController');

// Public routes
router.post('/', submitContactForm);
router.get('/', getContactMessages);

module.exports = router;
