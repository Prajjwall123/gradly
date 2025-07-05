const express = require("express");
const router = express.Router();

const {
    createApplication,
    getApplicationById,
    getApplicationsByUser,
    updateApplicationStatus,
    deleteApplication
} = require("../controllers/applicationController");

// Create a new application
router.post("/", createApplication);

// Get a specific application by ID
router.get("/:id", getApplicationById);

// Get all applications for a specific user
router.get("/user/:userId", getApplicationsByUser);

// Update application status
router.patch("/:id/status", updateApplicationStatus);

// Delete an application
router.delete("/:id", deleteApplication);

module.exports = router;
