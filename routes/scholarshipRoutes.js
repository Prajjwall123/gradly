const express = require("express");
const router = express.Router();

const {
    getAllScholarships,
    getScholarshipById,
    updateScholarship,
    deleteScholarship,
    createScholarship
} = require("../controllers/scholarshipController");

router.get("/", getAllScholarships);
router.post("/", createScholarship);
router.get("/:id", getScholarshipById);
router.put("/:id", updateScholarship);
router.delete("/:id", deleteScholarship);

module.exports = router;
